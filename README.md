# Internal Management Platform

An internal company platform for managing artists, events, schedules, and announcements for an entertainment agency.

## Overview

This platform provides a comprehensive solution for entertainment agencies to manage their internal operations. It includes features for artist management, event scheduling, and company-wide announcements, all accessible through a modern web interface.

## Tech Stack

### Frontend
- **React 18** - UI library
- **Vite** - Build tool and development server
- **React Router DOM** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **Material Tailwind** - React components built on Tailwind CSS
- **Redux Toolkit** - State management
- **Axios** - HTTP client for API requests
- **Formik + Yup** - Form handling and validation
- **FilePond** - File upload component

### Backend
- **Node.js** - Runtime environment
- **Express** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **Cloudinary** - Cloud-based image and file management
- **Multer** - File upload middleware
- **CORS** - Cross-origin resource sharing
- **dotenv** - Environment variable management

## Project Structure

```
internal-management-system/
├── backend/
│   ├── config/
│   │   ├── cloudinary.js      # Cloudinary configuration
│   │   └── database.js         # MongoDB connection
│   ├── controllers/            # Route controllers
│   │   ├── announcementController.js
│   │   ├── artistController.js
│   │   ├── dashboardController.js
│   │   └── eventController.js
│   ├── middleware/             # Express middleware
│   │   ├── errorHandler.js
│   │   ├── parseMultipartJson.js
│   │   └── upload.js
│   ├── models/                 # Mongoose models
│   │   ├── Announcement.js
│   │   ├── Artist.js
│   │   └── Event.js
│   ├── routes/                  # API routes
│   │   ├── announcementRoutes.js
│   │   ├── artistRoutes.js
│   │   ├── dashboardRoutes.js
│   │   ├── eventRoutes.js
│   │   └── index.js
│   ├── utils/                   # Utility functions
│   │   ├── cloudinaryUpload.js
│   │   └── errors.js
│   ├── server.js                # Express server entry point
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/         # React components
│   │   │   ├── common/         # Reusable UI components
│   │   │   ├── features/       # Feature-specific components
│   │   │   ├── forms/          # Form components
│   │   │   ├── ErrorBoundary.jsx
│   │   │   └── Layout.jsx
│   │   ├── context/            # React context providers
│   │   │   └── ToastContext.jsx
│   │   ├── hooks/              # Custom React hooks
│   │   │   ├── useApi.js
│   │   │   └── useDebounce.js
│   │   ├── pages/              # Page components
│   │   │   ├── Announcements.jsx
│   │   │   ├── Artists.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   └── Events.jsx
│   │   ├── services/           # API service functions
│   │   │   ├── announcementService.js
│   │   │   ├── api.js
│   │   │   ├── artistService.js
│   │   │   ├── dashboardService.js
│   │   │   └── eventService.js
│   │   ├── store/              # Redux store configuration
│   │   │   ├── slices/         # Redux slices
│   │   │   ├── hooks.js
│   │   │   └── store.js
│   │   ├── utils/              # Utility functions
│   │   │   ├── constants.js
│   │   │   ├── formatters.js
│   │   │   └── validation.js
│   │   ├── App.jsx             # Main App component
│   │   ├── main.jsx            # React entry point
│   │   └── index.css           # Global styles
│   ├── index.html
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── package.json
└── README.md
```

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher)
- **npm** or **yarn**
- **MongoDB** (local instance or cloud connection string)
- **Cloudinary account** (for file uploads)

## Installation

### 1. Clone the Repository

```bash
git clone <repository-url>
cd internal-management-system
```

### 2. Install Backend Dependencies

```bash
cd backend
npm install
```

### 3. Install Frontend Dependencies

```bash
cd ../frontend
npm install
```

## Configuration

### Backend Environment Variables

Create a `.env` file in the `backend` directory:

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
FRONTEND_URL=http://localhost:3000
```

### Frontend Environment Variables

Create a `.env` file in the `frontend` directory (optional, defaults are provided):

```env
VITE_API_URL=http://localhost:5000
PORT=3000
```

## Running the Application

### Development Mode

#### Start the Backend Server

```bash
cd backend
npm run dev
```

The backend server will run on `http://localhost:5000` with auto-reload enabled.

#### Start the Frontend Development Server

In a new terminal:

```bash
cd frontend
npm run dev
```

The frontend will run on `http://localhost:3000` and automatically proxy API requests to the backend.

### Production Mode

#### Build the Frontend

```bash
cd frontend
npm run build
```

This creates an optimized production build in the `dist` directory.

#### Preview the Production Build

```bash
cd frontend
npm run preview
```

#### Start the Backend Server

```bash
cd backend
npm start
```

## Available Scripts

### Backend Scripts

| Script | Description |
|--------|-------------|
| `npm start` | Start the production server |
| `npm run dev` | Start the development server with auto-reload |

### Frontend Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start the development server |
| `npm run build` | Build the application for production |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run ESLint to check code quality |

## API Endpoints

All API endpoints are prefixed with `/api`.

### Health Check

- **GET** `/status` - Returns server status

### Artists

- **GET** `/api/artists` - Get all artists
- **GET** `/api/artists/:id` - Get a specific artist
- **POST** `/api/artists` - Create a new artist (supports file upload)
- **PUT** `/api/artists/:id` - Update an artist (supports file upload)
- **DELETE** `/api/artists/:id` - Delete an artist

### Events

- **GET** `/api/events` - Get all events
- **GET** `/api/events/upcoming` - Get upcoming events
- **GET** `/api/events/:id` - Get a specific event
- **POST** `/api/events` - Create a new event (supports file upload)
- **PUT** `/api/events/:id` - Update an event (supports file upload)
- **DELETE** `/api/events/:id` - Delete an event

### Announcements

- **GET** `/api/announcements` - Get all announcements
- **GET** `/api/announcements/active` - Get active announcements
- **GET** `/api/announcements/:id` - Get a specific announcement
- **POST** `/api/announcements` - Create a new announcement
- **PUT** `/api/announcements/:id` - Update an announcement
- **DELETE** `/api/announcements/:id` - Delete an announcement

### Dashboard

- **GET** `/api/dashboard/stats` - Get dashboard statistics

## Features

### Dashboard
- Central hub providing an overview of key metrics
- Quick access to recent activities
- Statistics and summaries

### Artists Management
- Create, read, update, and delete artist profiles
- Upload and manage artist images
- Store artist information and details

### Events Management
- Full CRUD operations for events
- View upcoming events
- Upload event images
- Manage event schedules and details

### Announcements
- Create and manage company-wide announcements
- Filter active announcements
- Mark announcements as active or inactive

## API Notes

- All endpoints return JSON responses
- File uploads are handled via multipart/form-data
- The API uses RESTful conventions
- Error responses follow a consistent format
- CORS is configured to allow frontend requests

## Development Guidelines

The project follows clean code standards:

- **Clear naming conventions** - Descriptive variable and function names
- **Modular structure** - Separation of concerns with controllers, routes, and services
- **Proper formatting** - Consistent indentation and code style
- **Documentation** - Code comments where necessary
- **Error handling** - Centralized error handling middleware
- **Type validation** - Form validation using Yup schemas

## Future Improvements

Potential enhancements for future development:

- User authentication and authorization
- Role-based access control
- Advanced search and filtering
- Export functionality (CSV, PDF)
- Email notifications
- Calendar integration
- Mobile responsive optimizations
- Real-time updates via WebSockets
- Analytics and reporting dashboard
- Bulk operations for data management

## License

ISC
