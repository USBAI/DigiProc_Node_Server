import express, { Request, Response } from 'express';
import cors from 'cors';
import * as firebaseAdmin from 'firebase-admin';

const app = express();
const port = process.env.PORT || 3011;

// CROS [Allowing the spacific frontend to make requests to the server]
app.use(cors({
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
} catch (error) {
  console.error("Failed to parse Firebase credentials:", error);
}

const db = firebaseAdmin.firestore();

//Getting the products cards from the firbase DigiProc Database
interface ProductData {
  imageUrl: string;
  divStyling: {
    cardClass: string;
    AddCart_Id: string;
  };
  price: number;
  color_code: string;
  ratings: number;
  name: string;
}

interface Product {
  id: string;
  data: ProductData;
}

// Retrieving token from Vercel environment variables for the GET product API
const requiredToken = process.env.API_TOKEN;

app.get('/products', async (req: Request, res: Response) => {
  const token = req.headers['authorization'];

  // Check if Authorization header is present and matches the token from the Vercel veriables
  if (!token || token !== requiredToken) {
    return res.status(401).json({ error: ":( Unauthorized" });
  }

  try {
    const productsCollection = await db.collection('digiproc_Products').get();
    const products: Product[] = productsCollection.docs.map((doc) => ({
      id: doc.id,
      data: doc.data() as ProductData,
    }));

    res.json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ error: "Failed to fetch products" });
  }
});

app.get('/', (req: Request, res: Response) => {
  res.send('Welcome to the DigiProc API');
});


//I'm using this for only local testing the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
