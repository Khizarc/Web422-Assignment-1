const express = require('express');
const app = express();
const dotenv= require('dotenv').config();

const cors = require('cors');
//const serverless = require('serverless-http');
const ListingsDB = require('./modules/listingsDB.js');
const HTTP_PORT = process.env.PORT || 3000;


const db = new ListingsDB();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: 'API Listening' });
});

app.post('/api/listings', async (req, res) => {
  try {
    const newListing = await db.addNewListing(req.body);
    res.status(201).json(newListing);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/listings', async (req, res) => {
  const { page=1, perPage=5, name } = req.query;
  try {
    const listings = await db.getAllListings(page, perPage, name);
    console.log(listings);
    res.json(listings);
  } catch (err) {
    const isBadParams = err.message.includes('page and perPage');
    res.status(isBadParams ? 400 : 500).json({ error: err.message });
  }
});

app.get('/api/listings/:id', async (req, res) => {
  try {
    const listing = await db.getListingById(req.params.id);
    if (!listing) return res.status(404).json({ error: 'Listing not found' });
    res.json(listing);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/listings/:id', async (req, res) => {
  try {
    const result = await db.updateListingById(req.body, req.params.id);
    if (result.matchedCount === 0) return res.status(404).json({ error: 'Listing not found' });
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/listings/:id', async (req, res) => {
  try {
    const result = await db.deleteListingById(req.params.id);
    if (result.deletedCount === 0) return res.status(404).json({ error: 'Listing not found' });
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

console.log(process.env.MONGODB_CONN_STRING);
db.initialize(process.env.MONGODB_CONN_STRING).then(()=>{
  app.listen(HTTP_PORT, ()=>{
  console.log(`server listening on: ${HTTP_PORT}`);
  });
  }).catch((err)=>{
  console.log(err);
  });

// const ready = db.initialize(process.env.MONGODB_CONN_STRING);
// const handler = serverless(app);
// 
// module.exports = async (req, res) => {
  // await ready;
  // return handler(req, res);
// };
// 





