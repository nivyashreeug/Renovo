const express = require("express");
const cors = require("cors");

const rootRoutes = require("./routes/root");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/", rootRoutes);

module.exports = app;
