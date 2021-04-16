import React from 'react';
import styles from './Mail.module.css';
import { IconButton } from '@material-ui/core';
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import MoveToInboxIcon from "@material-ui/icons/MoveToInbox";
import ErrorIcon from "@material-ui/icons/Error";
import DeleteIcon from "@material-ui/icons/Delete";
import EmailIcon from "@material-ui/icons/Email";
import WatchLaterIcon from "@material-ui/icons/WatchLater";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import LabelImportantIcon from "@material-ui/icons/LabelImportant";
import MoreVertIcon from "@material-ui/icons/MoreVert"; 
import PrintIcon from "@material-ui/icons/Print";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import UnfoldMoreIcon from "@material-ui/icons/UnfoldMore";
import { useHistory } from 'react-router-dom';
import { selectOpenMail } from '../../features/mailSlice';
import { useSelector } from 'react-redux';
import EmailRow from '../EmailRow/EmailRow'

var important = EmailRow.important   


function Mail() {
    const history = useHistory();
    const selectedMail = useSelector(selectOpenMail);

    return(<div className={styles.mail}>
            <div className={styles.mail__tools}>
                <div className={styles.mail__toolsLeft}>
                    <IconButton onClick={() => history.push("/")}>
                        <ArrowBackIcon />
                    </IconButton>
                    <IconButton>
                        <MoveToInboxIcon />
                    </IconButton>
                    <IconButton>
                        <ErrorIcon />
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
                    <IconButton onClick={EmailRow.toggleImportant}>
                    {important ? <LabelImportantIcon style={{fill: "orange"}}/> : <LabelImportantIcon /> }
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
            <div className={styles.mail__body}>
                <div className={styles.mail__bodyHeader}>
                    <h2>{selectedMail?.subject}</h2>
                    <LabelImportantIcon className={styles.mail__important} />
                    <p>{selectedMail?.title}</p> 
                    <p className={styles.mail__time}>{selectedMail?.time}</p>
                </div>    
                <div className={styles.mail__message}>
                    <p>{selectedMail?.description}</p> 
                </div>
            </div>
        </div>
        );
}

export default Mail
