

import React, {useState, useEffect, useRef} from "react";

function ChatLayout({user}) {

    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const socket = useRef(null);



    useEffect(() => {

       
        console.log("initializing the socket");
        const ws = new WebSocket("ws://localhost:8000/ws");
        socket.current = ws;

        ws.onopen = () => {
            console.log(" websockect connected");
        };

        ws.onerror = (err) => {
            console.error("Websocket error", err);
        };

        ws.onmessage = (event) => {
            const data = JSON.parse(event.data);
            setMessages((prev) => [...prev, data]);

        };

        ws.onclose = () => {
            console.log("Websocket disconnected");
        };

        
    
    return () => ws?.close();
}, []);
 
        const sendMessage = () => {
            if (ws && input.trim()) {
                const message = {
                    user: user || "Anonymous",
                    message: input.trim(),
                };
                if(ws?.readyState === WebSocket.OPEN) {
                    ws.send(JSON.stringify(message));
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
            <div className = "flex flex-col h-screen">
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
