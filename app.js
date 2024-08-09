const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();

app.use(express.static('public'));

// Middleware pour récupérer l'adresse IP de l'utilisateur
app.use((req, res, next) => {
    const userIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    const log = `IP: ${userIp}, Date: ${new Date().toISOString()}\n`;
    
    // Enregistrer l'IP dans un fichier (par exemple: logs/ips.txt)
    fs.appendFileSync(path.join(__dirname, 'logs', 'ips.txt'), log);

    console.log(log);
    next();
});

// Route pour afficher une page simple
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
