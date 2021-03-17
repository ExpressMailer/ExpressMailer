import { Avatar, IconButton } from '@material-ui/core'
import MenuIcon from "@material-ui/icons/Menu"
import SearchIcon from '@material-ui/icons/Search';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import AppsIcon from '@material-ui/icons/Apps';
import NotificationsIcon from '@material-ui/icons/Notifications';
import React from 'react'
import styles from './Header.module.css'
import { useSelector, useDispatch } from "react-redux"
import { selectUser, logout } from '../../features/userSlice';
import { auth } from '../../firebase';
import { toggleSidebar } from '../../features/commonSlice';

function Header() {
    const user = useSelector(selectUser);
    const dispatch = useDispatch();

    const signOut = () => {
        auth.signOut().then(() => {
            dispatch(logout())
        })
    };

    const toggleSidebarFunction = () => {
        dispatch(toggleSidebar())
    }

    return (
        <div className={styles.header}>
            <div className={styles.header__left}>
                <IconButton>
                    <MenuIcon onClick={toggleSidebarFunction} />
                </IconButton>
                <img 
                    src="https://ssl.gstatic.com/ui/v1/icons/mail/rfr/logo_gmail_lockup_default_1x_r2.png" 
                    alt="gmail icon"
                />
            </div>
            <div className={styles.header__middle}>
                <SearchIcon />
                <input placeholder="Search mail" type="text" className={styles.header__inputCaret} />
                <ArrowDropDownIcon />
            </div>

            <div className={styles.header__right}>
                <IconButton>
                    <AppsIcon />
                </IconButton>
                <IconButton>
                    <NotificationsIcon />
                </IconButton>
                <Avatar onClick={signOut} src={user?.photoUrl} />
            </div>
        </div>
    )
}

export default Header
