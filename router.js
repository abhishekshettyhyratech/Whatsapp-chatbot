const router=require('express').Router();
const axios=require('axios')
router.post("/webhook", (req, res) => {
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
            "https://graph.facebook.com/v13.0/" +
            phone_number_id +
            "/messages?access_token=" +
            token,
          data: {
            messaging_product: "whatsapp",
            to: from,
            type: "template",
      template: {
         name: "sample_shipping_confirmation",
         language: {
             code: "en_US",
             policy: "deterministic"
         },
         components: [
           {
             type: "body",
             parameters: [
                 {
                     type: "text",
                     text: e.text,
                 }
             ]
           }
         ]
      }
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
  

module.exports =router;