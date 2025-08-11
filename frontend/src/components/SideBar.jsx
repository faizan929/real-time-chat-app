

import React from "react"
import {useState, useEffect} from "react";

function SideBar({ selectedUser, setSelectedUser }){
    // create the states to manage
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    // hook : useEffect
    useEffect(() => {
        fetch("http://localhost:8000/api/users")
            .then(res => res.json())
            .then(data => {
                setUsers(data);
                setLoading(false);
            })
            .catch(err => {
                console.error("Failed to fetch users:", err);
                setLoading(false);
            });
    }, []);  // empty dependency: run once on mount
    if (loading) {
        return (
            <p>Loading users...</p>
        )
    }
    return (
       <div>
        <h2>Users</h2>
        <ul>
            {users.map(user => (
                <li key = {user.id}
                    onClick = {() => setSelectedUser(user.name)}
                    style = {{
                        cursor : "pointer",
                        fontWeight : user.name === selectedUser ? "bold" : "normal"
                    }}
                >
                    {user.name}
                </li>
            ))}
        </ul>
        
       </div>
    );
}


export default SideBar;