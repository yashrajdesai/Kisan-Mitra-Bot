const axios = require('axios').default;
// const express = require('express');
// const app = express();
const { v4: uuidv4 } = require('uuid');

var subscriptionKey = "46f430e8db494bc2a36ec12d06e8e321";
var endpoint = "https://api.cognitive.microsofttranslator.com/";
var detectedlanguage;
// Add your location, also known as region. The default is global.
// This is required if using a Cognitive Services resource.
var location = "global";

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
        'to': 'mr'
    },
    data: [{
        'text': 'Hi'
    }],
    responseType: 'json'
}).then(function(response){
    console.log(JSON.stringify(response.data, null, 4));
    detectedlanguage = JSON.stringify(response.data[0].detectedLanguage.language);
    console.log(detectedlanguage);
})

// app.get("/", function(req, res) {
//     res.send()
// })

// app.listen(3000);