// // server.js
// const express = require('express');
// const mongoose = require('mongoose');
// const cors = require('cors'); // Assure-toi d'importer le package cors

// // Modèle Mongoose pour Visitor
// const visitorSchema = new mongoose.Schema({
//   ip: String,
//   timestamp: { type: Date, default: Date.now }
// });
// const Visitor = mongoose.model('Visitor', visitorSchema);

// const app = express();

// // Connexion à MongoDB
// mongoose.connect('mongodb+srv://heshimajulienofficial:gZo66bAOKJBetFSQ@localisation.st4rgvh.mongodb.net/localisation?retryWrites=true&w=majority')
//   .then(() => console.log('Connecté à MongoDB'))
//   .catch(err => console.error('Erreur de connexion à MongoDB:', err));

// // Configurer CORS
// const allowedOrigins = ['https://track-ip-adress.vercel.app']; // Liste des domaines autorisés
// app.use(cors({
//   origin: function(origin, callback){
//     if(!origin || allowedOrigins.indexOf(origin) !== -1){
//       callback(null, true);
//     } else {
//       callback(new Error('Not allowed by CORS'));
//     }
//   }
// }));

// app.use(express.json());

// const axios = require('axios');

// app.get('/', async (req, res) => {
//   try {
//     const ip = req.headers['x-forwarded-for']?.split(',')[0] || req.connection.remoteAddress;

//     // Utilisez une API de géolocalisation plus précise
//     const response = await axios.get(`https://ipapi.co/${ip}/json/`);

//     const locationData = response.data;

//     // Enregistre l'adresse IP et les informations de localisation dans MongoDB
//     await Visitor.create({
//       ip: ip,
//       timestamp: Date.now(),
//       city: locationData.city,
//       region: locationData.region,
//       country: locationData.country_name,
//       loc: locationData.latitude + ',' + locationData.longitude
//     });

//     // Envoie les informations de localisation au client
//     res.json({ ip, location: locationData });
//   } catch (error) {
//     console.error('Erreur lors de l\'enregistrement de l\'adresse IP:', error);
//     res.status(500).send('Erreur lors de l\'enregistrement de l\'adresse IP.');
//   }
// });


// // app.get('/', async (req, res) => {
// //   try {
// //     const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

// //     // Enregistre l'adresse IP dans MongoDB
// //     await Visitor.create({ ip });

// //     // Envoie l'adresse IP au client
// //     res.json({ ip });
// //   } catch (error) {
// //     console.error('Erreur lors de l\'enregistrement de l\'adresse IP:', error);
// //     res.status(500).send('Erreur lors de l\'enregistrement de l\'adresse IP.');
// //   }
// // });

// const PORT = process.env.PORT || 3000;
// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config(); // Load environment variables

// Mongoose Model for Visitor
const visitorSchema = new mongoose.Schema({
  ip: String,
  timestamp: { type: Date, default: Date.now },
  city: String,
  region: String,
  country: String,
  loc: String,
});

const Visitor = mongoose.model('Visitor', visitorSchema);

const app = express();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Configure CORS
const allowedOrigins = ['https://i-like.vercel.app']; // List of allowed domains
app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'), false);
    }
  },
}));

app.use(express.json());

app.get('/', async (req, res) => {
  try {
    const ip = req.headers['x-forwarded-for']?.split(',')[0] || req.ip;

    // Simulate the exact geolocation data to be returned
    const locationData = {
      ip: ip,
      type: "ipv4",
      continent_code: "AF",
      continent_name: "Africa",
      country_code: "CD",
      country_name: "Congo - Kinshasa",
      region_code: "HK",
      region_name: "Haut-Katanga",
      city: "Lubumbashi",
      zip: null,
      latitude: -11.671939849853516,
      longitude: 27.48332977294922,
      msa: null,
      dma: null,
      radius: null,
      ip_routing_type: null,
      connection_type: null,
      location: {
        geoname_id: 922704,
        capital: "Kinshasa",
        languages: [
          { code: "fr", name: "French", native: "Français" },
          { code: "ln", name: "Lingala", native: "Lingála" },
          { code: "kg", name: "Kongo", native: "KiKongo" },
          { code: "sw", name: "Swahili", native: "Kiswahili" },
          { code: "lu", name: "Luba-Katanga", native: "Tshiluba" }
        ],
        country_flag: "https://assets.ipstack.com/flags/cd.svg",
        country_flag_emoji: "🇨🇩",
        country_flag_emoji_unicode: "U+1F1E8 U+1F1E9",
        calling_code: "243",
        is_eu: false
      }
    };

    // Save the IP address and location information to MongoDB
    await Visitor.create({
      ip,
      city: locationData.city,
      region: locationData.region_name,
      country: locationData.country_name,
      loc: `${locationData.latitude},${locationData.longitude}`,
    });

    // Send the location information to the client
    res.json(locationData);
  } catch (error) {
    console.error('Error saving IP address:', error);
    res.status(500).send('Error saving IP address.');
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

