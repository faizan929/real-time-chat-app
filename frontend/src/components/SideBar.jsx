

import React from "react"
import {useState, useEffect} from "react";

function SideBar({ selectedUser, setSelectedUser }){
    // create the states to manage
    const [users, setUsers] = useState([]);
    const [groups, setGroups] = useState([]);
    const [loadingUsers, setLoadingUsers] = useState(true);
    const [loadingGroups, setLoadingGroups] = useState(true);
    const [groupName, setGroupName] = useState("");
    const [selectedMembers, setSelectedMembers] = useState([])


    // hook : useEffect
    useEffect(() => {
        fetch("http://localhost:8000/api/users")
            .then(res => res.json())
            .then(data => {
                setUsers(data);
                setLoadingUsers(false);
            })
            .catch(err => {
                console.error("Failed to fetch users:", err);
                setLoadingUsers(false);
            });


        fetch("http://localhost:8000/api/groups")
            .then((res) => res.json())
            .then((data) => {
                const groupsWithFlag = data.map((group) => ({...group, isGroup : true }));
                setGroups(groupsWithFlag);
                setLoadingGroups(false);
            })
            .catch( (err) => {
                console.log("Error fetching groups", err)
                setLoadingGroups(false);
            });
    }, []);  
    if (loadingUsers || loadingGroups) {
        return (
            <p>Loading...</p>
        )
    }


    const isSelected = (item) => {
        if(!selectedUser) return false;
        return selectedUser.id === item.id && selectedUser.isGroup === item.isGroup;
    }



    const createGroup = () => {
        if(!groupName.trim()) return;

        fetch("http://localhost:8000/api/groups", {
            method : 'POST',
            headers : {
                "Content-Type" : "application/json"
            },
            body : JSON.stringify({ 
                name : groupName,
                member_ids : selectedMembers 
            }),
        })

    .then(res => {

       if (!res.ok) {
            return res.json().then(err => Promise.reject(err.detail || "Failed to create group"))
        }
        return res.json()
    })
        .then(newGroup => {
            setGroups([...groups, {...newGroup, isGroup: true}]);
            setGroupName("");
            setSelectedMembers([]);
        })
        .catch(err => alert(err.message));
    }


    const toggleMember = (id) => {
        if (selectedMembers.includes(id)) {
            setSelectedMembers(selectedMembers.filter(m => m !== id));
        }else{
            setSelectedMembers([...selectedMembers, id]);
        }
    };

    return (
       <div style={{ padding: 10, width: 250, borderRight: "1px solid #ddd" }} >
        <h2>Users</h2>
        <ul  style={{ listStyle: "none", paddingLeft: 0 }}>
            {users.map(user => (
                <li 
                    key = {user.id}
                    onClick = {() => setSelectedUser(user)}
                    style = {{
                        cursor : "pointer",
                        fontWeight : isSelected(user)? "bold" : "normal",
                        padding : "5px 0",
                    }}
                >
                    {user.name}
                </li>
            ))}
        </ul>

        <h2>Groups</h2>
        <ul style = {{ listStyle: "none", paddingLeft: 0}}>
            {groups.map((group) => (
                <li 
                    key = {group.id}
                    onClick = {() => setSelectedUser(group)}
                    style = {{
                        cursor: "pointer",
                        fontWeight : isSelected(group) ? "bold" :"normal",
                        padding : "5px 0",
                        color : "blue",
                    }}
                >
                    {group.name}
                </li>
            ))}
        </ul>
        <div>
  <h3>Select Members</h3>
  {users.map(user => (
    <label key={user.id} style={{display: "block"}}>
      <input 
        type="checkbox" 
        checked={selectedMembers.includes(user.id)} 
        onChange={() => toggleMember(user.id)} 
      />
      {user.name}
    </label>
  ))}
</div>


 {/* New UI for creating group */}
      <div style={{ marginTop: 10 }}>
        <input
          type="text"
          placeholder="New group name"
          value={groupName}
          onChange={e => setGroupName(e.target.value)}
          style={{ width: "70%", marginRight: 5 }}
        />
        <button onClick={createGroup}>Create Group</button>
      </div>

        
        
       </div>
    );
}


export default SideBar;