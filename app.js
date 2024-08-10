// server.js
const express = require('express');
const mongoose = require('mongoose');

// Modèle Mongoose pour Visitor
const visitorSchema = new mongoose.Schema({
  ip: String,
  timestamp: { type: Date, default: Date.now }
});
const Visitor = mongoose.model('Visitor', visitorSchema);

const app = express();

// Connexion à MongoDB
mongoose.connect('mongodb+srv://heshimajulienofficial:gZo66bAOKJBetFSQ@localisation.st4rgvh.mongodb.net/localisation?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

app.use(express.json());

app.get('/', async (req, res) => {
  try {
    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    
    // Enregistre l'adresse IP dans MongoDB
    const visitor = await Visitor.create({ ip });
    
    // Log d'enregistrement
    console.log(`Adresse IP enregistrée: ${visitor.ip} à ${visitor.timestamp}`);
    
    res.send('Adresse IP enregistrée.');
  } catch (error) {
    console.error('Erreur lors de l\'enregistrement de l\'adresse IP:', error);
    res.status(500).send('Erreur lors de l\'enregistrement de l\'adresse IP.');
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
