import React, { useEffect, useState } from 'react';
import styles from './EmailList.module.css';
import { Checkbox, IconButton } from "@material-ui/core";
import RedoIcon from "@material-ui/icons/Redo";
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import KeyboardHideIcon from "@material-ui/icons/KeyboardHide";
import InboxIcon from "@material-ui/icons/Inbox";
import PeopleIcon from "@material-ui/icons/People";
import LocalOfferIcon from "@material-ui/icons/LocalOffer";
import SettingsIcon from "@material-ui/icons/Settings";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import Section from '../Section/Section';
import { auth, db } from '../../firebase';

import EmailRow from '../EmailRow/EmailRow'
function EmailList({ emails,setEmails }) {
    // const [emails,setEmails] = useState(emails)

    return (<div className={styles.emailList}>
            <div className={styles.emailList__settings}>
                <div className={styles.emailList__settingsLeft}>
                    <Checkbox />
                    <IconButton>
                        <ArrowDropDownIcon />
                    </IconButton>
                    <IconButton>
                        <RedoIcon />
                    </IconButton>
                    <IconButton>
                        <MoreVertIcon />
                    </IconButton>
                </div>
                <div className={styles.emailList__settingsRight}>
                    <IconButton>
                        <ChevronLeftIcon />
                    </IconButton>
                    <IconButton>
                        <ChevronRightIcon />
                    </IconButton>
                    <IconButton>
                        <KeyboardHideIcon />
                    </IconButton>
                    <IconButton>
                        <SettingsIcon />
                    </IconButton>
                </div>
            </div>

            <div className={styles.emailList__sections} >
                <Section Icon={InboxIcon} title="Primary" color="red" selected />  
                <Section Icon={PeopleIcon} title="Social" color="#1A73E8" />    
                <Section Icon={LocalOfferIcon} title="Promotions" color="green" />  
            </div>

            <div className={styles.emailList__list}>
                {emails.map(({id,data:{to,from,subject,message,timestamp}}) => {
                    return <EmailRow
                        id={id}
                        key={id}
                        title={from}
                        subject={subject}
                        description={message}
                        time={new Date(timestamp?.seconds*1000).toUTCString()}
                    />
                })}
                {/* {emails.map({ id,data: {to,subject,message,timestamp} } => {
                })} */}
            </div>
        </div>
    );
}

export default EmailList
