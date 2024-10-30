"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const firebaseAdmin = __importStar(require("firebase-admin"));
const app = (0, express_1.default)();
const port = process.env.PORT || 3011;
// CROS [Allowing the spacific frontend to make requests to the server]
app.use((0, cors_1.default)({
    origin: 'https://digiproc-frontend-27iw.vercel.app',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
}));
try {
    // Retriving Firebase credentials from the environment variable
    const firebaseCredentials = JSON.parse(process.env.FIREBASE_CREDENTIALS || '{}');
    // Initializing Firebase Admin SDK with parsed credentials
    firebaseAdmin.initializeApp({
        credential: firebaseAdmin.credential.cert(firebaseCredentials),
        databaseURL: 'https://digiproc-firebasedb-default-rtdb.europe-west1.firebasedatabase.app',
    });
}
catch (error) {
    console.error("Failed to parse Firebase credentials:", error);
}
const db = firebaseAdmin.firestore();
// Retrieving token from Vercel environment variables for the GET product API
const requiredToken = process.env.API_TOKEN;
app.get('/products', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const token = req.headers['authorization'];
    // Check if Authorization header is present and matches the token from the Vercel veriables
    if (!token || token !== requiredToken) {
        return res.status(401).json({ error: ":( Unauthorized" });
    }
    try {
        const productsCollection = yield db.collection('digiproc_Products').get();
        const products = productsCollection.docs.map((doc) => ({
            id: doc.id,
            data: doc.data(),
        }));
        res.json(products);
    }
    catch (error) {
        console.error("Error fetching products:", error);
        res.status(500).json({ error: "Failed to fetch products" });
    }
}));
app.get('/', (req, res) => {
    res.send('Welcome to the DigiProc API');
});
//I'm using this for only local testing the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
