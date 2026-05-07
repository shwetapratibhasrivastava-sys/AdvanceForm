const express = require("express");

const cors = require("cors");

const app = express();

app.use(cors());

app.use(express.json());


// STORE USERS
let users = [];


// POST API
app.post("/register", (req, res) => {

  console.log(req.body);

  users.push(req.body);

  res.json({
    success: true,
    message: "User Added"
  });
});


// GET API
app.get("/users", (req, res) => {

  res.json(users);
});


// SERVER
app.listen(5000, () => {

  console.log("Server Started");
});