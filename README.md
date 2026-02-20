# Smart Agriculture Advisory Platform

A full-stack Smart Agriculture web application that helps farmers make data-driven decisions using weather data, crop recommendations, market trends, and cloud-based services.

🗄️ Technology Stack
🔹 Frontend

React.js

Vite

Context API

Custom CSS (Glassmorphism UI)

🔹 Backend

Node.js

Express.js (REST API)

JWT Authentication

🔹 Database

MongoDB

🔹 Cloud Services (AWS)

AWS Lambda (Serverless Functions)

AWS API Gateway (API Management)

AWS IAM (Access Management)

AWS Cloud Services Integration

🔹 External APIs

OpenWeather API (Weather Forecast Data)

## Project Structure
SmartFarming/
│
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   └── server.js
│
├── frontend/
│   ├── public/
│   ├── src/
│   └── vite.config.js
│
├── aws/
│   └── lambda-functions/
│
└── README.md
🚀 Features

User Authentication
Secure signup and login using JWT.

Dashboard
Displays daily weather and market prices.

Crop Recommendation System
Suggests best crops based on:

Soil nutrients (N, P, K)

pH value

Weather data

Weather Forecast
Provides real-time and 7-day weather forecast.

Market Prices
Shows live agricultural commodity prices.

AI Assistant
24/7 chatbot for farmer support.

Cloud-Based Auto Detection
Uses AWS Lambda to analyze environment data.

## Environment Setup
You'll need `Node.js` installed and MongoDB running locally (or remote URI).

1. Clone or download the repository.
2. Open terminal in the project root.

### Backend Setup
```bash
cd backend
npm install
```
Ensure MongoDB is running locally on port `27017` or update `backend/.env`.
Start the backend server:
```bash
npm run dev
# Server will run on http://localhost:5000
```

### Frontend Setup
Open a new terminal session.
```bash
cd frontend
npm install
```
Start the frontend development server:
```bash
npm run dev
# App will run on http://localhost:5173
```
