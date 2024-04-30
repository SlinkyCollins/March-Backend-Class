const express = require("express");
require("dotenv").config();
let port = process.env.PORT     
const app = express();
const userRouter  = require("./Routes/user.Route")
const mongoose = require("mongoose");
const cors = require("cors");
let uri = "mongodb+srv://afolabiademola27:Collins5@cluster0.1auibv4.mongodb.net/march-db?retryWrites=true&w=majority&appName=Cluster0";

app.use(cors());
app.use(express.json({ limit: "50mb"}))
app.use(express.json());
app.use("/student", userRouter)
app.use(express.urlencoded({ extended : true , limit : "50mb" }));
// app.use("/user", userRouter)
// app.use("/", require("./Routes/user.Route"));

app.listen(port, () => {
    mongoose.connect(uri)
    .then(()=>{
        console.log(`Server is running on port ${port} and database is connected successfully `);
    })
    .catch((err)=>{
        console.log(err);
    });
    // console.log(`am working on port ${port} and database is connected successfully`);
});