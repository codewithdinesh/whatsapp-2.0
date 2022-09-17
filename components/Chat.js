// chat item

import styled from '@emotion/styled'
import { Avatar } from '@mui/material';
import { collection, doc, getDoc, query, where } from 'firebase/firestore';
import { Router, useRouter } from 'next/router';
import React from 'react'
import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollection } from 'react-firebase-hooks/firestore';
import { auth, db } from '../firebase';

export default function Chat({ chatUser }) {

    // chatUser - recipient user
    const [user, loading] = useAuthState(auth);

    const router = useRouter();


    // check recipient user present in database
    const recipientChatRef = query(collection(db, "users"), where("email", "==", chatUser));


    // geting recipient details - array response
    const [recipientSnapshot] = useCollection(recipientChatRef);


    // console.log("Reciepient:", recipientSnapshot?.docs[0])


    // get first user data (becuase of using collection)
    const recipient = recipientSnapshot?.docs[0]?.data();


    const recipientID = recipientSnapshot?.docs[0]?.id;


    // if user is not registered then null user come so thats why here we display chat user even if he is not registered to our app
    const recipientEmail = chatUser;


    // enter to the chat
    const enterChat = () => {

        router.push(`/chat/${recipientID}`)
        // if user is not registered then it will goes to "/chat/undefined"
        // for that may use email for chat path like this >"/chat/email@gmail.com"

    }


    return (
        <Container onClick={enterChat}>

            {
                recipient ?
                    <UserAvatar src={recipient?.photoURL} />
                    :
                    <UserAvatar>

                        {
                            recipientEmail[0]
                        }
                    </UserAvatar>
            }


            <p className='bg-yellow'>{recipientEmail}</p>

        </Container>
    )
}


const Container = styled.div`
    display: flex;
    cursor: pointer;
    align-items: center;
    padding:15px;
    word-break: break-all;


    :hover{
        background-color: #e9eaeb;
    }
`;

const UserAvatar = styled(Avatar)`
    margin: 5px;
    margin-right: 15px;
`;