# Driving School Management System - Frontend

React-based frontend for the driving school management system.

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

```bash
npm install
```

### Running the Application

```bash
npm start
```

The application will open at [http://localhost:3000](http://localhost:3000)

### Building for Production

```bash
npm run build
```

## Configuration

Set the backend API URL in `.env`:
```
REACT_APP_API_URL=http://localhost:3000/api
```

## Available Scripts

- `npm start` - Runs the app in development mode
- `npm build` - Builds the app for production
- `npm test` - Runs the test suite
- `npm eject` - Ejects from Create React App (one-way operation)

## Project Structure

```
frontend/
├── public/           # Static files
├── src/
│   ├── components/   # React components
│   ├── pages/        # Page components
│   ├── services/     # API services
│   ├── utils/        # Utility functions
│   ├── App.js        # Main app component
│   └── index.js      # Entry point
├── package.json      # Dependencies
└── .env              # Environment variables
```
