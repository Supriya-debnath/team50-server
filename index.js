const express = require('express')
const { MongoClient } = require('mongodb');
const ObjectId = require("mongodb").ObjectId;


const cors = require('cors');
require('dotenv').config()


const app = express()
const port = process.env.PORT || 5000

// middleware
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.crceb.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

console.log(uri);

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


async function run(){
  try{
    await client.connect();

    console.log('database connected successfully');

    
    const database = client.db('productsList');
    const productCollection = database.collection('products');
    const orderCollection = database.collection('orders');
    // const reviewCollection = database.collection('review');
    const usersCollection = database.collection('users');


    
    
     // POST API
     app.post('/products', async (req, res) => {
        const product = req.body;
        console.log('hitting the post api', product);
  
        const result = await productCollection.insertOne(product);
        console.log(result);
        res.json(result);
    });
  
  
      // GET PRODUCTS API
      app.get('/products', async (req, res) => {
        const cursor = productCollection.find({});
        const products = await cursor.toArray();
        res.send(products);
    });

    app.get('/products/:id' , async(req, res) =>{
        const id = req.params.id;
        const query = {_id:ObjectId(id)}
        const result = await productCollection.findOne(query);
        res.send(result);
    })


        // My order
        app.get("/myOrders", async(req, res) => {
          const email = req.query.email;
          const query = {email:email}
          const cursor = orderCollection.find(query);
          const result = await cursor.toArray();
          res.send(result); 
        })

  
    app.post('/users', async(req, res) =>{
        const user = req.body;
        const query = await usersCollection.insertOne(user);
        console.log(query);
        res.send(query);
    })

    app.get('/users', async (req, res) => {
        const cursor = usersCollection.find({});
        const products = await cursor.toArray();
        res.send(products);
    });

    // My order
        app.get("/users/:email", async (req, res) => {
          const query = bookingCollection.find({email:req.params.email})
          const result = await query.toArray();
          res.send(result);
        })

    
  
  



  }
  finally{
    // await client.close();
  }

}
run().catch(console.dir);


app.get('/', (req, res) => {
  res.send('Hello Team 50 Server Site!')
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})