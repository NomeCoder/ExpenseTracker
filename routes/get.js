const express = require("express");
const fs = require("fs");
const csv = require("csv-parser");

const router = express.Router();

router.post("/expenses", (req, res)=>{
    const{amount, category} = req.body;
    const newExpense = `\n${Date.now()},${req.user.id},${amount},${category},${new Date().toISOString().split('T')[0]}`;

    fs.appendFileSync("expenses.csv", newExpense);

    res.json({ message: "Expense added!" });
});

router.get("/expenses", (req, res) => {
    const { filter } = req.query;
    let expenses = [];

    fs.createReadStream("expenses.csv")
        .pipe(csv())
        .on("data", (row) => expenses.push(row))
        .on("end", () => {
            const userExpenses = expenses.filter(e => e.userId == req.user.id);
            let filteredExpenses = [];

            const today = new Date();
            const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

            if (filter === "month") {
                filteredExpenses = userExpenses.filter(e => new Date(e.date) >= startOfMonth);
            } else if (filter === "today") {
                filteredExpenses = userExpenses.filter(e => new Date(e.date).toDateString() === today.toDateString());
            } else if (filter === "7days") {
                filteredExpenses = userExpenses.filter(e => new Date(e.date) >= new Date(today.setDate(today.getDate() - 7)));
            } else if (filter === "30days") {
                filteredExpenses = userExpenses.filter(e => new Date(e.date) >= new Date(today.setDate(today.getDate() - 30)));
            } else if (filter === "90days") {
                filteredExpenses = userExpenses.filter(e => new Date(e.date) >= new Date(today.setDate(today.getDate() - 90)));
            } else if (filter === "365days") {
                filteredExpenses = userExpenses.filter(e => new Date(e.date) >= new Date(today.setDate(today.getDate() - 365)));
            } else if (filter == "all"){
                filteredExpenses = userExpenses; // Return all expenses
            } else if (filter == "custom"){
                filterExpense = userExpenses.filter(e => new Date(e.date));
            }

            res.json(filteredExpenses);
        });
});

module.exports = router;