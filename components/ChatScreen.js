import { AttachFile, EmojiEmotions, InsertEmoticonSharp, Mic, MoreVertRounded, Send, SendRounded } from "@mui/icons-material";
import { Avatar, IconButton } from "@mui/material";
import { addDoc, collection, doc, orderBy, query, refEqual, serverTimestamp, setDoc, where } from "firebase/firestore";
import { useRouter } from "next/router";
import { useAuthState } from "react-firebase-hooks/auth";
import { useCollection, useDocument } from "react-firebase-hooks/firestore";
import { auth, db } from "../firebase";

import styled from "styled-components";
import Message from "./Message";
import { useRef, useState } from "react";
import getRecipientEmail from "../utils/getRecipientEmail";

// for calculate time ago
import TimeAgo from "timeago-react";



function ChatScreen({ chat }) {

    const router = useRouter();

    const [newMessage, setNewMessage] = useState("");

    const [user] = useAuthState(auth);

    const ref = collection(doc(db, `chats`, router.query.id), "messages");


    // recipient User
    const recipientRef = collection(db, "users");

    const recipientQuery = query(recipientRef, where("email", "==", getRecipientEmail(chat?.users, user)));

    const [recipientSnapShot] = useCollection(recipientQuery);

    const recipient = recipientSnapShot?.docs?.[0]?.data();


    // Messages
    const [messagesSnapShot] = useCollection(query(ref, orderBy("timestamp", "asc")));

    const endOfMessagesRef = useRef(null)



    const showMessages = () => {

        if (messagesSnapShot) {

            return (messagesSnapShot?.docs?.map(
                (message) => (
                    <Message
                        key={message.id}
                        user={message.data().user}
                        message={{
                            ...message.data(),
                            timestamp: message?.data().timestamp?.toDate().getTime()
                        }}
                    />
                )
            ))
        }
    }

    const sendMessage = (e) => {
        e.preventDefault();
        updateLastSeen();

        const msg = {
            timestamp: serverTimestamp(),
            msg: newMessage,
            user: user.email
        }

        addDoc(ref, msg);

        setNewMessage("");
    }


    const updateLastSeen = async () => {
        const userRef = doc(db, "users", user.email);

        await setDoc(userRef,
            { lastSeen: serverTimestamp() },
            { merge: true });
    }

    console.log(
        "User Data : ", recipient
    )

    return (
        <Container>
            <Header>
                {/* Avatar */}
                {
                    recipient ?
                        (<Avatar src={recipient?.photoURL} />)
                        :
                        (<Avatar>
                            {recipient?.email[0]}
                        </Avatar>)
                }

                {/* name and user info */}
                <HeaderInfo>
                    <h3>
                        {recipient?.email ? recipient?.email : "Unavaible"}
                    </h3>
                    <p> Last active {recipient?.lastSeen?.toDate() ? (
                        <TimeAgo datetime={recipient?.lastSeen?.toDate()} />
                    ) : ("Unavaible")
                    }</p>
                </HeaderInfo>

                {/* Header Actions Icon */}
                <HeaderIcons>

                    <IconButton>
                        <AttachFile />
                    </IconButton>

                    <IconButton>
                        <MoreVertRounded />
                    </IconButton>

                </HeaderIcons>
            </Header>

            {/* Message Container */}
            <MessageContainer>

                {/* show messages */}
                {showMessages()}
                <EndOfMessage ref={endOfMessagesRef} />

            </MessageContainer>

            <InputContainer>

                {/* Emoji icon */}
                <IconButton>
                    <InsertEmoticonSharp />
                </IconButton>


                {/* Inputs */}
                <Input placeholder="Message Type karo" value={newMessage}
                    onChange={(e) => {
                        e.preventDefault();
                        setNewMessage(e.target.value)
                    }
                    } />

                <IconButton type="submit" onClick={(e) => sendMessage(e)} disabled={!newMessage}>
                    <Send />
                </IconButton>

                <IconButton>
                    {/* <SendRounded /> */}
                    <Mic />
                </IconButton>

            </InputContainer>

        </Container>
    )
}

export default ChatScreen;

const Container = styled.div`
`;

const Header = styled.div`
   position:sticky;
  background-color:white;
  z-index: 100;
  top: 0;
  display:flex;
  padding: 11px;
  height: 80px;
  align-items: center;
  justify-content: center;
  border-bottom: 1px solid whitesmoke;
`;


const HeaderInfo = styled.div`
  margin-left: 0.9rem;
  flex: 1;

  > h3 {
    font-size:1.5rem;
    margin-bottom:1px;
    @media(max-width: 500px){
      font-size: 1rem;
    }
    @media(max-width: 300px){
      font-size: 0.8rem;
    }
  }
  > p {
    font-size:0.8rem;
    color:gray;
    margin-top: 3px;
    @media(max-width: 300px){
      font-size: 0.5rem;
    }
  }
`
const HeaderIcons = styled.div`
    
`
const MessageContainer = styled.div`
    padding:30px;
    background-color:#e5ded8;
    min-height:90vh;
`
const EndOfMessage = styled.div`
    margin-bottom:50px;
    `
const InputContainer = styled.form`
    display:flex;
    align-items:center;
    padding:10px;
    position:sticky;
    bottom:0;
    background-color:white;
    z-index:100;
`

const Input = styled.input`
    flex:1;
    outline:0;
    border:none;
    border-radius:10px;
    align-items:center;
    padding:20px;
    position:sticky;
    background-color:whitesmoke;
    z-index:100;
    margin-left:15px;
    margin-right:15px;
`
