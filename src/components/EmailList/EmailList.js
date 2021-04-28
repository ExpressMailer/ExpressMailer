import React from 'react';
import styles from './EmailList.module.css';
import { Checkbox, IconButton } from "@material-ui/core";
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import KeyboardHideIcon from "@material-ui/icons/KeyboardHide";
import InboxIcon from "@material-ui/icons/Inbox";
import PeopleIcon from "@material-ui/icons/People";
import LocalOfferIcon from "@material-ui/icons/LocalOffer";
import SettingsIcon from "@material-ui/icons/Settings";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import RefreshIcon from '@material-ui/icons/Refresh';
import Section from '../Section/Section';
import ReactTooltip from 'react-tooltip';
import EmailRow from '../EmailRow/EmailRow'
import Loading from '../Loading/Loading';

function EmailList({ emails,selectedLabelItem,setSelectedLabelItem,getMails }) {
    
    return (<div className={styles.emailList}>
            <div className={styles.emailList__settings}>
                <div className={styles.emailList__settingsLeft}>
                    <ReactTooltip place="bottom"/>
                        <span data-tip="Select">
                            <Checkbox />
                        </span>
                    <ReactTooltip place="bottom"/>
                        <span data-tip="Select All">
                            <IconButton>
                                <ArrowDropDownIcon />
                            </IconButton>
                        </span>
                    <ReactTooltip place="bottom"/>
                        <span data-tip="Refresh">
                            <IconButton onClick={getMails}>
                                <RefreshIcon />
                            </IconButton>
                        </span>
                    <ReactTooltip place="bottom"/>
                        <span data-tip="More">
                            <IconButton>
                                <MoreVertIcon />
                            </IconButton>
                        </span>
                </div>
                <div className={styles.emailList__settingsRight}>
                    <ReactTooltip place="bottom"/>
                        <span data-tip="Previous Page">
                            <IconButton>
                                <ChevronLeftIcon />
                            </IconButton>
                        </span>
                    <ReactTooltip place="bottom"/>  
                        <span data-tip="Next Page">          
                            <IconButton>
                                <ChevronRightIcon />
                            </IconButton>
                        </span>
                    <ReactTooltip place="bottom"/>
                        <span data-tip="Keyboard">
                            <IconButton>
                                <KeyboardHideIcon />
                            </IconButton>
                        </span>
                    <ReactTooltip place="bottom"/>
                        <span data-tip="Settings">
                            <IconButton>
                                <SettingsIcon />
                            </IconButton>
                        </span>
                </div>
            </div>

            <div className={styles.emailList__sections} >
                {[
                    {icon:InboxIcon,title:'Primary',color:'red'},
                    {icon:PeopleIcon,title:'Social',color:'#1A73E8'},
                    {icon:LocalOfferIcon,title:'Promotions',color:'green'}
                ].map((obj,index) => {
                    return <Section 
                        Icon={obj.icon} 
                        title={obj.title}
                        color={obj.color}
                        selected={selectedLabelItem == index} 
                        onClick={() => setSelectedLabelItem(index)}
                    />  
                })}
            </div>

            <div className={styles.emailList__list}>
            {emails.length == 0 ? <Loading /> : 
                <div>
                    {emails.map(( {id, data} ) => {
                        return <EmailRow
                            id={id}
                            key={id}
                            title={data.from}
                            subject={data.subject}
                            to={data.to}
                            from={data.from}
                            description={data.message}
                            time={new Date(data.timestamp?.seconds*1000).toUTCString()}
                            starred={data.starred || false}
                            important={data.important || false}
                            read={data.read || false}
                            spam={data.spam || false}
                            searchableKeywords={data.searchableKeywords || []}
                            attachments={data.attachments || []}
                        />
                    })}
                </div>
            }
                {/* <div style={{width:"100%",textAlign:"center"}}>
                    <button onClick={getMails} className={styles.emailList__more}>More</button>
                </div> */}
            </div>
        </div>
    );
}

export default EmailList
