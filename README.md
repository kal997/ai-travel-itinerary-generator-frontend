# AI Travel Itinerary Generator - Frontend

[![React](https://img.shields.io/badge/React-18.2-blue.svg)](https://reactjs.org/)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Docker](https://img.shields.io/badge/Docker-Ready-green.svg)](https://www.docker.com/)

The frontend application for the AI Travel Itinerary Generator - a modern, responsive web interface that allows users to create personalized travel plans powered by Google's Gemini AI.

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app) and provides a seamless user experience for managing AI-generated travel itineraries.

## 🎯 Features

- **User Authentication**: Secure login and registration system
- **Interactive Dashboard**: Manage all your travel itineraries in one place
- **AI-Powered Generation**: Create detailed day-by-day travel plans based on your preferences
- **Real-time Preview**: See generated itineraries before saving
- **CRUD Operations**: Create, read, update, and delete itineraries
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Persistent Sessions**: Stay logged in with secure token storage

## 📋 Table of Contents

- [Prerequisites](#prerequisites)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Configuration](#configuration)
- [Available Scripts](#available-scripts)
- [API Integration](#api-integration)
- [Components Overview](#components-overview)
- [Styling](#styling)
- [Testing](#testing)
- [Deployment](#deployment)
- [Docker Support](#docker-support)
- [Troubleshooting](#troubleshooting)

## 🔧 Prerequisites

- Node.js 18+ and npm
- Backend API running (see [backend repository](https://github.com/kal997/ai-travel-itinerary-generator-backend/tree/main))
- Modern web browser
- Docker (optional, for containerized deployment)

## 📁 Project Structure

```
frontend/
├── public/
│   ├── index.html          # HTML template
│   └── favicon.ico         # App icon
├── src/
│   ├── components/         # React components
│   │   ├── Dashboard.js    # Main dashboard view
│   │   ├── Login.js        # Login form
│   │   ├── Register.js     # Registration form
│   │   └── ItineraryForm.js # Itinerary creation form
│   ├── services/
│   │   └── api.js          # API service layer
│   ├── App.js              # Main App component
│   ├── App.css             # Global styles
│   └── index.js            # Application entry point
├── nginx.conf              # Production nginx config
├── Dockerfile              # Production container
├── Dockerfile.dev          # Development container
└── package.json            # Dependencies and scripts
```

## 🚀 Getting Started

### Local Development Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   # Create .env file in root directory
   echo "REACT_APP_API_URL=http://localhost:8000" > .env
   ```

4. **Start the development server**
   ```bash
   npm start
   ```

   The app will open at [http://localhost:3000](http://localhost:3000)

### Docker Development Setup

```bash
# Build and run with Docker Compose
docker-compose up --build

# Or run standalone
docker build -f Dockerfile.dev -t travel-frontend-dev .
docker run -p 3000:3000 travel-frontend-dev
```

## ⚙️ Configuration

### Environment Variables

Create a `.env` file in the root directory:

```env
# API Configuration
REACT_APP_API_URL=http://localhost:8000  # Your backend URL

```

### Proxy Configuration

For local development, the `package.json` includes a proxy setting:
```json
"proxy": "http://localhost:8000"
```

This helps avoid CORS issues during development.

## 📜 Available Scripts

### `npm start`
Runs the app in development mode with hot reloading.

### `npm test`
Launches the test runner in interactive watch mode.

### `npm run build`
Creates an optimized production build in the `build` folder.

### `npm run eject`
**Note: This is irreversible!** Ejects from Create React App for full configuration control.

## 🔌 API Integration

The frontend communicates with the backend through a centralized API service (`src/services/api.js`):

### Authentication
- **POST `/register`** - User registration
- **POST `/token`** - User login (OAuth2 password flow)

### Itinerary Management
- **POST `/api/itinerary/generate`** - Generate AI itinerary
- **POST `/api/itinerary`** - Save generated itinerary
- **GET `/api/itinerary`** - Fetch all user itineraries
- **PATCH `/api/itinerary/{id}`** - Update existing itinerary
- **DELETE `/api/itinerary/{id}`** - Delete itinerary

All authenticated endpoints require a Bearer token in the Authorization header.

## 🧩 Components Overview

### App.js
Main application component handling:
- Authentication state management
- Route-like navigation between Login, Register, and Dashboard
- Token persistence in localStorage

### Dashboard.js
Core functionality component featuring:
- Itinerary list display with grid layout
- Create/Edit form with dynamic interest inputs
- AI generation with real-time preview
- Full CRUD operations

### Login.js & Register.js
Authentication components with:
- Form validation
- Error handling
- Loading states
- Navigation between auth modes

### API Service (api.js)
Centralized Axios instance with:
- Base URL configuration
- Auth token injection
- Form data handling for OAuth2

## 🎨 Styling

The application uses vanilla CSS with:
- Mobile-first responsive design
- CSS Grid for itinerary layouts
- Flexbox for component layouts
- Custom color scheme matching the travel theme
- Smooth transitions and hover effects

Key style features:
- Responsive breakpoint at 768px
- Card-based design for itineraries
- Clean form styling with validation states
- Loading states and animations

## 🧪 Testing

Basic test setup with React Testing Library:

```bash
# Run tests
npm test

# Run tests with coverage
npm test -- --coverage
```

Current test coverage includes:
- App component rendering
- Basic component mounting tests

## 🚢 Deployment

### Production Build

1. **Build the application**
   ```bash
   # Set the backend URL for production
   REACT_APP_API_URL=https://your-backend-url.com npm run build
   ```

2. **Deploy to Google Cloud Run**
   ```bash
   # Build Docker image
   docker build -t gcr.io/YOUR_PROJECT_ID/travel-frontend .
   
   # Push to Container Registry
   docker push gcr.io/YOUR_PROJECT_ID/travel-frontend
   
   # Deploy to Cloud Run
   gcloud run deploy travel-frontend \
     --image gcr.io/YOUR_PROJECT_ID/travel-frontend \
     --platform managed \
     --region us-central1 \
     --allow-unauthenticated \
     --set-env-vars REACT_APP_API_URL=https://your-backend-url.com
   ```

## 🐳 Docker Support

### Production Dockerfile
Multi-stage build for optimized production images:
- Stage 1: Node.js build environment
- Stage 2: Nginx serving static files

### Development Dockerfile
Simple Node.js container with hot reloading support.

### Nginx Configuration
Custom nginx.conf handles:
- SPA routing (redirects all routes to index.html)
- Static asset caching (1 year for JS/CSS/images)
- MIME type configuration

## 🔍 Troubleshooting

### Common Issues

1. **CORS Errors**
   - Ensure backend CORS allows your frontend URL
   - Check if proxy is configured for development

2. **API Connection Failed**
   - Verify REACT_APP_API_URL is set correctly
   - Ensure backend is running and accessible

3. **Build Failures**
   - Clear node_modules and package-lock.json
   - Run `npm install` fresh

4. **Docker Port Issues**
   - Ensure ports 3000 (dev) or 8080 (prod) are available
   - Check Docker logs for specific errors

### Debug Mode

Enable debug logging:
```javascript
// In api.js
if (process.env.NODE_ENV === 'development') {
  axios.interceptors.request.use(request => {
    console.log('Starting Request:', request);
    return request;
  });
}
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Follow React best practices
- Maintain component modularity
- Add PropTypes or TypeScript (future enhancement)
- Write tests for new features
- Keep accessibility in mind (ARIA labels, semantic HTML)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🔗 Related Repositories

- [Backend API](../backend) - FastAPI backend with Gemini AI integration
- [Infrastructure](../infrastructure) - Terraform/Kubernetes configs (if applicable)

---

## Technology Stack

- **Framework**: React 18.2 (Create React App)
- **HTTP Client**: Axios
- **Styling**: Vanilla CSS with Flexbox/Grid
- **Build Tool**: Webpack (via CRA)
- **Container**: Docker with multi-stage builds
- **Web Server**: Nginx (production)
- **Package Manager**: npm
- **Testing**: Jest + React Testing Library