Blogging Platform with React and Elasticsearch:

Introduction:

This project is a Blogging Platform built using React on the client-side and Elasticsearch as a document datastore backend. It allows users to create accounts, publish blog posts, subscribe to topics, search posts, and receive notifications for new postings. Additionally, it integrates with OpenAI for generating replies and recommending activities based on various parameters.

Getting Started:

Before running the project, ensure you have the necessary environment variables stored in the .env file. These variables include:

Elasticsearch API Key: Obtain by signing up for an Elasticsearch account and creating a deployment named "blog".
Serp API Key: Sign up for a Serp API account to access search functionality.
App Password: Create an App Password for receiving notifications through Gmail.
OpenAI API Key: Sign up for an OpenAI API account to access AI-assisted features.

Project Structure:

api: Contains server-side files, including routes and controllers.
client: Contains client-side files, including React components.
.env: Stores environment variables.
README.md: Project documentation.

Important Files:

routes: Defines server-side routes for different features.
controllers: Implements business logic for various functionalities.
models: Defines data models for Elasticsearch documents.
utils: Contains utility functions for interacting with Elasticsearch and OpenAI.
components: Contains React components for different UI elements.

Running the Project:

Navigate to the project folder and install dependencies:
npm install

Start the server:
npm run dev

Open another terminal, navigate to the client folder, and install client-side dependencies:
cd client
npm install

Start the client:
npm start

User Interface:

The Sign Up page allows users to create accounts with their full name, email address, and password.
Once signed in, users can access features such as subscribing to topics, searching posts, and generating replies using OpenAI.
Users can manage their subscriptions and settings from their account dashboard.

Project Requirements:

Subscription Feature: Users can subscribe and unsubscribe from topics to receive notifications.
Reply Generation: Users can generate replies to posts using OpenAI, with an option to toggle AI-generated replies.
Elasticsearch Integration: Posts are stored in Elasticsearch as a document datastore backend.
Search Functionality: Users can search for posts using Elasticsearch.
Activity Recommendations: Users can ask the OpenAI-assisted Agent to recommend activities based on weather, events, and location.