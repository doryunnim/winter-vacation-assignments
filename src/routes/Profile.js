import React, { useEffect, useState } from "react";
import { authService, dbService } from "fbase";

export default ({userObj}) => {
    // const getMyMessage = async() =>{
    //     const message = await dbService.collection('mycrud').where("creatorId", "==", userObj.uid).orderBy("createdAt").get();
    //     console.log(message.docs.map((doc)=>doc.data()));
    // }
    const [display, setDisplay] = useState("");
    
    const onChange = (event) =>{
        const { target: {value},} = event;
        setDisplay(value);
    }
    const onSubmit = async (event) => {
        event.preventDefault();
        if(display !== ""){
            userObj.updateProfile({
                displayName: display
            })
        }
    }
    useEffect(()=>{
        // getMyMessage();
    },[])
    return (
        <>
            <div>
                <form onSubmit={onSubmit}>
                    <input onChange={onChange}type="text" value={display} placeholder="Please type a user name...."></input>
                    <button className="btn" type="submit">SAVE</button>
                </form>
            </div>
        </>
    )
}