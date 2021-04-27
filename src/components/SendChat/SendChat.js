import React, { useEffect, useState } from 'react';
import styles from './SendChat.module.css';
import CloseIcon from "@material-ui/icons/Close";
import { useDispatch, useSelector } from 'react-redux';
import { closeSendChat, selectSendChatRecipientmail } from '../../features/chat';
import { auth, db } from '../../firebase';
import firebase from 'firebase'
import { generateRoomName } from '../../utilities/common';
import SendIcon from '@material-ui/icons/Send';
import ScrollToBottom from 'react-scroll-to-bottom';
import DuoIcon from "@material-ui/icons/Duo";
import { decrypt,encrypt } from '../../utilities/crypt'
import 'react-toastify/dist/ReactToastify.css';

function SendChat() {

    const recipient_mail = useSelector(selectSendChatRecipientmail);
    // const { register, handleSubmit, watch, errors } = useForm();
    const dispatch = useDispatch();

    const [chatmsg, setChatmsg] = useState('')
    
    // check which is lexicographically bigger and set docNAme accordingly
    var docName;
    if(auth.currentUser.email < recipient_mail){
        docName = auth.currentUser.email + '-' + recipient_mail;
    }
    else{
        docName = recipient_mail + '-' + auth.currentUser.email;
    }
    
    async function getUserByMail(mail){
        let snapshot = await db.collection('users').where('email','==',mail).limit(1).get()
        let user = snapshot.docs.length == 0 ? null : snapshot.docs.map(doc => ({
            id: doc.id,
            data: doc.data()
        }))[0]
        return user
    }

    function updateRecentChatArray(user,recipientUser){
        let currentRecentlyArray = user.data.recentlychatedwith || []
        console.log('currentRecentlyArray')
        console.log(currentRecentlyArray)

        let updatedArray = currentRecentlyArray
        // 3. exclude recipient_mail's object from array
        updatedArray = updatedArray.filter(el => el.email !== recipientUser.data.email)

        // 4. Add recipientUser at index 0
        updatedArray = [{
            id: recipientUser.id        ,
            email: recipientUser.data.email,
            displayName: recipientUser.data.displayName,
            photoUrl: recipientUser.data.photoUrl
        },...updatedArray]

        console.log('updatedArray')
        console.log(updatedArray)

        //5. Update user's recently chat array in db
        db.collection('users')
        .doc(user.id)
        .update({
            recentlychatedwith: updatedArray
        })
        .then(() => console.log('recent array update successful for sender'))
        .catch(e => console.log(JSON.stringify(e)))
    }
        
    const onSubmit =  async () => {

        // add chat to document 
        db.collection('echats')
        .doc(docName)
        .collection('chats').add({
            to: recipient_mail,
            from: auth.currentUser.email,
            message: encrypt(chatmsg, generateRoomName(auth.currentUser.email,recipient_mail)),
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        })

        // 1. get user from db
        let user = await getUserByMail(auth.currentUser.email)

        // 2. Get recipient user
        let recipientUser = await getUserByMail(recipient_mail)

        updateRecentChatArray(user,recipientUser)
        updateRecentChatArray(recipientUser,user)

        setChatmsg('')
    }

    const [chats,setChats] = useState([])

    useEffect(() => {
        db.collection('echats')
        .doc(docName)
        .collection('chats')
        .orderBy('timestamp').onSnapshot(snapshot => {
            setChats(snapshot.docs.map(doc => ({
                id: doc.id,
                data: doc.data()
            })))
        })
    },[recipient_mail])

    return <div style={{
            height:"350px",
            position:"absolute",
            bottom:"10px",
            right:"50px",
            backgroundColor:"white",
            width:"250px",
            boxShadow: "0px 5px 7px 8px rgba(0,0,0,0.24)"
        }}>
            {/* {chats.map(({id,data:{from,message,timestamp,to}}) => {
            return <> */}
            <div style={{
                    backgroundColor:"#404040",
                    // height:"10%",
                    padding:"5px"
                }}>
                    <div style={{
                        width:"100%",
                        color:"white",
                        position:"relative",
                        display:'flex',
                        justifyContent:'space-between',
                        alignItems:"center"
                    }}
                    >
                        <div style={{ flex:0.85 }}> 
                            {recipient_mail} 
                        </div>
                        <div>
                            <DuoIcon 
                                className={styles.sendChat__close} 
                                onClick={() => dispatch(closeSendChat())}
                            />
                            <CloseIcon 
                                className={styles.sendChat__close} 
                                onClick={() => dispatch(closeSendChat())}
                            />
                        </div>
                    </div>
                </div>
                <div style={{
                    height:"80%",
                }}>
                    <ScrollToBottom  className={styles.scrollClass}>
                        {chats.map(({id,data:{from,message,timestamp,to}}) => {
                            return <>
                                <div style={{
                                    maxWidth:"80%",
                                    padding:"10px",
                                    marginTop:"10px",
                                    backgroundColor:"#f2f2f2",
                                    float: from === auth.currentUser.email ? "right" : "left",
                                    clear:"both"
                                }}>
                                    {decrypt(message, generateRoomName(auth.currentUser.email,recipient_mail))}
                            </div><br></br>
                            </>
                        })}
                    </ScrollToBottom >
                </div>
                <div style={{
                    height:"10%",
                    width:"100%"
                }}>
                    <div style={{}}>
                        <hr></hr>
                        <input 
                            onKeyPress={(e) => {
                                if(e.key == 'Enter'){
                                    onSubmit()
                                }
                            }}
                            name="chatMsgField"
                            onChange={(e) => setChatmsg(e.target.value)}
                            type="text"
                            value={chatmsg}
                            style={{width:"80%",padding:'5px',outline: "none",border:"none"}}
                        />
                    
                        <div style={{
                                float:"right",
                                padding:"2px"
                            }}>
                                <SendIcon
                                    name="sendChatBtn"
                                    className={styles.sendChat__close} 
                                    onClick={() => onSubmit()}
                                />
                        </div>
                    </div>
                </div>
        </div>;
}

export default SendChat
