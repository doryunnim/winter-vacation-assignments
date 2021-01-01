import { authService, dbService, storageService } from "fbase";
import React, { useEffect, useState } from "react";
import Send from "component/Send";
import { v4 as uuidv4 } from 'uuid';
import { useHistory } from "react-router-dom";
import "../css/home.css";
import Profile from "routes/Profile";

const Home = ({userObj}) => {
    const [slack, setSlack] = useState("");
    const [slacks, setSlacks] = useState([]);
    const [file, setFile] = useState("");
    useEffect(()=>{
        dbService.collection("mycrud").onSnapshot((snapshot) => {
            const slackArray = snapshot.docs.map(doc => ({id:doc.id, ...doc.data(),}));
            setSlacks(slackArray);
        });
    }, [])
    const onSubmit = async (event) =>{
        if(userObj.uid){
            event.preventDefault();
            let fileUrl = file;
            if(fileUrl !== ""){
                const fileRef = storageService.ref().child(`${userObj.uid}/${uuidv4()}`)
                const res = await fileRef.putString(file, "data_url");
                fileUrl = await res.ref.getDownloadURL();
            }
            const sendObj = {
                text:slack,
                createdAt: Date.now(),
                creatorId: userObj.uid,    
                fileUrl
            }
            await dbService.collection("mycrud").add(sendObj)
            setSlack("");
            setFile("");
        }
    }
    const onChange = (event) =>{
        const { target: {value},} = event;
        setSlack(value)
    }
    const onFileChange = (event) =>{
        const {target: {files},} = event;
        const theFile = files[0];
        const reader = new FileReader();
        reader.onloadend = (finishedEvent) =>{
            const {
                currentTarget: {result},
            } = finishedEvent
            setFile(result)
        }
        reader.readAsDataURL(theFile);
    }
    const onClearFile = () => setFile(null)
    const history = useHistory();
    const onLogOutClick = () => {
        authService.signOut();
        history.push('/');
    }
    return (
        <div>
            <>    
                <button className="homeBtn btn-2 btn-logout" onClick={onLogOutClick}>Log Out</button>
                <h2>{userObj.displayName}님 안녕하세요</h2>
                {/* {
                userObj.displayName ? (
                    <h2>{userObj.displayName}님 안녕하세요</h2>) 
                    : (                
                    <>
                        <Profile userObj={userObj} />
                    </>)
                } */}
                <form onSubmit={onSubmit} className="form-home">
                    <textarea value={slack} onChange={onChange} placeholder="Enter something funny." className="textarea" name="text" rows="4"></textarea>  
                    <div className="fileAndBtn">
                        <label for="file">＋</label>
                        <input id="file" className="file" type="file" onChange={onFileChange}/>
                        <button type="submit" className="homeBtn btn-2 btn-send">SEND</button>
                    </div>
                    {file && (
                        <div>
                            <img className="home-img" src={file} alt="사진" width="50px" height="50px" />
                            <button className="homeBtn btn-2" onClick={onClearFile}>Clear</button>
                        </div>)}
                </form>
                <div>
                    {slacks.map((slack)=>(
                        <Send key={slack.id} sendObj={slack} isOwner={slack.creatorId === userObj.uid} />
                    ))}
                </div>
            </>
        </div>
    )
}
export default Home;