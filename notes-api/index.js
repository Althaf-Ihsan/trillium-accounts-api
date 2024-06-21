const express = require("express");
const dotenv = require("dotenv");

const cors = require("cors");
const noteRoute = require('./routes/noteRoutes.js');
const { default: helmet } = require("helmet");
dotenv.config();

const app = express();
const port = process.env.PORT || 7002;

const corsOptions = {
  origin: "http://localhost:5173", 
  optionsSuccessStatus: 200,
};

//middleware
app.use(helmet())
app.use(cors(corsOptions));
app.use(express.json());

// api routes
app.use("/api/v1/", noteRoute);

// app.use(notFound);
// app.use(handleError);

app.listen(port, () => {
  console.log(`server running on port ${port}`);
});