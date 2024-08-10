const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const app = express();

// URL de connexion à MongoDB
const mongoUrl = 'mongodb+srv://heshimajulienofficial:gZo66bAOKJBetFSQ@localisation.st4rgvh.mongodb.net/localisation?retryWrites=true&w=majority';

// Connexion à MongoDB avec Mongoose
mongoose.connect(mongoUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('Connected successfully to MongoDB'))
.catch(err => {
    console.error('Failed to connect to MongoDB', err);
    process.exit(1); // Arrêtez le serveur si la connexion échoue
});

// Définir un schéma pour les adresses IP
const ipSchema = new mongoose.Schema({
    ip: String,
    date: { type: Date, default: Date.now }
});

// Créer un modèle basé sur le schéma
const IpLog = mongoose.model('IpLog', ipSchema);

app.use(express.static('public'));

// Middleware pour enregistrer l'adresse IP de l'utilisateur
app.use(async (req, res, next) => {
    const userIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    console.log('User IP:', userIp); // Ajout d'une journalisation

    try {
        const log = new IpLog({ ip: userIp });
        const savedLog = await log.save(); // Enregistrer le document dans MongoDB
        console.log(`IP: ${userIp} logged successfully with ID: ${savedLog._id}`);
    } catch (err) {
        console.error('Failed to log IP address:', err);
    } finally {
        next();
    }
});

// Route pour afficher une page simple
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
