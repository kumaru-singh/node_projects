import express from "express";
import path from "path";
import fs from "fs";
import bodyparser from "body-parser";
import ejs from "ejs";
import bodyParser from "body-parser";


const app = express();
const PORT = 3000;

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended:false}));

const feedbacksFile = "feedbacks.json";

// Homepage - Feedback Form 

app.get("/", (req, res) => {
    res.render("index");
});

// Handle form submission

app.post("/submit", (req, res) =>{
    const { teacher, rating, suggestion } = req.body;
    const feedback = {
        teacher, rating, suggestion, date: new Date()
    }

    let data = [];
    if ( fs.existsSync(feedbacksFile)){
        data = JSON.parse(fs.readFileSync(feedbacksFile));
    }
    data.push(feedback);
    fs.writeFileSync(feedbacksFile, JSON.stringify(data, null, 2));

    res.redirect("/thankyou");
});


// Thank you page
app.get("/thankyou", (req, res) => {
    res.render("thankyou");
});


// Admin View ( no real auth here, just basic middleware)

app.get("/admin", ( req, res) =>{
    const data = fs.existsSync( feedbacksFile)
    ? JSON.parse(fs.readFileSync(feedbacksFile))
    : [];
    res.render("admin", { feedbacks : data});
});

app.listen ( PORT, ()=>{
    console.log(`Server is running on http://localhost:${PORT}`);
}
);
