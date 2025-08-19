

import React, {useState, useEffect} from "react";
import {Users, User, Plus, Search, Check, X} from 'lucide-react';

function SideBar({ selectedUser, setSelectedUser }){
  
    const [users, setUsers] = useState([]);
    const [groups, setGroups] = useState([]);
    const [loadingUsers, setLoadingUsers] = useState(true);
    const [loadingGroups, setLoadingGroups] = useState(true);
    const [groupName, setGroupName] = useState("");
    const [selectedMembers, setSelectedMembers] = useState([]);
    const [showCreateGroup, setShowCreateGroup] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");

    const API_URL = import.meta.env.VITE_URL;
    useEffect(() => {
        fetch(`${API_URL}/users`)
            .then(res => res.json())
            .then(data => {
                setUsers(data);
                setLoadingUsers(false);
            })
            .catch(err => {
                console.error("Failed to fetch users:", err);
                setLoadingUsers(false);
            });


        fetch(`${API_URL}/groups`)
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
    }, [API_URL]);  

    if (loadingUsers || loadingGroups) {
        return (
            <div className="w-80 bg-white border-r border-gray-200 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
                    <p className="mt-2 text-gray-500">Loading...</p>
                </div>
            </div>
        );
    }

    const isSelected = (item) => {
        if(!selectedUser) return false;
        return selectedUser.id === item.id && selectedUser.isGroup === item.isGroup;
    }

    const createGroup = () => {
        if(!groupName.trim()) return;

        fetch(`${API_URL}/groups`, {
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
            setShowCreateGroup(false);
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
    
    const filteredUsers = users.filter(user => 
        user.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    const filteredGroups = groups.filter(groups => 
        groups.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="w-80 bg-white border-r border-gray-200 flex flex-col h-full">
            <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-blue-500 to-purple-600">
                <h1 className="text-xl font-bold text-white">Messages</h1>
            </div>

            <div className="p-4 border-b border-gray-200">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                        type="text"
                        placeholder="Search conversations..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                </div>
            </div>


            <div className="flex-1 overflow-y-auto">
                {/* Users Section */}
                <div className="p-4">
                    <div className="flex items-center justify-between mb-3">
                        <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
                            Direct Messages
                        </h2>
                        <User className="w-4 h-4 text-gray-500" />
                    </div>
                    
                    <div className="space-y-1">
                        {filteredUsers.map(user => (
                            <div
                                key={user.id}
                                onClick={() => setSelectedUser(user)}
                                className={`flex items-center space-x-3 p-3 rounded-lg cursor-pointer transition-all duration-200 hover:bg-gray-50 ${
                                    isSelected(user) ? 'bg-blue-50 border-l-4 border-blue-500' : ''
                                }`}
                            >
                                <div className="flex-shrink-0">
                                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                                        <User className="w-4 h-4 text-blue-600" />
                                    </div>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className={`text-sm font-medium truncate ${
                                        isSelected(user) ? 'text-blue-700' : 'text-gray-900'
                                    }`}>
                                        {user.name}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>


            <div className="p-4 border-t border-gray-100">
                    <div className="flex items-center justify-between mb-3">
                        <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
                            Group Chats
                        </h2>
                        <button
                            onClick={() => setShowCreateGroup(!showCreateGroup)}
                            className="p-1 rounded hover:bg-gray-100 transition-colors duration-200"
                        >
                            <Plus className="w-4 h-4 text-gray-500" />
                        </button>
                    </div>
                    
                    <div className="space-y-1">
                        {filteredGroups.map((group) => (
                            <div
                                key={group.id}
                                onClick={() => setSelectedUser(group)}
                                className={`flex items-center space-x-3 p-3 rounded-lg cursor-pointer transition-all duration-200 hover:bg-gray-50 ${
                                    isSelected(group) ? 'bg-purple-50 border-l-4 border-purple-500' : ''
                                }`}
                            >
                                <div className="flex-shrink-0">
                                    <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                                        <Users className="w-4 h-4 text-purple-600" />
                                    </div>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className={`text-sm font-medium truncate ${
                                        isSelected(group) ? 'text-purple-700' : 'text-gray-900'
                                    }`}>
                                        {group.name}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

        {showCreateGroup && (
                    <div className="p-4 border-t border-gray-200 bg-gray-50">
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <h3 className="text-sm font-semibold text-gray-700">Create New Group</h3>
                                <button
                                    onClick={() => setShowCreateGroup(false)}
                                    className="p-1 rounded hover:bg-gray-200 transition-colors duration-200"
                                >
                                    <X className="w-4 h-4 text-gray-500" />
                                </button>
                            </div>
                            
                            <input
                                type="text"
                                placeholder="Group name"
                                value={groupName}
                                onChange={e => setGroupName(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                            />
                            
                            <div>
                                <p className="text-xs font-medium text-gray-600 mb-2">Select Members:</p>
                                <div className="max-h-32 overflow-y-auto space-y-1">
                                    {users.map(user => (
                                        <label key={user.id} className="flex items-center space-x-2 p-1 rounded hover:bg-gray-100 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={selectedMembers.includes(user.id)}
                                                onChange={() => toggleMember(user.id)}
                                                className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                                            />
                                            <span className="text-sm text-gray-700">{user.name}</span>
                                            {selectedMembers.includes(user.id) && (
                                                <Check className="w-3 h-3 text-purple-600" />
                                            )}
                                        </label>
                                    ))}
                                </div>
                            </div>
                            
                            <button
                                onClick={createGroup}
                                disabled={!groupName.trim() || selectedMembers.length === 0}
                                className="w-full bg-purple-500 hover:bg-purple-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white py-2 px-4 rounded-lg text-sm font-medium transition-colors duration-200"
                            >
                                Create Group
                            </button>
                        </div>
                    </div>
        
                                )}
            </div>
        </div>
    );
}


export default SideBar;