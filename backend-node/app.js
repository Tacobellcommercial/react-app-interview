require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

app.use(cors({
    origin: "*"
}))

app.use(express.json());

mongoose.connect("mongodb+srv://tacobellcommercial:"+process.env.PASSWORD+"@cluster0.aqeylzv.mongodb.net/")

/* MODELS */

const userSchema = new mongoose.Schema({
    name: String,
    roundsWon: Number,
    totalPoints: Number
})

const User = mongoose.model("User", userSchema);

/* ROUTES */
app.get("/get-users", (req, res)=>{
    User.find({}).then((userArray)=>{
        res.json({userArray})
    })
})

app.post("/make-user", (req, res)=>{
    /* req.body = {name: "user", roundsWon: 0, totalPoints: 0} */
    User.find({name: req.body.name}).then(array=>{
        if (array.length === 0){
            const newUser = new User({
                name: req.body.name,
                roundsWon: 0,
                totalPoints: 0
            })

            newUser.save().then(userObject=>{
                if (newUser===userObject){
                    res.json({message: "Successful"})
                }
            })
        }else{
            res.json({message: "User already found"})
        }
    })
})

app.post("/update-user", (req, res)=>{
    console.log(req.body);
    User.find({name: req.body.name}).then((result)=>{
        console.log("username found");
        User.findOneAndUpdate({name: req.body.name}, {totalPoints: result[0].totalPoints + req.body.totalPointsToAdd}).then(err=>{
            res.json({message: "Success"});
        })
        User.findOneAndUpdate({name: req.body.name}, {roundsWon: result[0].roundsWon + 1}).then(success=>{
            console.log(success);
        })
    })
})

app.listen(3000, ()=>{
    console.log("Listening on port 3000");
})