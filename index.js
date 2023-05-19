const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
const disneyPrincess = require('./DisneyPrincess.json');
const frozen = require('./FrozenDoll.json');
const animation = require('./AnimationDoll.json')
const app = express();
const port = process.env.PORT || 5000;

// middleware 
app.use(cors());
app.use(express.json());


app.get('/disneyPrincess',(req,res)=>{
    res.send(disneyPrincess)
})

app.get('/animation', (req,res)=>{
    res.send(animation);
})

app.get('/frozen',(req,res)=>{
    res.send(frozen);
})
















app.get('/', (req, res)=>{
    res.send('Princess is coming soon')
})

app.listen(port, () => {
    console.log(`Princess magic server is running on port ${port}`);
})