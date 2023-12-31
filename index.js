const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
const app = express();
const port = process.env.PORT || 5000;

// middleware 
app.use(cors());
app.use(express.json())



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.rwhgbgz.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();


    const serviceCollection = client.db('disneyDoll').collection('services');

    const dollAddedCollection = client.db('disneyDoll').collection('dollAdded');

    app.get('/services',async(req,res)=>{
        const cursor = serviceCollection.find().sort({price: 1}).limit(20);
        const result = await cursor.toArray();
        res.send(result);
    })

    app.get('/services/:id', async(req,res)=>{
        const id = req.params.id;
        const query = {_id: new ObjectId(id)}
        // const options = {
        //     projection : {sellerName: 1 , price:1, dollName:1, img:1, description:1, subCategoryName:1, quantityAvailable:1, }
        // }
        const result = await serviceCollection.findOne(query);
        res.send(result);
    })

    app.post('/dollAdded',async(req,res)=>{
      const addedDoll = req.body;
      if(!addedDoll){
        return res.status(404).send({message: "Body Data not found"})
      }
      const result = await dollAddedCollection.insertOne(addedDoll)
      console.log(result);
      res.send(result);
    })

    app.get('/dollAdded',async(req,res)=>{
          console.log(req.query?.email);
      let query = {};
      if(req.query?.email){
        query = {email: req.query.email}
      }
      const result = await dollAddedCollection.find(query).toArray();
      res.send(result);
    })
    
// for delete an unique information....

    app.delete('/dollAdded/:id',async(req,res)=>{
      const id = req.params.id;
      const query = {_id: new ObjectId(id)}
      const result = await dollAddedCollection.deleteOne(query);
      res.send(result);
    })

    app.put('/dollAdded/:id', async(req,res)=>{
      const id = req.params.id;
      const {price, quantity, description} =req.body;
      const filter = {_id: new ObjectId(id)};
      const updateDoll = {
        $set:{
      
       price:price,
       quantity:quantity,
       description: description,
        }
      }
const option = {upsert : true};
const result = await dollAddedCollection.updateOne(filter,updateDoll,option);
res.send(result);
    })

    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    // console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);





app.get('/', (req, res)=>{
    res.send('Princess is coming soon')
})

app.listen(port, () => {
    console.log(`Princess magic server is running on port ${port}`);
})