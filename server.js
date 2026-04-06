const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(express.static("public"));

mongoose.connect("mongodb://127.0.0.1:27017/simple_auth")
.then(() => console.log("MongoDB Connected"))
.catch(err => console.log(err));

const UserSchema = new mongoose.Schema({
    name: String,
    mobile: String,
    email: { type: String, unique: true },
    dob: String,
    password: String
});

const User = mongoose.model("User", UserSchema);

app.post("/signup", async (req, res) => {
    const { name, mobile, email, dob, password } = req.body;

    // ✅ Gmail validation inside
    if (!email.endsWith("@gmail.com")) {
        return res.json({ message: "Only @gmail.com allowed" });
    }

    // ✅ Age validation
    function isAdult(dob) {
        const today = new Date();
        const birthDate = new Date(dob);

        let age = today.getFullYear() - birthDate.getFullYear();
        const m = today.getMonth() - birthDate.getMonth();

        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }

        return age >= 18;
    }

    if (!isAdult(dob)) {
        return res.json({ message: "Must be 18+ to register" });
    }

    const hash = await bcrypt.hash(password, 10);

    const user = new User({
        name,
        mobile,
        email,
        dob,
        password: hash
    });

    try {
        await user.save();
        res.json({ message: "Signup successful" });
    } catch (err) {
        res.json({ message: "Email already exists" });
    }
});
app.post("/login", async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
        return res.json({ message: "User not found" });
    }

    const match = await bcrypt.compare(password, user.password);

    if (match) {
        res.json({
            message: "Login success",
            name: user.name   // ✅ VERY IMPORTANT
        });
    } else {
        res.json({ message: "Wrong password" });
    }
});


function isAdult(dob) {
    const today = new Date();
    const birthDate = new Date(dob);

    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();

    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }

    return age >= 18;
}

app.listen(3000);