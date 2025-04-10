import express from "express";
import path from "path";
import fs from "fs";
import bodyparser from "body-parser";
import ejs from "ejs";
import bodyParser from "body-parser";
import { fileURLToPath } from "url";


const app = express();
const PORT = 3000;

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended:false}));

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const feedbacksFile = path.join(__dirname, "feedbacks.json");
const __filename1 = fileURLToPath(import.meta.url);
const __dirname1 = path.dirname(__filename1);
const teachersFile = path.join(__dirname1, "teachers.json");


// Middleware to set up locals for success and error messages
app.use((req, res, next) => {
    res.locals.success = null;
    res.locals.error = null;
    next();
  });

//  Home page
  app.get("/", (req, res) => {
    const teachers = JSON.parse(fs.readFileSync(teachersFile));
    res.render("index", { success: null, error: null, teachers });
  });

// Handle form submission

app.post("/submit", (req, res) =>{
    const { teacher, rating, suggestion } = req.body;
    
    if (!teacher || !rating || !suggestion) {
        return res.render("index", {
          error: "All fields are required.",
          success: null,
          teachers,
        });
      }

    const feedback = {
        teacher, rating, suggestion, date: new Date()
    }
    let data = [];
    
    if ( fs.existsSync(feedbacksFile)){
        data = JSON.parse(fs.readFileSync(feedbacksFile));
    }
    data.push(feedback);
    fs.writeFileSync(feedbacksFile, JSON.stringify(data, null, 2));

    res.locals.success = "Feedback submitted successfully!";
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
