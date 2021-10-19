import React, { useEffect, useState } from 'react'
import { IconButton } from '@material-ui/core';
import SendIcon from '@material-ui/icons/Send';
import MicIcon from '@material-ui/icons/Mic';
import axios from 'axios';
import { collection, query, orderBy, onSnapshot, addDoc, Timestamp } from "firebase/firestore"; 
import { useHistory } from 'react-router-dom';

import {firestore as db} from "../../firebase.js";
import bot from "./bot.png"
import { useStateValue } from "../../StateProvider";
import ReactTooltip from "react-tooltip";
import $ from "jquery";
import "./Home.css"


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



            // if(user){

                console.log(userId)
    
                const q = query(collection(db, "users/"+userId+"/chats"), orderBy("timestamp", "desc"));
    
                unsubscribe = onSnapshot(q, (querySnapshot) => {
                    const chats  = [];
                    querySnapshot.forEach((doc) => {
                        chats.push(doc.data());
                    });
    
                    setMessages(chats);
                    
                });
            // }

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
                axios.post('http://localhost:3001/sendMessage', {body : jsonMessage}, {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }).then(async (res) => {
                    console.log(res.data.answer);
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
                <select onChange={setLanguage} value={languageChosen} data-placeholder="Choose a Language...">
                        <option value="AF">Afrikaans</option>
                        <option value="SQ">Albanian</option>
                        <option value="AR">Arabic</option>
                        <option value="HY">Armenian</option>
                        <option value="EU">Basque</option>
                        <option value="BN">Bengali</option>
                        <option value="BG">Bulgarian</option>
                        <option value="CA">Catalan</option>
                        <option value="KM">Cambodian</option>
                        <option value="ZH">Chinese (Mandarin)</option>
                        <option value="HR">Croatian</option>
                        <option value="CS">Czech</option>
                        <option value="DA">Danish</option>
                        <option value="NL">Dutch</option>
                        <option value="EN">English</option>
                        <option value="ET">Estonian</option>
                        <option value="FJ">Fiji</option>
                        <option value="FI">Finnish</option>
                        <option value="FR">French</option>
                        <option value="KA">Georgian</option>
                        <option value="DE">German</option>
                        <option value="EL">Greek</option>
                        <option value="GU">Gujarati</option>
                        <option value="HE">Hebrew</option>
                        <option value="HI">Hindi</option>
                        <option value="HU">Hungarian</option>
                        <option value="IS">Icelandic</option>
                        <option value="ID">Indonesian</option>
                        <option value="GA">Irish</option>
                        <option value="IT">Italian</option>
                        <option value="JA">Japanese</option>
                        <option value="JW">Javanese</option>
                        <option value="KO">Korean</option>
                        <option value="KN">Kannada</option>
                        <option value="LA">Latin</option>
                        <option value="LV">Latvian</option>
                        <option value="LT">Lithuanian</option>
                        <option value="MK">Macedonian</option>
                        <option value="MS">Malay</option>
                        <option value="ML">Malayalam</option>
                        <option value="MT">Maltese</option>
                        <option value="MI">Maori</option>
                        <option value="MR">Marathi</option>
                        <option value="MN">Mongolian</option>
                        <option value="NE">Nepali</option>
                        <option value="NO">Norwegian</option>
                        <option value="FA">Persian</option>
                        <option value="PL">Polish</option>
                        <option value="PT">Portuguese</option>
                        <option value="PA">Punjabi</option>
                        <option value="QU">Quechua</option>
                        <option value="RO">Romanian</option>
                        <option value="RU">Russian</option>
                        <option value="SM">Samoan</option>
                        <option value="SR">Serbian</option>
                        <option value="SK">Slovak</option>
                        <option value="SL">Slovenian</option>
                        <option value="ES">Spanish</option>
                        <option value="SW">Swahili</option>
                        <option value="SV">Swedish </option>
                        <option value="TA">Tamil</option>
                        <option value="TT">Tatar</option>
                        <option value="TE">Telugu</option>
                        <option value="TH">Thai</option>
                        <option value="BO">Tibetan</option>
                        <option value="TO">Tonga</option>
                        <option value="TR">Turkish</option>
                        <option value="UK">Ukrainian</option>
                        <option value="UR">Urdu</option>
                        <option value="UZ">Uzbek</option>
                        <option value="VI">Vietnamese</option>
                        <option value="CY">Welsh</option>
                        <option value="XH">Xhosa</option>
                </select>
            </div>

        </div>
    )
}

export default Home
