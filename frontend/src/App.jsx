
import {useEffect, useState} from "react"
import Login from "./components/Login";
import ChatLayout from "./components/ChatLayout";

function App(){
  const [message, setMessage] = useState("Loading..");
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetch("http://localhost:8000/")
      .then((res) => res.json())
      .then((data) => setMessage(data.message))
      .catch((err) => setMessage("Error: " + err.message));
  }, []);

  return (
    <>
    {!user? (
      <Login onLogin = {(username) => setUser(username)} />
    ): (
      <ChatLayout user={user}/>
    )}
    </>
  );
}

export default App;