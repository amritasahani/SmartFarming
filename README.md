# Smart Agriculture Advisory Platform

A complete MERN stack web application for smart agriculture, serving as an advisory dashboard for farmers. Features include crop recommendations, weather forecasting, market prices tracking, and an AI chat assistant.

## Tech Stack
- **Database:** MongoDB
- **Backend:** Node.js, Express.js (REST API)
- **Frontend:** React.js, Vite, Context API
- **Styling:** Custom CSS (Modern, Glassmorphism design)
- **Authentication:** JWT (JSON Web Tokens)

## Project Structure
- `/backend`: Express.js server, MongoDB Models, Controllers, and Routes.
- `/frontend`: React application created with Vite.

## Features
1. **User Authentication:** Secure signup and login for farmers.
2. **Dashboard:** Daily snapshot of local weather and top market prices.
3. **Crop Recommendation:** Predicts best crops based on soil nutrients (N, P, K), pH, and weather.
4. **Weather Forecast:** Fetches current and upcoming weather for any location.
5. **Market Prices:** Live updates on commodity pricing and trends.
6. **AI Assistant:** 24/7 conversational bot for farming inquiries.

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
