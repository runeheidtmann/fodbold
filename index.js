const express = require('express');
const { createCanvas, loadImage, registerFont } = require('canvas');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 8000;

// Register the Roboto Condensed font
registerFont('RobotoCondensed-Regular.ttf', { family: 'Roboto Condensed' });

app.get('/generate', async (req, res) => {
    const { team1, team2, score, date, stadion, time } = req.query;

    const canvas = createCanvas(800, 600);
    const ctx = canvas.getContext('2d');

    //determin margin of logos and teamnames
    let logoMargin = 100
    if (date && stadion) {
       logoMargin = 50
    } 

    // Background
    ctx.fillStyle = "#173F3F";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Top and bottom bars
    ctx.fillStyle = "#050821";
    ctx.fillRect(0, 0, canvas.width, 100);
    ctx.fillRect(0, canvas.height - 100, canvas.width, 100);

    // Draw logos and text for team1 and team2
    await Promise.all([
        drawImage(`logos/${team1}.png`, logoMargin, 200, 200).then(team1Height => {
            ctx.fillStyle = "white";
            ctx.font = "20px 'Roboto Condensed'";
            ctx.textAlign = "center";
            ctx.fillText(team1, logoMargin + 100, 200 + team1Height + 30);
        }),
        drawImage(`logos/${team2}.png`, canvas.width - logoMargin - 200, 200, 200).then(team2Height => {
            ctx.fillText(team2, canvas.width - (logoMargin + 100), 200 + team2Height + 30);
        })
    ]);

    // Conditional display of score or stadium and date in two lines
    ctx.font = "40px 'Roboto Condensed'";
    ctx.textAlign = "center";
    if (score) {
        ctx.fillText(score, canvas.width / 2, canvas.height / 2);
    } else if (date && stadion) {
        // Adjusting font size for better fit if necessary
        ctx.font = "24px 'Roboto Condensed'"; // Smaller font size for fitting two lines
        const middleY = canvas.height / 2;
        ctx.fillText(stadion, canvas.width / 2, middleY); // Draw stadion on one line
        ctx.fillText(date, canvas.width / 2, middleY + 50); // Draw date below stadion
        ctx.fillText(time, canvas.width / 2, (middleY + 50) + 50); // Draw date below stadion
    }

    // Additional text
    ctx.font = "36px 'Roboto Condensed'";
    ctx.fillText("Det er bedst at se fodbold på stadion", canvas.width / 2, 60);

    // Footer text and logo
    const logoSrc = 'jfmplay.png';
    await drawImage(logoSrc, canvas.width - 190, canvas.height - 75, 145);
    ctx.fillText("...men det er også godt på", (canvas.width / 2) - 50, canvas.height - 35);

    // Utility function to draw images and text, with error handling
    async function drawImage(src, x, y, width) {
        try {
            const img = await loadImage(src);
            const height = img.height * (width / img.width); // Calculate height to maintain aspect ratio
            ctx.drawImage(img, x, y, width, height);
            return height; // Return the calculated height for further use if needed
        } catch (error) {
            console.error("Failed to load image:", src, error);
            return 0; // Return 0 height if the image fails to load
        }
    }

    // Convert canvas to image and send response
    const buffer = canvas.toBuffer('image/png');
    res.type('png').send(buffer);
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
