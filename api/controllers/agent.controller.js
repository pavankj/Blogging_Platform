import dotenv from 'dotenv';
import { openai } from '../utils/openAi.js';
import {getJson} from 'serpapi'
dotenv.config();


async function getActivities() {
    try {
        const response = await new Promise((resolve, reject) => {
            getJson({
              engine: "google_events",
              q: "Things to do in Chicago",
              hl: "en",
              gl: "us",
              htichips:"date:today",
              api_key: process.env.SERP_API_KEY,
            }, (data, error) => {
              if (error) {
                reject(error);
              } else {
                resolve(data);
              }
            });
          });

        const eventsResults = response["events_results"];
        const activitiesData = eventsResults.map((event) => ({
            title:event.title,
            date: event.date,
            address: event.address,
            description: event.description,
        }))

        console.log("activities data is here",activitiesData);

        return activitiesData;
    } catch (error) {
        console.log("Failed to fetch activities",error);
    }
    
}



export const askAIAgent = async (req, res) => {
    try {
      // Extract the 'query' parameter from the URL query string
      const userQuery = req.query.query;
  
      // Check if 'query' parameter is provided
      if (!userQuery) {
        return res.status(400).json({ message: "Query parameter 'query' is required." });
      }
  
      // Use the extracted 'query' parameter in the agent function
      const response = await agent(userQuery);
      res.status(200).json(response);
  
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  


async function getLocation() {
    const response = await fetch("https://ipapi.co/json/");
    const locationData = await response.json();
    return locationData;
}

async function getCurrentWeather(latitude, longitude) {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&hourly=apparent_temperature`;
    const response = await fetch(url);
    const weatherData = await response.json();
    return weatherData;
}





const tools = [
    {
      type: "function",
      function: {
        name: "getCurrentWeather",
        description: "Get the current weather in a given location",
        parameters: {
          type: "object",
          properties: {
            latitude: { type: "string" },
            longitude: { type: "string" },
          },
          required: ["latitude", "longitude"],
        },
      },
    },
    {
      type: "function",
      function: {
        name: "getLocation",
        description: "Get the user's location based on their IP address",
        parameters: {
          type: "object",
          properties: {},
        },
      },
    },
    {
      type: "function",
      function: {
        name: "getActivities",
        description: "Get the current activities to do in a given location",
        parameters: {
          type: "object", // Corrected to 'object' from 'array'
          properties: {},
        },
      },
    },
];


const messages = [
    {
      role: "system",
      content:
        "You are a helpful assistant. Only use the functions you have been provided with.",
    },
];
  

const agent = async (userInput) => {

    messages.push({
      role: "user",
      content: userInput,
    });

    console.log('after pushing',messages)

    for (let i = 0; i < 7; i++) {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo-16k",
      messages: messages,
      tools: tools,
    });
    console.log(response);
    const { finish_reason, message } = response.choices[0];
 
if (finish_reason === "tool_calls" && message.tool_calls) {
  const functionName = message.tool_calls[0].function.name;
  const functionToCall = availableTools[functionName];
  const functionArgs = JSON.parse(message.tool_calls[0].function.arguments);
  const functionArgsArr = Object.values(functionArgs);
  const functionResponse = await functionToCall.apply(null, functionArgsArr);
  console.log(functionResponse);


  messages.push({
    role: "function",
    name: functionName,
    content: `The result of the last function was this: ${JSON.stringify(
      functionResponse
    )}
    `,
  });



}  else if (finish_reason === "stop") {
    messages.push(message);
    return message.content;
  }

}
return "The maximum number of iterations has been met without a suitable answer. Please try again with a more specific input.";

}

const availableTools = {
    getCurrentWeather,
    getLocation,
    getActivities
  };
  





