import express from 'express';
import { getData, getDataById, createData, updateData, deleteData } from '../controllers/dataController';

const router = express.Router();

router.get('/api/data', getData);
router.get('/api/data/:id', getDataById);
router.post('/api/data', createData);
router.put('/api/data/:id', updateData);
router.delete('/api/data/:id', deleteData);

export default router;
