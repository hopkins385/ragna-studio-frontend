<div align="center">
  <h1>🤖 RAGNA Studio Frontend</h1>
  <p><strong>Multi-Agent AI Platform for Content Creation & Collaboration</strong></p>
  
  [![Vue.js](https://img.shields.io/badge/Vue.js-3.5.20-4FC08D?style=flat&logo=vue.js&logoColor=white)](https://vuejs.org/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-5.7.3-3178C6?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
  [![Vite](https://img.shields.io/badge/Vite-7.1.3-646CFF?style=flat&logo=vite&logoColor=white)](https://vitejs.dev/)
  [![TailwindCSS](https://img.shields.io/badge/Tailwind-3.4.16-06B6D4?style=flat&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
  [![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
</div>

![RAGNA Studio Home View](https://static.ragna.io/studio-images/home-view.png)

## 🌟 Overview

RAGNA Studio is a comprehensive multi-agent AI platform that brings together conversational AI, content generation, and document management in one intuitive interface. Built with Vue 3 and TypeScript, it provides a modern workspace for orchestrating multiple AI agents, generating images from text, managing knowledge bases, and exploring the latest AI capabilities. Whether you're creating content, organizing documents, or building complex multi-agent workflows, RAGNA Studio offers a seamless and powerful experience.

## ⚠️ Important Notes

- **Not Production Ready**: This software is provided for educational and development purposes
- **API Keys Required**: You'll need API keys from AI providers to use AI features
- **Resource Intensive**: AI operations require significant computational resources
- **Incomplete**: Some side-features are incomplete or work-in-progress

## 🏗️ RAGNA Studio Ecosystem

This frontend is part of the complete RAGNA Studio platform:

- **[RAGNA Studio Backend](https://github.com/hopkins385/ragna-studio-backend)** - AI-powered API backend
- **[RAGNA Studio Frontend](https://github.com/hopkins385/ragna-studio-frontend)** (this repository) - Modern Vue3-based user interface
- **[RAGNA SDK](https://github.com/hopkins385/ragna-sdk)** - TypeScript SDK for easy integration into your own software

For the full experience, you'll want to set up both the backend and frontend repositories. The SDK provides a convenient way to integrate RAGNA Studio's AI capabilities into your own applications with type-safe API calls and built-in error handling.

## ✨ Key Features

### 🤖 AI-Powered Assistants

![RAGNA Studio Home View](https://static.ragna.io/studio-images/agent-tools.png)

- **Multi-Agent Orchestration**: Create and manage multiple AI agents working together
- **Custom AI Assistants**: Configure specialized AI assistants with custom tools and knowledge bases
- **Agent Collaboration**: Enable agents to communicate and collaborate on complex tasks
- **Multi-Modal Chat**: Support for text, images, and voice inputs
- **Template Library**: (Work in progress) Pre-built assistant templates for various use cases
- **Tool Integration**: Extensible tool system for enhanced AI capabilities

### 📊 Workflow Management

- **Multi-Agent Workflows**: Design workflows where multiple AI agents collaborate
- **Process Automation**: Streamline content creation and data processing workflows

### 📚 Document & Knowledge Management

- **Smart Collections**: Organize documents with AI-powered categorization
- **Document Processing**: Upload, analyze, and extract insights from various file formats

### 🎨 Content Generation

- **Text-to-Image**: AI-powered image generation with advanced controls
- **Markdown Editor**: Rich text editing with TipTap integration
- **Code Highlighting**: Syntax highlighting for multiple programming languages
- **Mathematical Notation**: KaTeX support for mathematical expressions

### 🏢 Enterprise Features (Work in progress)

- **Team Management**: Role-based access control and team collaboration
- **Admin Dashboard**: Comprehensive user and system administration
- **Analytics**: Usage tracking and performance metrics
- **Multi-language Support**: Internationalization with Vue I18n

## 🚀 Quick Start

### Prerequisites

- **Node.js** 22+
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

## 🛠️ Development

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
├── composables/        # Core composables
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

- **RAGNA SDK** - Backend API SDK
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

- German (default)
- Extensible for additional languages

## 📋 Requirements

### System Requirements

- **Node.js**: 22.x or higher
- **Memory**: 4GB RAM minimum
- **Storage**: 1GB available space

## 🤝 Contributing

We welcome contributions! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Vue.js Team** - For the amazing framework
- **TailwindCSS** - For the utility-first CSS framework
- **Radix Vue** - For accessible UI primitives
- **Tiptap** - For the rich and extensible text editor
- **Lucide Icons** - For the beautiful icon set
- **All Contributors** - For their valuable contributions

---

<div align="center">
  <p>Built with ❤️ and Appreciation by Sven Stadhouders</p>
  <p>
    <a href="https://ragna-engineering.de">Website</a> •
    <a href="https://docs.ragna.studio">Documentation (tbd)</a> •
    <a href="https://github.com/hopkins385/ragna-studio-frontend">GitHub</a>
  </p>
</div>
