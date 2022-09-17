import { CircularProgress } from '@mui/material';
import React from 'react'

function Loading() {
    return (

        <div style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
            backgroundColor: "white"
        }}>
            <img src='/assets/img/whatsapp-logo.png'
                style={{
                    marginBottom: 20
                }}

                height={200}
                width={200}
            />
            <CircularProgress color='success' size={60} />


        </div>

    )
}

export default Loading;

