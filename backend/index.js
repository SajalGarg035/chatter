import express from 'express';
import cors from 'cors';
const app = express()
import auth from './routes/auth.route.js';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
dotenv.config()

import connectdb from './lib/db.js';

app.use(express.json());
app.use(cors());

app.use('/api/auth', auth); 

const PORT = process.env.PORT || 3000
app.get('/', (req, res) => {
    res.send('Hello World!')
    }
)

connectdb().then(() => {
    console.log('connected to db')
    }
)

app.listen(PORT, () => {
    console.log('Server is running on http://localhost:' + PORT)
    }
)