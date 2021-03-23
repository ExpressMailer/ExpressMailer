import React, { useRef } from 'react';
import { Avatar } from '@material-ui/core'
import styles from './Sidebar.module.css';
import AddIcon from "@material-ui/icons/Add";
import InboxIcon from "@material-ui/icons/Inbox"; 
import { Button, IconButton, Collapse } from '@material-ui/core';
import SidebarOption from '../SidebarOption/SidebarOption';
import StarIcon from "@material-ui/icons/Star";
import AccessTimeIcon from "@material-ui/icons/AccessTime";
import LabelImportantIcon from "@material-ui/icons/LabelImportant";
import NearMeIcon from "@material-ui/icons/NearMe";
import NoteIcon from "@material-ui/icons/Note";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
// import PersonIcon from "@material-ui/icons/Person";
import ChatIcon from "@material-ui/icons/Chat";
import DuoIcon from "@material-ui/icons/Duo";
// import PhoneIcon from "@material-ui/icons/Phone";
import ArrowDropDown from "@material-ui/icons/ArrowDropDown";
import { openSendMessage } from '../../features/mail';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { openSendChat } from '../../features/chat';
import { useState } from 'react';
//temp
import { useSelector } from "react-redux"
import { selectUser } from '../../features/userSlice';

// for modal
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

import { auth, db } from '../../firebase';

function Sidebar() {

    const history = useHistory();
    const dispatch = useDispatch();
    //variable for opening chat window from recent chat person
    const [isOpen, setIsOpen] = useState(false);
    //variable for opening dialogbox for chat with new person
    const [Openchatnew, setOpenchatnew] = useState(false);
    //creating a refernce for TextField Component in dialogbox
    const valueRef = useRef('') 
    // function as it's name says
    const checkIfEmailExists = async (email) => {
        const snapshot = await db.collection('users').where('email','==',email).limit(1).get()
        console.log(snapshot.empty)
        if(snapshot.empty){
            return false
        }
        return true
    }

    // is called when one clicks on start chat in dialog box
    const sendValue = async() => {
        //on clicking button accesing current value of TextField and output it to console
        console.log(valueRef.current.value) 

        // check here if email exist, if exists then open chat window
        const emailExists = await checkIfEmailExists(valueRef.current.value);

        if(emailExists){  
            //close window
            handleClose();
            //open chat window
            dispatch(openSendChat(valueRef.current.value));
        }
        else{
            console.log(valueRef.current.value + " doesn't exist.");
            //alert showing email doesnt exists
            alert(valueRef.current.value + " doesn't exist.");
        }
         
    }

    // dialogbox handling functions 
    const handleClickOpen = () => {
        setOpenchatnew(true);
    };

    const handleClose = () => {
        setOpenchatnew(false);
    };


    //temp
    const user = useSelector(selectUser);
    // till here temp

    return <div className={styles.sidebar}>
            <Button 
                startIcon={<AddIcon fontsize="large"/>}
                className={styles.sidebar_compose}
                onClick={() => dispatch(openSendMessage())}
            >
                Compose
            </Button>

            <SidebarOption Icon={InboxIcon} title="Inbox"
             number={54} selected={true} />
            <SidebarOption Icon={StarIcon} title="Starred" number={54} />
            <SidebarOption Icon={AccessTimeIcon} title="Snoozed" number={54} />
            <SidebarOption Icon={LabelImportantIcon} title="Important" number={54} />
            <SidebarOption Icon={NearMeIcon} title="Sent" number={54} />
            <SidebarOption Icon={NoteIcon} title="Drafts" number={54} />
            <SidebarOption Icon={ExpandMoreIcon} title="More" number={54} />

            <div className={styles.sidebar_footer}>
            <div>
                <IconButton>
                    <ArrowDropDown  onClick={() => setIsOpen(!isOpen)}/>  
                </IconButton> 
            Chat 
            </div>   
            <div>
            <IconButton>
                    <AddIcon onClick={handleClickOpen} />
            </IconButton>

            <Dialog open={Openchatnew} onClose={handleClose} aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">Start a new Chat</DialogTitle>
                <DialogContent>
                <DialogContentText>
                Type the recipient email to whom you want to chat with:
                </DialogContentText>
                <TextField
                    autoFocus
                    margin="dense"
                    id="name"
                    label="Email Address"
                    type="email"

                    //connecting inputRef property of TextField to the valueRef
                    inputRef={valueRef}   
                    fullWidth
                />
                </DialogContent>
                <DialogActions>
                <Button onClick={handleClose} color="primary">
                    Cancel
                </Button>
                <Button onClick={sendValue} color="primary">
                    Start Chat
                </Button>
                </DialogActions>
            </Dialog>

            </div>
            </div>

            <Collapse in={isOpen}>
            <div className={styles.sidebar_footer}>  
            <div className={styles.sidebar_chatavatar}>
                <Avatar src={user?.photoUrl} />     
            </div>   
            <div className={styles.sidebar_chatname}>
                Tushar Bapecha 
            </div>
            {/* <div className={styles.sidebar_chatname_1}>Tushar</div> */}
            <div className={styles.sidebar_chatfunctions}>
                    <IconButton>
                        <ChatIcon onClick={() => dispatch(openSendChat('rugved@gmail.com'))}/>
                    </IconButton>
                    <IconButton onClick={() => history.push('/meet/single/rugvedpb@gmail.com')}>
                        <DuoIcon />
                    </IconButton>
                </div>
            </div>
            </Collapse>

            <div>    
            </div>
            

            {/* <div>
                <b>(video call)</b><br></br>
                <IconButton onClick={() => history.push('/meet/single/rugvedpb@gmail.com')}>
                    rugvedpb@gmail.com
                    <DuoIcon />
                </IconButton>
                <br></br>
                <IconButton onClick={() => history.push('/meet/single/rugved.bongale@somaiya.edu')}>
                    rugved.bongale@somaiya.edu
                    <DuoIcon />
                </IconButton>
                <br></br>
            </div>
            <div>
                <b>(conference call)</b><br></br>
                <IconButton onClick={() => history.push('/meet/conference/anyRoomName')}>
                    Conf call
                    <DuoIcon />
                </IconButton>
                <br></br>
            </div> */}
        </div>;
}

export default Sidebar
