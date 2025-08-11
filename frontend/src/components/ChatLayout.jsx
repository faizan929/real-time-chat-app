

import React, {useState, useEffect, useRef, useCallback} from "react";
import SideBar from './SideBar';
import ChatWindow from './ChatWindow';
function ChatLayout({user, onLogout }) {

    const [messages, setMessages] = useState([]);
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
        if (!user || (!user.name && !user.email)) return;
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

    const username = user?.name || user?.email || "Anonymous";

        const fetchChatHistory = useCallback(async (otherUser) => {
            try{
                const currentUserId = user.user_id || user.id;
                const response = await fetch(`http://127.0.0.1:8000/messages/${currentUserId}/${otherUser.id}`)

                if (response.ok){
                 
                    const data = await response.json();

                    const transformedMessages = data.messages.map(msg => ({
                        user : msg.sender_id === currentUserId ? username : otherUser.name,
                        to: msg.sender_id === currentUserId ? otherUser.name : username,
                        message: msg.content
                    }));
                    
                    setMessages(transformedMessages);
                }
            } catch(error){
                console.error("Error fetching the chat history", error)
            }
        }, [user, username]);

     
       


        useEffect(() => {
            if (selectedUser) {
                fetchChatHistory(selectedUser);
            }
        }, [selectedUser, fetchChatHistory]);


     
       
    
        const sendMessage = async () => {
            if (socket.current && input.trim() && selectedUser) {
               
                const message = {
                    user: username|| "Anonymous",
                    to: selectedUser.isGroup? selectedUser.id.toString(): selectedUser.name,
                    message: input.trim(),
                    isGroup: selectedUser.isGroup || false,
                };

                if(socket.current.readyState === WebSocket.OPEN) {
                    console.log("Sending", message);
                    socket.current?.send(JSON.stringify(message));
                } 

                try {
                    await fetch("http://127.0.0.1:8000/send-message", {
                        method: 'POST',
                        headers: {
                            'Content-Type' : 'application/json',
                        }, 
                        body : JSON.stringify({
                            sender_id : user.user_id || user.id,
                            recipient_id : selectedUser.id,
                            content : input.trim(),
                            is_group : selectedUser.isGroup || false,
                        }),
                    });
                }catch(error){
                    console.error("Unable to send the data to the db", error);
                }
                setMessages((prev) => [...prev, message]);
                setInput("");
            }
        };

        const filteredMessages = messages.filter(msg =>{
            if (!selectedUser) return false;

            const msgUser = msg.user?.trim()?.toLowerCase() || "";
            const msgTo = msg.to?.trim()?.toLowerCase() || "";
            const currentUser = username?.trim()?.toLowerCase()  || "";
            
            if (selectedUser.isGroup){
                const selectedId = selectedUser.id.toString();
                return msg.to  === selectedId;
            }else{
                const selectedName = selectedUser.name?.trim()?.toLowerCase() || "";     
                return (
                    (msgUser === selectedName && msgTo  === currentUser ) || 
                    (msgUser === currentUser && msgTo === selectedName)  || 
                    (msgUser === selectedName && msgTo === selectedName) ||
                    (msgUser === currentUser && msgTo === currentUser)

               
            );
                }
        });
        
        return (
            <div className = "flex h-screen">
                <SideBar selectedUser = {selectedUser}  setSelectedUser = {setSelectedUser} />

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
                    <h2>{user.name || user.email} </h2>

                    <button onClick = {onLogout}>Logout</button>
                </div>
            </div>
            
        );
} 

export default ChatLayout;
