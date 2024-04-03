import express from 'express';
import monngoose from 'mongoose';
import dotenv from 'dotenv';
import routes from './routes/routes.js'

const app = express();
dotenv.config();
app.use(express.json());

const PORT = process.env.PORT || 3006 

monngoose
    .connect(process.env.DB_CONNECT)
    .then(() => {
        console.log('Database is connected')
    })
    .catch(err => console.log(err));

app.get('/', (req, res) => {
    res.send('Welcome to Mongo DB server')
});

app.use('/api', routes);

app.listen(PORT, (req, res) => {
    console.log(`Server is running on ${PORT}`)
})

