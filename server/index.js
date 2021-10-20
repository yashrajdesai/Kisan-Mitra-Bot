const express = require("express");
const router = express.Router();
const axios = require('axios');
const cors = require("cors");
const { v4: uuidv4 } = require('uuid');
// const key = require("./keys.json"); 

var subscriptionKey = "46f430e8db494bc2a36ec12d06e8e321";
var endpoint = "https://api.cognitive.microsofttranslator.com/";
var detectedlanguage;
// Add your location, also known as region. The default is global.
// This is required if using a Cognitive Services resource.
var location = "global";
var translatedtext;
var translatedBotText;
var intent;

const PORT = process.env.PORT || 3001;

const app = express();
app.use(
    cors({
        origin : "http://frontend:3000"
    })
)
app.use(express.json());
// axios.post('/sendMessage', {
    
//   })
//   .then(function (response) {
//     console.log(response);
//   })
//   .catch(function (error) {
//     console.log(error);
//   });

app.post("/sendMessage", (req,res) => {
    // console.log(req.body);
    var {body} =  req.body;
    body = JSON.parse(body);
    // console.log(body.message);
    //console.log(body.message);
    axios({
        baseURL: endpoint,
        url: '/translate',
        method: 'post',
        headers: {
            'Ocp-Apim-Subscription-Key': subscriptionKey,
            'Ocp-Apim-Subscription-Region': location,
            'Content-type': 'application/json',
            'X-ClientTraceId': uuidv4().toString()
        },
        params: {
            'api-version': '3.0',
            'to': 'en'
        },
        data: [{
            'text': body.message
        }],
        responseType: 'json'
    }).then(function(response){
        // console.log(JSON.stringify(response.data, null, 4));
        detectedlanguage = JSON.stringify(response.data[0].detectedLanguage.language);
        translatedtext = response.data[0].translations[0].text;
        // console.log(translatedtext);
        // console.log(detectedlanguage);

        axios.post('http://rasa:5005/webhooks/rest/webhook', {"message": translatedtext})
        .then(function (respon) {
            // console.log(respon.data);
            if(respon.data.length === 0) {
                res.json({answer: "Sorry, I do not have idea about this question. Please contact Kisan Call Center at 1800-180-1551."});
            } 
            else {
                // if(detectedlanguage != "en") {
                axios({
                    baseURL: endpoint,
                    url: '/translate',
                    method: 'post',
                    headers: {
                        'Ocp-Apim-Subscription-Key': subscriptionKey,
                        'Ocp-Apim-Subscription-Region': location,
                        'Content-type': 'application/json',
                        'X-ClientTraceId': uuidv4().toString()
                    },
                    params: {
                        'api-version': '3.0',
                        'from': 'en',
                        'to': detectedlanguage.replace(/['"]+/g, '')
                    },
                    data: [{
                        'text': respon.data[0].text
                    }],
                    responseType: 'json'
                }).then(function(resp){
                    // console.log(JSON.stringify(resp.data, null, 4));
                    translatedBotText = resp.data[0].translations[0].text;
                    // console.log(translatedBotText);

                    console.log(translatedtext);

                    axios.post('http://rasa:5005/model/parse', {"text": translatedtext}, {
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    }).then((result)=>{
                        intent = result.data.intent.name
                        res.json({answer: translatedBotText,intent});
                    })
                    
                       
                })
                // }
                // else {
                //     translatedBotText = response.data[0].text
                // }

        }
      })
      .catch(function (error) {
        console.log(error);
    });
    })



})

app.get("/sendMessage", (req,res) => {
    res.json({ message: "Hello from server!" });
})
app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});