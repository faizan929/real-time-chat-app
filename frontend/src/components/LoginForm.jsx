
import React, {useState} from "react";
import {Mail, Lock, User, MessageCircle} from 'lucide-react'

function LoginForm( {onLogin} ) {

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: ''
    });

    const [isRegister, setIsRegister] = useState(true);
    const [isLoading, setIsLoading] = useState(false);

    function handleChange(event){
        // event.target: the thing that triggered the change
        const {name, value} = event.target;
        setFormData( prev => ({
            ...prev,     
            [name]: value 
        }));
    }

    const handleSubmit = async (event) => {
        event.preventDefault();              
        try{
            const response = await fetch("https://creative-perfection-production.up.railway.app/api/register", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),  
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.log("Registration failed:", errorData.detail);
                alert(errorData.detail);
                return;    
            } 

            const data = await response.json()
            onLogin(data);
            console.log("Registration Successful");    
        } catch(error){
            console.error("Something went wrong", error);
        }
    };

    const handleLogin = async (event) => {
        event.preventDefault();
        try{
            const response = await fetch("https://creative-perfection-production.up.railway.app/api/login",{
                method: 'POST',
                headers: {
                    'Content-Type' :"application/json",
                }, 
                body: JSON.stringify({
                    email : formData.email,
                    password: formData.password
                }),
            });
            if (!response.ok){
                alert("Invalid Credentials");
                return;
            }
            
            const data = await response.json()
            onLogin(data);
            console.log("Login successful");

        }catch(error){
            console.error("Login error", error)
            alert("Login Failed, Please try again later.")
        } finally{
            setIsLoading(false);
        }
    };
      
    
return(
    <div className = "min-h-screen bg-gradient-to-br from-blue-500 via-purple-600 to-indigo-700 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8">
            <div className = "text-center mb-8">
                <div className = "bg-gradient-to-r from-blue-500 to-purple-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <MessageCircle className="w-8 h-8 text-white" />
                </div>
                <h1 className = "text-3xl font-bold text-gray-800">
                    {isRegister ? 'Create Account' : 'Welcome Back'}
                </h1>
                <p className = "text-gray-600 mt-2">
                        {isRegister 
                            ? 'Join our chat community today' 
                            : 'Sign in to continue chatting'
                        }
                </p>
            </div>

        <form onSubmit = {isRegister ? handleSubmit : handleLogin} className = "space-y-6">
            {isRegister && (
                <div className = "relative">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Full Name 
                    </label>
                    <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                name="name"
                                type="text"
                                placeholder="Enter your full name"
                                value={formData.name}
                                onChange={handleChange}
                                required={isRegister}
                                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                            />
                    </div>
                </div>
            )}
        
            <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address
                </label>
                <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                        name="email"
                        type="email"
                        placeholder="Enter your email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    />
                </div>
            </div>

            <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                        Password
                </label>
                <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                        name="password"
                        type="password"
                        placeholder="Enter your password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                        className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    />
                </div>
            </div>
            <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 transform hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed"
            >
                {isLoading ? (
                    <div className="flex items-center justify-center space-x-2">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                            <span>{isRegister ? 'Creating Account...' : 'Signing In...'}</span>
                        </div>
                    ) : (
                        <span>{isRegister ? 'Create Account' : 'Sign In'}</span>
                )}
            </button>

            <div className="text-center pt-4 border-t border-gray-200">
                <p className="text-gray-600">
                    {isRegister ? 'Already have an account?' : "Don't have an account?"}
                </p>
                <button
                    type="button"
                    onClick={() => setIsRegister(!isRegister)}
                    disabled={isLoading}
                    className="mt-2 text-blue-600 hover:text-blue-800 font-medium transition-colors duration-200 disabled:opacity-50"
                >
                    {isRegister ? 'Sign In Instead' : 'Create Account'}
                </button>
            </div>
        </form>
                
        <div className="mt-8 pt-6 border-t border-gray-200 text-center">
            <p className="text-xs text-gray-500">
                By continuing, you agree to our Terms of Service and Privacy Policy
            </p>
        </div>
    </div>
</div>
    )
}

 
export default LoginForm



