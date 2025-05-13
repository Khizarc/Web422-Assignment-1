require('dotenv').config();

const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: 'API Listening' });
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`✔️ Server listening on http://localhost:${PORT}`);
});
