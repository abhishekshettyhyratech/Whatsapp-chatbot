const router=require('express').Router();
const axios=require('axios')
const token = process.env.TOKEN;
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

        if(msg_body==='Eye Specialist'){
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
        "name": "appointment_eye",
        "language": {
            "code": "en_US"
        }
        
      }
          },
          headers: { "Content-Type": "application/json" },
        }).catch(
          function (error) {
            console.log(error.toJSON())
          });
        }
      }
      res.sendStatus(200);
    } else {
      res.sendStatus(404);
    }
  });
  

module.exports =router;