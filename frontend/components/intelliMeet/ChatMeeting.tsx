import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import SockJS from 'sockjs-client'
import Stomp from 'stompjs'
import { useState } from "react";



const ChatMeeting = () => {

    const [message, setMessage] = useState("")
    const [nickName, setNickName]= useState("")
    const [stompClient, setStompClient]= useState("")
    let sock = new SockJS("http://localhost:8888/api/ws-message");
    let stomp= Stomp.over(sock);


    sock.onopen = function() {
        console.log('open');
        sock.send('test');
    };

    sock.onmessage = function(e) {
        console.log('message', e.data);
        sock.close();
    };

    sock.onclose = function() {
        console.log('close');
    };
    return (
        <div className="flexCenter">
            <Input type="text" placeholder="Type a message" />
            <Button onClick={handleSendMessage}>Send</Button>
        </div>
    )
}

export default ChatMeeting
