# API Documentation

Base URL: `http://localhost:5000/api`

## Authentication (`/api/auth`)

### Register User
- **Method:** `POST`
- **Endpoint:** `/register`
- **Body:** `{ "name", "email", "password", "farmSize" (optional), "location" (optional) }`
- **Returns:** User Object & JWT Token

### Login User
- **Method:** `POST`
- **Endpoint:** `/login`
- **Body:** `{ "email", "password" }`
- **Returns:** User Object & JWT Token

### Profile
- **Method:** `GET`
- **Endpoint:** `/profile`
- **Headers:** `Authorization: Bearer <token>`
- **Returns:** User details

---

## Crop Recommendation (`/api/crop`)

### Get Recommendation
- **Method:** `POST`
- **Endpoint:** `/recommend`
- **Headers:** `Authorization: Bearer <token>`
- **Body:** `{ "nitrogen", "phosphorus", "potassium", "temperature", "humidity", "ph", "rainfall" }`
- **Returns:** The recommended crop name and saves to user history.

### View History
- **Method:** `GET`
- **Endpoint:** `/history`
- **Headers:** `Authorization: Bearer <token>`
- **Returns:** List of past crop recommendations

---

## Weather Forecast (`/api/weather`)

### Get Forecast
- **Method:** `GET`
- **Endpoint:** `/:city`
- **Headers:** `Authorization: Bearer <token>`
- **Returns:** Mocked weather data including current temp, conditions, and 4-day forecast for the given city.

---

## Market Prices (`/api/market`)

### Get Prices
- **Method:** `GET`
- **Endpoint:** `/`
- **Headers:** `Authorization: Bearer <token>`
- **Returns:** Live list of commodity prices, trends, and percentage changes.

---

## AI Assistant (`/api/ai`)

### Chat
- **Method:** `POST`
- **Endpoint:** `/chat`
- **Headers:** `Authorization: Bearer <token>`
- **Body:** `{ "message" }`
- **Returns:** AI reply string
