
import React from "react";

function ChatLayout() {
    return (
        <div className = "flex h-screen">
            {/*sidebar*/}
            <div className = "w-1/4 bg-gray-100 p-4 border-r">
                <h2 className = "text-lg font-semibold mb-4">Chats</h2>
                <ul>
                    <li className = "mb-2 p-2 bg-white rounded shadow cursor-pointer">Faizan</li>
                    <li className = "mb-2 p-2 bg-white rounded shadow cursor-pointer">Aman</li>
                    <li className = "mb-2 p-2 bg-white rounded shadow cursor-pointer">Humaira</li>
                    <li className = "mb-2 p-2 bg-white rounded shadow cursor-pointer">Simran</li>    
                    <li className = "mb-2 p-2 bg-white rounded shadow cursor-pointer">Sheikh</li> 
                </ul>
            </div>

            {/*CHAT WINDOW*/}
            <div className = "flex-1 flex flex-col">
                {/*HEADER*/}
                <div className = "bg-white p-4 border-b">
                    <h2 className = "text-lg font-semibold">Chat with </h2>
                </div>

                {/*MESSAGES*/}

                <div classsName = "flex-1 p-4 overflow-y-auto bg-gray">
                    <div className = "mb-2 p-2 bg-blue-100 rounded w-max">Hii</div>
                    <div className = "mb-2 p-2 bg-blue-100 rounded w-max self-end">Hello</div>
                </div>

                {/*input box*/}
                <div className = "p-4 border-t bg-white flex">
                    <input 
                        type = "text"
                        placeholder = "Type your message"
                        className = "flex-1 border rounded px-4 py-2 mr-2"
                    />

                    <button className = "bg-blue-500 text-white px-4 px-2 rounded">Send</button>
                </div>
            </div>
        </div>
        
    );
} 

export default ChatLayout;
