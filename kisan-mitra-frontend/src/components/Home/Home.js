import React from 'react'
import bot from "./bot.png"
import { IconButton } from '@material-ui/core';
import SendIcon from '@material-ui/icons/Send';
import MicIcon from '@material-ui/icons/Mic';

import "./Home.css"

function Home() {
    return (
        <div className="home-background">
            
            <div className="chat-bot">
                <div className="chat-header">
                    <img alt="bot" src={bot} className="bot-image"/>
                </div>

                <div className="chat-body">

                    <p className="chat-message">
                        <span className="chat-name">Kisan Mitra Bot</span>
                        <span className="chat-text">ggghrghrtgvhrggnjbngjbnnjbggghrghrtgvhrggnjbngjbnnjbggghrghrtgvhrggnjbngjbnnjbggghrghrtgvhrggnjbngjbnnjb</span>
                    </p>

                    <p className="chat-message chat-receiver">
                        <span className="chat-name">You</span>
                        <span className="chat-text">ggghrghrtgvhrggnjbngjbnnjbggghrghrtgvhrggnjbngjbnnjbggghrghrtgvhrggnjbngjbnnjbggghrghrtgvhrggnjbngjbnnjb</span>
                    </p>

                </div>
                
                <div className="chat-footer">
                    <IconButton className="icon-button">
                        <MicIcon style={{fill: "white"}}/>
                    </IconButton>

                    <form >
                        <input placeholder="Type a message" type="text" />                      
                    </form>

                    <IconButton className="icon-button">
                        <SendIcon style={{fill: "white"}}/>
                    </IconButton>
                </div>
            </div>

        </div>
    )
}

export default Home
