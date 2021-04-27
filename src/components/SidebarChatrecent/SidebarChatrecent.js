import React from 'react'
import { Avatar } from '@material-ui/core'
// import styles from './EmailRow.module.css';
import { useHistory } from 'react-router-dom';
import { useDispatch} from "react-redux";
import styles from '../Sidebar/Sidebar.module.css';
import { IconButton } from '@material-ui/core';
import ChatIcon from "@material-ui/icons/Chat";
import { openSendChat } from '../../features/chat';
import DuoIcon from "@material-ui/icons/Duo";

function SidebarChatrecent({ displayName, email, photoUrl }) 
{
    const history = useHistory();
    const dispatch = useDispatch();

    return (
        <div className={styles.sidebar_features}>  
            <div className={styles.sidebar_chatavatar}>
                <Avatar src={photoUrl} />     
            </div>    
            <div className={styles.sidebar_chatname}>
                {displayName}
            </div>
            <div className={styles.sidebar_chatfunctions}>
                <IconButton>                                        
                    <ChatIcon onClick={() => dispatch(openSendChat(email))}/>
                </IconButton>
                <IconButton onClick={() => history.push('/meet/single/' + email)}>
                    <DuoIcon />
                </IconButton>
            </div>
        </div>
    )
}


export default SidebarChatrecent