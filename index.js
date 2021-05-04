const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config()

const app = express();
app.use(bodyParser.json());
app.use(cors());
app.use(express.static('royal'));

const port = 4000;


const MongoClient = require('mongodb').MongoClient;
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.kpa70.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const foodCollection = client.db("Red_Onnion_Resturent").collection("food_list");

  app.post('/foods', (req, res) => {
    const foodItem = req.body;
    console.log(foodItem);
    foodCollection.insertOne(foodItem)
      .then(result => {
        res.send(result.insertedCount > 0)
      })
  })

  app.get('/orderPayment', (req, res) => {
    foodCollection.find({ email: req.query.email })
      .toArray((err, documents) => {
        res.send(documents);
      })

  })
})


app.get('/', (req, res) => {
  res.send('Red Onnion Resturent')
})

app.listen(process.env.PORT || port);