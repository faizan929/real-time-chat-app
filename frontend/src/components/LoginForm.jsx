

// useState is a react hook that lets one to manage the states
// simply useState is like a box where one can store value and can change
// important property : it triggers re-render

import React, {useState} from "react";
// import {useNavigate} from "react-router-dom";


//  loginform as == react functional component

// const navigate = useNavigate;


function LoginForm( {onLogin} ) {
    // set up state
    //formData is an object that holds the value 
    //setFormData updates the value (i.e., formData object)
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: ''
    });


    const [isRegister, setIsRegister] = useState(true)

    function handleChange(event){
        //event.target : the thing that triggered the change 
        const {name, value} = event.target;
        setFormData( prev => ({
            ...prev,           //previous version of formData before updating it
            // it allows to update only one part of the formData , lets say email one wants to change
            // ... is a spread operator, it says copy everything that was already in formData
            [name]: value 
        }));

    }

    const handleSubmit = async (event) => {
        event.preventDefault();              //// this stops the browser from refreshing the page 
        // when the form is submitted

        try{
            const response = await fetch("http://127.0.0.1:8000/register", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),  
            });
            // uper vala response thk huwa to
            if (!response.ok) {
                // backend will send the message "user already registered"
                const errorData = await response.json();
                console.log("Registration failed:", errorData.detail);
                alert(errorData.detail);
                return;
                
            } 

            // navigate('/ChatLayout ');
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
            const response = await fetch("http://127.0.0.1:8000/login",{
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
        }
    };
      
    
    return(
        <>


    <form onSubmit = {isRegister ? handleSubmit : handleLogin}>
        {isRegister && (
            <input 
                name = "name"
                type = "text"
                placeholder = "Enter your name"
                value = {formData.name}
                onChange = {handleChange}
            />
        )}
      

        <input 
            name = "email"
            type = "email"
            placeholder = "Enter your email"
            value = {formData.email}
            onChange = {handleChange}
        />

        <input
            name = "password"
            type = "password"
            placeholder = "Password"
            value = {formData.password}
            onChange = {handleChange} 
        />
        
        <button type = "submit">
            {isRegister ? "Register" : "Login"}
        </button>

        <button type = "button" onClick = {() => setIsRegister(!isRegister)}>
            Switch to {isRegister ? "Login" : "Register"}
        </button>
        </form>
      
        </>
    )
}

 
export default LoginForm



