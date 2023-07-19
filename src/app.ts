import express, { Express, Request, Response } from 'express';
import mongoose from 'mongoose';
import swaggerUi from 'swagger-ui-express';
import * as swaggerDocument from './swagger.json';

const app: Express = express();
const PORT: number = 3000;

// Replace 'YOUR_MONGODB_URI' with your actual MongoDB connection string
const MONGODB_URI = 'mongodb+srv://myself:lolaso@cluster0.4eiodjx.mongodb.net/interviewprep';

// Connect to MongoDB
mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
  });

// Middleware to parse JSON data from the request body
app.use(express.json());

// Define a schema for your data
const dataSchema = new mongoose.Schema({
  id: String,
  question: String,
  answer: String,
  category: String,
});

// Define a model based on the schema
const DataModel = mongoose.model('Data', dataSchema);

// Fetch data from MongoDB
app.get('/api/data', async (req: Request, res: Response) => {
  try {
    const fetchedData = await DataModel.find();
    res.json(fetchedData);
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Create a new data entry in MongoDB (POST request)
app.post('/api/data', async (req: Request, res: Response) => {
  try {
    const newData = req.body;
    const createdData = await DataModel.create(newData);
    res.json(createdData);
  } catch (error) {
    console.error('Error creating data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
app.put('/api/data/:id', async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const updatedData = await DataModel.findByIdAndUpdate(id, req.body, {
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
  });

app.delete('/api/data/:id', async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const deletedData = await DataModel.findByIdAndDelete(id);
  
      if (!deletedData) {
        return res.status(404).json({ message: 'Data not found' });
      }
  
      res.json(deletedData);
    } catch (error) {
      console.error('Error deleting data:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
