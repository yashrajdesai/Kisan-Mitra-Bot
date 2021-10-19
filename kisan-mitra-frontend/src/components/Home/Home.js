import React, { useEffect, useState } from 'react'
import { IconButton } from '@material-ui/core';
import SendIcon from '@material-ui/icons/Send';
import MicIcon from '@material-ui/icons/Mic';
import axios from 'axios';
import { collection, query, orderBy, onSnapshot, addDoc, Timestamp } from "firebase/firestore"; 
import {firestore as db} from "../../firebase.js";
import bot from "./bot.png"
import "./Home.css"


function Home() {

    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState("");
    const [botMessage, setBotMessage] = useState("");

    useEffect(() => {
        const q = query(collection(db, "users/7y5BmQyWY93YRJBgWfIM/chats"), orderBy("timestamp", "desc"));

        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const chats  = [];
            querySnapshot.forEach((doc) => {
                chats.push(doc.data());
            });

            setMessages(chats);
            
        });

        return () => {
            unsubscribe();
        }
    }, [])

    const sendMessage = async (e) => {

            e.preventDefault();
            const jsonMessage = JSON.stringify({ message });
            axios.post('/sendMessage', {body : jsonMessage}, {
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then(async (res) => {
                console.log(res.data.answer);
                setBotMessage(res.data.answer);
                await addDoc(collection(db, 'users/7y5BmQyWY93YRJBgWfIM/chats'), {
                    botAnswer: res.data.answer,
                    userMessage: message,
                    timestamp: Timestamp.now()
                });

                setMessage("")
            });
       
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
                                    <span className="chat-name">You</span>
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
                        <IconButton className="icon-button">
                            <MicIcon style={{fill: "white"}}/>
                        </IconButton>

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
