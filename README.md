# DiagPT - AI-Powered AWS Architecture Diagrams

🚀 **Generate interactive AWS infrastructure diagrams using AI** - Describe your cloud architecture requirements and let Gemini AI create optimized, interactive diagrams with best practices, security recommendations, and cost optimization suggestions.

![DiagPT Demo](https://via.placeholder.com/800x400/3B82F6/FFFFFF?text=DiagPT+Demo)

## ✨ Features

- **🤖 AI-Powered Generation**: Uses Google's Gemini AI to understand requirements and generate architecture diagrams
- **🎨 Interactive Diagrams**: Built with React Flow for fully interactive, draggable, and zoomable diagrams
- **☁️ AWS Service Icons**: Comprehensive library of AWS service icons and components
- **🏗️ VPC Visualization**: Proper VPC, subnet, and availability zone representation
- **📊 Smart Recommendations**: AI-generated optimization suggestions for security, performance, and cost
- **📤 Multiple Export Formats**: Export diagrams as PNG, PDF, or JSON
- **📱 Responsive Design**: Works seamlessly on desktop and mobile devices
- **🎯 Template Library**: Quick-start templates for common architecture patterns

## 🛠️ Tech Stack

- **Frontend**: Next.js 15, React 18, TypeScript
- **Styling**: Tailwind CSS
- **Diagrams**: React Flow
- **AI**: Google Gemini AI
- **Icons**: Lucide React, Custom AWS Icons
- **Export**: html2canvas, jsPDF

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ installed
- Google Gemini AI API key ([Get one here](https://makersuite.google.com/app/apikey))

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd diagpt
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   ```bash
   cp .env.example .env.local
   ```

   Edit `.env.local` and add your Gemini AI API key:

   ```env
   GOOGLE_GEMINI_API_KEY=your_gemini_api_key_here
   ```

4. **Run the development server**

   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📖 Usage

### 1. Describe Your Requirements

Use the requirements form to describe your cloud architecture needs. Be specific about:

- **Application type** and technology stack
- **Expected traffic** and user load
- **Database and storage** requirements
- **Security and compliance** needs
- **High availability** requirements
- **Budget constraints**
- **Preferred AWS regions**

### 2. Generate Diagram

Click "Generate Diagram" and watch as AI creates your architecture diagram with:

- Properly positioned AWS services
- VPC and subnet organization
- Security group configurations
- Load balancers and auto-scaling groups
- Database and storage services
- Monitoring and logging components

### 3. Interact and Export

- **Drag and drop** services to reorganize
- **Zoom and pan** to explore details
- **Click services** to view detailed information
- **Export** as PNG, PDF, or JSON
- **Review recommendations** for optimization

## 🎯 Example Requirements

### Web Application

```
I need a scalable web application architecture with:

- Frontend: React/Next.js application
- Backend: Node.js API servers
- Database: PostgreSQL with read replicas
- Load balancing for high availability
- Auto-scaling based on traffic
- CDN for static assets
- SSL/TLS termination
- Monitoring and logging

Expected traffic: 10,000 daily active users
Region: US East (N. Virginia)
Budget: $500-1000/month
```

### Microservices

```
I need a microservices architecture with:

- Container orchestration with ECS
- API Gateway for service communication
- Service discovery and load balancing
- Centralized logging and monitoring
- Database per service pattern
- Message queues for async communication
- CI/CD pipeline integration

Services: User, Product, Order, Payment
Region: Multi-region (US East, EU West)
Compliance: PCI DSS for payments
```

## 🏗️ Architecture

```
├── app/
│   ├── api/
│   │   └── generate-diagram/
│   │       └── route.ts          # Gemini AI integration
│   ├── globals.css               # Global styles
│   ├── layout.tsx                # Root layout
│   └── page.tsx                  # Main application
├── components/
│   ├── aws-icons.tsx             # AWS service icons
│   ├── aws-node.tsx              # Custom AWS node component
│   ├── vpc-container.tsx         # VPC container component
│   ├── diagram-canvas.tsx        # React Flow diagram
│   ├── requirements-form.tsx     # Requirements input form
│   └── recommendations-panel.tsx # AI recommendations
└── ...
```

## 🎨 Supported AWS Services

- **Compute**: EC2, Lambda, ECS, EKS
- **Storage**: S3, EBS, EFS
- **Database**: RDS, DynamoDB, ElastiCache
- **Networking**: VPC, ELB, CloudFront, Route 53
- **Security**: IAM, Security Groups, NACLs
- **Monitoring**: CloudWatch, CloudTrail
- **Messaging**: SNS, SQS
- **API**: API Gateway
- **And many more...**

## 🔧 Configuration

### Environment Variables

| Variable                | Description            | Required |
| ----------------------- | ---------------------- | -------- |
| `GOOGLE_GEMINI_API_KEY` | Your Gemini AI API key | Yes      |

### Customization

- **Add new AWS services**: Edit `components/aws-icons.tsx`
- **Modify AI prompts**: Update `app/api/generate-diagram/route.ts`
- **Customize styling**: Modify Tailwind classes or `app/globals.css`
- **Add templates**: Update `components/requirements-form.tsx`

## 📦 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add your `GOOGLE_GEMINI_API_KEY` environment variable
4. Deploy!

### Other Platforms

```bash
# Build for production
npm run build

# Start production server
npm start
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Google Gemini AI](https://ai.google.dev/) for powerful AI capabilities
- [React Flow](https://reactflow.dev/) for the amazing diagram library
- [Next.js](https://nextjs.org/) for the excellent React framework
- [Tailwind CSS](https://tailwindcss.com/) for beautiful styling
- [Lucide](https://lucide.dev/) for the icon library

## 📞 Support

If you have any questions or need help, please:

1. Check the [documentation](README.md)
2. Search [existing issues](../../issues)
3. Create a [new issue](../../issues/new)

---

**Built with ❤️ for the cloud architecture community**
