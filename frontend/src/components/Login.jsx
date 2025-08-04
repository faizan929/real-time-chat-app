
import React, {useState} from "react";


const Login = ({ onLogin }) => {
    const [username, setUsername] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        if (username.trim()){  //WHAT IS TRIM 
            onLogin(username.trim());
        }
    };


    return (
        <div className = "flex items-center justify-center min-h-screen bg-gray-100">
            <form
                onSubmit = {handleSubmit}
                className = "bg-white p-8 rounded-2x1 shadow-xl w-full max-w-sm"
            >
                <h2 className = "text-2x1 font-semibold mb-6 text-center">Login</h2>
                <input
                type = "text"
                placeholder = "Enter username"
                className = "w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                value = {username}
                onChange = {(e) => setUsername(e.target.value)}

                />
                
                <button
                    type = "submit"
                    className = "mt-6 w-full bg-blue-600 text-white py-2 rounded-xl hover:bg-blue-700 transition"
                >
                    Login 
                </button>
            </form>
        </div>
    );
};

export default Login;