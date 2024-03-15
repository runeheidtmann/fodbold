const express = require('express');
const { createCanvas, loadImage, registerFont } = require('canvas');
require('dotenv').config();
const teamNames = require('./teamNames');

const app = express();
const PORT = process.env.PORT || 8000;

// Set the image dimensions in one place
const imageWidth = 912;
const imageHeight = 512;

// Register Roboto Condensed font which is the font JFM uses on websites.
registerFont('RobotoCondensed-Regular.ttf', { family: 'Roboto Condensed' });


app.get('/generate/results', async (req, res) => {
    const { team1, team2, score, division } = req.query;

    const canvas = createCanvas(imageWidth, imageHeight);
    const ctx = canvas.getContext('2d');
    setupCanvas(ctx, canvas);

    let team1Path = `logos/${division}/${team1}.png`;
    let team2Path = `logos/${division}/${team2}.png`;

    await drawTeams(ctx, team1Path, team2Path, team1, team2, 100, canvas);

    //Draw score
    ctx.font = "40px 'Roboto Condensed'";
    ctx.fillText(score, canvas.width / 2, canvas.height / 2);

    drawHeaderText(ctx, canvas);
    await drawFooterText(ctx, canvas);
    sendImage(ctx, canvas, res);
});

app.get('/generate/info', async (req, res) => {
    const { team1, team2, stadion, date, time, division } = req.query;

    const canvas = createCanvas(imageWidth, imageHeight);
    const ctx = canvas.getContext('2d');
    setupCanvas(ctx, canvas);

    let team1Path = `logos/${division}/${team1}.png`;
    let team2Path = `logos/${division}/${team2}.png`;

    await drawTeams(ctx, team1Path, team2Path, team1, team2, 50, canvas);

    ctx.font = "24px 'Roboto Condensed'";
    const middleY = canvas.height / 2 - 25;
    ctx.fillText(stadion, canvas.width / 2, middleY);
    ctx.fillText(date, canvas.width / 2, middleY + 40);
    ctx.fillText(time, canvas.width / 2, middleY + 80);

    drawHeaderText(ctx, canvas, "Fodbold skal ses på stadion");
    await drawFooterText(ctx, canvas);
    sendImage(ctx, canvas, res);
});

function setupCanvas(ctx, canvas) {
    // Background
    ctx.fillStyle = "#173F3F";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Top and bottom bars
    ctx.fillStyle = "#050821";
    ctx.fillRect(0, 0, canvas.width, 100);
    ctx.fillRect(0, canvas.height - 100, canvas.width, 100);
}

async function drawTeams(ctx, team1Path, team2Path, team1, team2, logoMargin, canvas) {
    // Adjust logo positioning based on canvas size
    const logoSize = 200; // Or adjust based on canvas size if needed
    const centerY = canvas.height / 2 - logoSize / 2;
    await Promise.all([
        drawImage(ctx, team1Path, logoMargin, centerY, logoSize).then(team1Height => {
            ctx.fillStyle = "white";
            ctx.font = "20px 'Roboto Condensed'";
            ctx.textAlign = "center";
            ctx.fillText(teamNames(team1), logoMargin + logoSize / 2, centerY + team1Height + 30);
        }),
        drawImage(ctx, team2Path, canvas.width - logoMargin - logoSize, centerY, logoSize).then(team2Height => {
            ctx.fillText(teamNames(team2), canvas.width - (logoMargin + logoSize / 2), centerY + team2Height + 30);
        })
    ]);
}


async function drawImage(ctx, src, x, y, width) {
    try {
        const img = await loadImage(src);
        const height = img.height * (width / img.width); // Calculate height to maintain aspect ratio
        ctx.drawImage(img, x, y, width, height);
        return height;
    } 
    catch (error) {
        console.error("Failed to load image:", src, error);
        return 0;
    }
}

function drawHeaderText(ctx, canvas, text = "Fodbold skal ses på stadion") {
    ctx.fillStyle = "white";
    ctx.font = "36px 'Roboto Condensed'";
    ctx.textAlign = "center";
    ctx.fillText(text, canvas.width / 2, 60); // Center the header text based on canvas width
}


async function drawFooterText(ctx, canvas) {
    const footerText = "...men det er også godt på ";
    const logoSrc = 'jfmplay.png';
    ctx.fillStyle = "white";
    ctx.font = "36px 'Roboto Condensed'";
    ctx.fillText(footerText, canvas.width / 2 - 50, canvas.height - 35);
    await drawImage(ctx, logoSrc, canvas.width - 210, canvas.height - 75, 145); // Adjust logo position based on canvas size
}

function sendImage(ctx, canvas, res) {
    // Convert canvas to image and send response
    const buffer = canvas.toBuffer('image/png');
    res.type('png').send(buffer);
}

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
