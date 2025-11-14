# Internal Management Platform

An internal company platform for managing artists, events, schedules, and announcements for an entertainment agency.

## Tech Stack

- **Frontend**: React + Vite, React Router DOM, Tailwind CSS (Material Tailwind), Axios
- **Backend**: Node.js, Express, MongoDB (Mongoose), CORS

## Project Structure

```
internal-management-platform/
├─ backend/
│  ├─ models/          # MongoDB models
│  ├─ routes/          # API routes
│  ├─ controllers/     # Route controllers
│  └─ server.js        # Express server entry point
├─ frontend/
│  ├─ src/
│  │  ├─ components/   # Reusable React components
│  │  ├─ pages/        # Page components
│  │  ├─ services/     # API service functions
│  │  ├─ App.jsx       # Main App component
│  │  └─ main.jsx      # React entry point
│  └─ index.html
├─ .gitignore
└─ README.md
```

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- MongoDB (local or cloud instance)

### Installation

1. Install backend dependencies:
```bash
cd backend
npm install
```

2. Install frontend dependencies:
```bash
cd frontend
npm install
```

### Running the Application

1. Start the backend server:
```bash
cd backend
npm start
# or for development with auto-reload:
npm run dev
```

The backend server will run on `http://localhost:5000`

2. Start the frontend development server:
```bash
cd frontend
npm run dev
```

The frontend will run on `http://localhost:3000`

### Environment Variables

Create a `.env` file in the `backend` directory:

```
PORT=5000
MONGODB_URI=your_mongodb_connection_string
```

## API Endpoints

- `GET /status` - Health check endpoint (returns `{status: "ok"}`)

## Features

- **Dashboard**: Central hub for overview and quick access
- **Artists**: Manage artist information
- **Events**: Manage event details and schedules
- **Announcements**: Company-wide announcements

## Development

The project follows clean code standards:
- Clear naming conventions
- Modular component structure
- Proper indentation and formatting
- Documentation comments

## License

ISC
