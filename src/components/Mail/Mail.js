import React, { useEffect, useState, useRef  } from 'react';
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
import { useHistory } from 'react-router-dom';
import { selectOpenMail } from '../../features/mailSlice';
import { useSelector } from 'react-redux'; 
import { auth, db } from '../../firebase';
import ReactHtmlParser from 'react-html-parser';
import { toggleImportant, toggleSpam } from '../../utilities/utils';
import Loading from '../Loading/Loading';
import ReactTooltip from 'react-tooltip';
import { useReactToPrint } from 'react-to-print';
// import { ComponentToPrint } from './ComponentToPrint';

function Mail() {
    const history = useHistory();
    const selectedMail = useSelector(selectOpenMail);
    const [imp, setImp] = useState(false)
    const [spam, setSpam] = useState(false)
    const componentRef = useRef();

    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
    });

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
                    <ReactTooltip place="bottom"/>
                        <p data-tip="Back">
                            <IconButton onClick={() => history.push("/")}>
                                <ArrowBackIcon />
                            </IconButton>
                        </p>
                    <ReactTooltip place="bottom"/>
                        <p data-tip="Archive">
                            <IconButton>
                                <MoveToInboxIcon />
                            </IconButton>
                        </p>
                    <ReactTooltip place="bottom"/>
                        <p data-tip="Report As Spam">
                            <IconButton onClick={async (e) => {
                                e.stopPropagation();
                                const result = await toggleSpam(selectedMail.id)
                                if(result) setSpam(!spam)
                                }
                            }>
                                {spam ? <NewReleasesIcon style={{fill: "red"}}/> : <NewReleasesIcon /> }
                            </IconButton>
                        </p>
                    <ReactTooltip place="bottom"/>
                        <p data-tip="Delete">
                            <IconButton>
                                <DeleteIcon />
                            </IconButton>
                        </p>
                    <ReactTooltip place="bottom"/>
                        <p data-tip="Mark as Unread">
                            <IconButton>
                                <EmailIcon />
                            </IconButton>
                        </p>
                    <ReactTooltip place="bottom"/>
                        <p data-tip="Snooze">
                            <IconButton>
                                <WatchLaterIcon />
                            </IconButton>
                        </p>
                    <ReactTooltip place="bottom"/>
                        <p data-tip="Mark as Read">
                            <IconButton>
                                <CheckCircleIcon />
                            </IconButton>
                        </p>
                    <ReactTooltip place="bottom"/>
                        <p data-tip="Mark as Important">
                            <IconButton onClick={async (e) => {
                                e.stopPropagation();
                                const result = await toggleImportant(selectedMail.id)
                                if(result) setImp(!imp)
                                }
                            }>
                                {imp ? <LabelImportantOutlinedIcon style={{fill: "orange"}}/> : <LabelImportantOutlinedIcon /> }
                            </IconButton>
                        </p>
                    <ReactTooltip place="bottom"/>
                        <p data-tip="More">
                            <IconButton>
                                <MoreVertIcon />
                            </IconButton>
                        </p>
                </div>

                <div className={styles.mail__toolsRight}>
                <div className={styles.mail__toolsRight}>
                    <ReactTooltip place="bottom"/>
                        <span data-tip="Print Mail"> 
                            <IconButton onClick={handlePrint}>
                                <PrintIcon />
                            </IconButton>
                        </span>
                    <ReactTooltip place="bottom"/>
                        <span data-tip="Pop out">     
                            <IconButton onClick={MyComponent}>
                                <ExitToAppIcon />
                            </IconButton>
                        </span>
                </div>
                </div>
            </div>



            <div className={styles.mail__body} style={{position:"relative"}} ref={componentRef}>                
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
