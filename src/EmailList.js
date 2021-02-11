import React from 'react';
import './EmailList.css';
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
import Section from './Section';

function EmailList() {
    return (<div classname="emailList">
            <div className="emailList__settings">
                <div className="emailList__settingsLeft">
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
                <div className="emailList__settingsRight">
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

            <div className="emailList__sections" >
                <Section Icon={InboxIcon} title="primary" color="red" selected />  
                <Section Icon={PeopleIcon} title="Social" color="#1A73E8" />    
                <Section Icon={LocalOfferIcon} title="Promotions" color="green" />  
            </div>
        </div>
    );
}

export default EmailList
