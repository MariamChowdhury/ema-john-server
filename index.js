const express = require('express')
const app = express()
const port = 3000
require('dotenv').config()
const bodyParser=require('body-parser')
const cors=require('cors')
const MongoClient = require('mongodb').MongoClient;


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.scyee.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


app.use(cors())
app.use(express.json())




client.connect(err => {
  const products = client.db("emaJohnStore").collection("products");
  const ordersCollection = client.db("emaJohnStore").collection("orders");


 app.post('/addProduct',(req,res) => {
   const product=req.body
   products.insertMany(product) 
   .then( result => {
     console.log(result.insertedCount)
     res.send(result.insertedCount)
   })
 })
 app.get('/products',(req,res) => {
   products.find({})
   .toArray((err,documents) => {
     res.send(documents)
   })
 })
 app.get('/product/:key',(req,res) => {
  products.find({key : req.params.key})
  .toArray((err,documents) => {
    res.send(documents[0])
  })
})
app.post('/productByKeys',(req,res) => {
  const productKeys=req.body
  products.find({$in : productKeys})
  .toArray((err,documents) => {
    res.send(documents)
  })
})
app.post('/addOrder',(req,res) => {
  const order=req.body
  ordersCollection.insertOne(order) 
  .then( result => {
    res.send(result.insertedCount >0)
  })
})
});




app.listen(port)