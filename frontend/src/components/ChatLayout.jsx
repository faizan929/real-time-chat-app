

import React, {useState, useEffect, useRef, useCallback} from "react";
import {LogOut, Settings, User} from 'lucide-react';

import SideBar from './SideBar';
import ChatWindow from './ChatWindow';


function ChatLayout({user, onLogout }) {

    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [selectedUser, setSelectedUser] = useState(null);
    const [showUserMenu, setShowUserMenu] = useState(false);
    const socket = useRef(null);

    useEffect(() => {
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
                let response;
                if (otherUser.isGroup) {
                    response =await fetch(`http://127.0.0.1:8000/group-messages/${otherUser.id}`)
                }else{
                    response =  await fetch(`http://127.0.0.1:8000/messages/${currentUserId}/${otherUser.id}`)
                }

                if (response.ok) {
                    const data = await response.json();
                    
                    if(otherUser.isGroup){
                        const transformedMessages = data.messages.map(msg => ({
                        user : msg.sender_id === currentUserId ? username : `User ${msg.sender_id}`,
                        to: otherUser.id.toString(),
                        message: msg.content,
                        isGroup: true,
                        }));
                        setMessages(transformedMessages);
                    } else {
                        const transformedMessages = data.messages.map(msg => ({
                        user : msg.sender_id === currentUserId ? username : otherUser.name,
                        to: msg.sender_id === currentUserId ? otherUser.name : username,
                        message: msg.content,
                        isGroup:false,
                        }));
                        setMessages(transformedMessages);
                    }        
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
                } catch(error){
                    console.error("Unable to send the data to the db", error);
                    }
                setMessages((prev) => [...prev, message]);
                setInput("");
        }
    };

    const filteredMessages = messages.filter(msg =>{
        if (!selectedUser) return false;
        if (selectedUser.isGroup){
                return msg.to  === selectedUser.id.toString() && msg.isGroup;
        } else {
            const msgUser = msg.user?.trim()?.toLowerCase() || "";
            const msgTo = msg.to?.trim()?.toLowerCase() || "";
            const currentUser = username?.trim()?.toLowerCase()  || "";
            const selectedName = selectedUser.name?.trim()?.toLowerCase() || "";
            return (
                (msgUser === selectedName && msgTo  === currentUser ) || 
                (msgUser === currentUser && msgTo === selectedName)  || 
                (msgUser === selectedName && msgTo === selectedName) ||
                (msgUser === currentUser && msgTo === currentUser)
                );
            }
        });

    const handleLogout = () => {
        if (socket.current){
            socket.current.close();
        }
        onLogout();
    }
        
    return (
    

    <div className ="flex h-screen bg-gray-100">
        <div className = "flex flex-1 max-w-7xl mx-auto bg-white shadow-xl rounded-lg overflow-hidden">
                <SideBar 
                    selectedUser = {selectedUser}  
                    setSelectedUser = {setSelectedUser} 
                />
                <div className ="flex-1 flex flex-col" >
                    <ChatWindow 
                        messages = {filteredMessages}
                        input = {input}
                        setInput = {setInput}
                        sendMessage = {sendMessage}
                        selectedUser = {selectedUser}
                    />
                </div>
        </div>

        <div className = "fixed top-4 right-4 z-10">
            <div className = "relative">
                <button 
                    onClick = {() => setShowUserMenu(!showUserMenu)}
                    className = "flex items-center space-x-2 bg-white rounded-full px-4 py-2 shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-200">
                    <div className = "w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex        items-center justify-center">
                        <User className = "w-4 h-4 text-white"/>
                    </div>
                    <span className = "text-sm font-medium text-gray-700 max-w-32 truncate">
                            {user.name || user.email} 
                    </span>
                </button>

                <div className = "absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-20">
                    <div className = "px-4 py-2 border-b border-gray-100">
                        <p className="text-sm font-medium text-gray-900">
                            {user.name || 'Anonymous'}
                        </p>
                        <p className="text-xs text-gray-500">
                                {user.email}
                        </p>
                    </div>

                    <button className = "flex items-center space-x-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200">
                            <Settings className="w-4 h-4" />
                            <span>Settings</span>
                    </button>
                    <button
                        onClick={handleLogout}
                        className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors duration-200"
                    >
                        <LogOut className="w-4 h-4" />
                        <span>Logout</span>
                    </button>
                </div>
                    {/* onClick = {onLogout}>Logout</button> */}
            </div>
        </div>

            {showUserMenu && (
                <div className="fixed inset-0 z-0" onClick={() => setShowUserMenu(false)}/>
            )}
    </div>

    );
};

export default ChatLayout;
