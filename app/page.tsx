"use client";

import React, { useState } from "react";
import { Node, Edge } from "reactflow";
import RequirementsForm from "@/components/requirements-form";
import DiagramCanvas from "@/components/diagram-canvas";
import RecommendationsPanel from "@/components/recommendations-panel";
import { Cloud, Sparkles, ArrowRight, RefreshCw } from "lucide-react";

interface DiagramData {
  data: string; // raw D2 code string
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
}

export default function Home() {
  const [diagramData, setDiagramData] = useState<DiagramData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState<"input" | "diagram">("input");

  const handleRequirementsSubmit = async (requirements: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/generate-diagram", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ requirements }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to generate diagram");
      }

      const result = await response.json();

      if (result.success && result.data) {
        setDiagramData({ data: result.data, nodes: [], edges: [] });
        setCurrentStep("diagram");
      } else {
        throw new Error("Invalid response format");
      }
    } catch (err) {
      console.error("Error generating diagram:", err);
      setError(
        err instanceof Error ? err.message : "An unexpected error occurred"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleStartOver = () => {
    setDiagramData(null);
    setError(null);
    setCurrentStep("input");
  };

  const handleDiagramChange = (newNodes: Node[], newEdges: Edge[]) => {
    if (diagramData) {
      const nodesChanged =
        JSON.stringify(diagramData.nodes) !== JSON.stringify(newNodes);
      const edgesChanged =
        JSON.stringify(diagramData.edges) !== JSON.stringify(newEdges);

      if (nodesChanged || edgesChanged) {
        setDiagramData((prevData) => ({
          ...(prevData as DiagramData),
          nodes: newNodes,
          edges: newEdges,
        }));
      }
    }
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-600 rounded-lg">
                <Cloud className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">DiagPT</h1>
                <p className="text-sm text-gray-600">
                  AI-Powered AWS Architecture Diagrams
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-yellow-500" />
              <span className="text-sm font-medium text-gray-700">
                Powered by Gemini AI
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Progress Steps */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center py-4">
            <div className="flex items-center gap-4">
              {/* Step 1 */}
              <div
                className={`flex items-center gap-2 ${
                  currentStep === "input" ? "text-blue-600" : "text-green-600"
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    currentStep === "input"
                      ? "bg-blue-600 text-white"
                      : "bg-green-600 text-white"
                  }`}
                >
                  {currentStep === "input" ? "1" : "✓"}
                </div>
                <span className="font-medium">Requirements</span>
              </div>

              <ArrowRight className="w-5 h-5 text-gray-400" />

              {/* Step 2 */}
              <div
                className={`flex items-center gap-2 ${
                  currentStep === "diagram" ? "text-blue-600" : "text-gray-400"
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    currentStep === "diagram"
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200 text-gray-600"
                  }`}
                >
                  2
                </div>
                <span className="font-medium">Architecture Diagram</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {currentStep === "input" && (
          <div className="space-y-8">
            {/* Hero Section */}
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Generate AWS Architecture Diagrams with AI
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Describe your cloud infrastructure requirements and let our AI
                create optimized, interactive AWS architecture diagrams with
                best practices, security recommendations, and cost optimization
                suggestions.
              </p>
            </div>

            {/* Requirements Form */}
            <RequirementsForm
              onSubmit={handleRequirementsSubmit}
              isLoading={isLoading}
            />

            {/* Error Display */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 text-red-500">⚠️</div>
                  <h3 className="font-medium text-red-800">Error</h3>
                </div>
                <p className="text-red-700 mt-1">{error}</p>
                <button
                  onClick={() => setError(null)}
                  className="mt-2 text-sm text-red-600 hover:text-red-800 underline"
                >
                  Dismiss
                </button>
              </div>
            )}

            {/* Features */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
              <div className="text-center p-6">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Cloud className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  AWS Best Practices
                </h3>
                <p className="text-gray-600 text-sm">
                  Generated diagrams follow AWS Well-Architected Framework
                  principles
                </p>
              </div>

              <div className="text-center p-6">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Sparkles className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  AI-Powered Optimization
                </h3>
                <p className="text-gray-600 text-sm">
                  Smart recommendations for security, performance, and cost
                  optimization
                </p>
              </div>

              <div className="text-center p-6">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <RefreshCw className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  Interactive & Exportable
                </h3>
                <p className="text-gray-600 text-sm">
                  Edit diagrams interactively and export to PNG, PDF, or JSON
                  formats
                </p>
              </div>
            </div>
          </div>
        )}

        {currentStep === "diagram" && diagramData && (
          <div className="space-y-6">
            {/* Header with Actions */}
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Your AWS Architecture Diagram
                </h2>
                <p className="text-gray-600">
                  Interactive diagram with {diagramData.nodes?.length || 0}{" "}
                  services and {diagramData.edges?.length || 0} connections
                </p>
              </div>

              <button
                onClick={handleStartOver}
                className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
                Start Over
              </button>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              {/* Diagram Canvas */}
              <div className="lg:col-span-3">
                <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
                  <div className="h-[600px]">
                    <DiagramCanvas
                      diagramData={diagramData}
                      onDiagramChange={handleDiagramChange}
                    />
                  </div>
                </div>
              </div>

              {/* Recommendations Panel */}
              <div className="lg:col-span-1">
                {diagramData.recommendations && (
                  <RecommendationsPanel
                    recommendations={diagramData.recommendations}
                    className="h-fit"
                  />
                )}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-gray-50 border-t border-gray-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-gray-600">
            <p className="mb-2">
              Built with Next.js, React Flow, and Gemini AI
            </p>
            <p className="text-sm">
              Generate optimized AWS architecture diagrams in seconds
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
