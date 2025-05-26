"use client";

import React, { useState } from "react";
import {
  ChevronDown,
  ChevronUp,
  Lightbulb,
  Shield,
  DollarSign,
  Zap,
  AlertTriangle,
  CheckCircle,
} from "lucide-react";

interface RecommendationsPanelProps {
  recommendations: string[];
  className?: string;
}

const RecommendationsPanel: React.FC<RecommendationsPanelProps> = ({
  recommendations,
  className = "",
}) => {
  const [isExpanded, setIsExpanded] = useState(true);

  if (!recommendations || recommendations.length === 0) {
    return null;
  }

  // Categorize recommendations based on keywords
  const categorizeRecommendation = (recommendation: string) => {
    const lower = recommendation.toLowerCase();

    if (
      lower.includes("security") ||
      lower.includes("encryption") ||
      lower.includes("iam") ||
      lower.includes("vpc")
    ) {
      return { type: "security", icon: Shield, color: "red" };
    }
    if (
      lower.includes("cost") ||
      lower.includes("pricing") ||
      lower.includes("budget") ||
      lower.includes("optimize")
    ) {
      return { type: "cost", icon: DollarSign, color: "green" };
    }
    if (
      lower.includes("performance") ||
      lower.includes("scaling") ||
      lower.includes("latency") ||
      lower.includes("speed")
    ) {
      return { type: "performance", icon: Zap, color: "yellow" };
    }
    if (
      lower.includes("warning") ||
      lower.includes("risk") ||
      lower.includes("consider") ||
      lower.includes("caution")
    ) {
      return { type: "warning", icon: AlertTriangle, color: "orange" };
    }

    return { type: "general", icon: CheckCircle, color: "blue" };
  };

  const getColorClasses = (color: string) => {
    const colorMap = {
      red: "text-red-600 bg-red-50 border-red-200",
      green: "text-green-600 bg-green-50 border-green-200",
      yellow: "text-yellow-600 bg-yellow-50 border-yellow-200",
      orange: "text-orange-600 bg-orange-50 border-orange-200",
      blue: "text-blue-600 bg-blue-50 border-blue-200",
    };
    return colorMap[color as keyof typeof colorMap] || colorMap.blue;
  };

  const getIconColorClasses = (color: string) => {
    const colorMap = {
      red: "text-red-500",
      green: "text-green-500",
      yellow: "text-yellow-500",
      orange: "text-orange-500",
      blue: "text-blue-500",
    };
    return colorMap[color as keyof typeof colorMap] || colorMap.blue;
  };

  return (
    <div
      className={`bg-white rounded-xl shadow-lg border border-gray-200 ${className}`}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between p-4 border-b border-gray-200 cursor-pointer hover:bg-gray-50 transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Lightbulb className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">AI Recommendations</h3>
            <p className="text-sm text-gray-600">
              {recommendations.length} optimization suggestions
            </p>
          </div>
        </div>

        <button className="p-1 hover:bg-gray-100 rounded transition-colors">
          {isExpanded ? (
            <ChevronUp className="w-5 h-5 text-gray-500" />
          ) : (
            <ChevronDown className="w-5 h-5 text-gray-500" />
          )}
        </button>
      </div>

      {/* Content */}
      {isExpanded && (
        <div className="p-4">
          <div className="space-y-3">
            {recommendations.map((recommendation, index) => {
              const {
                type,
                icon: Icon,
                color,
              } = categorizeRecommendation(recommendation);
              const colorClasses = getColorClasses(color);
              const iconColorClasses = getIconColorClasses(color);

              return (
                <div
                  key={index}
                  className={`p-4 rounded-lg border ${colorClasses} transition-all duration-200 hover:shadow-md`}
                >
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 mt-0.5">
                      <Icon className={`w-5 h-5 ${iconColorClasses}`} />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm leading-relaxed text-gray-800">
                        {recommendation}
                      </p>

                      {/* Category Badge */}
                      <div className="mt-2">
                        <span
                          className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium capitalize ${
                            color === "red"
                              ? "bg-red-100 text-red-800"
                              : color === "green"
                              ? "bg-green-100 text-green-800"
                              : color === "yellow"
                              ? "bg-yellow-100 text-yellow-800"
                              : color === "orange"
                              ? "bg-orange-100 text-orange-800"
                              : "bg-blue-100 text-blue-800"
                          }`}
                        >
                          {type === "security"
                            ? "🔒 Security"
                            : type === "cost"
                            ? "💰 Cost Optimization"
                            : type === "performance"
                            ? "⚡ Performance"
                            : type === "warning"
                            ? "⚠️ Warning"
                            : "✅ Best Practice"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Summary */}
          <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <h4 className="font-medium text-gray-900 mb-2">Summary</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div className="text-center">
                <div className="font-semibold text-red-600">
                  {
                    recommendations.filter(
                      (r) => categorizeRecommendation(r).type === "security"
                    ).length
                  }
                </div>
                <div className="text-gray-600">Security</div>
              </div>
              <div className="text-center">
                <div className="font-semibold text-green-600">
                  {
                    recommendations.filter(
                      (r) => categorizeRecommendation(r).type === "cost"
                    ).length
                  }
                </div>
                <div className="text-gray-600">Cost</div>
              </div>
              <div className="text-center">
                <div className="font-semibold text-yellow-600">
                  {
                    recommendations.filter(
                      (r) => categorizeRecommendation(r).type === "performance"
                    ).length
                  }
                </div>
                <div className="text-gray-600">Performance</div>
              </div>
              <div className="text-center">
                <div className="font-semibold text-blue-600">
                  {
                    recommendations.filter(
                      (r) => categorizeRecommendation(r).type === "general"
                    ).length
                  }
                </div>
                <div className="text-gray-600">General</div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-4 flex gap-2">
            <button className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
              Apply All Recommendations
            </button>
            <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium">
              Export Report
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default RecommendationsPanel;
