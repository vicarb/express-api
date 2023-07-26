import mongoose from 'mongoose';

const dataSchema = new mongoose.Schema({
  id: String,
  question: String,
  answer: String,
  category: String,
  seniority: String
});

export const DataModel = mongoose.model('Data', dataSchema);
