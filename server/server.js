const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 8000;

app.use(express.json());

// Serve static files from public folder
app.use(express.static(path.join(__dirname, '../public')));

// API endpoint to receive feedback
app.post('/feedback', (req, res) => {
  console.log('Feedback received:', req.body);
  res.status(200).send('Feedback received successfully.');
});

// Handle SPA routing (fallback to index.html)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
