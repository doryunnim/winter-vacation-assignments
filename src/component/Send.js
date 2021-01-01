import { dbService, storageService } from "fbase";
import React, { useState } from "react";
import "../css/home.css";
import "../css/send.css";

const Send = ({ sendObj, isOwner }) =>{
    const [edit, setEdit] = useState(false);
    const [newText, setNewText] = useState(sendObj.text);
    const onDeleteClick = async () =>{
        const ok = window.confirm("delete??");
        if(ok){
            await dbService.doc(`mycrud/${sendObj.id}`).delete();
            if(sendObj.fileUrl !== "") await storageService.refFromURL(sendObj.fileUrl).delete();
        }
    }
    const toggleEditing = () => setEdit((prev)=> !prev);
    const onSubmit = (event) => {
        event.preventDefault();
        dbService.doc(`mycrud/${sendObj.id}`).update({
            text:newText
        })
        setEdit(false);
    }
    const onChange = (event) => {
        const{target:{value},
        } = event;
        setNewText(value);
    }
    return (
    <div>
        {
            edit ? (
                <>
                    <form onSubmit={onSubmit}>
                        <textarea value={newText} onChange={onChange} placeholder="Enter something funny." className="textarea" name="text" rows="4"></textarea>  
                        <div className="deUp">
                            <button className="homeBtn btn-2 formBtn btn-deUp" type="submit" >update</button>
                            <button className="homeBtn btn-2 formBtn btn-deUp" onClick={toggleEditing}>Cancel</button>
                        </div>
                    </form>
                </>
            ) : (
                <>  
                    <div className="message">
                        <p className="message-text">{sendObj.text}</p>
                    </div>
                    {sendObj.fileUrl != "" && <img className="message-img" src={sendObj.fileUrl} width="100px" height="100px" />}
                    {isOwner && (
                    <>
                        <div className="deUp">
                            <button className="homeBtn btn-2 btn-deUp" onClick={toggleEditing}>Edit</button>
                            <button className="homeBtn btn-2 btn-deUp" onClick={onDeleteClick}>Delete</button>
                        </div>
                    </>
                    )}
                </>
            )
        }
    </div>
)}

export default Send;