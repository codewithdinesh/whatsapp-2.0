import { Avatar, Button, CircularProgress, IconButton } from '@mui/material'
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

import { addDoc, arrayUnion, collection, doc, getDoc, getDocs, query, chatsSnapshot, setDoc, updateDoc, where } from 'firebase/firestore';

import Chat from './Chat';

const Sidebar = () => {

    const [user, loading] = useAuthState(auth);

    // chats Ref
    const chatsRef = collection(db, "chats");

    const q = query(chatsRef, where("users", "array-contains", user.email));


    // get all chats of current user
    const [chatsSnapshot] = useCollection(q);


    // create Chat
    const createChat = () => {

        // check chat is already exists
        const chatAlreadyExists = (recipientEmail) =>
            !!chatsSnapshot?.docs.find(chat =>
                chat?.data()?.users?.find(user => user === recipientEmail)?.length > 0
            );



        const input = window.prompt(
            "Please enter Email address of user to chat"
        )

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

            addDoc(chatsRef, chatObj);


        } else {

            console.log("Chat Exist or Not created")
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
                <UserAvatar onClick={onSignOut} />

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

            <SidebarButton onClick={createChat}>
                Start a new Chat
            </SidebarButton>



            {/* Lists of Chat  */}
            {
                chatsSnapshot?.docs.map(chat => (
                    <Chat key={chat.id} id={chat.id} users={chat.data().users} user={user} />
                ))
            }

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
    padding: 10px;
    height: 25px;
`;

const SidebarButton = styled(Button)`
    width: calc(100% - 10px);
    border:1px solid ;
    margin: 5px;

    
`;