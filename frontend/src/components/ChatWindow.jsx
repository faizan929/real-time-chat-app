

import { useRef, useEffect } from "react";
import {Send, User, Users} from "lucide-react"

function ChatWindow({ messages, input, setInput, sendMessage, selectedUser, user }) {
    const messagesEndRef = useRef(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({behavior: 'smooth'});
    }, [messages])

    const onChange = (e) => setInput(e.target.value);

    const onSubmit = (e) => {
        e.preventDefault();
        sendMessage();
    };

    const handleKeyPress = (e)  => {
        if (e.key === 'Enter' && !e.shiftKey){
            e.preventDefault();
            onSubmit(e);
        }
    }
    
    return (
    <div className="flex flex-col h-full bg-gray-50">
        {selectedUser && (
            <div className="bg-white border-b border-gray-200 px-6 py-4 shadow-sm">
                <div className="flex items-center space-x-3">
                    <div className="flex-shrink-0">
                        {selectedUser.isGroup ? (
                        <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                                <Users className="w-5 h-5 text-purple-600" />
                        </div>
                        ) : (
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                            <User className="w-5 h-5 text-blue-600" />
                        </div>
                        )}
                    </div>
                    <div>
                        <h2 className="text-lg font-semibold text-gray-900">
                            {selectedUser.name}
                        </h2>
                        <p className="text-sm text-gray-500">
                            {selectedUser.isGroup ? 'Group Chat' : 'Private Chat'}
                        </p>
                    </div>
                </div>
            </div>
        )}

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {selectedUser ? (
                messages && messages.length > 0 ? (
                messages.map((msg, idx) => {
                    const isCurrentUser = msg.user === (typeof user === "string" ? user : user?.name);
                        return (
                            <div
                                key={idx}
                                className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
                            >
                                <div
                                    className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg shadow-sm ${
                                        isCurrentUser
                                        ? 'bg-blue-500 text-white rounded-br-none'
                                        : 'bg-white text-gray-800 border rounded-bl-none'
                                        }`}
                                >
                                    {!isCurrentUser && selectedUser.isGroup && (
                                    <div className="text-xs font-medium mb-1 text-gray-600">
                                            {msg.user}
                                    </div>
                                    )}
                                    <div className="break-words">
                                        {msg.message}
                                    </div>
                                </div>
                            </div>
                        );
                })
                ) : (
                <div className="flex items-center justify-center h-full">
                    <div className="text-center">
                        <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                                <User className="w-8 h-8 text-gray-400" />
                        </div>
                        <p className="text-gray-500 text-lg">No messages yet</p>
                        <p className="text-gray-400 text-sm">Start the conversation!</p>
                    </div>
                </div>
                )
        ) : (
            <div className="flex items-center justify-center h-full">
                <div className="text-center">
                    <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Users className="w-10 h-10 text-gray-400" />
                    </div>
                    <p className="text-gray-500 text-xl">Select a user to chat with</p>
                    <p className="text-gray-400 text-sm">Choose from the sidebar to start messaging</p>
                </div>
            </div>
            )
        }
        <div ref={messagesEndRef} />
    </div>



    {selectedUser && (
        <div className="bg-white border-t border-gray-200 p-4">
            <form onSubmit={onSubmit} className="flex items-end space-x-2">
                <div className="flex-1">
                    <textarea
                        value={input}
                        onChange={onChange}
                        onKeyPress={handleKeyPress}
                        placeholder="Type your message..."
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                        rows="1"
                        style={{
                            minHeight: '40px',
                            maxHeight: '120px',
                            height: 'auto'
                        }}
                        onInput={(e) => {
                            e.target.style.height = 'auto';
                            e.target.style.height = e.target.scrollHeight + 'px';
                            }}
                    />
                </div>
            
               <button
                    type="submit"
                    disabled={!input.trim()}
                    className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white p-2 rounded-lg transition-colors duration-200 flex items-center justify-center"
                >
                    <Send className="w-5 h-5" />
                </button>
            </form>
        </div>
        )}
    </div>
    );

};

export default ChatWindow;
