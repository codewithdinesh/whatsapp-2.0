import { Avatar, Button, CircularProgress, IconButton } from '@mui/material'
import React from 'react'
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

import { addDoc, arrayUnion, collection, doc, getDoc, query, setDoc, updateDoc, where } from 'firebase/firestore';

import Chat from './Chat';

const Sidebar = () => {

    const [user, loading] = useAuthState(auth);

    // this returns all the chats which matches the email so it is not good.
    // const userChatRef = query(collection(db, "chats"), where("users", "array-contains", user.email))

    // This will returns all chats of perticular user
    const [chatsSnapshot] = useDocument(doc(collection(db, "chats"), user.uid))


    // now parse chatsSnapshot: new

    console.log("Chatsnap:", chatsSnapshot?.data())


    const createChat = async () => {

        const input = window.prompt(
            "Please enter Email address of user to chat"
        )

        if (!input) return null;

        // email validation
        if (EmailValidator.validate(input) &&
            !chatAlereadyExists(input) &&
            input !== user.email) {

            // add chatinto db if it has no exist 

            const chatObj = {
                users: arrayUnion(input)
            }

            // console.log("user",user)
            const chatRef = doc(db, "chats", user.uid);

            await updateDoc(chatRef, chatObj);


        } else {
            console.log("Exit")
        }
    }

    // check chat is already exists
    const chatAlereadyExists = (mail) => {
        // !! used to return 
        // ?  Optional Chaining - if value then run after code . to avoid error when value is undefined 
        !!chatsSnapshot?.data()?.users?.some(
            (chatUser) =>
                chatUser == mail
        )?.length > 0;
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
                chatsSnapshot?.data()?.users?.map((chat) => {
                    { console.log(chat) }
                    return <Chat key={chat} chatUser={chat} />
                })
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
    width: 100%;
    border:1px solid ;

    
`;