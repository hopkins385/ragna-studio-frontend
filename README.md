<div align="center">
  <h1>🤖 RAGNA Studio Frontend</h1>
  <p><strong>Multi-Agent AI Platform for Content Creation & Collaboration</strong></p>
  
  [![Vue.js](https://img.shields.io/badge/Vue.js-3.5.20-4FC08D?style=flat&logo=vue.js&logoColor=white)](https://vuejs.org/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-5.7.3-3178C6?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
  [![Vite](https://img.shields.io/badge/Vite-7.1.3-646CFF?style=flat&logo=vite&logoColor=white)](https://vitejs.dev/)
  [![TailwindCSS](https://img.shields.io/badge/Tailwind-3.4.16-06B6D4?style=flat&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
  [![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
</div>

## 🌟 Overview

RAGNA Studio is a comprehensive multi-agent AI platform that brings together conversational AI, content generation, and document management in one intuitive interface. Built with Vue 3 and TypeScript, it provides a modern workspace for orchestrating multiple AI agents, generating images from text, managing knowledge bases, and exploring the latest AI capabilities. Whether you're creating content, organizing documents, or building complex multi-agent workflows, RAGNA Studio offers a seamless and powerful experience.

## ⚠️ Important Notice

**This software is currently in development and is NOT intended for production use.**

- Many features are incomplete or work-in-progress
- The platform is designed for experimentation and development purposes
- Expect breaking changes and instability
- Use at your own risk for non-critical applications only
- No warranty or support guarantees are provided

This is an open-source project shared for educational and collaborative purposes. Contributions and feedback are welcome!

## ✨ Key Features

### 🤖 AI-Powered Assistants

- **Multi-Agent Orchestration**: Create and manage multiple AI agents working together
- **Custom AI Assistants**: Configure specialized AI assistants with custom tools and knowledge bases
- **Agent Collaboration**: Enable agents to communicate and collaborate on complex tasks
- **Multi-Modal Chat**: Support for text, images, and file uploads in conversations
- **Template Library**: (Work in progress) Pre-built assistant templates for various use cases
- **Tool Integration**: Extensible tool system for enhanced AI capabilities

### 📊 Workflow Management

- **Multi-Agent Workflows**: Design workflows where multiple AI agents collaborate
- **Visual Workflow Builder**: (Work in progress) Drag-and-drop interface using Vue Flow
- **Process Automation**: Streamline content creation and data processing workflows
- **Real-time Collaboration**: Multi-user workflow editing and execution
- **Workflow Templates**: Ready-to-use automation patterns

### 📚 Document & Knowledge Management

- **Smart Collections**: Organize documents with AI-powered categorization
- **Document Processing**: Upload, analyze, and extract insights from various file formats
- **Advanced Search**: Semantic search across all documents and conversations

### 🎨 Content Generation

- **Text-to-Image**: AI-powered image generation with advanced controls
- **Markdown Editor**: Rich text editing with TipTap integration
- **Code Highlighting**: Syntax highlighting for multiple programming languages
- **Mathematical Notation**: KaTeX support for mathematical expressions

### 🏢 Enterprise Features

- **Team Management**: Role-based access control and team collaboration
- **Admin Dashboard**: Comprehensive user and system administration
- **Analytics**: Usage tracking and performance metrics
- **Multi-language Support**: Internationalization with Vue I18n

## 🚀 Quick Start

### Prerequisites

- **Node.js** 20+
- **npm** or **yarn**
- **Modern Browser** (Chrome, Firefox, Safari, Edge)

### Installation

```bash
# Clone the repository
git clone https://github.com/hopkins385/ragna-studio-frontend.git
cd ragna-studio-frontend

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your configuration

# Start development server
npm run dev
```

The application will be available at `http://localhost:5173`

### Environment Configuration

Create a `.env` file in the root directory:

```env
VITE_BACKEND_URL=https://api.ragna.studio
VITE_APP_VERSION=0.45.1
VITE_WEBSOCKET_URL=wss://api.ragna.studio
```

## 🛠️ Development

### Available Scripts

```bash
# Development
npm run dev              # Start development server
npm run build           # Build for production
npm run preview         # Preview production build

# Testing
npm run test:unit       # Run unit tests with Vitest
npm run test:e2e        # Run end-to-end tests with Cypress
npm run test:e2e:dev    # Run E2E tests in development

# Code Quality
npm run lint            # Lint and fix code
npm run format          # Format code with Prettier
npm run type-check      # Type checking with Vue TSC

# Assets
npm run generate-pwa-assets  # Generate PWA icons and assets
```

### Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # Base UI components (shadcn/vue)
│   ├── brand/          # Brand-specific components
│   ├── nav/            # Navigation components
│   └── ...
├── modules/            # Feature modules
│   ├── ai-chat/        # AI chat functionality
│   ├── assistant/      # AI assistant management
│   ├── workflow/       # Workflow builder and execution
│   ├── collection/     # Document collections
│   ├── text-to-image/  # Image generation
│   └── ...
├── composables/        # Vue composables
├── layouts/           # Application layouts
├── router/            # Vue Router configuration
├── stores/            # Pinia state management
├── utils/             # Utility functions
└── assets/            # Static assets
```

### Technology Stack

#### Core Framework

- **Vue 3** - Progressive JavaScript framework
- **TypeScript** - Type-safe JavaScript
- **Vite** - Next-generation build tool
- **Vue Router** - Official router for Vue.js

#### UI & Styling

- **TailwindCSS** - Utility-first CSS framework
- **Radix Vue** - Unstyled, accessible UI components
- **Lucide Vue** - Beautiful icons
- **TipTap** - Rich text editor
- **Vue Flow** - Interactive flowchart library

#### State Management & Data

- **Pinia** - Modern state management
- **VueUse** - Collection of Vue composition utilities
- **Socket.io** - Real-time communication
- **Zod** - Schema validation

#### AI & Integration

- **RAGNA SDK** - Custom AI platform SDK
- **Markdown-it** - Markdown parser
- **KaTeX** - Mathematical notation
- **Highlight.js** - Syntax highlighting

## 🏗️ Architecture

RAGNA Studio follows a modular architecture pattern:

### Module-Based Organization

Each feature is organized into self-contained modules with:

- **Components**: Vue components specific to the module
- **Composables**: Reusable logic and state management
- **Stores**: Pinia stores for module state
- **Views**: Page-level components
- **Services**: API and business logic

### Key Architectural Patterns

- **Composition API**: Leveraging Vue 3's composition API throughout
- **Dependency Injection**: Using Vue's provide/inject for service dependencies
- **Event-Driven**: Real-time updates using WebSocket connections
- **Reactive State**: Centralized state management with Pinia
- **Type Safety**: Full TypeScript coverage for robust development

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Development Guidelines

1. **Code Style**: Follow the ESLint and Prettier configurations
2. **Type Safety**: Maintain 100% TypeScript coverage
3. **Testing**: Write tests for new features and bug fixes
4. **Documentation**: Update documentation for any API changes
5. **Accessibility**: Ensure all components meet WCAG guidelines

### Submitting Changes

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📦 Building & Deployment

### Production Build

```bash
# Build for production
npm run build-prod

# Preview production build locally
npm run preview
```

### Docker Deployment

```bash
# Build Docker image
docker build -t ragna-studio-frontend .

# Run container
docker run -p 80:80 ragna-studio-frontend
```

### Environment-Specific Builds

The application supports multiple deployment environments through Vite's mode system:

- **Development**: `npm run dev`
- **Staging**: `npm run build --mode staging`
- **Production**: `npm run build-prod`

## 🔧 Configuration

### Progressive Web App (PWA)

The application is configured as a PWA with:

- Service Worker for offline functionality
- Installable app experience
- Background sync capabilities
- Push notifications support

### Internationalization

Multi-language support using Vue I18n:

- English (default)
- German
- Extensible for additional languages

## 📋 Requirements

### System Requirements

- **Node.js**: 20.x or higher
- **Memory**: 4GB RAM minimum
- **Storage**: 1GB available space

### Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Documentation**: [docs.ragna.studio](https://docs.ragna.studio)
- **Issues**: [GitHub Issues](https://github.com/hopkins385/ragna-studio-frontend/issues)
- **Discussions**: [GitHub Discussions](https://github.com/hopkins385/ragna-studio-frontend/discussions)

## 🙏 Acknowledgments

- **Vue.js Team** - For the amazing framework
- **TailwindCSS** - For the utility-first CSS framework
- **Radix Vue** - For accessible UI primitives
- **All Contributors** - Thank you for your contributions!

---

<div align="center">
  <p>Built with ❤️ and Apprechiation by Sven Stadhouders</p>
  <p>
    <a href="https://ragna-engineering.de">Website</a> •
    <a href="https://docs.ragna.studio">Documentation (tbd)</a> •
    <a href="https://github.com/hopkins385/ragna-studio-frontend">GitHub</a>
  </p>
</div>
