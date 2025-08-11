
import {useEffect, useState} from "react"

import ChatLayout from "./components/ChatLayout";
import LoginForm from "./components/LoginForm";



function App(){
  const [message, setMessage] = useState("Loading..");
  const [user, setUser] = useState(null);
  const [isCheckingUser, setIsCheckingUser] =  useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem('whatsapp_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));  /// convert string back t object

    }
    setIsCheckingUser(false);   // done checking
  }, []);   //runs only when the app starts
  



  useEffect(() => {
    fetch("http://localhost:8000/")
      .then((res) => res.json())
      .then((data) => setMessage(data.message))
      .catch((err) => setMessage("Error: " + err.message));
  }, []);




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
    <>
      <h1>Whatsapp Clone</h1>
      <p>{message}</p>
      {isCheckingUser? (
        <p>Checking saved login...</p>

        ): !user ? (
          <div>
          <LoginForm onLogin = {onLogin} />
          {/* <p>arr u working</p> */}
          </div>
        ): (
        <div>
          <ChatLayout user = {user} onLogout = {onLogout} />
          {/* <p>are u geting rendered</p> */}
        </div>
        )

      }

    </>
  );
}

export default App;