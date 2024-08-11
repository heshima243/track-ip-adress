const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const axios = require('axios'); // Ajoute axios pour faire des requêtes HTTP

// Modèle Mongoose pour Visitor
const visitorSchema = new mongoose.Schema({
  ip: String,
  continentCode: String,
  continentName: String,
  countryCode: String,
  countryName: String,
  countryNameNative: String,
  officialCountryName: String,
  regionCode: String,
  regionName: String,
  cityGeoNameId: Number,
  city: String,
  latitude: Number,
  longitude: Number,
  timestamp: { type: Date, default: Date.now }
});
const Visitor = mongoose.model('Visitor', visitorSchema);

const app = express();

// Connexion à MongoDB
mongoose.connect('mongodb+srv://heshimajulienofficial:gZo66bAOKJBetFSQ@localisation.st4rgvh.mongodb.net/localisation?retryWrites=true&w=majority')
  .then(() => console.log('Connecté à MongoDB'))
  .catch(err => console.error('Erreur de connexion à MongoDB:', err));

// Configurer CORS
const allowedOrigins = ['https://track-ip-adress.vercel.app']; 
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

    // Remplacez 'YOUR_ACCESS_KEY' par ta clé d'API obtenue
    const response = await axios.get(`https://apiip.net/api/check?ip=${ip}&accessKey=08b90849-de12-49b9-b743-5f65a5848f9e`);

    // Afficher la réponse complète de l'API
    console.log('Réponse API:', response.data);

    // Extraction des données avec des fallbacks pour éviter les erreurs
    const {
      ip: ipAddress,
      continentCode,
      continentName,
      countryCode,
      countryName,
      countryNameNative,
      officialCountryName,
      regionCode,
      regionName,
      city,
      latitude,
      longitude
    } = response.data;

    // Enregistre les informations dans MongoDB
    await Visitor.create({ 
      ip: ipAddress, 
      continentCode, 
      continentName, 
      countryCode, 
      countryName, 
      countryNameNative, 
      officialCountryName, 
      regionCode, 
      regionName, 
      cityGeoNameId: null, // apiip.net ne fournit pas l'ID GeoNames de la ville
      city, 
      latitude, 
      longitude 
    });

    // Envoie les informations au client
    res.json({ 
      ip: ipAddress, 
      continentCode, 
      continentName, 
      countryCode, 
      countryName, 
      countryNameNative, 
      officialCountryName, 
      regionCode, 
      regionName, 
      cityGeoNameId: null,
      city, 
      latitude, 
      longitude 
    });
  } catch (error) {
    console.error('Erreur lors de l\'enregistrement des informations:', error.response ? error.response.data : error.message);
    res.status(500).send('Erreur lors de l\'enregistrement des informations.');
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
