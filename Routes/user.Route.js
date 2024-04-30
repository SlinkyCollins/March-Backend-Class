const express = require("express")
const router = express.Router()
const {welcomeUser, about, loginUser, registerUser, login, register, dashboard, uploadProfile, sendMail} = require("../Controllers/User.Controller")

router.get("/user", welcomeUser);
router.get("/about", about);
router.get("/register", register);
router.get("/login", login);
router.post("/register", registerUser);
router.post("/login", loginUser);   
router.post("/upload", uploadProfile);  
router.get("/dashboard", dashboard);
router.get("/sendmail", sendMail);
// router.get("/about", about)


module.exports = router