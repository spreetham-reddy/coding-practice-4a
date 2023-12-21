const express = require("express");
const app = express();
app.use(express.json());

const { open } = require("sqlite");
const sqlite3 = require("sqlite3");

const path = require("path");
const dbPath = path.join(__dirname, "cricketTeam.db");
let db = null;
const initializeDBandServer = async () => {
  try {
    db = await open({
      filename: "cricketTeam.db",
      driver: sqlite3.Database,
    });
    app.listen(3000);
  } catch (e) {
    console.log(`DB Error: ${e.message}`);
    process.exit(1);
  }
};
initializeDBandServer();

module.exports = app;

app.get("/players/", async (request, response) => {
  const getPlayersQuery = `SELECT * FROM cricket_team;`;
  const result = await db.all(getPlayersQuery);
  response.send(result);
});

app.post("/players/", async (request, response) => {
  const playerDetails = request.body;
  const { playerName, jerseyNumber, role } = playerDetails;
  const addPlayerQuery = `INSERT INTO 
    cricket_team (player_name,jersey_number,role)
   VALUES('${playerName}',${jerseyNumber},'${role}');`;
  const result = db.run(addPlayerQuery);
  response.send("Player Added to Team");
});

app.get("/players/:playerId", async (request, response) => {
  const { playerId } = request.params;
  const getPlayerDetailsQuery = `SELECT * FROM cricket_team WHERE player_id = ${playerId};`;
  const result = await db.get(getPlayerDetailsQuery);
  response.send(result);
});

app.put("/players/:playerId", async (request, response) => {
  const { playerId } = request.params;
  const playerDetails = request.body;
  const { playerName, jerseyNumber, role } = playerDetails;
  const updatePlayerDetailsQuery = `UPDATE cricket_team SET 
    player_name='${playerName}',
    jersey_number = ${jerseyNumber},
    role='${role}';`;
  await db.run(updatePlayerDetailsQuery);
  response.send("Player Details Updated");
});

app.delete("/players/:playerId/", async (request, response) => {
  const { playerId } = request.params;
  const deletePlayerQuery = `DELETE FROM cricket_team WHERE player_id = ${playerID};`;
  await db.run(deletePlayerQuery);
  response.send("Player Removed");
});
