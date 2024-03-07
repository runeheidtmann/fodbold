# Soccer Match Image Generator

This Node.js application generates custom images for soccer matches, including post-match results and pre-match information. Using the Express framework and the `canvas` library, the app dynamically creates images featuring soccer club logos, scores for concluded matches, or details (such as date, time, and venue) for upcoming matches.

## Features

- **Post-Match Results**: Generate images with the final score of the match.
- **Pre-Match Information**: Create images with details about an upcoming match, including stadium, date, and time.

## Getting Started

### Prerequisites

- Node.js
- npm or yarn

### Installation

1. Clone the repository.
2. Navigate to the project directory
3. npm install
4. Add your environment variables:
Create a `.env` file in the root directory and set `PORT` to your preferred port number. Example:
PORT=8000
5. Start the server:
npm start
The server will start running, and you can access it at `http://localhost:<PORT>`.


## Usage

### Generating Post-Match Results

**Endpoint:** `/generate/results`

**Method:** GET

**Query Parameters:**

- `team1`: Identifier for the first team.
- `team2`: Identifier for the second team.
- `score`: The final score of the match.
- `division`: The division or league of the teams.

**Example Request:**
GET /generate/results?team1=middelfart&team2=efb&score=2-1&division=2

This request generates an image with the logos of Arsenal and Chelsea, displaying the score "2-1".

### Generating Pre-Match Information

**Endpoint:** `/generate/info`

**Method:** GET

**Query Parameters:**

- `team1`: Identifier for the first team.
- `team2`: Identifier for the second team.
- `stadion`: The venue of the match.
- `date`: The match date.
- `time`: The match time.
- `division`: The division or league of the teams.

**Example Request:**
GET /generate/info?team1=naesby&team2=avarta&stadion=Næsby%20Stadion&date=3. marts&time=15:00&division=3

