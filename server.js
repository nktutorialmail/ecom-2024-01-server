// import
const express = require("express");
const app = express();
const morgan = require("morgan");
const { readdirSync } = require("fs");
const cors = require("cors");

// middle ware
app.use(morgan("dev"));
app.use(express.json({limit: "20mb"}));
app.use(cors());

// routes
readdirSync("./routes").map((item) => app.use("/api", require("./routes/" + item)));

// server
app.listen(8000, () => console.log("Server is running on port 8000"));
