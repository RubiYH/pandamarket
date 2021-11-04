"use strict";

const express = require("express");
const ejs = require("ejs");
const app = express();
const helmet = require("helmet");
const config = require("./config.json");

//로깅
require("./logging.js");

//create an app
app.set("view engine", "ejs");

app.use(
  helmet({
    contentSecurityPolicy: false,
  })
);

app.use(helmet.xssFilter());
app.disable("x-powered-by");
app.use(helmet.frameguard("deny"));
app.use(helmet.noSniff());
app.use(express.static(__dirname + "/src"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


//import js for ejs
var glob = require("glob"),
  path = require("path");

glob.sync("./views/js/**/*.js").forEach(function (file) {
  require(path.resolve(file))(app);
});

//default page
app.get("/", (req, res) => {
  res.redirect("main");
});

//error page
app.get("*", (req, res) => {
  res.sendFile(__dirname + "/storage/notFound.html");
});

//error handling
app.use(function (req, res, next) {
  var err_code = "E" + Date.now();
  res.status(404).render(__dirname + "/storage/error.ejs", {
    err_code: err_code,
  });
});

//ejs error handling
app.use(function (err, req, res, next) {
  var err_code = "E" + Date.now();
  console.log(`[코드: ${err_code}] 오류가 발생하였습니다: \n` + err.toString());
  res.status(500).render(__dirname + "/storage/error.ejs", {
    err_code: err_code,
  });
});

//start app
app.listen(config.port, () =>
  console.log(`Website is now online: Port ${config.port}`)
);
