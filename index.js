const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(bodyParser.json());
app.use(cors());

// Serve static files from the "public" folder
app.use(express.static('public'));

// Word Game API
app.get('/api/word_game', (req, res) => {
    const sentence = req.query.sentence;
    const words = sentence.split(' ');
    const longestWord = Math.max(...words.map(word => word.length));
    const shortestWord = words.reduce((shortest, current) => current.length < shortest.length ? current : shortest, words[0]);
    const sum = words.reduce((total, word) => total + word.length, 0);
    res.json({ longestWord, shortestWord, sum });
});

// Phone Bill API
let callPrice = 2.75;
let smsPrice = 0.65;

app.post('/api/phonebill/total', (req, res) => {
    const bill = req.body.bill.split(',');
    const total = bill.reduce((sum, item) => sum + (item === 'call' ? callPrice : smsPrice), 0);
    res.json({ total });
});

app.get('/api/phonebill/prices', (req, res) => {
    res.json({ call: callPrice, sms: smsPrice });
});

app.post('/api/phonebill/price', (req, res) => {
    const { type, price } = req.body;
    if (type === 'call') callPrice = parseFloat(price);
    else if (type === 'sms') smsPrice = parseFloat(price);
    res.json({ status: 'success', message: `The ${type} price was set to ${price}` });
});

// Enough Airtime API
app.post('/api/enough', (req, res) => {
    const { usage, available } = req.body;
    const bill = usage.split(',');
    const totalUsage = bill.reduce((sum, item) => sum + (item === 'call' ? callPrice : smsPrice), 0);
    const result = available - totalUsage;
    res.json({ result });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
