const input = document.getElementById("messageInput");
const messages = document.getElementById("messages");


const socket = new WebSocket("ws://127.0.0.1:8000/ws");
const username = "Sender";

socket.onopen = () => {
    console.log("Connected");

    socket.send(JSON.stringify({
        type: "connect",
        user: username
    }));
};


socket.onmessage = (event) => {

    const data = JSON.parse(event.data);

    console.log("Received:", data);

    const message = document.createElement("p");

    if (data.type === "user_list") {
        message.innerText = "Online users: " + data.users.join(", ");
    }
    else {
        message.innerText = `${data.user}: ${data.message}`;
    }

    messages.appendChild(message);
};


function sendMessage() {

    const text = input.value.trim();

    if (!text) return;


    socket.send(JSON.stringify({
        user: username,
        to: "Receiver",
        message: text
    }));

    input.value = "";
}
