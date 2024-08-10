// server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors'); // Assure-toi d'importer le package cors

// Modèle Mongoose pour Visitor
const visitorSchema = new mongoose.Schema({
  ip: String,
  timestamp: { type: Date, default: Date.now }
});
const Visitor = mongoose.model('Visitor', visitorSchema);

const app = express();

// Connexion à MongoDB
mongoose.connect('mongodb+srv://heshimajulienofficial:gZo66bAOKJBetFSQ@localisation.st4rgvh.mongodb.net/localisation?retryWrites=true&w=majority')
  .then(() => console.log('Connecté à MongoDB'))
  .catch(err => console.error('Erreur de connexion à MongoDB:', err));

// Configurer CORS
const allowedOrigins = ['https://track-ip-adress.vercel.app']; // Liste des domaines autorisés
app.use(cors({
  origin: function(origin, callback){
    if(!origin || allowedOrigins.indexOf(origin) !== -1){
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  }
}));

app.use(express.json());

app.get('/', async (req, res) => {
  try {
    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

    // Enregistre l'adresse IP dans MongoDB
    await Visitor.create({ ip });

    // Envoie l'adresse IP au client
    res.json({ ip });
  } catch (error) {
    console.error('Erreur lors de l\'enregistrement de l\'adresse IP:', error);
    res.status(500).send('Erreur lors de l\'enregistrement de l\'adresse IP.');
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
