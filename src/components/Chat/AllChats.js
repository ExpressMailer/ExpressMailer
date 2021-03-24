import React from 'react'
import { Avatar } from '@material-ui/core'
// import styles from './EmailRow.module.css';
// import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from "react-redux";
import { selectChat } from '../../features/chatSlice';
import { selectUser } from '../../features/userSlice';
import styles from '../SendChat/SendChat.module.css';

import SendIcon from '@material-ui/icons/Send';
import ScrollToBottom from 'react-scroll-to-bottom';
import DuoIcon from "@material-ui/icons/Duo";

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function AllChats({ id, 
                    title,
                    chatmsg,
                    time, }) 
{
    // const history = useHistory();
    const dispatch = useDispatch();

    const user = useSelector(selectUser);

    const openChats = () => {
        dispatch(
            selectChat({
                id, 
                title,
                chatmsg,
                time,
            })
        );

    };

    return (
        <div style={{
            height:"350px",
            position:"absolute",
            bottom:"10px",
            right:"50px",
            backgroundColor:"white",
            width:"250px",
            boxShadow: "0px 5px 7px 8px rgba(0,0,0,0.24)"
        }}>
            
            <div style={{
                backgroundColor:"#404040",
                // height:"10%",
                padding:"5px"
            }}>
                <div style={{
                    width:"100%",
                    color:"white"
                }}
                >
                    {recipient_mail}
                    <div style={{
                        float:"right"
                    }}>
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
                <ScrollToBottom className={styles.scrollClass}>
                    {[1,4,2,6,9,9,2,4,2,6,9,9,2,4].map(chat => {
                        return <>
                        <div style={{
                                maxWidth:"80%",
                                padding:"10px",
                                marginTop:"10px",
                                backgroundColor:"#f2f2f2",
                                float:chat%2 == 0 ? "right" : "left",
                                clear:"both"
                            }}>
                                scrollClassscrollClass scrollClass wajnaw awjdaw dawd nwa dawmdnw ad amwnd 
                        </div><br></br>
                        </>
                    })}
                </ScrollToBottom>
            </div>
            <div style={{
                height:"10%",
                width:"100%"
            }}>
                <div style={{}}>
                    <hr></hr>
                    <input 
                        type="text"
                        style={{width:"80%",padding:'5px',outline: "none",border:"none"}}
                    />
                
                    <div style={{
                            float:"right",
                            padding:"2px"
                        }}>
                            <SendIcon
                                className={styles.sendChat__close} 
                                onClick={() => toast("Wow so easy!")}
                            />
                    </div>
                </div>
            </div>
        </div>
    )
}


export default AllChats


// {recentChatpersons.map(({id,data:{from,message,timestamp,to},recents:{email, displayName, photoUrl}}) => {
//     return