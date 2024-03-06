const express = require('express');
const { createCanvas, loadImage, registerFont } = require('canvas');
require('dotenv').config();
const teamNames = require('./teamNames');

const app = express();
const PORT = process.env.PORT || 8000;

// Register the Roboto Condensed font
registerFont('RobotoCondensed-Regular.ttf', { family: 'Roboto Condensed' });

// Endpoint for generating postmatch results with a score
app.get('/generate/results', async (req, res) => {
    const { team1, team2, score, division } = req.query;

    const canvas = createCanvas(800, 600);
    const ctx = canvas.getContext('2d');
    setupCanvas(ctx);

    let team1Path = `logos/${division}/${team1}.png`;
    let team2Path = `logos/${division}/${team2}.png`;

    await drawTeams(ctx, team1Path, team2Path, team1, team2, 100);

    //Draw score
    ctx.font = "40px 'Roboto Condensed'";
    ctx.fillText(score, canvas.width / 2, canvas.height / 2);

    // Draw Header and Footer
    drawHeaderText(ctx);
    await drawFooterText(ctx, canvas);
    sendImage(ctx, canvas, res);
});

// Endpoint for generating prematch information including date, time, and venue
app.get('/generate/info', async (req, res) => {
    const { team1, team2, stadion, date, time, division } = req.query;

    const canvas = createCanvas(800, 600);
    const ctx = canvas.getContext('2d');
    setupCanvas(ctx);

    let team1Path = `logos/${division}/${team1}.png`;
    let team2Path = `logos/${division}/${team2}.png`;

    await drawTeams(ctx, team1Path, team2Path, team1, team2, 50);

    ctx.font = "24px 'Roboto Condensed'";
    const middleY = canvas.height / 2 - 25;
    ctx.fillText(stadion, canvas.width / 2, middleY);
    ctx.fillText(date, canvas.width / 2, middleY + 40);
    ctx.fillText(time, canvas.width / 2, middleY + 80);

    // Header and Footer Text for Game Info
    drawHeaderText(ctx, "Fodbold skal ses på stadion");
    await drawFooterText(ctx, canvas);
    sendImage(ctx, canvas, res);
});

function setupCanvas(ctx) {
    // Background
    ctx.fillStyle = "#173F3F";
    ctx.fillRect(0, 0, 800, 600);

    // Top and bottom bars
    ctx.fillStyle = "#050821";
    ctx.fillRect(0, 0, 800, 100);
    ctx.fillRect(0, 500, 800, 100);
}

async function drawTeams(ctx, team1Path, team2Path, team1, team2, logoMargin) {
    // Draw logos and text for team1 and team2
    // team1 = the winner of the match. If draw team1 = home_team
    await Promise.all([
        drawImage(ctx, team1Path, logoMargin, 200, 200).then(team1Height => {
            ctx.fillStyle = "white";
            ctx.font = "20px 'Roboto Condensed'";
            ctx.textAlign = "center";
            ctx.fillText(teamNames(team1), logoMargin + 100, 200 + team1Height + 30);
        }),
        drawImage(ctx, team2Path, 800 - logoMargin - 200, 200, 200).then(team2Height => {
            ctx.fillText(teamNames(team2), 800 - (logoMargin + 100), 200 + team2Height + 30);
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

function drawHeaderText(ctx) {
    const text = "Fodbold skal ses på stadion"
    ctx.fillStyle = "white";
    ctx.font = "36px 'Roboto Condensed'";
    ctx.textAlign = "center";
    ctx.fillText(text, 400, 60); // Center the header text
}

async function drawFooterText(ctx, canvas) {
    const footerText = "...men det er også godt på ";
    const logoSrc = 'jfmplay.png';
    ctx.fillStyle = "white";
    ctx.font = "36px 'Roboto Condensed'";
    ctx.fillText(footerText, canvas.width / 2 - 50, canvas.height - 35);
    // Wait for the logo to be drawn before continuing
    await drawImage(ctx, logoSrc, canvas.width - 210, canvas.height - 75, 145); // Logo on the bottom right
}

function sendImage(ctx, canvas, res) {
    // Convert canvas to image and send response
    const buffer = canvas.toBuffer('image/png');
    res.type('png').send(buffer);
}

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
