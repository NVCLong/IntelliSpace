import {useGoogleLogin} from "@react-oauth/google";
import {Button} from "@/components/auth_ui/button";
import {FcGoogle} from "react-icons/fc";
import React, {useState} from "react";
import axios from "axios";
import {useRouter} from "next/navigation";


export  const CustomButton= ()=>{
    const router = useRouter();
    const login= useGoogleLogin({
        onSuccess:async codeResponse => {
            console.log(codeResponse)
            const response= await axios.get(`https://www.googleapis.com/oauth2/v3/userinfo?access_token=${codeResponse.access_token}`)
            console.log(response.data)
            const loginResponse = await axios.get(`http://localhost:8888/api/auth/oauth2/login?name=${response.data.family_name}&email=${response.data.email}`);
            localStorage.setItem("access_token", loginResponse.data.accessToken);
            document.cookie = `refreshToken=${loginResponse.data.refreshToken}`;
            router.push("/dashboard")
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