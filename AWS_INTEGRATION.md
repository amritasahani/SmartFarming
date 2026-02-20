# AWS Integration Guide for Smart Farming Auto Detect Feature

This guide explains how to set up the AWS infrastructure required for the "Auto Detect Environment" feature. This feature uses the browser's Geolocation API to get coordinates, calls an AWS API Gateway endpoint, which triggers an AWS Lambda function. The Lambda function fetches weather data, determines the season, and optionally queries a SageMaker ML model for soil prediction.

## Architecture Architecture

1.  **Frontend (React)**: Gets user latitude/longitude via Geolocation API. Sends a POST request to API Gateway.
2.  **API Gateway**: Acts as the secure entry point. Routes the request to AWS Lambda.
3.  **AWS Lambda (Node.js)**: The backend logic handler.
    *   Calls **OpenWeatherMap API** to get live temperature, rainfall (or humidity/precipitation data).
    *   Calculates the current **Season** based on the month.
    *   Invokes an **AWS SageMaker** endpoint to predict the `soilType` based on location/weather features.
    *   (Optional) Logs data to **DynamoDB** for analytics.
4.  **AWS S3**: Used to store training datasets and model artifacts for SageMaker.
5.  **AWS SageMaker**: Hosts the machine learning model that predicts soil type.

---

## Step 1: Set up DynamoDB (Optional for Data Storage)
1. Go to AWS Console -> DynamoDB -> Create Table.
2. Table name: `SmartFarmingEnvLogs`
3. Partition key: `userId` (String) or `logId` (String).
4. Sort key (optional): `timestamp` (Number).

---

## Step 2: Set up AWS SageMaker (Soil Prediction Model)
1. Upload your soil dataset (e.g., CSV with lat, lon, temp, rainfall -> soil_type) to an **S3 Bucket**.
2. Open SageMaker Studio or Notebook Instances.
3. Train a classification model (e.g., XGBoost or Random Forest) predicting `soilType` (`Sandy`, `Clay`, `Loamy`, `Black`, `Red`).
4. **Deploy the model** to an endpoint. Note the **Endpoint Name** (e.g., `smart-farming-soil-predictor`).

---

## Step 3: Create the AWS Lambda Function
1. Go to AWS Console -> Lambda -> Create Function.
2. Name: `SmartFarmingAutoDetect`
3. Runtime: `Node.js 18.x` or later.
4. **Permissions**: Ensure the Lambda execution role has permissions to:
    *   `sagemaker:InvokeEndpoint`
    *   `dynamodb:PutItem` (if storing logs)
5. Copy the code provided in `aws/autoDetectEnvLambda.js` into your function.
6. **Environment Variables** (Configuration -> Environment variables):
    *   `OPENWEATHER_API_KEY`: Your OpenWeatherMap API key.
    *   `SAGEMAKER_ENDPOINT_NAME`: The name of your deployed SageMaker endpoint.

---

## Step 4: Set up API Gateway
1. Go to AWS Console -> API Gateway -> Create API (HTTP API or REST API).
2. Create a `/detect` route with the `POST` method.
3. Integrate this route with your `SmartFarmingAutoDetect` Lambda function.
4. **CORS Configuration**: Enable CORS for your React app's domain (e.g., `http://localhost:5173` for local dev).
5. **Deploy API** and copy the **Invoke URL**. Ensure to store this securely in your frontend `.env` as `VITE_AWS_API_GATEWAY_URL`.

---

## Step 5: Security & API Keys
*   **Never expose the OpenWeather API key in the frontend.** The Lambda function handles the external API call securely.
*   Secure your API Gateway using IAM authorization, API Keys, or Amazon Cognito if user authentication is required at the gateway level.
*   For development, we've set up CORS to only allow requests from your frontend origins.

---

## Step 6: Deployment Steps Summary
1. Train and deploy SageMaker endpoint.
2. Create DynamoDB table (optional).
3. Create Lambda function, set IAM permissions, and add Environment Variables.
4. Create API Gateway, link to Lambda, configure CORS, and deploy.
5. Update React frontend `.env` with the API Gateway URL.
