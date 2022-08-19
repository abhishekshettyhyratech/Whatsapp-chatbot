
"use strict";

const request = require("request"),
express = require("express"),
body_parser = require("body-parser"),
axios = require("axios").default,
app = express().use(body_parser.json()); 
require('dotenv').config({path: '.env'})

const token = process.env.TOKEN;
const port = process.env.PORT;

app.listen(port, () => console.log("webhook is listening on port: " + port + " with token: " + token));

app.put("/wa-cloud-api-webhook/webhook", (req, res) => {
  let body = req.body;
 
  console.log(JSON.stringify(req.body, null, 2));

  if (req.body.object) {
    if (
      req.body.entry &&
      req.body.entry[0].changes &&
      req.body.entry[0].changes[0] &&
      req.body.entry[0].changes[0].value.messages &&
      req.body.entry[0].changes[0].value.messages[0]
    ) {
      let phone_number_id =
        req.body.entry[0].changes[0].value.metadata.phone_number_id;
      let from = req.body.entry[0].changes[0].value.messages[0].from; 
      let msg_body = req.body.entry[0].changes[0].value.messages[0].text.body; 
      axios({
        method: "POST", 
        url:
          "https://graph.facebook.com/v14.0/" +
          phone_number_id +
          "/messages?access_token=" +
          token,
        data: {
          messaging_product: "whatsapp",
          to: from,
          text: { body: "Ack: " + msg_body },
        },
        headers: { "Content-Type": "application/json" },
      }).catch(
        function (error) {
          console.log(error.toJSON())
        });
    }
    res.sendStatus(200);
  } else {

    res.sendStatus(404);
  }
});


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
