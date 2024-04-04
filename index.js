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
    res.send('<h1>Welcome to the database</h1>')
});

app.get('/home', (req, res) => {
    res.send('<h1>Where shall we go?</h1>')
});

app.use('/api', routes);
app.use('/home', routes);




app.listen(PORT, (req, res) => {
    console.log(`Server is running on ${PORT}`)
})

