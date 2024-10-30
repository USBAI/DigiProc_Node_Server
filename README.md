
# DigiProc Node.js Server

This project is a backend server for the DigiProc application, developed in TypeScript using Node.js and Express.js. It provides an API for the DigiProc frontend to retrieve product data stored in Firebase Firestore and enforces secure access controls.

## Project Structure

Here's the structure of the project:

```plaintext
DigiProc_Node_Server/
├── dist/                   # Compiled JavaScript files (output of TypeScript)
├── node_modules/           # Node.js dependencies
├── src/                    # Source files
│   ├── index.ts            # Main server file with API routes and Firebase setup
├── package.json            # Project metadata and dependencies
├── tsconfig.json           # TypeScript configuration
└── README.md               # Project documentation (this file)
```

## How the GET Product Data API Works

The server provides a `GET` endpoint at `/products` to fetch product data stored in Firebase. Here's a breakdown of how it functions:

1. **Firebase Initialization**: The server uses Firebase Admin SDK, initialized with credentials stored in environment variables. This setup allows secure access to the Firestore database where product data is stored.

2. **CORS Policy**: The server allows requests only from the DigiProc frontend URL (`https://digiproc-frontend-27iw.vercel.app`) to ensure that only the specified frontend can communicate with the backend. 

3. **Authorization**: The `/products` endpoint requires a valid `Authorization` header. This token is matched against an environment variable (`API_TOKEN`) to verify that the request is authorized. If the token is missing or incorrect, the server responds with a 401 Unauthorized status.

4. **Fetching Products**: Once authorized, the server retrieves product data from a Firestore collection named `digiproc_Products`. Each product entry contains information such as `imageUrl`, `price`, `color_code`, `ratings`, and other styling data used by the frontend.

5. **Response**: The server returns the retrieved product data in JSON format. If there's an error during the data retrieval process, it returns a 500 Internal Server Error status with a descriptive message.

This setup ensures that product data is fetched securely and only accessible by authorized requests from the DigiProc frontend.
