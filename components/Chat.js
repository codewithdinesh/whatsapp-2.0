// chat item

import styled from '@emotion/styled'
import { Avatar } from '@mui/material';
import { collection, doc, getDoc, query, where } from 'firebase/firestore';
import { Router, useRouter } from 'next/router';
import React from 'react'
import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollection } from 'react-firebase-hooks/firestore';
import { auth, db } from '../firebase';
import getRecipientEmail from "../utils/getRecipientEmail";

export default function Chat({ id, users, user }) {

    const router = useRouter();

    const recipientEmail = getRecipientEmail(users, user)

    // check recipient user present in database
    const recipientChatRef = query(collection(db, "users"), where("email", "==", getRecipientEmail(users, user)));


    // geting recipient details - array response
    const [recipientSnapshot] = useCollection(recipientChatRef);


    const recipient = recipientSnapshot?.docs?.[0]?.data();


    // enter to the chat
    const enterChat = () => {

        router.push(`/chat/${id}`)


    }


    return (
        <Container onClick={enterChat}>

            {
                recipient ?
                    (<UserAvatar src={recipient?.photoURL}/>)
                    :
                    (<UserAvatar>

                        {
                            recipientEmail?.[0]
                        }
                    </UserAvatar>)
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