import { authService, firebaseInstance } from "fbase";
import React, { useState } from "react";
import "../css/auth.css"


const Auth = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [newAccount, setNewAccount] = useState(true);
    const [error, setError] = useState("");
    const onChange = (event) => {
        const {target:{name, value}} = event;
        if(name === "email"){
            setEmail(value)
        }else if (name==="password"){
            setPassword(value)
        }
    };
    const onSubmit = async (event) =>{
        event.preventDefault();
        let data;
        try{
            if(newAccount){
                data = await authService.createUserWithEmailAndPassword(
                    email, password
                )
            }else{
                data =await authService.signInWithEmailAndPassword(email,password);
            }
        }catch(error){
            setError(error.message)
        }
    }
    const toggleAccount = () => setNewAccount((prev)=> !prev);
    const onSocialClick = async (event) => {
        const {
            target:{name},
        } = event;
        let provider;
        if(name === "google"){
            provider = new firebaseInstance.auth.GoogleAuthProvider();
        };
        await authService.signInWithPopup(provider);
    }
    return (
        <div className="container">
            <div className="login_box">
                <h1 className="form-signin-heading">Welcome</h1>
                <form onSubmit={onSubmit} className="form_login">
                    <input name="email" type="email" placeholder="Email" value={email} onChange={onChange} className="input email" required/>
                    <input name="password" type="password" placeholder="Password" value={password} onChange={onChange} className="input password" required/>
                    <button type="submit" className="btn btn_sign">{newAccount ? "Sign Up" : "Sign In"}</button>
                </form>
                <h3 onClick={toggleAccount} className="sign-toggle">{newAccount ? "Sign In" : "Sign Up"}</h3>
                <div>
                    <button name="google" onClick={onSocialClick} className="btn btn_google">sign in with Google
                    </button>
                    {error}
                </div>
            </div>
        </div>
    )
}
export default Auth