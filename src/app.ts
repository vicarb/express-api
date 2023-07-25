import express, { Express, Request, Response } from 'express';
import mongoose from 'mongoose';
import swaggerUi from 'swagger-ui-express';
import * as swaggerDocument from './swagger.json';

class DataServer {
  private app: Express;
  private PORT: number;
  private MONGODB_URI: string;
  private DataModel: mongoose.Model<any>;

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

    const dataSchema = new mongoose.Schema({
      id: String,
      question: String,
      answer: String,
      category: String,
    });

    this.DataModel = mongoose.model('Data', dataSchema);
  }

  private initializeMiddleware() {
    this.app.use(express.json());
  }

  private initializeRoutes() {
    this.app.get('/api/data', this.getData);
    this.app.get('/api/data/:id', this.getDataById);
    this.app.post('/api/data', this.createData);
    this.app.put('/api/data/:id', this.updateData);
    this.app.delete('/api/data/:id', this.deleteData);
  }

  private initializeSwaggerDocs() {
    this.app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
  }

  private getData = async (req: Request, res: Response) => {
    try {
      const fetchedData = await this.DataModel.find();
      res.json(fetchedData);
    } catch (error) {
      console.error('Error fetching data:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };

  private getDataById = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const data = await this.DataModel.findById(id);

      if (!data) {
        return res.status(404).json({ message: 'Data not found' });
      }

      res.json(data);
    } catch (error) {
      console.error('Error fetching data by ID:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };

  private createData = async (req: Request, res: Response) => {
    try {
      const newData = req.body;
      const createdData = await this.DataModel.create(newData);
      res.json(createdData);
    } catch (error) {
      console.error('Error creating data:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };

  private updateData = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const updatedData = await this.DataModel.findByIdAndUpdate(id, req.body, {
        new: true,
      });

      if (!updatedData) {
        return res.status(404).json({ message: 'Data not found' });
      }

      res.json(updatedData);
    } catch (error) {
      console.error('Error updating data:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };

  private deleteData = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const deletedData = await this.DataModel.findByIdAndDelete(id);

      if (!deletedData) {
        return res.status(404).json({ message: 'Data not found' });
      }

      res.json(deletedData);
    } catch (error) {
      console.error('Error deleting data:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };

  public start() {
    this.app.listen(this.PORT, () => {
      console.log(`Server listening on port ${this.PORT}`);
    });
  }
}

// Usage:
const PORT = 8081;
const MONGODB_URI = 'mongodb+srv://myself:lolaso@cluster0.4eiodjx.mongodb.net/interviewprep';
const server = new DataServer(PORT, MONGODB_URI);
server.start();
