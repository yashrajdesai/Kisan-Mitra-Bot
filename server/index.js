const express = require("express");
const router = express.Router();
const axios = require('axios');
const cors = require("cors");

const PORT = process.env.PORT || 3001;

const app = express();

app.use(
    cors({
        origin : "http://localhost:3000"
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
    console.log(req.body);
    const {body} =  req.body;
    console.log(body);
    axios.post('http://localhost:5005/webhooks/rest/webhook', body)
      .then(function (response) {
        console.log(response.data);
        if(response.data.length === 0) {
            res.json({answer: "Sorry, I do not have idea about this question. Please contact Kisan Call Center at 1800-180-1551."});
        } else {
            console.log(response.data);
            res.json({answer: response.data[0].text});
        }
      })
      .catch(function (error) {
        console.log(error);
    });
})

app.get("/sendMessage", (req,res) => {
    res.json({ message: "Hello from server!" });
})

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
