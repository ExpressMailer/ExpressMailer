import React from 'react'
import { Avatar } from '@material-ui/core'
// import styles from './EmailRow.module.css';
// import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from "react-redux";
import { selectChat } from '../../features/chatSlice';
import { selectUser } from '../../features/userSlice';
import styles from '../SendChat/SendChat.module.css';

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

        // history.push("/mail");
    };

    return (
        <div onClick= {openChats} >
            <div className={styles.sendChat__chats}>
                <Avatar src={user?.photoUrl} /> 
                <h4 className="">
                    {title}
                </h4>                
            </div>
            <p className={styles.sendChat__chattime}>
                    {time}
            </p>
            <div className={styles.sendChat__chats_1}>
                <span className=""> {chatmsg}
                </span>
            </div>

            

        </div>
    )
}


export default AllChats
