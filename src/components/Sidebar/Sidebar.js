import React, { useRef, useEffect } from 'react';
import styles from './Sidebar.module.css';
import AddIcon from "@material-ui/icons/Add";
import InboxIcon from "@material-ui/icons/Inbox"; 
import { Button, IconButton, Collapse } from '@material-ui/core';
import SidebarOption from '../SidebarOption/SidebarOption';
import StarIcon from "@material-ui/icons/Star";
import LabelImportantIcon from "@material-ui/icons/LabelImportant";
import NearMeIcon from "@material-ui/icons/NearMe";
import NoteIcon from "@material-ui/icons/Note";
import NewReleasesIcon from '@material-ui/icons/NewReleases';
import VideoCallIcon from '@material-ui/icons/VideoCall';
import ArrowDropDown from "@material-ui/icons/ArrowDropDown";
import { openSendMessage } from '../../features/mail';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { openSendChat } from '../../features/chat';
import { useState } from 'react';
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
import SidebarChatrecent from '../SidebarChatrecent/SidebarChatrecent'

function Sidebar({selectedSideBarItem,setSelectedSideBarItem,listLength}) {

    const history = useHistory();
    const dispatch = useDispatch();
    //variable for opening chat collapse from recent chat person
    const [isOpen, setIsOpen] = useState(false);
    //variable for opening meet collapse from recent chat person
    const [isOpenmeet, setIsOpenmeet] = useState(false);
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

    const [recentChatpersons,setRecentChatpersons] = useState([])

    useEffect(() => {
        db.collection('users').where('email','==', auth.currentUser.email).onSnapshot(snapshot => {
            setRecentChatpersons(snapshot.docs.map(doc => ({
                id: doc.id,
                data: doc.data(),
                recents: doc.data()['recentlychatedwith'],
            })))
        })
        
    },[])

    return <div className={styles.sidebar}>
            <Button 
                name = "composebtnK"
                startIcon={<AddIcon fontsize="large"/>}
                className={styles.sidebar_compose}
                onClick={() => dispatch(openSendMessage())}
            >
                Compose
            </Button>

            <SidebarOption setSelectedSideBarItem={setSelectedSideBarItem} index={0} selected={selectedSideBarItem == 0} Icon={InboxIcon} title="Inbox"
             number={selectedSideBarItem == 0 ? listLength : ''}  />
            <SidebarOption setSelectedSideBarItem={setSelectedSideBarItem} index={1} selected={selectedSideBarItem == 1} Icon={StarIcon} title="Starred" number={selectedSideBarItem==1 ? listLength : ''} />
            <SidebarOption setSelectedSideBarItem={setSelectedSideBarItem} index={3} selected={selectedSideBarItem == 3} Icon={LabelImportantIcon} title="Important" number={selectedSideBarItem==3 ? listLength : ''} />
            <SidebarOption setSelectedSideBarItem={setSelectedSideBarItem} index={4} selected={selectedSideBarItem == 4} Icon={NearMeIcon} title="Sent" number={selectedSideBarItem==4 ? listLength : ''} />
            <SidebarOption setSelectedSideBarItem={setSelectedSideBarItem} index={5} selected={selectedSideBarItem == 5} Icon={NoteIcon} title="Drafts" number={selectedSideBarItem==5 ? listLength : ''} />
            <SidebarOption setSelectedSideBarItem={setSelectedSideBarItem} index={6} selected={selectedSideBarItem == 6} Icon={NewReleasesIcon} title="Spam" number={selectedSideBarItem==6 ? listLength : ''} />

            <div className={styles.sidebar_footer}>
            <div className={styles.sidebar_features}>    
                <div>
                    <IconButton>
                        <ArrowDropDown  onClick={() => setIsOpen(!isOpen)}/>  
                    </IconButton> 
                Chat 
                </div>   
                <div>
                <IconButton>
                        <AddIcon name="addChat" onClick={handleClickOpen} />
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
                                name="mailFieldChat"
                                //connecting inputRef property of TextField to the valueRef
                                inputRef={valueRef}   
                                fullWidth
                            />
                            </DialogContent>
                            <DialogActions>
                            <Button onClick={handleClose} color="primary">
                                Cancel
                            </Button>
                            <Button name="startChatBtn" onClick={sendValue} color="primary">
                                Start Chat
                            </Button>
                            </DialogActions>
                        </Dialog>
                </div>
            </div>
            <div style={{overflowY: 'auto', maxHeight:'100px',}}>

            <Collapse in={isOpen}>

            {/* ,recents:{email, displayName, photoUrl */}
            {/* {JSON.stringify(recentChatpersons)} */}
            {recentChatpersons && recentChatpersons.length > 0 && recentChatpersons[0].recents.map(({displayName, email, photoUrl}) => {
                return  <SidebarChatrecent
                            displayName = {displayName}
                            email={email}
                            // displayName={displayName}
                            photoUrl={photoUrl}
                        />
                     })} 

            </Collapse>
            
            </div>

            
            <div className={styles.sidebar_features}> 
                <div>
                    <IconButton>
                        <ArrowDropDown  onClick={() => setIsOpenmeet(!isOpenmeet)}/>  
                    </IconButton> 
                Meet
                </div> 
            </div>
            </div>

            <Collapse in={isOpenmeet}>
                <div className={styles.sidebar_features}>  
                    <div className={styles.sidebar_meet} onClick={() => history.push(`/meet/conference/${parseInt(100000 + Math.random()*(500000))}`)}>
                        <IconButton>
                            <VideoCallIcon  />  
                        </IconButton>
                        New meeting
                    </div>
                </div>
            </Collapse>
        </div>;
}

export default Sidebar
