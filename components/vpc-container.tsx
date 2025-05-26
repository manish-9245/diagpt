import React, { memo } from "react";
import { NodeProps } from "reactflow";

interface VPCContainerData {
  label: string;
  cidr: string;
  region: string;
  subnets?: Array<{
    id: string;
    name: string;
    type: "public" | "private";
    cidr: string;
    availabilityZone: string;
  }>;
}

const VPCContainer: React.FC<NodeProps<VPCContainerData>> = ({
  data,
  selected,
}) => {
  return (
    <div
      className={`
        relative bg-blue-50 rounded-lg border-2 border-dashed transition-all duration-200
        ${selected ? "border-blue-600 bg-blue-100" : "border-blue-400"}
        min-w-[400px] min-h-[300px] p-4
      `}
    >
      {/* VPC Header */}
      <div className="absolute top-2 left-2 bg-white rounded px-3 py-1 shadow-sm border border-blue-200">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-blue-500 rounded-sm"></div>
          <div>
            <h3 className="font-semibold text-sm text-blue-900">
              {data.label}
            </h3>
            <p className="text-xs text-blue-700">
              {data.cidr} • {data.region}
            </p>
          </div>
        </div>
      </div>

      {/* Subnet Information */}
      {data.subnets && data.subnets.length > 0 && (
        <div className="absolute top-2 right-2 bg-white rounded px-3 py-2 shadow-sm border border-blue-200 max-w-[200px]">
          <h4 className="font-medium text-xs text-blue-900 mb-1">Subnets</h4>
          <div className="space-y-1">
            {data.subnets.map((subnet) => (
              <div key={subnet.id} className="text-xs">
                <div className="flex items-center gap-1">
                  <div
                    className={`w-2 h-2 rounded-full ${
                      subnet.type === "public"
                        ? "bg-green-500"
                        : "bg-orange-500"
                    }`}
                  ></div>
                  <span className="font-medium text-gray-700">
                    {subnet.name}
                  </span>
                </div>
                <div className="text-gray-600 ml-3">
                  {subnet.cidr} • {subnet.availabilityZone}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* VPC Content Area */}
      <div className="mt-16 h-full">
        {/* This area will contain the AWS services */}
        <div className="text-center text-blue-600 text-sm opacity-50 mt-8">
          AWS Services will be placed here
        </div>
      </div>

      {/* VPC Label at bottom */}
      <div className="absolute bottom-2 left-2 text-xs text-blue-700 font-medium">
        Virtual Private Cloud
      </div>
    </div>
  );
};

export default memo(VPCContainer);
