"use client";

import React, { useCallback, useRef, useState, useEffect } from "react";
import ReactFlow, {
  Node,
  Edge,
  NodeTypes,
  addEdge,
  Connection,
  useNodesState,
  useEdgesState,
  Controls,
  MiniMap,
  Background,
  BackgroundVariant,
  ReactFlowProvider,
  ReactFlowInstance,
  Panel,
} from "reactflow";
import * as dagre from "dagre";
import "reactflow/dist/style.css";
import AWSNode from "./aws-node";
import VPCContainer from "./vpc-container";
import { Download, ZoomIn, ZoomOut, Maximize, Save } from "lucide-react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

interface DiagramCanvasProps {
  diagramData: {
    data: string; // raw D2 source string
    nodes: Node[];
    edges: Edge[];
    vpcs?: Array<{
      id: string;
      name: string;
      cidr: string;
      region: string;
      subnets?: Array<{
        id: string;
        name: string;
        type: "public" | "private";
        cidr: string;
        availabilityZone: string;
      }>;
    }>;
    recommendations?: string[];
  };
  onDiagramChange?: (nodes: Node[], edges: Edge[]) => void;
}

const nodeTypes = {
  "aws-service": AWSNode,
  "vpc-container": VPCContainer,
};

const DiagramCanvas: React.FC<DiagramCanvasProps> = ({
  diagramData,
  onDiagramChange,
}) => {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const [reactFlowInstance, setReactFlowInstance] =
    useState<ReactFlowInstance | null>(null);
  const [nodes, setNodes, onNodesChange] = useNodesState(
    diagramData.nodes || []
  );
  const [edges, setEdges, onEdgesChange] = useEdgesState(
    diagramData.edges || []
  );
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);

  // Update nodes and edges when diagramData changes
  useEffect(() => {
    if (!diagramData.data) return;
    try {
      const parsedNodes: Node[] = [];
      const parsedEdges: Edge[] = [];
      const lines = diagramData.data.split(/\r?\n/);
      const containerStack: string[] = [];
      // parsers
      const startRegex = /([\w.-]+)\s*\[([^\]]+)\]\s*\{/;
      const leafRegex = /([\w.-]+)\s*\[([^\]]+)\](?!\s*\{)/;
      // Remove surrounding quotes
      const strip = (s: string) => s.trim().replace(/^"(.*)"$/, "$1");
      lines.forEach((line) => {
        let m = startRegex.exec(line);
        if (m) {
          const [, id, propsStr] = m;
          const props = Object.fromEntries(
            propsStr.split(",").map((p) => {
              const [k, v] = p.split(":");
              return [k.trim(), strip(v)];
            })
          );
          const parent = containerStack.slice(-1)[0];
          parsedNodes.push({
            id,
            type: parent ? "aws-service" : "vpc-container",
            data: {
              label: strip(id.replace(/[.-]/g, " ")),
              service: props.icon,
              ...props,
            },
            position: { x: 0, y: 0 },
            parentNode: parent,
            extent: parent ? ("parent" as const) : undefined,
          });
          containerStack.push(id);
          return;
        }
        if (line.includes("}")) {
          containerStack.pop();
          return;
        }
        m = leafRegex.exec(line);
        if (m) {
          const [, id, propsStr] = m;
          const props = Object.fromEntries(
            propsStr.split(",").map((p) => {
              const [k, v] = p.split(":");
              return [k.trim(), strip(v)];
            })
          );
          const parent = containerStack.slice(-1)[0];
          parsedNodes.push({
            id,
            type: "aws-service",
            data: {
              label: strip(id.replace(/[.-]/g, " ")),
              service: props.icon,
              ...props,
            },
            position: { x: 0, y: 0 },
            parentNode: parent,
            extent: parent ? ("parent" as const) : undefined,
          });
        }
      });
      // parse edges
      const connRegex =
        /([\w.-]+)\s*(->|<->)\s*([\w.-]+)(?:\s*:\s*"([^"]+)")?/g;
      let edgeCount = 0;
      let em;
      while ((em = connRegex.exec(diagramData.data))) {
        parsedEdges.push({
          id: `edge-${edgeCount++}`,
          source: em[1],
          target: em[3],
          animated: em[2] === "<->",
          label: em[4],
        });
      }
      // layout with dagre
      const g = new dagre.graphlib.Graph();
      g.setDefaultEdgeLabel(() => ({}));
      g.setGraph({ rankdir: "LR", marginx: 50, marginy: 50 });
      parsedNodes.forEach((n) => {
        const isContainer = n.type === "vpc-container";
        const w = isContainer ? 360 : 200;
        const h = isContainer ? 240 : 120;
        g.setNode(n.id, { width: w, height: h });
      });
      parsedEdges.forEach((e) => g.setEdge(e.source, e.target));
      dagre.layout(g);
      const layoutedNodes = parsedNodes.map((n) => {
        const { x, y } = g.node(n.id);
        const dims = g.node(n.id);
        return {
          ...n,
          position: { x: x - dims.width / 2, y: y - dims.height / 2 },
        };
      });
      setNodes(layoutedNodes);
      setEdges(parsedEdges);
    } catch (error) {
      console.error("D2 Parsing Error:", error);
      setNodes([]);
      setEdges([]);
    }
  }, [diagramData.data]);

  // Notify parent component of changes
  useEffect(() => {
    if (onDiagramChange) {
      onDiagramChange(nodes, edges);
    }
  }, [nodes, edges, onDiagramChange]);

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const onNodeClick = useCallback((event: React.MouseEvent, node: Node) => {
    setSelectedNode(node);
  }, []);

  const onPaneClick = useCallback(() => {
    setSelectedNode(null);
  }, []);

  // Export functions
  const exportToPNG = useCallback(async () => {
    if (reactFlowWrapper.current) {
      const canvas = await html2canvas(reactFlowWrapper.current, {
        backgroundColor: "#ffffff",
        scale: 2,
      });

      const link = document.createElement("a");
      link.download = "aws-architecture-diagram.png";
      link.href = canvas.toDataURL();
      link.click();
    }
  }, []);

  const exportToPDF = useCallback(async () => {
    if (reactFlowWrapper.current) {
      const canvas = await html2canvas(reactFlowWrapper.current, {
        backgroundColor: "#ffffff",
        scale: 2,
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: canvas.width > canvas.height ? "landscape" : "portrait",
        unit: "px",
        format: [canvas.width, canvas.height],
      });

      pdf.addImage(imgData, "PNG", 0, 0, canvas.width, canvas.height);
      pdf.save("aws-architecture-diagram.pdf");
    }
  }, []);

  const exportToJSON = useCallback(() => {
    const exportData = {
      nodes,
      edges,
      vpcs: diagramData.vpcs,
      recommendations: diagramData.recommendations,
      timestamp: new Date().toISOString(),
    };

    const dataStr = JSON.stringify(exportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: "application/json" });

    const link = document.createElement("a");
    link.download = "aws-architecture-diagram.json";
    link.href = URL.createObjectURL(dataBlob);
    link.click();
  }, [nodes, edges, diagramData]);

  const fitView = useCallback(() => {
    if (reactFlowInstance) {
      reactFlowInstance.fitView({ padding: 0.1 });
    }
  }, [reactFlowInstance]);

  const zoomIn = useCallback(() => {
    if (reactFlowInstance) {
      reactFlowInstance.zoomIn();
    }
  }, [reactFlowInstance]);

  const zoomOut = useCallback(() => {
    if (reactFlowInstance) {
      reactFlowInstance.zoomOut();
    }
  }, [reactFlowInstance]);

  return (
    <div className="w-full h-full relative" ref={reactFlowWrapper}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeClick={onNodeClick}
        onPaneClick={onPaneClick}
        onInit={setReactFlowInstance}
        nodeTypes={nodeTypes}
        fitView
        attributionPosition="bottom-left"
        className="bg-gray-50"
      >
        <Background
          variant={BackgroundVariant.Dots}
          gap={20}
          size={1}
          color="#e5e7eb"
        />

        <Controls className="bg-white shadow-lg border border-gray-200" />

        <MiniMap
          className="bg-white border border-gray-200 shadow-lg"
          nodeColor={(node) => {
            if (node.type === "aws-service") {
              return "#3b82f6";
            }
            return "#e5e7eb";
          }}
        />

        {/* Custom Control Panel */}
        <Panel position="top-right" className="space-y-2">
          <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-2">
            <div className="flex flex-col gap-2">
              <button
                onClick={fitView}
                className="flex items-center gap-2 px-3 py-2 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                title="Fit to view"
              >
                <Maximize size={16} />
                Fit View
              </button>

              <div className="flex gap-1">
                <button
                  onClick={zoomIn}
                  className="flex items-center justify-center p-2 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
                  title="Zoom in"
                >
                  <ZoomIn size={16} />
                </button>
                <button
                  onClick={zoomOut}
                  className="flex items-center justify-center p-2 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
                  title="Zoom out"
                >
                  <ZoomOut size={16} />
                </button>
              </div>
            </div>
          </div>

          {/* Export Panel */}
          <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-2">
            <h3 className="text-sm font-medium text-gray-700 mb-2">Export</h3>
            <div className="flex flex-col gap-2">
              <button
                onClick={exportToPNG}
                className="flex items-center gap-2 px-3 py-2 text-sm bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
              >
                <Download size={16} />
                PNG
              </button>
              <button
                onClick={exportToPDF}
                className="flex items-center gap-2 px-3 py-2 text-sm bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
              >
                <Download size={16} />
                PDF
              </button>
              <button
                onClick={exportToJSON}
                className="flex items-center gap-2 px-3 py-2 text-sm bg-purple-500 text-white rounded hover:bg-purple-600 transition-colors"
              >
                <Save size={16} />
                JSON
              </button>
            </div>
          </div>
        </Panel>
      </ReactFlow>

      {/* Node Details Panel */}
      {selectedNode && (
        <div className="absolute top-4 left-4 bg-white rounded-lg shadow-lg border border-gray-200 p-4 max-w-sm z-10">
          <h3 className="font-semibold text-lg text-gray-900 mb-2">
            {selectedNode.data.label}
          </h3>
          <div className="space-y-2 text-sm">
            <div>
              <span className="font-medium text-gray-600">Service:</span>
              <span className="ml-2 text-gray-800">
                {selectedNode.data.service}
              </span>
            </div>
            {selectedNode.data.description && (
              <div>
                <span className="font-medium text-gray-600">Description:</span>
                <p className="mt-1 text-gray-800">
                  {selectedNode.data.description}
                </p>
              </div>
            )}
            {selectedNode.data.region && (
              <div>
                <span className="font-medium text-gray-600">Region:</span>
                <span className="ml-2 text-gray-800">
                  {selectedNode.data.region}
                </span>
              </div>
            )}
            {selectedNode.data.vpc && (
              <div>
                <span className="font-medium text-gray-600">VPC:</span>
                <span className="ml-2 text-gray-800">
                  {selectedNode.data.vpc}
                </span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

const DiagramCanvasWrapper: React.FC<DiagramCanvasProps> = (props) => {
  return (
    <ReactFlowProvider>
      <DiagramCanvas {...props} />
    </ReactFlowProvider>
  );
};

export default DiagramCanvasWrapper;
