const express = require("express");
const cors = require("cors");
const { holdingsData, capitalGainsData } = require("./data");

const app = express();
const PORT = 5000;

app.use(cors());

app.get("/api/holdings", (req, res) => {
  res.json(holdingsData);
});

app.get("/api/capital-gains", (req, res) => {
  res.json(capitalGainsData);
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});