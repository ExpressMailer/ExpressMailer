import React from 'react'
import { Avatar } from '@material-ui/core'
// import styles from './EmailRow.module.css';
// import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from "react-redux";
import { selectChat } from '../../features/chatSlice';
import { selectUser } from '../../features/userSlice';
import styles from '../SendChat/SendChat.module.css';

function SidebarChatrecent({ id, 
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

        // history.push("/mail");
    };

    return (
        <div className={styles.sidebar_features}>  
            <div className={styles.sidebar_chatavatar}>
                <Avatar src={user?.photoUrl} />     
            </div>   
            <div className={styles.sidebar_chatname}>
                Tushar Bapecha 
            </div>
                        {/* <div className={styles.sidebar_chatname_1}>Tushar</div> */}
            <div className={styles.sidebar_chatfunctions}>
                <IconButton>                                        
                    <ChatIcon onClick={() => dispatch(openSendChat('rugved.bongale@somaiya.edu'))}/>
                </IconButton>
                <IconButton onClick={() => history.push('/meet/single/rugvedpb@gmail.com')}>
                    <DuoIcon />
                </IconButton>
            </div>
        </div>
    )
}


export default AllChats


// {recentChatpersons.map(({id,data:{from,message,timestamp,to},recents:{email, displayName, photoUrl}}) => {
//     return