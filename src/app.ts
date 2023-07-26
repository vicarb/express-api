import express from 'express';
import mongoose from 'mongoose';
import swaggerUi from 'swagger-ui-express';
import * as swaggerDocument from './swagger.json';
import dataRoutes from './routes/dataRoutes';
import cors from 'cors'; 

class DataServer {
  private app: express.Express;
  private PORT: number;
  private MONGODB_URI: string;

  constructor(port: number, mongoURI: string) {
    this.PORT = port;
    this.MONGODB_URI = mongoURI;
    this.app = express();

    this.connectToMongoDB();
    this.initializeMiddleware();
    this.initializeRoutes();
    this.initializeSwaggerDocs();
  }

  private connectToMongoDB() {
    mongoose
      .connect(this.MONGODB_URI)
      .then(() => {
        console.log('Connected to MongoDB');
      })
      .catch((error) => {
        console.error('Error connecting to MongoDB:', error);
      });
  }

  private initializeMiddleware() {
    this.app.use(express.json());
    this.app.use(cors());
  }

  private initializeRoutes() {
    this.app.use(dataRoutes);
  }

  private initializeSwaggerDocs() {
    this.app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
  }

  public start() {
    this.app.listen(this.PORT, () => {
      console.log(`Server listening on port ${this.PORT}`);
    });
  }
}

// Usage:
const PORT = 8082;
const MONGODB_URI = 'mongodb+srv://user:pw@cluster0.4eiodjx.mongodb.net/interviewprep';
const server = new DataServer(PORT, MONGODB_URI);
server.start();
