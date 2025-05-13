require('dotenv').config();

const express = require('express');
const cors = require('cors');
const ListingsDB = require('./modules/listingsDB.js');
const db = new ListingsDB();

const app = express();

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
    const { page, perPage, name } = req.query;
    try {
      const listings = await db.getAllListings(page, perPage, name);
      res.json(listings);
    } catch (err) {
      const isBadParams = err.message.includes('page and perPage');
      res.status(isBadParams ? 400 : 500).json({ error: err.message });
    }
  });
  
  app.get('/api/listings/:id', async (req, res) => {
    try {
      const listing = await db.getListingById(req.params.id);
      if (!listing) {
        return res.status(404).json({ error: 'Listing not found' });
      }
      res.json(listing);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
  
  app.put('/api/listings/:id', async (req, res) => {
    try {
      const result = await db.updateListingById(req.body, req.params.id);
      if (result.matchedCount === 0) {
        return res.status(404).json({ error: 'Listing not found' });
      }
      res.status(204).send();
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
  
  app.delete('/api/listings/:id', async (req, res) => {
    try {
      const result = await db.deleteListingById(req.params.id);
      if (result.deletedCount === 0) {
        return res.status(404).json({ error: 'Listing not found' });
      }
      res.status(204).send();
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
  
  const PORT = process.env.PORT || 8080;
  const connString = process.env.MONGODB_CONN_STRING;
 

  db.initialize(connString)
    .then(() => {
      app.listen(PORT, () => {
        console.log(`server listening on: ${PORT}`);
      });
    })
    .catch(err => {
      console.error(err);
    });