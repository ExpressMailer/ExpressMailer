import React, { useEffect, useState } from 'react';
import styles from './Mail.module.css';
import { IconButton } from '@material-ui/core';
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import MoveToInboxIcon from "@material-ui/icons/MoveToInbox";
import NewReleasesIcon from '@material-ui/icons/NewReleases'
import DeleteIcon from "@material-ui/icons/Delete";
import EmailIcon from "@material-ui/icons/Email";
import WatchLaterIcon from "@material-ui/icons/WatchLater";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import LabelImportantOutlinedIcon from "@material-ui/icons/LabelImportant";
import MoreVertIcon from "@material-ui/icons/MoreVert"; 
import PrintIcon from "@material-ui/icons/Print";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import UnfoldMoreIcon from "@material-ui/icons/UnfoldMore";
import { useHistory } from 'react-router-dom';
import { selectOpenMail } from '../../features/mailSlice';
import { useSelector } from 'react-redux'; 
import { auth, db } from '../../firebase';
import ReactHtmlParser from 'react-html-parser';
import { toggleImportant, toggleSpam } from '../../utilities/utils';
import Loading from '../Loading/Loading';

function Mail() {
    const history = useHistory();
    const selectedMail = useSelector(selectOpenMail);
    const [imp, setImp] = useState(false)
    const [spam, setSpam] = useState(false)

    useEffect(() => {
        if(!selectedMail){
            history.push("/")
            return
        }

        //  If receiver open this mail, set its read status as true
        if(selectedMail.from != auth.currentUser.email){
            db.collection('emails').doc(selectedMail.id).set({
                "read": true
            },{merge:true})
        }
        setImp(selectedMail.important || false)
        setSpam(selectedMail.spam || false)
    }, [])

    return(!selectedMail ? <Loading /> : <div className={styles.mail}>
            <div className={styles.mail__tools}>
                <div className={styles.mail__toolsLeft}>
                    <IconButton onClick={() => history.push("/")}>
                        <ArrowBackIcon />
                    </IconButton>
                    <IconButton>
                        <MoveToInboxIcon />
                    </IconButton>
                    <IconButton onClick={async (e) => {
                            e.stopPropagation();
                            const result = await toggleSpam(selectedMail.id)
                            if(result) setSpam(!spam)
                        }
                    }>
                        {spam ? <NewReleasesIcon style={{fill: "red"}}/> : <NewReleasesIcon /> }
                    </IconButton>
                    <IconButton>
                        <DeleteIcon />
                    </IconButton>
                    <IconButton>
                        <EmailIcon />
                    </IconButton>
                    <IconButton>
                        <WatchLaterIcon />
                    </IconButton>
                    <IconButton>
                        <CheckCircleIcon />
                    </IconButton>
                    <IconButton onClick={async (e) => {
                            e.stopPropagation();
                            const result = await toggleImportant(selectedMail.id)
                            if(result) setImp(!imp)
                        }
                    }>
                        {imp ? <LabelImportantOutlinedIcon style={{fill: "orange"}}/> : <LabelImportantOutlinedIcon /> }
                    </IconButton>
                    <IconButton>
                        <MoreVertIcon />
                    </IconButton>

                </div>

                <div className={styles.mail__toolsRight}>
                    <IconButton>
                        <UnfoldMoreIcon />
                    </IconButton>
                    <IconButton>
                        <PrintIcon />
                    </IconButton>
                    <IconButton>
                        <ExitToAppIcon />
                    </IconButton>
                </div>
            </div>



            <div className={styles.mail__body} style={{position:"relative"}}>
                <div style={{position:"absolute",top:"0px",right:"20px"}}>
                    {selectedMail && selectedMail.read ? 
                        selectedMail.from == auth.currentUser.email &&
                        <div style={{
                            padding: "10px",
                            borderRadius: "10px",
                            backgroundColor: "turquoise",
                            cursor: "pointer",
                            color:"white"
                        }}>
                            Read
                        </div>
                        :
                        selectedMail.from == auth.currentUser.email &&
                        <div style={{
                            padding: "10px",
                            borderRadius: "10px",
                            backgroundColor: "transparent",
                            border:"2px solid turquoise",
                            cursor: "pointer",
                        }}>
                            Unread
                        </div>
                    }
                </div>

                <div className={styles.mail__bodyHeader}>
                    <h2>{selectedMail?.subject}</h2>
                    {imp ? <LabelImportantOutlinedIcon style={{fill: "orange"}}/> : <LabelImportantOutlinedIcon /> }
                    <p>{selectedMail?.title}</p> 
                    <p className={styles.mail__time}>{selectedMail?.time}</p>
                </div>    
                <div className={styles.mail__message}>
                    <p>{ReactHtmlParser(selectedMail?.description)}</p> 
                </div>
            </div>
        </div>
        );
}

export default Mail
