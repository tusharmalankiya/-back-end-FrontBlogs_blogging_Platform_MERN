const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");
const path = require('path');
const cors = require('cors');

//imports from files
const commonRoutes = require("./routes/commonRoutes");
const authRoutes = require("./routes/authRoutes");
const adminRoutes = require("./routes/adminRoutes");
const { auth } = require("./middlewares/authMiddleware");
//----------------------------------------------------

require("dotenv").config();
app = express();

//***********************middlwares********************** */
// CORS Middleware
app.use(cors());

app.use(morgan("dev"));

// express middleware handling the body parsing 
app.use(express.json());

app.use("/assets", express.static("public"));
// app.set("view engine", "ejs");
app.use(cookieParser());

//routes
app.use("/api/v1", commonRoutes);
app.use("/api/v1/admin", adminRoutes);
app.use("/api/v1/admin", auth, authRoutes);

// create static assets from react code for production only
if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/build"));

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "client", "build", "index.html"));
  });
}

// app.get("*", (req, res) => {
//   res.status(404).render("404");
// });
//database connection
mongoose
  .connect(process.env.MONGO_URI)
  .then((result) => {
    app.listen(process.env.PORT, () => {
      console.log(
        `connected to database and listening on port ${process.env.PORT}`
      );
    });
  })
  .catch((err) => {
    console.log(err);
  });
