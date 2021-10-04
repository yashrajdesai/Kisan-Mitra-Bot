import React, { useState } from 'react'
import bot from "./bot.png"
import { IconButton } from '@material-ui/core';
import SendIcon from '@material-ui/icons/Send';
import MicIcon from '@material-ui/icons/Mic';
import axios from 'axios';

import "./Home.css"

function Home() {

    const [message, setMessage] = useState("");
    const [botMessage, setBotMessage] = useState("");

    const sendMessage = async () => {

        const jsonMessage = JSON.stringify({ message });
        console.log(jsonMessage);
        const res = await axios.post('http://localhost:3001/sendMessage', {body : jsonMessage}, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        console.log(res.data);
        setBotMessage(res.data.answer)
    }

    return (
        <div className="home-background">
            
            <div className="chat-bot">
                <div className="chat-header">
                    <img alt="bot" src={bot} className="bot-image"/>
                </div>

                <div className="chat-body">

                    <p className="chat-message">
                        <span className="chat-name">Kisan Mitra Bot</span>
                        <span className="chat-text">{botMessage}</span>
                    </p>

                    {(message.length != 0) && <p className="chat-message chat-receiver">
                        <span className="chat-name">You</span>
                        <span className="chat-text">{message}</span>
                    </p>
                    }
                </div>
                
                <div className="chat-footer">
                    <IconButton className="icon-button">
                        <MicIcon style={{fill: "white"}}/>
                    </IconButton>

                    <form >
                        <input value = {message} onChange = {(e)=>{setMessage(e.target.value);}} placeholder="Type a message" type="text" />                      
                    </form>

                    <IconButton className="icon-button" onClick = {sendMessage}>
                        <SendIcon style={{fill: "white"}}/>
                    </IconButton>
                </div>
            </div>

        </div>
    )
}

export default Home
