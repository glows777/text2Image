# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a multimodal chat application that uses Alibaba Cloud's DashScope API. The application consists of:
- A Bun + TypeScript proxy server (`server.ts`) that handles CORS and API forwarding
- A single-page HTML frontend (`index.html`) with Tailwind CSS styling
- Docker containerization support

**Key Features:**
- Text-to-image generation using `qwen-image` model
- Image editing/processing using `qwen-image-edit` model
- Image upload with Base64 encoding
- Multimodal chat interface supporting text + image inputs

## Development Commands

```bash
# Install dependencies
bun install

# Development mode (with auto-reload)
bun run dev

# Production mode
bun run start

# Build the project
bun run build

# Docker commands
docker-compose up -d
docker build -t text2image .
```

## Architecture

### Server Architecture (`server.ts`)
- **Framework**: Bun native HTTP server (not Express or other frameworks)
- **Port**: 3001 (hardcoded in server)
- **TypeScript Interfaces**: 
  - `DashScopeRequest` for text-to-image API requests
  - `ImageProcessRequest` for image editing API requests  
  - `ProxyRequestBody` and `ImageProxyRequestBody` for proxy requests
- **CORS**: Full CORS support with wildcard origins

### API Endpoints
- `GET /` - Serves the HTML frontend
- `GET /health` - Health check endpoint
- `POST /api/create-task` - Proxy to DashScope text-to-image generation API
- `GET /api/task/{taskId}` - Query task status with Authorization header
- `POST /api/process-image` - Proxy to DashScope image editing API

### Key Features
- **Proxy Server**: Forwards requests to `https://dashscope.aliyuncs.com/api/v1`
- **API Key Handling**: API keys are passed through request body or Authorization headers
- **Error Handling**: Comprehensive error responses in Chinese
- **Static File Serving**: Serves `index.html` at root path
- **Image Processing**: Base64 image handling for multimodal requests

### Frontend Architecture (`index.html`)
- **Single HTML File**: Complete chat interface in one file
- **Styling**: Tailwind CSS loaded via CDN
- **No Build Process**: Direct HTML/CSS/JS, no bundling
- **Local Storage**: API keys stored in browser localStorage
- **Responsive Design**: Mobile-friendly chat interface
- **Image Upload**: File selection with preview and Base64 encoding
- **Multimodal Support**: Text + image message composition

## Environment Variables

Optional environment variables:
- `PORT` - Override default port 3001
- `NODE_ENV` - Set to 'production' for Docker

## DashScope API Integration

The application integrates with two Alibaba Cloud DashScope APIs:

### Text-to-Image Generation
- **Model**: `qwen-image`
- **Endpoint**: `/services/aigc/text2image/image-synthesis`
- **Mode**: Async with task polling
- **Authentication**: Bearer token

### Image Editing/Processing  
- **Model**: `qwen-image-edit`
- **Endpoint**: `/services/aigc/multimodal-generation/generation`
- **Mode**: Synchronous response
- **Input Format**: Base64 images with text prompts
- **Authentication**: Bearer token

Both APIs use the same API key and support comprehensive error handling.

## Docker Configuration

- **Base Image**: `oven/bun:1-alpine`
- **Working Directory**: `/app`
- **Exposed Port**: 3001
- **Health Check**: Uses `/health` endpoint
- **Frozen Lockfile**: Uses `bun install --frozen-lockfile`

## Development Notes

- **No TypeScript Compilation**: Uses Bun's native TypeScript support
- **No External Dependencies**: Only uses Bun built-ins and @types packages
- **Chinese UI**: All user-facing text is in Chinese
- **Security**: API keys handled securely, not logged by server
- **Error Messages**: All error responses include Chinese messages
- **Image Upload**: 10MB file size limit with type validation
- **Base64 Encoding**: All images converted to Base64 for API transmission

## File Structure

```
text2Image/
├── server.ts           # Main Bun server with API proxy
├── index.html          # Complete frontend chat interface
├── package.json        # Bun project configuration
├── tsconfig.json       # TypeScript configuration
├── Dockerfile          # Container configuration
├── docker-compose.yml  # Docker Compose setup
└── .dockerignore       # Docker ignore patterns
```