import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextRequest, NextResponse } from 'next/server';

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY || '');

export async function POST(request: NextRequest) {
  try {
    const { requirements } = await request.json();

    if (!requirements) {
      return NextResponse.json(
        { error: 'Requirements are required' },
        { status: 400 }
      );
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const prompt = `You are an expert AWS cloud architect. Based on the user's requirements, generate D2 diagram code using bracket notation for node properties and container grouping.
The D2 code should be a single string and render a diagram similar to the example provided by the user.
The diagram should accurately represent the AWS services and their interactions as described in the requirements.

Follow these D2 syntax and conventions:

1.  **Title**: Start with \`title: "Descriptive Diagram Title based on requirements"\`.
    Example: \`title: Real-Time Trading System AWS Cloud Architecture\`

2.  **Nodes**:
    *   Syntax: \`NodeLabel [icon: service-icon, label: "Optional Label", color: colorName] { ... }\`
    *   Properties go inside square brackets after the label, separated by commas.

3.  **Containers (Groups)**:
    *   Syntax: \`ContainerLabel [icon: group-icon, color: colorName] { ... nested elements ... }\`
    *   Use containers to group related services as shown in the user's example (e.g., \`Frontend\`, \`SecurityLayer\`, \`BackendCluster\`).
    *   Containers can have their own icons, shapes, and styles (e.g., \`style.fill: "#RRGGBB"\`).
    *   Nest nodes within containers by defining them inside the container's curly braces.

4.  **Connections (Edges)**:
    *   Syntax: \`source_node_id -> target_node_id: "Optional Connection Label"\`
    *   Use \`->\` for directed connections.
    *   Use \`<->\` for bidirectional connections.
    *   To connect to/from a node inside a container, use the full path: \`container_id.node_id\`. Example: \`S3WebHost -> SecurityLayer.AWS_WAF\`.
    *   Include connection labels where they add clarity (e.g., \`S3WebHost -> BackendCluster.Microservices.AuthService: "authenticate (Cognito)"\`).

5.  **Styling**:
    *   Apply styles (like colors) as demonstrated in the user's example D2 code.
    *   Inline style: \`node_id: "Label" { style.fill: "#RRGGBB"; style.stroke: "#RRGGBB" }\`
    *   Separate style definition: \`node_id.style.fill: "#RRGGBB"\`
    *   Example from user: \`Security Layer [icon: shield, color: red]\` could translate to \`SecurityLayer: "Security Layer" { icon: "shield"; style.fill: "#FF0000" }\` (assuming 'shield' is a valid icon or shape). If using standard AWS icons, the color might be inherent or less critical to override unless for specific emphasis.

6.  **Comments**: Use \`#\` for comments to explain sections of the D2 code if necessary.

7.  **Layout**: D2 handles layout automatically. Focus on logical grouping and connections. The structure of your D2 code (nesting within containers) will heavily influence the layout.

8.  **Output Format**:
    *   The entire output MUST be a single block of valid D2 code.
    *   Do NOT wrap the D2 code in JSON.
    *   Do NOT wrap the D2 code in markdown code fences like \`\`\`d2 ... \`\`\` or \`\`\` ... \`\`\`.
    *   Start directly with the \`title:\` or the first D2 element.

**User's Requirements for the Diagram:**
${requirements}

**Example D2 Structure (use bracket notation like below):**

title Real-Time Trading System AWS Cloud Architecture

// Frontend & Entry
Frontend [icon: monitor] {
  Route 53 [icon: aws-route-53]
  CloudFront [icon: aws-cloudfront]
  S3 Web Hosting [icon: aws-s3, label: "S3 (Web App)"]
}

// Security & Networking Layer
Security Layer [icon: shield, color: red] {
  VPC [icon: aws-vpc]
  Public Subnets [icon: globe]
  Private Subnets [icon: lock]
  AWS WAF [icon: aws-waf]
  IAM [icon: aws-iam]
  Secrets Manager [icon: aws-secrets-manager]
}

// Backend Microservices (ECS/Fargate)
Backend Cluster [icon: aws-ecs, color: blue] {
  Microservices [icon: server] {
    Auth Service [icon: aws-cognito, label: "User Auth"]
    Order Service [icon: package, label: "Order Placement"]
    Portfolio Service [icon: briefcase, label: "Portfolio Mgmt"]
    Analytics Service [icon: bar-chart-2, label: "Trade Analytics"]
  }
}

// Trading Engine (Low Latency)
Trading Engine [icon: cpu, color: orange] {
  Trading Engine EC2 [icon: aws-ec2, label: "Engine (EC2)"]
  Trading Redis [icon: aws-elasticache-redis, label: "ElastiCache (Redis)"]
}

// Streaming & Queue
Streaming & Queue [icon: activity, color: purple] {
  Market Data MSK [icon: aws-msk, label: "MSK (Kafka)"]
  Async SQS [icon: aws-sqs, label: "SQS"]
}

// Datastores
Datastores [icon: database, color: green] {
  Trading RDS [icon: aws-rds, label: "RDS (Postgres/Aurora)"]
  Trading DynamoDB [icon: aws-dynamodb, label: "DynamoDB"]
  Trading Redshift [icon: aws-redshift, label: "Redshift"]
  Trading Timestream [icon: aws-timestream, label: "Timestream"]
}

// Observability
Observability [icon: eye, color: yellow] {
  CloudWatch [icon: aws-cloudwatch]
  X-Ray [icon: aws-x-ray]
  Grafana [icon: grafana]
}

// CI/CD & IaC
CICD [icon: git-branch, color: gray] {
  CodePipeline [icon: aws-codepipeline]
  CodeBuild [icon: aws-codebuild]
  CDK Terraform [icon: terraform, label: "CDK/Terraform"]
}

// Connections

// User entry and frontend
Route 53 > CloudFront
CloudFront > S3 Web Hosting

// Frontend to backend (API endpoints, Cognito for auth)
S3 Web Hosting > AWS WAF
AWS WAF > VPC
VPC > Public Subnets
Public Subnets > Microservices

S3 Web Hosting > Auth Service: authenticate (Cognito)
S3 Web Hosting > Order Service: place order
S3 Web Hosting > Portfolio Service: portfolio ops
S3 Web Hosting > Analytics Service: analytics

// Security Layer
Microservices > IAM
Microservices > Secrets Manager
Microservices > Private Subnets

// Backend microservices to trading engine
Order Service > Trading Engine EC2: submit order
Portfolio Service > Trading Engine EC2: query positions
Analytics Service > Trading Engine EC2: fetch stats

// Trading engine to Redis
Trading Engine EC2 <> Trading Redis: real-time cache

// Market data streaming
Market Data MSK > Trading Engine EC2: stream market data
Market Data MSK > Microservices: stream market data

// SQS for async jobs
Microservices > Async SQS: enqueue tasks
Async SQS > Microservices: process tasks

// Datastore connections
Order Service <> Trading RDS: transactional data
Portfolio Service <> Trading RDS
Analytics Service <> Trading Redshift: analytics queries
Trading Engine EC2 <> Trading Timestream: time-series data
Auth Service <> Trading DynamoDB: session/risk data
Order Service <> Trading DynamoDB: risk/session

// Observability
Microservices > CloudWatch
Trading Engine EC2 > CloudWatch
Market Data MSK > CloudWatch
Async SQS > CloudWatch
Microservices > X-Ray
Trading Engine EC2 > X-Ray
CloudWatch > Grafana
X-Ray > Grafana

// CI/CD
CICD > Backend Cluster: deploy
CICD > Trading Engine: deploy
CICD > Streaming & Queue: deploy
CICD > Datastores: provision
CICD > Security Layer: provision
CICD > Observability: provision

// Multi-AZ, cross-region (disaster recovery)
VPC --> VPC: cross-region replication
Trading RDS --> Trading RDS: multi-AZ/cross-region
Trading DynamoDB --> Trading DynamoDB: global tables
Trading Redshift --> Trading Redshift: DR sync
`;

    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();

    // The response is expected to be raw D2 code.
    // Assign the raw text directly to diagramData, trimming whitespace.
    const diagramData = text.trim();

    return NextResponse.json({
      success: true,
      data: diagramData,
      rawResponse: text
    });

  } catch (error) {
    console.error('Error generating diagram:', error);
    return NextResponse.json(
      { 
        error: 'Failed to generate diagram',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}