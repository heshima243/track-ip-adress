const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const app = express();

// URL de connexion à MongoDB
const mongoUrl = 'mongodb+srv://heshimajulienofficial:gZo66bAOKJBetFSQ@localisation.st4rgvh.mongodb.net/localisation?retryWrites=true&w=majority';

// Connexion à MongoDB avec Mongoose
console.log('Attempting to connect to MongoDB...');
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

// Serve static files from the 'public' directory
app.use(express.static('public'));

// Middleware pour enregistrer l'adresse IP de l'utilisateur
app.use(async (req, res, next) => {
    console.log('Received a request, processing middleware...');
    
    const userIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    console.log('User IP identified:', userIp);

    try {
        const log = new IpLog({ ip: userIp });
        console.log('Attempting to save IP to MongoDB...');
        const savedLog = await log.save(); // Enregistrer le document dans MongoDB
        console.log(`IP: ${userIp} logged successfully with ID: ${savedLog._id}`);
    } catch (err) {
        console.error('Failed to log IP address:', err);
    } finally {
        console.log('Middleware process completed, moving to the next middleware or route.');
        next();
    }
});

// Route pour afficher une page simple
app.get('/', (req, res) => {
    console.log('Serving the root route /');
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Route de test pour enregistrer une adresse IP fixe
app.get('/test-ip', async (req, res) => {
    console.log('Accessed /test-ip route');
    try {
        const testIp = '127.0.0.1'; // Utilisez une IP fixe pour le test
        console.log('Attempting to save test IP to MongoDB...');
        const log = new IpLog({ ip: testIp });
        const savedLog = await log.save();
        console.log(`Test IP logged successfully with ID: ${savedLog._id}`);
        res.send(`Test IP logged successfully with ID: ${savedLog._id}`);
    } catch (err) {
        console.error('Failed to log test IP address:', err);
        res.status(500).send('Failed to log test IP address');
    }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
