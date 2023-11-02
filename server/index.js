import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import dotenv from 'dotenv';

const app = express();

dotenv.config();

app.use(bodyParser.json({ extended: true }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

const username = process.env.DB_USERNAME;
const password = process.env.DB_PASSWORD;


mongoose.connect(
  `mongodb+srv://${username}:${password}@cluster0.uxvtrqj.mongodb.net/?retryWrites=true&w=majority`,
  {
    useUnifiedTopology: true,
    useNewUrlParser: true,
  }
);

console.log("Database connected successfully");

// schema

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
});

// model

const User = new mongoose.model("User", userSchema);

// Routes
app.post("/login", async(req, res) => {
    const {email, password } = req.body;

    try {
        const existingUser = await User.findOne({ email: email });

        if(existingUser){
            if(password === existingUser.password){
                res.send({message: "Login successfull", user: existingUser})
            }else{
                res.send({message: "password didn't match"});
            }
        }else{
            res.send({message: "user not registered"});
        }
    } catch (err) {
        res.status(500).send({ message: "login failed" });
        // res.send(err);
    }
});

app.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email: email });

    if (existingUser) {
      res.send({ message: "user already registered" });
    } else {
      // user creation in database
      const user = new User({
        name,
        email,
        password,
      });

      await user.save();
      res.send({ message: "successfully registered, please login now" });
    }
  } catch (err) {
    res.status(500).send({ message: "registration failed" });
  }
});

app.listen(8000, () => console.log("server started"));
