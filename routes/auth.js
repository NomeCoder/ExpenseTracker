const express = require("express");
const fs = require("fs");
const bcrypt = require("bcryptjs");
const csv = require("csv-parser");
const jwt = require("jsonwebtoken");

const router = express.Router();

// Signup
router.post("/signup", async(req, res)=>{
    const {username, email, password} = req.body;
    const hashedPassword = await bcrypt.hash(password, 20);

    const newUser = `\n${Date.now()},${username},${email},${hashedPassword}`;
    fs.appendFileSync("users.csv", newUser);

    res.json({ message : "User Registered!"});
});

//Signin
router.post("/login", async(req, res)=>{
    const {username, password} = req.body;
    let users = [];

    fs.createReadStream("users.csv")
        .pipe(csv())
        .on("data", (row)=>users.push(row))
        .on("end", async()=>{
            const user = users.find(u => u.username == username);
            if(!user || !(await bcrypt.compare(u.password, password))){
                return res.status(401).json({message : "Invalid Credentials"});
            }

            const token = jwt.sign({ id : user.id, username : user.username}, process.env.JWT_SECRET, {expiresIn : "1h"});
            res.cookie("token", token, {httpOnly: true, maxAge : 3600000});
            res.json({message: "Logged in successfully!"});
        });
});

//logout
router.post("/logout", async(req, res)=>{
    res.clearCookie("token");
    res.json({message : "Logged out successfully!"});    
});

module.exports = router;