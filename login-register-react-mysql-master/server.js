const express = require("express");
const env = require("dotenv").config();
const path = require("path");
const users = require("./routes/users");
const auth = require("./routes/auth");
const app = express();
const db = require("./models/index");
const cors = require('cors')
var corsOption ={
    origin:"*"
}
app.use(cors(corsOption))



if (!process.env.jwtPrivateKey) {
  console.error("FATAL ERROR: jwtPrivateKey is not defined");
  process.exit(1);
}

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/users", users);
app.use("/api/auth", auth);

db.sequelize.sync();

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, console.log(`Server started on port ${PORT}`));
module.exports = server;
