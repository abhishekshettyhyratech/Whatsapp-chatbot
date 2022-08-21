
"use strict";

const request = require("request"),
express = require("express"),
body_parser = require("body-parser"),
axios = require("axios").default,
app = express().use(body_parser.json()); 
require('dotenv').config({path: '.env'})

const token = process.env.TOKEN;
const port = process.env.PORT;
const postRoute=require('./router')

app.listen(port, () => console.log("webhook is listening on port: " + port + " with token: " + token));


app.use("/wa-cloud-api-webhook",postRoute);

app.get("/wa-cloud-api-webhook/webhook", (req, res) => {
  const verify_token = process.env.MYTOKEN;
  let mode = req.query["hub.mode"];
  let token = req.query["hub.verify_token"];
  let challenge = req.query["hub.challenge"];


  if (mode && token) {
    if (mode === "subscribe" && token === verify_token) {
      console.log("WEBHOOK_VERIFIED");
      res.status(200).send(challenge);
    } else {
      res.sendStatus(403);
    }
  }
});

app.get('/',((req,res)=>{
res.send('hello webhook')
}))
