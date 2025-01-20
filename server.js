const express = require('express');
const path = require('path');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();
const PORT = 3000;

// MongoDB connection URI
const MONGO_URI = 'mongodb+srv://kanishkasingh1920:password1920@cluster0.rneag.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0'; // Replace with your MongoDB URI

// Connect to MongoDB using Mongoose
mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Error connecting to MongoDB:', err));

// Define a schema for the `answers` subdocument
const answerSchema = new mongoose.Schema({
  answer: { type: String, required: true },
  emoticon: { type: String, required: true },
});

// Define the main schema for user responses
const responseSchema = new mongoose.Schema({
  email: { type: String, required: true },
  answers: { type: [answerSchema], required: true },
}, { timestamps: true });

// Create a Mongoose model
const Response = mongoose.model('Response', responseSchema);

// Middleware
app.use(express.json());
app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));

// Endpoint to save responses
app.post('/saveResponses', async (req, res) => {
  const userResponses = req.body;

  try {
    // Save the responses to the database
    const newResponse = new Response(userResponses);
    const savedResponse = await newResponse.save();
    res.status(200).json({ message: 'Responses saved successfully!', data: savedResponse });
  } catch (err) {
    console.error('Error saving responses to MongoDB:', err);
    res.status(500).json({ message: 'Error saving responses', error: err.message });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
