

import React, {useState, useEffect, useRef} from "react";
import SideBar from './SideBar';
import ChatWindow from './ChatWindow';
function ChatLayout({user, onLogout }) {

    const [messages, setMessages] = useState([]);
    // first one is the state variable and the second is the function to update it
    //useState is immutable
    const [input, setInput] = useState("");
    const [selectedUser, setSelectedUser] = useState(null);
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
                user: typeof user === "string" ? user : user.name,
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
            try{
                const data = JSON.parse(event.data);
                if (data.type === "user_list"){
                    return;
                }

                if(data.type === "ack"){
                    console.log("Message acknowledged by server");
                    return;
                }


                if (data.message && data.user){
                    setMessages((prev) => [...prev, {
                        user: data.user,
                        to: data.to || "all",
                        message: data.message
                    }]);
                }
          
            }catch(error){
                console.log("error parsing error:", error);

        }
    };



        ws.onclose = () => {
            console.log("Websocket disconnected");
        };

        
    
    return () => ws?.close();
}, [user]);



       
        const username = typeof user === "string" ? user : user.name;
        const sendMessage = () => {
            if (socket.current && input.trim() && selectedUser) {
               
                const message = {
                    user: username|| "Anonymous",
                    to: selectedUser.trim(),
                    message: input.trim(),
                };
                if(socket.current.readyState === WebSocket.OPEN) {
                    console.log("Sending", message);
                    socket.current?.send(JSON.stringify(message));
                } 
                setMessages((prev) => [...prev, message]);
                setInput("");
            }
        };

        const filteredMessages = messages.filter(msg =>{
            const msgUser = msg.user?.trim()?.toLowerCase() || "";
            const msgTo = msg.to?.trim()?.toLowerCase() || "";
            const selected = selectedUser?.trim()?.toLowerCase() || "";
            const currentUser = username?.trim()?.toLowerCase()  || "";
            return (
                (msgUser === selected && msgTo  === currentUser ) || 
                (msgUser === currentUser && msgTo === selected)  
               
            );
        });
         

     
        return (
            <div className = "flex h-screen">
                <SideBar selectedUser = {selectedUser}  setSelectedUser = {setSelectedUser} />

                {/* <div className = "flex-1 overflow-y-auto p-4">
                    {selectedUser ? (
                        filteredMessages.length> 0 ? (
                            filteredMessages.map((msg, idx) => (
                            <div key = {idx} style={{ border: "1px solid gray", padding: "5px", margin: "5px 0" }}>
                                <strong>{msg.user}:</strong>{msg.message}
                            </div>
                            ))
                     ) : (
                        <div>No messages yet.</div>
                        ) 
                    ): (
                        <div>Select a user to chat with.</div>
                    )}
                </div>        */}
    
    
                <div className = "chat-window">
                    <ChatWindow 
                    messages = {filteredMessages}
                    input = {input}
                    setInput = {setInput}
                    sendMessage = {sendMessage}
                    selectedUser = {selectedUser}
                    />
                </div>

                <div>
                    <h2>Welcome {user.name || user.email} </h2>

                    <button onClick = {onLogout}>Logout</button>
                </div>
            </div>
            
        );
} 

export default ChatLayout;
