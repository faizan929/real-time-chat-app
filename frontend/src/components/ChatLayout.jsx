

import React, {useState, useEffect, useRef} from "react";
import SideBar from './SideBar'
function ChatLayout({user}) {

    const [messages, setMessages] = useState([]);
    // first one is the state variable and the second is the function to update it
    //useState is immutable
    const [input, setInput] = useState("");
    //useRef() : mutable and does not trigger the re-render
    const socket = useRef(null);


//useEffect:
// it is used to perform side effect
// let us synchronize with the system outside the react
// two types of side effects
// event based and render based effects
// (can use eventhandler directly instead of useEffect)

    useEffect(() => {
        // code inside the useEffect hook runs when the component is mounted
        // it is a trigger

        console.log("initializing the socket");
        const ws = new WebSocket("ws://localhost:8000/ws");
        socket.current = ws;

        ws.onopen = () => {
            console.log(" websockect connected");

            ws.send(JSON.stringify({
                user: user,
                type: "connect",
                message: "User connected"
                
            }));
        };

        ws.onerror = (err) => {
            console.error("Websocket error", err);
        };
        
        // frontend is listening from the backend
        
        ws.onmessage = (event) => {
            console.log("onmessage is firing")
            console.log("i am receiving", event.data)
            const data = JSON.parse(event.data);
            setMessages((prev) => [...prev, data]);

        };

        ws.onclose = () => {
            console.log("Websocket disconnected");
        };

        
    
    return () => ws?.close();
}, [user]);



        const sendMessage = () => {
            if (socket.current && input.trim()) {
                const message = {
                    user: user || "Anonymous",
                    message: input.trim(),
                };
                if(socket.current?.readyState === WebSocket.OPEN) {
                    console.log("Sending", message);
                    socket.current.send(JSON.stringify(message));
                } 
                // setMessages((prev) => [...prev, message]);
                setInput("");
            }
        };
        const handleKeyDown = (e) => {
            if (e.key === "Enter") {
                sendMessage();
            }
        }

        return (
            <div className = "flex h-screen">
                <SideBar />
                <div className = "flex-1 overflow-y-auto p-4">
                    {messages.map((msg, idx) => (
                        <div key = {idx}>
                            <strong>{msg.user}:</strong> {msg.message}
                        </div> 
                    ))}
                </div>

                <div className = "p-4 border-t flex">
                    <input
                        className= "flex-1 border rounded p-2"
                        value = {input}
                        onChange = {(e) => setInput(e.target.value)}
                        onKeyDown = {handleKeyDown}
                        placeholder = "Type your message"
                    />
                    <button 
                        className = "ml-2 bg-blue-500 text-white px-4 py-2 rounded"
                        onClick = {sendMessage}
                    >
                        Send
                    </button>
                </div>
            </div>
        );
} 

export default ChatLayout;
