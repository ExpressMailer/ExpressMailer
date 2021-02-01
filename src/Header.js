import { Avatar, IconButton } from '@material-ui/core'
import MenuIcon from "@material-ui/icons/Menu"
import SearchIcon from '@material-ui/icons/Search';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import AppsIcon from '@material-ui/icons/Apps';
import NotificationsIcon from '@material-ui/icons/Notifications';
import React from 'react'
import './Header.css'

function Header() {
    return (
        <div className="header">
            <div className="header__left">
                <IconButton>
                    <MenuIcon />
                </IconButton>
                <img 
                    src="https://ssl.gstatic.com/ui/v1/icons/mail/rfr/logo_gmail_lockup_default_1x_r2.png" 
                    alt="gmail icon"
                />
            </div>
            <div className="header__middle">
                <SearchIcon />
                <input placeholder="Search mail" type="text" className="header__inputCaret" />
                <ArrowDropDownIcon />
            </div>

            <div className="header__right">
                <IconButton>
                    <AppsIcon />
                </IconButton>
                <IconButton>
                    <NotificationsIcon />
                </IconButton>
                <Avatar />
            </div>
        </div>
    )
}

export default Header
