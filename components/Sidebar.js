import { Avatar, Button, CircularProgress, IconButton, Tooltip } from '@mui/material'
import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import * as EmailValidator from "email-validator";

// icons
import ChatIcon from '@mui/icons-material/Chat';
import SearchIcon from '@mui/icons-material/Search';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { auth, db } from '../firebase';
import { signOut } from 'firebase/auth';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollection, useDocument } from 'react-firebase-hooks/firestore';

import { addDoc, collection, query, where } from 'firebase/firestore';

import Chat from './Chat';


// dialog 
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

const Sidebar = () => {

    const [user, loading] = useAuthState(auth);

    // chats Ref
    const chatsRef = collection(db, "chats");

    const q = query(chatsRef, where("users", "array-contains", user.email));


    // get all chats of current user
    const [chatsSnapshot] = useCollection(q);

    // dailog 
    const [open, setOpen] = React.useState(false);

    const [input, setInput] = useState("");

    const handleOpenClose = () => {

        if (open) setOpen(false);
        else setOpen(true)
    };

    const handleInput = () => {
        createChat();

    }



    // create Chat
    const createChat = () => {

        handleOpenClose()

        // check chat is already exists
        const chatAlreadyExists = (recipientEmail) =>
            !!chatsSnapshot?.docs.find(chat =>
                chat?.data()?.users?.find(user => user === recipientEmail)?.length > 0
            );


        if (!input) return null;


        // email validation
        if (EmailValidator.validate(input) &&
            !chatAlreadyExists(input) &&
            input !== user.email) {

            // chatObj
            const chatObj = {
                users: [user.email, input]
            }
            console.log("Add new chat")

            const newChat = addDoc(chatsRef, chatObj);
            setInput("");


        } else {

            alert("Chat Exist or Not created or Invalid Email Address")

        }


    }


    const onSignOut = () => {
        auth.signOut();
    }



    return (
        <Container>
            {/* Header */}
            {/* search Bar */}
            {/* List of chart */}

            {/* loading */}
            {
                loading ? <CircularProgress color='success' size={60} />
                    : null
            }

            <Header>
                <Tooltip title="LogOut">
                    <UserAvatar onClick={onSignOut} />
                </Tooltip>

                <IconsContainer>
                    <IconButton>
                        <ChatIcon />
                    </IconButton>

                    <IconButton>
                        <MoreVertIcon />
                    </IconButton>
                </IconsContainer>

            </Header>


            <Search>
                <SearchIcon />
                <SearchInput placeholder='Search In chat' />
            </Search>

            <SidebarButton onClick={handleOpenClose}>
                Start a new Chat
            </SidebarButton>



            {/* Lists of Chat  */}
            {
                chatsSnapshot?.docs.map(chat => (
                    <Chat key={chat.id} id={chat.id} users={chat.data().users} user={user} />
                ))
            }


            {/* Email input Dialog */}

            <Dialog open={open} onClose={handleOpenClose} >
                <DialogTitle>Send Message</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Enter the email of user where you want to send message.
                    </DialogContentText>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="name"
                        label="Email Address"
                        type="email"
                        fullWidth
                        variant="standard"
                        value={input}
                        onChange={(e) => {
                            e.preventDefault();
                            setInput(e.target.value);
                        }}
                        placeholder='jisko send karna hai uska email type karo.'
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleOpenClose}>Cancel</Button>
                    <Button onClick={handleInput}>Chat</Button>
                </DialogActions>
            </Dialog>

        </Container>
    )
}

export default Sidebar

const Container = styled.div`


`;

const Header = styled.div`
    display: flex !important;
    position:sticky;
    top:0;
    background-color: white;
    justify-content:space-between;
    z-index: 1;
    align-items: center;
    padding: 15px;
    padding-right: 1px;
    height: 80px;
    border-bottom: 1px solid whitesmoke;
`;

const UserAvatar = styled(Avatar)`
cursor: pointer;
    :hover{
        opacity:0.8;
    }
`;

const IconsContainer = styled.div`
   /* display: flex; */
`;

const Search = styled.div`
    display: flex;
    align-items: center;
    padding:20px ;
    border-radius: 2px;
`;

const SearchInput = styled.input`
    outline: none;
    outline-width: 0;
    border: none;
    flex: 1;
    padding: 20px;
    height: 25px;
`;

const SidebarButton = styled(Button)`
    width: calc(100% - 10px);
    border:1px solid ;
    margin: 5px;

    
`;