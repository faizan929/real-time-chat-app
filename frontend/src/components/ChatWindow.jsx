



function ChatWindow({ messages, input, setInput, sendMessage, selectedUser }) {

    const onChange = (e) => setInput(e.target.value);
    

    const onSubmit = (e) => {
        e.preventDefault();
        sendMessage();
    };

    
    return (
    <>  
        {/* to enter javascript mode, render message */}
        {selectedUser ? (  
            messages && messages.length > 0 ? (
            messages.map((msg, idx) => (
                <div className = "message-text" key = {idx}>
                    <strong>{msg.user}:</strong> {msg.message}
                </div>
            ))
        ): (
            <div>No message yet.</div>
        )
     ) : (
            <div>Select a user to chat with .</div>
        )}

      



        {selectedUser && (
            <form onSubmit = {onSubmit}>
                <div className = "message-box">
                    <input 
                        type = "text"
                        value = {input}
                        onChange = {onChange}
                        placeholder = "enter your message"
                    />
                </div>
                <button 
                    type = "submit"
                    className = "ml-2 bg-blue-500 text-white px-4 py-2 rounded"
                >Send</button>
        </form>
        )}
    </>
    );

};
export default ChatWindow;
