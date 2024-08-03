# Project Title

## Description

This project is a comprehensive solution for sales and account managers to record conversations with customers and use OpenAI to extract relevant data to be submitted to Salesforce CRM. The application includes features for transcribing audio conversations, analyzing the text using OpenAI, generating suggestions for sales managers, and integrating with Salesforce for data management.

## Features

- **Audio Transcription**: Transcribe audio conversations using Google Cloud Speech-to-Text.
- **Text Analysis**: Analyze transcribed text using OpenAI to extract relevant data.
- **Salesforce Integration**: Create and update Salesforce records (leads, contacts, accounts, opportunities, tasks) based on analyzed data.
- **Suggestions Generation**: Generate actionable suggestions for sales managers based on conversation analysis.
- **Note Creation**: Automatically create notes in Salesforce with suggestions from conversation analysis.

## Prerequisites

- [Node.js](https://nodejs.org/en/download/) (version 14 or higher)
- [npm](https://www.npmjs.com/get-npm) (version 6 or higher)
- A [Google Cloud](https://cloud.google.com/) account with Speech-to-Text API enabled
- An [OpenAI](https://www.openai.com/) account with API key
- A [Salesforce](https://www.salesforce.com/) account

## Installation

1. Clone the repository:

   ```sh
   git clone https://github.com/yourusername/your-repo-name.git
   cd your-repo-name
   
2. Install the dependencies:
   
      ```sh
      pnpm install

3. Create a .env file in the root directory and add the following environment variables:
    
     ```sh
      GOOGLE_APPLICATION_CREDENTIALS=path/to/your/google-cloud-service-account-file.json
      OPENAI_API_KEY=your-openai-api-key
      SALESFORCE_USERNAME=your-salesforce-username
      SALESFORCE_PASSWORD=your-salesforce-password
      SALESFORCE_TOKEN=your-salesforce-security-token
      SALESFORCE_LOGIN_URL=https://login.salesforce.com

4. Ensure the GOOGLE_APPLICATION_CREDENTIALS file is accessible and correctly configured.

## Usage

1. Start the server:

   ```sh
   pnpm start

2. Use a tool like Postman or cURL to interact with the API endpoints.

# API Endpoints

## Upload Conversation

- **URL**: `/conversations/upload`
- **Method**: `POST`
- **Description**: Upload an audio file and process the conversation.
- **Headers**: `Content-Type: multipart/form-data`
- **Body**:
    - `conversation` (file): The audio file to be processed.

## Create Lead

- **URL**: `/conversations/lead`
- **Method**: `POST`
- **Description**: Create a new lead in Salesforce.
- **Body**:
    - JSON object with lead data.

## Update Contact

- **URL**: `/conversations/contact/:id`
- **Method**: `PUT`
- **Description**: Update an existing contact in Salesforce.
- **Body**:
    - JSON object with updated contact data.

## Create Account

- **URL**: `/conversations/account`
- **Method**: `POST`
- **Description**: Create a new account in Salesforce.
- **Body**:
    - JSON object with account data.

## Update Account

- **URL**: `/conversations/account/:id`
- **Method**: `PUT`
- **Description**: Update an existing account in Salesforce.
- **Body**:
    - JSON object with updated account data.

## Create Opportunity

- **URL**: `/conversations/opportunity`
- **Method**: `POST`
- **Description**: Create a new opportunity in Salesforce.
- **Body**:
    - JSON object with opportunity data.

## Update Opportunity

- **URL**: `/conversations/opportunity/:id`
- **Method**: `PUT`
- **Description**: Update an existing opportunity in Salesforce.
- **Body**:
    - JSON object with updated opportunity data.

## Create Task

- **URL**: `/conversations/task`
- **Method**: `POST`
- **Description**: Create a new task in Salesforce.
- **Body**:
    - JSON object with task data.

## Update Task

- **URL**: `/conversations/task/:id`
- **Method**: `PUT`
- **Description**: Update an existing task in Salesforce.
- **Body**:
    - JSON object with updated task data.

## Query Salesforce

- **URL**: `/conversations/query`
- **Method**: `GET`
- **Description**: Query Salesforce data using SOQL.
- **Parameters**:
    - `q` (string): The SOQL query string.

# Testing

Ensure you have set up the environment variables in the `.env` file.

Run the tests:

    ```sh
    npm run test


# Contact

For questions or feedback, please reach out to:

- **Name**: Ziv Shoshany
- **Email**: ziv.sho@gmail.com
- **GitHub**: [ziv-sho](https://github.com/ziv-sho)


