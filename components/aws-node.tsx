import React, { memo } from "react";
import { Handle, Position, NodeProps } from "reactflow";
import { AWSIcon, getAWSServiceColor } from "./aws-icons";

interface AWSNodeData {
  label: string;
  service: string;
  icon: string;
  description?: string;
  region?: string;
  vpc?: string;
  subnet?: string;
  instanceType?: string;
  storage?: string;
}

const AWSNode: React.FC<NodeProps<AWSNodeData>> = ({ data, selected }) => {
  const serviceColor = getAWSServiceColor(data.service);

  return (
    <div
      className={`
        relative bg-white rounded-lg border-2 shadow-lg transition-all duration-200
        ${
          selected
            ? "border-blue-500 shadow-xl"
            : "border-gray-200 hover:border-blue-300"
        }
        min-w-[180px] max-w-[250px]
      `}
      style={{
        borderColor: selected ? "#3b82f6" : serviceColor + "40",
      }}
    >
      {/* Service Icon and Header */}
      <div
        className="flex items-center gap-3 p-3 rounded-t-lg"
        style={{ backgroundColor: serviceColor + "10" }}
      >
        <div className="flex-shrink-0">
          <AWSIcon service={data.icon || data.service} size={32} />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-sm text-gray-900 truncate">
            {data.label}
          </h3>
          <p className="text-xs text-gray-600 truncate">{data.service}</p>
        </div>
      </div>

      {/* Service Details */}
      <div className="p-3 space-y-2">
        {data.description && (
          <p className="text-xs text-gray-700 leading-relaxed">
            {data.description}
          </p>
        )}

        <div className="space-y-1">
          {data.region && (
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-gray-500">Region:</span>
              <span className="text-xs text-gray-700 bg-gray-100 px-2 py-1 rounded">
                {data.region}
              </span>
            </div>
          )}

          {data.vpc && (
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-gray-500">VPC:</span>
              <span className="text-xs text-gray-700 bg-blue-100 px-2 py-1 rounded">
                {data.vpc}
              </span>
            </div>
          )}

          {data.subnet && (
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-gray-500">Subnet:</span>
              <span
                className={`text-xs px-2 py-1 rounded ${
                  data.subnet.toLowerCase().includes("public")
                    ? "text-green-700 bg-green-100"
                    : "text-orange-700 bg-orange-100"
                }`}
              >
                {data.subnet}
              </span>
            </div>
          )}

          {data.instanceType && (
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-gray-500">Type:</span>
              <span className="text-xs text-gray-700 bg-gray-100 px-2 py-1 rounded">
                {data.instanceType}
              </span>
            </div>
          )}

          {data.storage && (
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-gray-500">
                Storage:
              </span>
              <span className="text-xs text-gray-700 bg-gray-100 px-2 py-1 rounded">
                {data.storage}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Connection Handles */}
      <Handle
        type="target"
        position={Position.Top}
        className="w-3 h-3 border-2 border-white"
        style={{ backgroundColor: serviceColor }}
      />
      <Handle
        type="source"
        position={Position.Bottom}
        className="w-3 h-3 border-2 border-white"
        style={{ backgroundColor: serviceColor }}
      />
      <Handle
        type="target"
        position={Position.Left}
        className="w-3 h-3 border-2 border-white"
        style={{ backgroundColor: serviceColor }}
      />
      <Handle
        type="source"
        position={Position.Right}
        className="w-3 h-3 border-2 border-white"
        style={{ backgroundColor: serviceColor }}
      />
    </div>
  );
};

export default memo(AWSNode);
