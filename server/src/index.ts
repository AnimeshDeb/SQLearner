import express from 'express';
import cors from 'cors'; 
import problemRoutes from './endpoints/problems';
import sqlRun from './endpoints/sqlRun'

const app = express();
const PORT = 3000; 

app.use(cors()); 
app.use(express.json());

app.use('/api/problems', problemRoutes);
app.use('/sqlrun', sqlRun)
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});