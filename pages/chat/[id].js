import { async } from "@firebase/util";
import { useRouter } from "next/router";
import { useAuthState } from "react-firebase-hooks/auth";
import { useState } from "react";
import Head from "next/head";

import { collection, doc, getDoc, getDocs, orderBy, query, setDoc, where } from "firebase/firestore";

import ChatScreen from "../../components/ChatScreen";
import styled from "styled-components";
import Sidebar from "../../components/Sidebar";
import { auth, db } from "../../firebase";
import { SwipeableDrawer, Hidden } from '@mui/material';
import getRecipientEmail from "../../utils/getRecipientEmail";


const Chat = ({ chat, messages }) => {

    const [open, setOpen] = useState(false);

    const router = useRouter();

    const chatId = router.query.id;

    const [user] = useAuthState(auth);


    return (
        <Container>

            <Head>
                <title>Chat with {getRecipientEmail(chat.users, user)}</title>
            </Head>

            {/* Mobile view hide */}
            <Hidden mdUp implementation="css">
                <SwipeableDrawer anchor="left"
                    open={open}
                    onClose={() => setOpen(false)}
                    onOpen={() => { setOpen(true) }}>


                    {/* side bar */}
                    <Sidebar />

                </SwipeableDrawer>
            </Hidden>

            <Hidden smDown implementation="css">
                <Sidebar />
            </Hidden>

            {/* chat Container */}
            <ChatContainer>

                {/* Chat Screen */}
                <ChatScreen chat={chat} />

            </ChatContainer>

        </Container>
    )
}

export default Chat;

export async function getServerSideProps(context) {
    // geting messages from the server

    // chat ref
    // const ref = collection(doc(db, `chats`, context.query.id), "messages");

    // // getting messgaes
    // const MessageSnap = await getDocs(query(ref, orderBy("timestamp")));

    // const Messages = MessageSnap?.docs?.map(
    //     (doc) => ({
    //         id: doc?.id,
    //         ...doc?.data(),
    //     })).map(
    //         messages => ({
    //             ...messages,
    //             timestamp: messages?.timestamp?.toDate()?.getTime()
    //         })
    //     )

    // getting chat details
    const chatRef = await getDoc(doc(db, `chats`, context.query.id));

    const chat = {
        id: chatRef.id,
        ...chatRef.data()
    }

    return {

        props: {
            // messages: JSON.stringify(Messages),
            chat

        }
    }
}

const Container = styled.div`
    display: flex;

`;

const ChatContainer = styled.div`
    flex: 1;
    overflow:scroll;
    height: 100vh;

    ::-webkit-scrollbar{
        display: none;
    }

    -ms-overflow-style: none;
    scrollbar-width:none;
`;

