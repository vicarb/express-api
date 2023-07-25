import { Request, Response } from 'express';
import { DataModel } from '../models/dataModel';

export const getData = async (req: Request, res: Response) => {
  try {
    const fetchedData = await DataModel.find();
    res.json(fetchedData);
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const getDataById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const data = await DataModel.findById(id);

    if (!data) {
      return res.status(404).json({ message: 'Data not found' });
    }

    res.json(data);
  } catch (error) {
    console.error('Error fetching data by ID:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const createData = async (req: Request, res: Response) => {
  try {
    const newData = req.body;
    const createdData = await DataModel.create(newData);
    res.json(createdData);
  } catch (error) {
    console.error('Error creating data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const updateData = async (req: Request, res: Response) => {
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
};

export const deleteData = async (req: Request, res: Response) => {
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
};
