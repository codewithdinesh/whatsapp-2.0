import moment from 'moment/moment';
import React from 'react'
import { useAuthState } from 'react-firebase-hooks/auth';
import styled from "styled-components";
import { auth } from '../firebase';

const Message = ({ id, user, message }) => {

    const [currentUser] = useAuthState(auth);

    const TypeOfMessage = user === currentUser.email ? Sender : Reciever

    console.log("message:;;", message)

    return (

        <Container>

            <TypeOfMessage>{message.msg}

                <Timestamp>
                    {
                        message.timestamp ?
                            moment(message.timestamp).format('LT') : "..."
                    }
                </Timestamp>
            </TypeOfMessage>

        </Container>
    )
}

export default Message

const Container = styled.div``

const MessageElement = styled.div`
  width: fit-content;
  padding: 15px;
  border-radius: 8px;
  margin: 10px;
  min-width:60px;
  padding-bottom: 26px;
  position: relative;
  text-align:center;
`

const Sender = styled(MessageElement)`
  margin-left: auto;
  background-color: #dcf8c6;
`
const Reciever = styled(MessageElement)`
  text-align: left;
  background-color: whitesmoke;
`
const Timestamp = styled.span`
  color:gray;
  padding:10px;
  font-size:9px;
  position:absolute;
  bottom:0;
  right:0;
  text-align:right;
`