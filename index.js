
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const cors = require('cors')
require('dotenv').config()

app.use(bodyParser.json())
app.use(cors())
const MongoClient = require('mongodb').MongoClient;
console.log(process.env.DB_USER);
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.u1ngc.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

const port = 5000





const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const products = client.db("emaJohnStore").collection("products");
  const order = client.db("emaJohnStore").collection("order");

  app.post('/addProduct',(req,res) => {
      const product = req.body
    products.insertMany(product)
    .then(result => {
      console.log(result.insertedCount);
        res.send(result.insertedCount)
    })
  })
  

  app.get('/products', (req,res) => {
    products.find({})
    .toArray( (err, documents) => {
      res.send(documents)
    })
  })

  app.get('/product/:key', (req,res) => {
    products.find({key: req.params.key})
    .toArray( (err, documents) => {
      res.send(documents[0])
    })
  })

  app.post('/productsByKeys', (req,res) => {
    const productKey = req.body;
    products.find({key: { $in: productKey}})
    .toArray((err, documents) => {
      res.send(documents)
    })
  })

  app.post('/addOrder',(req,res) => {
    const orders = req.body
    order.insertOne(orders)
    .then(result => {
      res.send(result.insertedCount > 0)
  })
})
  // app.post('/addOrder',(req,res) => {
  //   const orders = req.body
  // order.insertMany(product)
  // .then(result => {
  //   console.log(result.insertedCount);
  //     res.send(result.insertedCount)
  // })
});


app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port)