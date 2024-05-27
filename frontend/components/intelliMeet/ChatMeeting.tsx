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
import { useSearchParams } from "next/navigation";


const ChatMeeting = () => {

    const searchParams= useSearchParams();
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState([{
        sender:"",
        content:""
    }]);

    const [nickName, setNickName] = useState("");
    const [connected, setConnected] = useState(false);
    const [stompClient, setStompClient] = useState(null);

    const [code, setCode]=useState("");
    const localVideoRef = useRef(null);
    const remoteVideoRef = useRef(null);
    const [peerConnection, setPeerConnection] = useState(null);


    const createPeerConnection = (
      onTrack: (stream: MediaStream) => void,
      onIceCandidate: (candidate: RTCIceCandidate) => void
    ): RTCPeerConnection => {
        const config: RTCConfiguration = {
            iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
        };

        const peerConnection = new RTCPeerConnection(config); // Provide config object

        peerConnection.onicecandidate = (event) => {
            if (event.candidate) {
                onIceCandidate(event.candidate);
            }
        };

        peerConnection.ontrack = (event) => {
            onTrack(event.streams[0]);
        };

        return peerConnection;
    };

    const createOffer = async (peerConnection: RTCPeerConnection): Promise<RTCSessionDescriptionInit> => {
        const offer = await peerConnection.createOffer();
        await peerConnection.setLocalDescription(offer);
        return offer;
    };

    const createAnswer = async (peerConnection: RTCPeerConnection, offer: RTCSessionDescriptionInit): Promise<RTCSessionDescriptionInit> => {
        console.log(offer)
        await peerConnection.setRemoteDescription(new RTCSessionDescription(offer));
        const answer = await peerConnection.createAnswer();
        console.log(answer)
        await peerConnection.setLocalDescription(answer);
        return answer;
    };

    const addIceCandidate = async (peerConnection: RTCPeerConnection, candidate: RTCIceCandidateInit | undefined): Promise<void> => {
        if (candidate) {
            try {
                await peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
            } catch (error) {
                console.error("Error adding ICE candidate:", error);
            }
        }
    };



    const onMessageReceived = (payload: { body: string; }) => {
        const newMessage = JSON.parse(payload.body);
        console.log(newMessage.offer)
        // @ts-ignore
        setMessages(prevMessages => [...prevMessages, newMessage]);
        console.log("this is an offer")
        if(peerConnection!==null) {
            if (newMessage.type === 'offer') {
                // @ts-ignore
                console.log("Answer")
                // @ts-ignore
                createAnswer(peerConnection, newMessage.offer).then((answer) => {
                    // @ts-ignore
                    stompClient.send(`/app/answer/${code}`,{}, JSON.stringify({
                        type:"answer",
                        answer:answer,
                        candidate:null,
                        offer:null,
                    }));
                });
            } else if (newMessage.type === 'answer') {
                console.log("processing answer");
                // @ts-ignore
                if (peerConnection.signalingState === 'stable') {
                    console.log("Initiating renegotiation...");

                    createOffer(peerConnection).then((offer: any) => {
                        console.log("running")
                        // @ts-ignore
                        stompClient.send(`/app/offer/${code}`, {}, JSON.stringify({
                            type: "offer", // Include the type field with value "offer"
                            offer: offer,
                            answer:null,
                            candidate:null
                        }));
                    });
                } else {
                    // Proceed with setting the remote answer since the state is not 'stable'
                    // @ts-ignore
                    peerConnection.setRemoteDescription(new RTCSessionDescription(newMessage.answer))
                      .catch((error: any) => {
                          console.error("Error setting remote description:", error);
                      });
                }

            } else if (newMessage.type === 'candidate') {
                console.log("processing candidate");

                if (peerConnection && newMessage.candidate) { // Check if peerConnection and candidate are defined
                    addIceCandidate(peerConnection, newMessage.candidate).catch((error: any) => {
                        console.error("Error adding ICE candidate:", error);
                    });
                } else {
                    console.warn("Skipping adding ICE candidate due to null peerConnection or candidate.");
                }
            }
        }
    }


    useEffect(() => {

        console.log(searchParams.get("roomId"))
        // @ts-ignore
        setCode(searchParams.get("roomId"))


        if(stompClient && connected && code !==""){
           // @ts-ignore
            stompClient.subscribe(`/topic/room/${code}`, onMessageReceived,(error)=>{
                console.error(error)
            });
        }
    }, [stompClient, connected, code]);


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

            const pc=createPeerConnection((stream)=>{
                // @ts-ignore
                remoteVideoRef.current.srcObject=stream
                console.log(remoteVideoRef)
            },(candidate)=>{
                stompClient.send(`/app/candidate/${code}`,{},JSON.stringify({
                    type:"candidate",
                    candidate:candidate,
                    offer:null,
                    answer:null,
                }))
            })
            // @ts-ignore
            setPeerConnection(pc);
            navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then((stream) => {
                // @ts-ignore
                localVideoRef.current.srcObject = stream;
                stream.getTracks().forEach((track) => pc.addTrack(track, stream));
            });


                // @ts-ignore
                console.log("running");
                // @ts-ignore
                createOffer(pc).then((offer: any) => {
                    console.log("running")
                    // @ts-ignore
                    stompClient.send(`/app/offer/${code}`, {}, JSON.stringify({
                        type: "offer", // Include the type field with value "offer"
                        offer: offer,
                        answer:null,
                        candidate:null
                    }));
                });
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
            }));
            setMessage('');
        }
    }
    const  handleChangeCode=(e: { target: { value: SetStateAction<string>; }; })=>{
        setCode(e.target.value)
    }





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
              <video ref={localVideoRef} autoPlay muted></video>
              <video ref={remoteVideoRef} autoPlay></video>

              <Input type="text" placeholder="Type a message" onChange={handleInput} value={message} />
              <Input type="text" placeholder="Enter nickname" value={nickName} onChange={handleChangeName} />
              <Button onClick={handleSendMessage}>Send</Button>
              <Button onClick={handleConnect} disabled={connected}>Connect</Button>
          </div>

      </>
    )

}

export default ChatMeeting
