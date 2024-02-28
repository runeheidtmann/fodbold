require('dotenv').config();
const express = require('express');
const { createCanvas, loadImage, registerFont } = require('canvas');
const app = express();
const PORT = process.env.PORT || 8000;

// Uncomment and adjust the path to register the Roboto Condensed font if available locally
registerFont('RobotoCondensed-Regular.ttf', { family: 'Roboto Condensed' })

app.get('/generate', async (req, res) => {
    const { team1, team2, score } = req.query;

    const canvas = createCanvas(800, 600);
    const ctx = canvas.getContext('2d');

    // Background
    ctx.fillStyle = "#173F3F";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Top and bottom bars
    ctx.fillStyle = "#050821";
    ctx.fillRect(0, 0, canvas.width, 100);
    ctx.fillRect(0, canvas.height - 100, canvas.width, 100);

    // Utility to draw images and text
    const drawImage = async (src, x, y, width) => {
        const img = await loadImage(src);
        const height = img.height * (width / img.width);
        ctx.drawImage(img, x, y, width, height);
    };

    // Draw logos and text
    await drawImage(`logos/${team1}.png`, 100, 200, 200);
    ctx.fillStyle = "white";
    ctx.font = "20px sans-serif"; // Using sans-serif as a fallback
    ctx.textAlign = "center";
    ctx.fillText(team1, 200, 430);

    await drawImage(`logos/${team2}.png`, canvas.width - 300, 200, 200);
    ctx.fillText(team2, canvas.width - 200, 430);

    // Score
    ctx.font = "48px sans-serif"; // Using sans-serif as a fallback
    ctx.fillText(score, canvas.width / 2, (canvas.height / 2)+20);

    // Additional text
    ctx.font = "36px sans-serif"; // Using sans-serif as a fallback
    ctx.fillText("Det er bedst at se fodbold på stadion", canvas.width / 2, 60);

    // Footer text and logo
    const logoSrc = 'jfmplay.png';
    const logoHeight = 50; // Height of the logo
    await drawImage(logoSrc, canvas.width - 190, canvas.height - 75, 145); // Logo width is auto-calculated in drawImage
    ctx.fillText("...men det er også godt på", (canvas.width / 2)-50, canvas.height - 35);

    // Convert canvas to image
    const buffer = canvas.toBuffer('image/png');
    res.type('png');
    res.send(buffer);
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
