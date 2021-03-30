const express = require('express')
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express()
const port = 5000;
require('dotenv').config();
const MongoClient = require('mongodb').MongoClient;

app.use(bodyParser.json());
app.use(cors());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.iyt5e.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

client.connect(err => {
  const productsCollection = client.db("emaJohnStone").collection("products");
  const orderCollection = client.db("emaJohnStone").collection("orders");
  
  app.post('/addProduct',(req, res) => {
    const products = req.body;
        productsCollection.insertOne(products)
        .then(result => {
            console.log(result.insertedCount);
            res.send(result.insertedCount)
  })
});

  app.get('/products',(req, res) => {
    productsCollection.find({})
    .toArray((err, documents) => {
      res.send(documents)
    })
  })

  app.get('/product/:key',(req, res) => {
    productsCollection.find({key: req.params.key})
    .toArray((err, documents) => {
      res.send(documents[0])
    })
  })

  app.post('/productsByKeys',(req, res) => {
    const productKeys = req.body;
    productsCollection.find({key: { $in : productKeys }})
    .toArray((err,documents)=>{
      res.send(documents);
    })
  })

  app.post('/addOrder',(req, res) => {
    const order = req.body;
        orderCollection.insertOne(order)
        .then(result => {
            console.log(result.insertedCount);
            res.send(result.insertedCount)
  })
});
})
app.listen(port)