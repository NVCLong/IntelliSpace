import {useGoogleLogin} from "@react-oauth/google";
import {Button} from "@/components/auth_ui/button";
import {FcGoogle} from "react-icons/fc";
import React, {useState} from "react";
import axios from "axios";

export  const CustomButton= ()=>{
    const [accessToken, setAccessToken]= useState("");
    const login= useGoogleLogin({
        onSuccess:async codeResponse => {
            console.log(codeResponse)
            const response= await axios.get(`https://www.googleapis.com/oauth2/v3/userinfo?access_token=${codeResponse.access_token}`)
            console.log(response.data)
        },
        prompt: "select_account",
        onError: () => {
            console.log('Login failed')
        }
    })

    return(
        <Button className="socialFormBtn hoverScale" onClick={()=>{
            login();
        }}>
            <FcGoogle className="w-10 h-10" />
        </Button>
    )
}