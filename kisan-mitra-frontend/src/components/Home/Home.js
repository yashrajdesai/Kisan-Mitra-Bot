import React, { useEffect, useState } from 'react'
import { IconButton } from '@material-ui/core';
import SendIcon from '@material-ui/icons/Send';
import MicIcon from '@material-ui/icons/Mic';
import axios from 'axios';
import { collection, query, getDocs, where, updateDoc, doc, orderBy, onSnapshot, addDoc, Timestamp } from "firebase/firestore"; 
import { useHistory } from 'react-router-dom';

import {firestore as db} from "../../firebase.js";
import bot from "./bot.png"
import { useStateValue } from "../../StateProvider";
import ReactTooltip from "react-tooltip";
import $ from "jquery";
import "./Home.css"
import { async } from '@firebase/util';


function Home() {

    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState("");
    const [botMessage, setBotMessage] = useState("");
    const [{userId,user,authReady},dispatch] = useStateValue();

    const [languageChosen,setLanguageChosen]=useState('EN');
    const [micButtonClicked,setMicButton]=useState(false);

    var speechRecognition = window.webkitSpeechRecognition;   //used for speech to text
    var synth = window.speechSynthesis;                       //used for text to speech


    var voices = synth.getVoices();

    var recognition = new speechRecognition();

    var textbox=$("#textbox");

    var instructions = $("#instructions");

    var content = '';

    //code for speech to text

    recognition.continuous = false;

    recognition.lang=languageChosen;

    recognition.onstart = function(event){
        instructions.text("Voice start");
    }

    recognition.onspeechend = function(event){
        recognition.stop();
        instructions.text("Recorded Successfully. Click Again For Speaking");
        setMicButton(false);
    }

    recognition.onerror = function(event){
        instructions.text("Speak");
    }


    recognition.onresult = function(event){
        var current = event.resultIndex;

        var transcript = event.results[current][0].transcript;

        content+=transcript;

        textbox.val(content)
        setMessage(content)
    }
    
    $("#mic-button").on('click',function(event){
      
        console.log("clicked")
        recognition.start();
        if(content.length){
            content+= ''
        }
        console.log(content);
        setMicButton(true);
        
    });

    console.log(content);

    textbox.on('input',function(){
      content = $(this).val();
      setMessage(content);
      console.log(content);
      
    })

    const history = useHistory()

    useEffect(() => {


        var unsubscribe = null;

        if(authReady && user && userId){

                console.log(userId)
    
                const q = query(collection(db, "users/"+userId+"/chats"), orderBy("timestamp", "desc"));
    
                unsubscribe = onSnapshot(q, (querySnapshot) => {
                    const chats  = [];
                    querySnapshot.forEach((doc) => {
                        chats.push(doc.data());
                    });
    
                    setMessages(chats);
                    
                });

        }

        return () => {
            if(unsubscribe){
                unsubscribe();
            }
        }
    }, [authReady,user,userId])

    const sendMessage = async (e) => {

            e.preventDefault();
            if(user){
                const jsonMessage = JSON.stringify({ message });
                axios.post('/sendMessage', {body : jsonMessage}, {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }).then(async (res) => {
                    console.log(res.data.answer);
                    console.log(res.data.intent);

                    var suggestedIntent = res.data.intent.replaceAll("_", " ");

                    var intents = ['Animal Production (Piggery, Goatery, Sheep Farming etc.)', 'Fertilizer Use and Availability', 'Varieties', 'Organic Farming', 'Market Information', 'Soil Health Card', 'Power, Roads etc.', 'Mushroom Production', 'Plant Protection', 'Bio-Pesticides and Bio-Fertilizers', 'Cattle shed Planning and Management', 'Water Management, Micro Irrigation', 'Training and Exposure Visits', 'Agriculture Mechanization', 'Cultural Practices', 'Livestock Products Processing and Packaging', 'Dairy Production', 'Field Preparation', 'Animal Breeding', 'Soil Testing', 'Tank, Pond and Reservoir Management', 'Seeds', 'Crop Insurance', 'Sowing Time and Weather', 'Government Schemes', 'Animal Nutrition', 'Water Management', 'Credit', 'Weed Management', 'Disease Management', 'Integrated Farming', 'Post Harvest Management (Cleaning, Grading, Packaging, Food Processing, Cool Chain etc.)', 'Seeds and Planting Material', 
'Weather', 'Nutrient Management'];

                    intents.forEach(async(intent) => {
                        if(suggestedIntent.includes(intent)){

                            const q = query(collection(db, "statistics"), where("name", "==", intent));

                            const querySnapshot = await getDocs(q);
                          
                            if(querySnapshot){
                                querySnapshot.forEach(async(document) =>{
                                    var val = document.data().value;
                                    
                                    const docRef = doc(db, "statistics", document.id)

                                    await updateDoc(docRef, {
                                        name: intent,
                                        value: val + 1
                                    });

                                })
                            }else{
                                await addDoc(collection(db, "statistics"), {
                                    name: intent,
                                    value: 1
                                });
                            }     
    
                        } 
                    })

                    
                    setBotMessage(res.data.answer);
                    await addDoc(collection(db, "users/"+userId+"/chats"), {
                        botAnswer: res.data.answer,
                        userMessage: message,
                        timestamp: Timestamp.now()
                    });
                    
                    setMessage("")
                    if (synth.speaking) {
                        console.error('speechSynthesis.speaking');
                        return;
                    }
                    if (res.data.answer !== '') {
                    var utterThis = new SpeechSynthesisUtterance(res.data.answer);
                    utterThis.onend = function (event) {
                        console.log('SpeechSynthesisUtterance.onend');
                    }
                    utterThis.onerror = function (event) {
                        console.error('SpeechSynthesisUtterance.onerror');
                    }
                    var selectedOption = 'hi-IN';
                    for(var i = 0; i < voices.length ; i++) {
                        // console.log(voices[i].name);
                        // console.log(voices[i].lang);
                      if(voices[i].lang === selectedOption) {
                        utterThis.voice = voices[i];
                        break;
                      }
                    }
                    synth.speak(utterThis);
                   
                  }
                    
                });

            }else{
                alert("You must be signed in to chat with our bot")
                history.push("/login")
            }
       
    }

    const setLanguage = (event) =>{
        setLanguageChosen(event.target.value);
    }

    return (
        <div className="home-background">
            
            <div className="chat-bot">
                <div className="chat-header">
                    <img alt="bot" src={bot} className="bot-image"/>
                    <div className="language-dropdown">
                        <select onChange={setLanguage} value={languageChosen} data-placeholder="Choose a Language...">
                            <option value="BN">Bengali</option>
                            <option value="EN">English</option>
                            <option value="GU">Gujarati</option>
                            <option value="HI">Hindi</option>
                            <option value="KN">Kannada</option>
                            <option value="ML">Malayalam</option>
                            <option value="MR">Marathi</option>
                            <option value="PA">Punjabi</option>
                            <option value="TA">Tamil</option>
                            <option value="TE">Telugu</option>
                            <option value="UR">Urdu</option>
                        </select>
                    </div>
                </div>

                <div className="chat-body">

                    {
                        messages.map((msg) => (
                            <>
                                <p className="chat-message">
                                    <span className="chat-name">Kisan Mitra Bot</span>
                                    <span className="chat-text">{msg.botAnswer}</span>
                                    <br />
                                    <span className="chat-timestamp">{new Date(msg.timestamp?.toDate()).toLocaleString("en-US", {timeZone: 'Asia/Kolkata'})}</span>
                                </p> 

                                <p className="chat-message chat-receiver">
                                    <span className="chat-name">{user.Name}</span>
                                    <span className="chat-text">{msg.userMessage}</span>
                                    <br />
                                    <span className="chat-timestamp">{new Date(msg.timestamp?.toDate()).toLocaleString("en-US", {timeZone: 'Asia/Kolkata'})}</span>
                                </p> 
                            </>
                        ))
                    }

                </div>
                
                <div className="chat-footer">
                    <form>
                           <div data-tip data-for="registerTip">
                                <IconButton id="mic-button" className="icon-button" style={{backgroundColor: micButtonClicked?"white":""}}>
                                    <MicIcon style={{fill: micButtonClicked?"red":"white"}}/>
                                </IconButton>
                            </div>
                            <ReactTooltip id="registerTip" place="top" effect="solid">
                                <div id="instructions">
                                    Speak
                                </div>
                            </ReactTooltip>

                        <input value = {message} onChange = {(e)=>{setMessage(e.target.value);}} placeholder="Type a message" type="text" />                      
                        
                        <IconButton className="icon-button">
                            <button type="submit" id="messageSubmit" onClick={sendMessage}>Send a message</button>
                            <label htmlFor="messageSubmit"><SendIcon style={{fill: "white"}}/></label>
                        </IconButton>
                    </form>
                </div>
                
            </div>

        </div>
    )
}

export default Home
