const express = require ('express');
const dotenv = require('dotenv');
const cookieParser = require("cookie-parser");


const app = express();
dotenv.config();



//Middleware
app.use(express.json());
app.use(cookieParser());

const authRoutes = require("./routes/auth.js");
const getRoutes = require("./routes/get");

// Use the routes
app.use("/auth", authRoutes);
// Use the get
app.use("/get", getRoutes);

app.listen(process.env.PORT, ()=> console.log("Server running on port", process.env.PORT));