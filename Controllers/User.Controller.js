const userModel = require("../Models/user.model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
require("dotenv").config();
let secret = process.env.SECRET;
const nodemailer = require("nodemailer");

const cloudinary = require("cloudinary");

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

const welcomeUser = (req, res) => {
  res.send("Welcome to the user page!");
  console.log("Welcome to the user page");
};

const about = (req, res) => {
  res.send("Welcome to the about page!");
  console.log("Welcome to the about page  ");
};

const register = (req, res) => {
  res.send("Welcome to the register page!");
  console.log("Welcome to the about page ");
};

const login = (req, res) => {
  res.send("Welcome to the login page!");
};

const registerUser = async (req, res) => {
  let saltRound = 10;
  const { firstName, lastName, email, password } = req.body;
  const plainTextPassword = password;
  const hashedPassword = bcrypt.hashSync(plainTextPassword, saltRound);
  console.log(req.body);
  let user = new userModel({
    firstName,
    lastName,
    email,
    password: hashedPassword,
  });
  user
    .save()
    .then((result) => {
      console.log(result);
      console.log("User signed up successfully");
      res.status(201).json({ Message: "Registration successful" });
      sendMail(email)
    })
    .catch((err) => {
      console.log(err);
      res
        .status(500)
        .json({ Message: "Registration failed or error occurred" });
    });
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  let user;
  try {
    user = await userModel.findOne({ email: email });
    console.log("User:", user);
  } catch (error) {
    console.log("Error:", error);
    console.log("User not found");
    res.status(400).json({ Message: "User not found" });
    return res.status(500).json({ Message: "Internal Server Error`" });
  }

  if (!user) {
    console.log("user not found");
    res.status(200).json({
      Message: "user not found, please sign up!!!",
    });
  }

  // else {
  //     res.status(200).json({
  //         Message: "success, user found"
  //     });
  // }

  const correctPassword = bcrypt.compareSync(password, user.password);
  console.log("Entered password:", password);
  console.log("Stored hashed password:", user.password);
  console.log("Correct password:", correctPassword);

  if (!correctPassword) {
    console.log("Wrong credentials");
    res.status(400).json({
      Message: "Wrong login credentials",
    });
  } else {
    const token = jwt.sign({ id: user._id }, secret, { expiresIn: "2h" });
    res.status(200).json({
      Message: "login sucessfully",
      token: token,
      user: user,
    });
    console.log("login sucessfully");
  }
};

// let user;
// user = await userModel.findOne({ email: email});
// if(user) {
//     console.log("User found");
//     res.status(200).json({Message: "User found"});
// } else {
//     console.log("User not found");
//     res.status(400).json({Message: "User not found"})
// }

const dashboard = async (req, res) => {
  let token = req.headers.authorization.split(" ")[1];
  console.log(token);
  jwt.verify(token, secret, (err, result) => {
    if (err) {
      console.log(err);
      res.send({ status: false, Message: "error", result });
    } else {
      console.log(result);
      res.send({ status: true, Message: "Welcome", result });
    }
  });
};

const uploadProfile = (req, res) => {
  console.log(req.body.file);
  let file = req.body.myFile;

  cloudinary.uploader.upload(file, (result, error) => {
    if (error) {
      console.log(error);
    } else {
      console.log(result);
      res.send({ status: true, message: "sucessfully uploaded", result });
    }
  });
};

let htmlText = `<div style=background-color:red>
    <h2 style=color:black>Hello world</h2>
</div>`

const sendMail = (email) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASSWORD,
    },
    tls: {
        rejectUnauthorized: false
    }
  })

  console.log(process.env.EMAIL);
  console.log(process.env.PASSWORD);
  let mailOption = {
    from: process.env.EMAIL, // sender address
    to: email, // list of receivers
    subject: "Hello", // Subject line
    // text: "Sending an email to check", // plain text body
    html: htmlText,
  };
  transporter.sendMail (mailOption,
    (err, result) => {
      if (err) {
        console.log("Error: " + err);
      } else {
        console.log("Mail sent");
        console.log(result);
      }
    })
};

module.exports = {
  welcomeUser,
  about,
  register,
  login,
  registerUser,
  loginUser,
  dashboard,
  uploadProfile,
  sendMail,
};
