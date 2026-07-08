
const db = require("./db");
console.log(db);
const express = require("express");
const cors = require("cors");


const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static("public"));

app.post("/movies", (req, res) => {

    const { title, genre, rating } = req.body;

    db.query(
        "INSERT INTO movies(title, genre, rating) VALUES (?, ?, ?)",
        [title, genre, rating],
        (err, result) => {
            if (err) return res.status(500).json(err);

            res.json({
                message: "Movie Added"
            });
        }
    );
});

app.get("/movies", (req, res) => {

    db.query(
        "SELECT * FROM movies",
        (err, result) => {

            if (err) {
                console.log("MYSQL ERROR:", err);
                return res.status(500).json(err);
            }

            res.json(result);
        }
    );

});

app.listen(5000, () => {
    console.log("Server Running");
});