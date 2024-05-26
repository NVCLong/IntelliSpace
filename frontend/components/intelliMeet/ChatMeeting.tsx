import 'react-toastify/dist/ReactToastify.css'

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import SockJS from 'sockjs-client'
import Stomp from 'stompjs'
import React, { MutableRefObject,SetStateAction, useEffect, useRef, useState } from "react";
import { getCode } from "@/lib/apiCall";
import { toast, ToastContainer } from "react-toastify";
import copy from "copy-to-clipboard";
import { Peer } from "peerjs";


const ChatMeeting = () => {

    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState([{
        sender:"",
        content:""
    }]);
    const [remotePeerId, setRemotePeerId] = useState(null);
    const myVideoRef = useRef(null);
    interface RemoteVideoRefs {
        [peerId: string]: React.RefObject<HTMLVideoElement> | null;
    }
    const [remoteVideoRefs, setRemoteVideoRefs] = useState(
      new Map<string, React.RefObject<HTMLVideoElement>>()
    );
    const [connectedPeers, setConnectedPeers] = useState<string[]>([]);
    const [myPeerId, setMyPeerId] = useState(null);
    const [nickName, setNickName] = useState("");
    const [connected, setConnected] = useState(false);
    const [stompClient, setStompClient] = useState(null);

    const [code, setCode]=useState("");
    // @ts-ignore
    const [myPeer, setMyPeer] = useState(null);
    const [remoteStreams, setRemoteStreams] = useState({});


    let userId: string | null;
    if(typeof  window !='undefined'){
        userId= localStorage.getItem("userId");
    }


    const onMessageReceived = (payload: { body: string; }) => {
        const newMessage = JSON.parse(payload.body);
        // @ts-ignore
        setMessages(prevMessages => [...prevMessages, newMessage]);
        console.log(newMessage)
    }


    useEffect(() => {
        console.log(stompClient)
        console.log(connected)
        console.log(myPeerId)
        if(stompClient && connected && code !==""){
           // @ts-ignore
            stompClient.subscribe(`/topic/room/${code}`, onMessageReceived);
        }
    }, [stompClient,connected, myPeerId]);



    const handleChangeName = (e: { target: { value: SetStateAction<string>; }; })=>{
        setNickName(e.target.value)
    }
    const handleInput=(e: { target: { value: SetStateAction<string>; }; })=>{
        setMessage(e.target.value)
    }


    const handleConnect = () => {
        const sock = new SockJS('http://localhost:8888/api/ws-message');
        const stompClient = Stomp.over(sock);

        // @ts-ignore
        setStompClient(stompClient); // Set stompClient immediately

        stompClient.connect({}, (frame) => {
            console.log('Connected:', frame);
            setConnected(true);
            localStorage.setItem("nickName", nickName);
        })
    };


    const handleSendMessage=()=>{
        if (stompClient && connected) {
            let username;
            if(typeof  window !="undefined"){
                username=localStorage.getItem("nickName")
            }
            // @ts-ignore
            stompClient.send(`/app/sendMessage/${code}`, {}, JSON.stringify({
                sender: username,
                content: message,
                peerId:myPeerId,
            }));
            setMessage('');
        }
    }
    const  handleChangeCode=(e: { target: { value: SetStateAction<string>; }; })=>{
        setCode(e.target.value)
    }

    const handleCreate=async  ()=>{
        try{
            // @ts-ignore
            const data = await getCode(userId);
            console.log(data)
            toast.success(<div>
                Code: {data.roomId}
                <br />
                Copied to clipboard
            </div>)
            copy(data.roomId);
        }catch (e){
            console.log(e)
            throw  e
        }
    }

    const addVideoStream = (videoRef: React.RefObject<HTMLVideoElement>, stream: any) => {
        console.log(videoRef)
        if (videoRef.current) {
            videoRef.current.srcObject = stream;
        } else {
            console.error("Error: videoRef or videoRef.current is undefined");
        }
    };

    // @ts-ignore
    // @ts-ignore
    return (
      <>
          <ToastContainer
            position="bottom-right"
            autoClose={8000}
            hideProgressBar={false}
            newestOnTop
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="colored"
          />

          <div className="flexCenter">
              {connected && (
                <ul>
                    {messages.map((msg, index) => (
                      <li key={index}>
                          <b>{msg.sender}:</b> {msg.content}
                      </li>
                    ))}
                </ul>
              )}

              <Input type="text" placeholder="Type a message" onChange={handleInput} value={message} />
              <Input type="text" placeholder="Enter nickname" value={nickName} onChange={handleChangeName} />
              <Input type="text" placeholder="Room code" value={code} onChange={handleChangeCode} />
              <Button onClick={handleSendMessage}>Send</Button>
              <Button onClick={handleCreate}>Create Room</Button>
              <Button onClick={handleConnect} disabled={connected}>Connect</Button>
          </div>
          <video ref={myVideoRef} autoPlay playsInline />
          {Object.keys(remoteStreams).map((peerId) => (
            <video
              key={peerId}
              autoPlay
              playsInline
              ref={(el) => {
                  if (el) {
                      // @ts-ignore
                      remoteVideoRefs.current[peerId] = el;  // Type-safe assignment
                      // @ts-ignore
                      el.srcObject = remoteStreams[peerId];
                  }
              }}
            />
          ))}
      </>
    )

}

export default ChatMeeting
