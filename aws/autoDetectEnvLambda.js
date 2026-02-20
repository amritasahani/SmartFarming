const https = require('https');
const { SageMakerRuntimeClient, InvokeEndpointCommand } = require("@aws-sdk/client-sagemaker-runtime");
const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { PutCommand, DynamoDBDocumentClient } = require("@aws-sdk/lib-dynamodb");

// Initialize AWS Clients
const sagemakerClient = new SageMakerRuntimeClient({ region: process.env.AWS_REGION || "us-east-1" });
const dynamoClient = new DynamoDBClient({ region: process.env.AWS_REGION || "us-east-1" });
const docClient = DynamoDBDocumentClient.from(dynamoClient);

// Helper function to fetch data from OpenWeatherMap API
const getWeatherData = (lat, lon, apiKey) => {
    return new Promise((resolve, reject) => {
        const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;

        https.get(url, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                try {
                    const parsedData = JSON.parse(data);
                    if (res.statusCode !== 200) {
                        reject(new Error(parsedData.message || 'Error fetching weather data'));
                    } else {
                        resolve(parsedData);
                    }
                } catch (e) {
                    reject(e);
                }
            });
        }).on('error', reject);
    });
};

// Helper function to detect season based on month (India Context)
const detectSeason = () => {
    const month = new Date().getMonth() + 1; // 1 to 12
    if (month >= 6 && month <= 10) return "Kharif"; // June - Oct
    if (month >= 11 || month <= 3) return "Rabi";   // Nov - March
    return "Zaid";                                  // April - May
};

exports.handler = async (event) => {
    try {
        // Parse incoming request body
        const body = JSON.parse(event.body || "{}");
        const { lat, lon, userId } = body;

        if (!lat || !lon) {
            return {
                statusCode: 400,
                headers: { "Access-Control-Allow-Origin": "*" },
                body: JSON.stringify({ message: "Latitude and Longitude are required." })
            };
        }

        // 1. Fetch live weather data
        const weatherApiKey = process.env.OPENWEATHER_API_KEY;
        if (!weatherApiKey) throw new Error("OpenWeather API key not configured.");

        const weatherData = await getWeatherData(lat, lon, weatherApiKey);

        const temperature = weatherData.main.temp;
        const humidity = weatherData.main.humidity;
        // OpenWeatherMap provides rainfall volume for the last 1h/3h if available, otherwise default to a mock value or 0
        const rainfall = weatherData.rain ? (weatherData.rain['1h'] || weatherData.rain['3h'] || 0) : Math.floor(Math.random() * 150 + 50); // Mocking rainfall if not currently raining

        // 2. Detect Season
        const season = detectSeason();

        // 3. Predict Soil Type using AWS SageMaker
        let predictedSoilType = 'Loamy'; // Default fallback
        const sagemakerEndpoint = process.env.SAGEMAKER_ENDPOINT_NAME;

        if (sagemakerEndpoint) {
            try {
                // Format payload expected by your specific SageMaker model
                const payload = {
                    instances: [{ features: [lat, lon, temperature, humidity, rainfall] }]
                };

                const command = new InvokeEndpointCommand({
                    EndpointName: sagemakerEndpoint,
                    Body: Buffer.from(JSON.stringify(payload)),
                    ContentType: "application/json",
                    Accept: "application/json"
                });

                const sagemakerResponse = await sagemakerClient.send(command);
                const responseData = JSON.parse(Buffer.from(sagemakerResponse.Body).toString('utf-8'));

                // Extract prediction (adjust based on your model's actual output format)
                if (responseData && responseData.predictions && responseData.predictions.length > 0) {
                    predictedSoilType = responseData.predictions[0].predicted_label || 'Loamy';
                }
            } catch (mlError) {
                console.error("SageMaker prediction failed, using fallback:", mlError);
                // Continue with fallback soil type instead of failing the whole request
            }
        }

        const resultPayload = {
            temperature: parseFloat(temperature.toFixed(1)),
            rainfall: parseFloat(rainfall.toFixed(1)),
            humidity,
            season,
            soilType: predictedSoilType,
            location: weatherData.name
        };

        // 4. (Optional) Store data in DynamoDB
        if (userId && process.env.DYNAMODB_TABLE_NAME) {
            try {
                const command = new PutCommand({
                    TableName: process.env.DYNAMODB_TABLE_NAME,
                    Item: {
                        logId: Date.now().toString(),
                        userId,
                        timestamp: new Date().toISOString(),
                        ...resultPayload
                    }
                });
                await docClient.send(command);
            } catch (dbError) {
                console.error("DynamoDB logging failed:", dbError);
            }
        }

        // Return successful response
        return {
            statusCode: 200,
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Content-Type": "application/json"
            },
            body: JSON.stringify(resultPayload)
        };

    } catch (error) {
        console.error("Error in auto-detect lambda:", error);
        return {
            statusCode: 500,
            headers: { "Access-Control-Allow-Origin": "*" },
            body: JSON.stringify({ message: "Failed to auto-detect environment metrics.", error: error.message })
        };
    }
};
