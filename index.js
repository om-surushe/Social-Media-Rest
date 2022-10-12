const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const helmet = require("helmet");
const morgan = require("morgan");
const authRoute = require("./routes/authenticate");
const followRoute = require("./routes/follow");
const userRoute = require("./routes/user");
const postRoute = require("./routes/post");

const app = express();
dotenv.config();

mongoose.connect(
    process.env.MONGO_URL,
    { useNewUrlParser: true, useUnifiedTopology: true },
    () => {
        console.log("Connected to MongoDB");
    }
);

//middleware
app.use(express.json());
app.use(helmet());
app.use(morgan("common"));

app.use("/api/authenticate", authRoute);
app.use("/api", followRoute);
app.use("/api", userRoute);
app.use("/api", postRoute);

app.listen(8800, () => {
    console.log("Backend server is running!");
    });