const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, 'client/build')));

app.get('/api/plans', (req, res) => {
  fs.readFile(path.join(__dirname, 'plans.json'), 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal Server Error' });
      return;
    }
    res.json(JSON.parse(data));
  });
});


app.post('/api/activate', (req, res) => {
  const { planId, startTime, endTime } = req.body;
  
  const activationDetails = { planId, startTime, endTime };
  res.json({ message: 'Plan activated successfully', details: activationDetails });
});

if (process.env.NODE_ENV === 'production') {
  app.use(express.static('client/build'));
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
