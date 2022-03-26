const mongoose = require("mongoose");
const authRoutes = require("./routes/authRoutes");

const express = require("express");
const cookieParser = require("cookie-parser");
const {
  requireAuth,
  checkUser
} = require("./middleware/authMiddleware");
const Task = require("./models/Task");

const port = process.env.PORT || 3000;

const app = express();

//middleware
app.use(express.static("public"));
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({
  extended: true
}));

//set view engine:
app.set("view engine", "ejs");

const dbURI = "mongodb+srv://daniel:jKD4KrEz2MDNpvoC@cluster0.qcvll.mongodb.net/lms?retryWrites=true&w=majority";
mongoose
  .connect(dbURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
  })
  .then((result) => app.listen(process.env.PORT || 3000, function () {
    console.log("SERVER STARTED PORT: 3000");
  }))
  .catch((err) => console.log(err));

app.get("*", checkUser);
app.get("/", (req, res) => res.render("home", {
  title: "Code Dojo"
}));
app.get("/courses", requireAuth, (req, res) =>
  res.render("courses", {
    title: "Courses"
  })
);
app.get("/usertasks", (req, res) => {
  Task.find()
    .sort({
      createdAt: -1
    })
    .then((result) => {
      res.render("usertasks", {
        title: "Tasks",
        tasks: result
      });
    })
    .catch((err) => {
      console.log(err);
    });
});

app.use(authRoutes);