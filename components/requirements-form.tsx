"use client";

import React, { useState } from "react";
import {
  Send,
  Loader2,
  Lightbulb,
  Cloud,
  Shield,
  DollarSign,
} from "lucide-react";

interface RequirementsFormProps {
  onSubmit: (requirements: string) => void;
  isLoading: boolean;
}

const RequirementsForm: React.FC<RequirementsFormProps> = ({
  onSubmit,
  isLoading,
}) => {
  const [requirements, setRequirements] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);

  const templates = [
    {
      id: "web-app",
      title: "Web Application",
      icon: <Cloud className="w-5 h-5" />,
      description: "Scalable web application with load balancing",
      template: `I need a scalable web application architecture with the following requirements:

- Frontend: React/Next.js application
- Backend: Node.js API servers
- Database: PostgreSQL with read replicas
- Load balancing for high availability
- Auto-scaling based on traffic
- CDN for static assets
- SSL/TLS termination
- Monitoring and logging
- Development and production environments

Expected traffic: 10,000 daily active users
Region: US East (N. Virginia)
Budget: $500-1000/month`,
    },
    {
      id: "microservices",
      title: "Microservices",
      icon: <Shield className="w-5 h-5" />,
      description: "Container-based microservices architecture",
      template: `I need a microservices architecture with the following requirements:

- Container orchestration with ECS or EKS
- API Gateway for service communication
- Service discovery and load balancing
- Centralized logging and monitoring
- Database per service pattern
- Message queues for async communication
- CI/CD pipeline integration
- Security groups and network isolation
- Auto-scaling for individual services

Services: User service, Product service, Order service, Payment service
Region: Multi-region deployment (US East, EU West)
Compliance: PCI DSS for payment processing`,
    },
    {
      id: "data-analytics",
      title: "Data Analytics",
      icon: <DollarSign className="w-5 h-5" />,
      description: "Big data processing and analytics platform",
      template: `I need a data analytics platform with the following requirements:

- Data ingestion from multiple sources
- Real-time stream processing
- Data lake for raw data storage
- Data warehouse for structured analytics
- ETL/ELT pipelines
- Machine learning model training and inference
- Business intelligence dashboards
- Data governance and security
- Cost optimization for storage and compute

Data volume: 100GB daily ingestion
Sources: Application logs, IoT sensors, third-party APIs
Analytics: Real-time dashboards, batch reporting, ML predictions
Region: US West (Oregon)`,
    },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (requirements.trim()) {
      onSubmit(requirements.trim());
    }
  };

  const handleTemplateSelect = (template: string) => {
    setRequirements(template);
    setSelectedTemplate(null);
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4">
          <h2 className="text-xl font-semibold text-white flex items-center gap-2">
            <Cloud className="w-6 h-6" />
            Describe Your Cloud Architecture Requirements
          </h2>
          <p className="text-blue-100 mt-1">
            Tell us about your application, expected traffic, compliance needs,
            and budget constraints.
          </p>
        </div>

        {/* Templates */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center gap-2 mb-4">
            <Lightbulb className="w-5 h-5 text-yellow-500" />
            <h3 className="font-medium text-gray-900">Quick Start Templates</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {templates.map((template) => (
              <button
                key={template.id}
                onClick={() => handleTemplateSelect(template.template)}
                className="text-left p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-all duration-200 group"
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className="text-blue-600 group-hover:text-blue-700">
                    {template.icon}
                  </div>
                  <h4 className="font-medium text-gray-900 group-hover:text-blue-900">
                    {template.title}
                  </h4>
                </div>
                <p className="text-sm text-gray-600 group-hover:text-gray-700">
                  {template.description}
                </p>
              </button>
            ))}
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6">
          <div className="mb-4">
            <label
              htmlFor="requirements"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Architecture Requirements
            </label>
            <textarea
              id="requirements"
              value={requirements}
              onChange={(e) => setRequirements(e.target.value)}
              placeholder="Describe your cloud architecture requirements in detail. Include:

• Application type and technology stack
• Expected traffic and user load
• Database and storage needs
• Security and compliance requirements
• High availability and disaster recovery needs
• Budget constraints
• Preferred AWS region(s)
• Integration requirements

Example: 'I need a scalable e-commerce platform that can handle 50,000 concurrent users, with a React frontend, Node.js backend, PostgreSQL database, and Redis caching. The application should be highly available across multiple availability zones with auto-scaling capabilities...'"
              rows={12}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none text-sm leading-relaxed"
              disabled={isLoading}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-500">
              <span className="font-medium">{requirements.length}</span>{" "}
              characters
              {requirements.length < 100 && (
                <span className="text-orange-600 ml-2">
                  • Add more details for better results
                </span>
              )}
            </div>

            <button
              type="submit"
              disabled={
                isLoading || !requirements.trim() || requirements.length < 50
              }
              className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Generating Architecture...
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  Generate Diagram
                </>
              )}
            </button>
          </div>
        </form>

        {/* Tips */}
        <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
          <h4 className="font-medium text-gray-900 mb-2">
            💡 Tips for better results:
          </h4>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• Be specific about your technology stack and frameworks</li>
            <li>• Include expected traffic patterns and peak loads</li>
            <li>
              • Mention any compliance requirements (HIPAA, PCI DSS, SOC 2,
              etc.)
            </li>
            <li>
              • Specify your budget range and cost optimization priorities
            </li>
            <li>• Include integration needs with third-party services</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default RequirementsForm;
