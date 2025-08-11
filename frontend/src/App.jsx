
import {useEffect, useState} from "react"

import ChatLayout from "./components/ChatLayout";
import LoginForm from "./components/LoginForm";



function App(){
  const [message, setMessage] = useState("Loading..");
  const [user, setUser] = useState(null);
  

  const onLogin = (userData) => {
      setUser(userData);
  }

  useEffect(() => {
    fetch("http://localhost:8000/")
      .then((res) => res.json())
      .then((data) => setMessage(data.message))
      .catch((err) => setMessage("Error: " + err.message));
  }, []);

  return (
    <>
    <h1>Whatsapp Clone</h1>
    <p>{message}</p>
    {!user? (
      <LoginForm onLogin = {onLogin}/>
    ): (
      <ChatLayout user = {user}/>
    )} 
    </>
  );
}

export default App;