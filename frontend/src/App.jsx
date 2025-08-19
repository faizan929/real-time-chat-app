
import {useEffect, useState} from "react"

import ChatLayout from "./components/ChatLayout";
import LoginForm from "./components/LoginForm";




function App(){
  const [message, setMessage] = useState("Loading..");
  const [user, setUser] = useState(null);
  const [isCheckingUser, setIsCheckingUser] =  useState(true);
  
  const API_URL = import.meta.env.VITE_URL;

  useEffect(() => {
    const savedUser = localStorage.getItem('whatsapp_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));  /// convert string back t object

    }
    setIsCheckingUser(false);   // done checking
  }, []);   //runs only when the app starts
  



  useEffect(() => {
    fetch(`${API_URL}/health`)
      .then((res) => res.json())
      .then((data) => setMessage(data.message))
      .catch((err) => setMessage("Error: " + err.message));
  }, [API_URL]);




  const onLogin = (userData) => {
      console.log("onlogin called with", userData)
      localStorage.setItem('whatsapp_user', JSON.stringify(userData));
      setUser(userData);
  }


  const onLogout = () => {
    localStorage.removeItem("whatsapp_user");
    setUser(null);
  }



  return (
    <div> 
      <p>{message}</p>
      {isCheckingUser? (
        <p>Checking saved login...</p>

        ): !user ? (
          <div>
            <LoginForm onLogin = {onLogin} />
          </div>
        ): (
        <div>
          <ChatLayout user = {user} onLogout = {onLogout} />
        </div>
        )

      }

    </div>
  );
}

export default App;