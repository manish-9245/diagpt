import React from "react";
import * as SiIcons from "react-icons/si";

interface AWSIconProps {
  service: string;
  size?: number;
  className?: string;
}

export const AWSIcon: React.FC<AWSIconProps> = ({
  service,
  size = 24,
  className = "",
}) => {
  const iconStyle = {
    width: size,
    height: size,
    display: "inline-block",
  };

  // Dynamic AWS service icons via react-icons (Simple Icons) fallback to default SVG
  const getIcon = (serviceName: string) => {
    // Try react-icon Simple Icons for AWS services
    if (serviceName) {
      const key =
        "SiAmazon" +
        serviceName
          .replace(/^(aws-?)/i, "")
          .split(/[-_]/)
          .map((seg) => seg.charAt(0).toUpperCase() + seg.slice(1))
          .join("");
      const IconComp = (SiIcons as any)[key];
      if (IconComp) {
        return <IconComp style={iconStyle} className={className} />;
      }
    }
    // default generic circle icon
    return (
      <svg
        viewBox="0 0 24 24"
        className="aws-icon"
        data-testid="aws-default-icon"
        style={iconStyle}
      >
        <circle cx="12" cy="12" r="12" fill="#232F3E" fillOpacity="0.1" />
        <circle cx="12" cy="12" r="4" fill="#232F3E" fillOpacity="0.3" />
      </svg>
    );
  };

  return getIcon(service);
};

export const getAWSServiceColor = (service: string): string => {
  if (!service) {
    return "#232F3E"; // Default color if service is undefined
  }
  const normalizedService = service.toLowerCase().replace(/[^a-z0-9]/g, "");

  const colorMap: { [key: string]: string } = {
    ec2: "#FF9900",
    rds: "#3F48CC",
    s3: "#569A31",
    lambda: "#FF9900",
    apigateway: "#FF4B4B",
    cloudfront: "#8C4FFF",
    elb: "#FF9900",
    loadbalancer: "#FF9900",
    vpc: "#232F3E",
    route53: "#8C4FFF",
    cloudwatch: "#FF4B4B",
    iam: "#DD344C",
    sns: "#FF9900",
    sqs: "#FF9900",
  };

  return colorMap[normalizedService] || "#232F3E";
};
