import 'react-toastify/dist/ReactToastify.css';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import SockJS from 'sockjs-client';
import Stomp from 'stompjs';
import React, {
  MutableRefObject,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from 'react';
import { getCode } from '@/lib/apiCall';
import { toast, ToastContainer } from 'react-toastify';
import copy from 'copy-to-clipboard';
import { Peer } from 'peerjs';
import { useSearchParams } from 'next/navigation';

const ChatMeeting = () => {
  const searchParams = useSearchParams();
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([
    {
      sender: '',
      content: '',
    },
  ]);

  const [nickName, setNickName] = useState('');
  const [connected, setConnected] = useState(false);
  const [stompClient, setStompClient] = useState(null);

  const [code, setCode] = useState('');
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const [peerConnection, setPeerConnection] = useState(null);

  const onMessageReceived = (payload: { body: string }) => {
    const newMessage = JSON.parse(payload.body);

    setMessages((prevMessages) => [...prevMessages, newMessage]);
  };

  useEffect(() => {
    console.log(searchParams.get('roomId'));
    // @ts-ignore
    setCode(searchParams.get('roomId'));

    if (stompClient && connected && code !== '') {
      // @ts-ignore
      stompClient.subscribe(
        `/topic/room/${code}`,
        onMessageReceived,
        (error:any) => {
          console.error(error);
        },
      );
    }
  }, []);

  const handleChangeName = (e: {
    target: { value: SetStateAction<string> };
  }) => {
    setNickName(e.target.value);
  };
  const handleInput = (e: { target: { value: SetStateAction<string> } }) => {
    setMessage(e.target.value);
  };

  const handleConnect = () => {
    const sock = new SockJS('http://localhost:8888/api/ws-message');
    const stompClient = Stomp.over(sock);
    // @ts-ignore
    const peer = new Peer({
      config: {
        iceServers: [{ url: 'stun:stun.l.google.com:19302' }],
      } /* Sample servers, please use appropriate ones */,
    });
    // @ts-ignore
    setPeerConnection(peer);

    // @ts-ignore
    setStompClient(stompClient); // Set stompClient immediately

    stompClient.connect({}, (frame) => {
      console.log('Connected:', frame);
      setConnected(true);
      localStorage.setItem('nickName', nickName);
      let username: string | null;
      if (typeof window != 'undefined') {
        username = localStorage.getItem('nickName');
      }

      // @ts-ignore
      peer.on('open', (id) => {
        console.log('My peerId: ' + id);
        stompClient.send(
          `/app/sendMessage/${code}`,
          {},
          JSON.stringify({
            type: 'JOIN',
            sender: username,
            content: null,
            peerId: id,
          }),
        );
      });
      navigator.mediaDevices
        .getUserMedia({ video: true, audio: true })
        .then((stream) => {
          // @ts-ignore
          addVideoStream(localVideoRef, stream);
          stompClient.subscribe(`/topic/room/${code}`, (message) => {
            const parsedMessage = JSON.parse(message.body);
            if (parsedMessage.type === 'CHAT') {
              onMessageReceived(message);
            } else if (parsedMessage.type === 'JOIN') {
              // When someone new joins, initiate a call to them
              console.log(peerConnection);
              connectToNewUser(parsedMessage.peerId, stream, peer);
            }
          });

          peer.on('call', (call) => {
            call.answer(stream);

            call.on('stream', (userVideoStream) => {
              addVideoStream(remoteVideoRef, userVideoStream);
            });
          });
        })
        .catch((error) =>
          console.error('Error accessing media devices:', error),
        );
    });
  };

  const addVideoStream = (
    ref: React.MutableRefObject<null>,
    stream: MediaStream,
  ) => {
    // @ts-ignore
    ref.current.srcObject = stream;
  };
  const connectToNewUser = (
    userId: string,
    stream: MediaStream,
    peer: Peer,
  ) => {
    // Use 'peer' directly
    console.log('Other id ' + userId);

    if (!peer) {
      console.error('Peer instance not available.');
      return;
    }

    const call = peer.call(userId, stream);
    console.log(call);

    call.on('stream', (userVideoStream: MediaStream) => {
      console.log('calling');
      console.log('Received userVideoStream:', userVideoStream);
      addVideoStream(remoteVideoRef, userVideoStream);
    });

    call.on('error', (error: any) => {
      console.error('PeerJS call error:', error);
    });
  };

  const handleSendMessage = () => {
    if (stompClient && connected) {
      let username;
      if (typeof window != 'undefined') {
        username = localStorage.getItem('nickName');
      }
      // @ts-ignore
      stompClient.send(
        `/app/sendMessage/${code}`,
        {},
        JSON.stringify({
          type: 'CHAT',
          sender: username,
          content: message,
          peerId: null,
        }),
      );
      setMessage('');
    }
  };

  return (
    <div className="flexCenter flex-col h-screen">
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

      <div className="grid sm:grid-cols-2 grid-cols-1 gap-4 p-4">
        <video
          className="rounded-lg shadow-lg border-2  hover:border-2 hover:border-blue-300 duration-200 transition-all camFormat"
          ref={localVideoRef}
          autoPlay
        ></video>
        <video
          className="rounded-lg shadow-lg border-2  hover:border-2 hover:border-blue-300 duration-200 transition-all camFormat"
          ref={remoteVideoRef}
          autoPlay
        ></video>
        <video
          className="rounded-lg shadow-lg border-2  hover:border-2 hover:border-blue-300 duration-200 transition-all camFormat"
          ref={localVideoRef}
          autoPlay
        ></video>
        <video
          className="rounded-lg shadow-lg border-2  hover:border-2 hover:border-blue-300 duration-200 transition-all camFormat"
          ref={remoteVideoRef}
          autoPlay
        ></video>
      </div>

      <div className="">
        {connected && (
          <ul>
            {messages.map((msg, index) => (
              <li key={index}>
                <b>{msg.sender}</b> {msg.content}
              </li>
            ))}
          </ul>
        )}

        <div className="flex flex-col">
          <Button onClick={handleConnect} disabled={connected}>
            Connect
          </Button>
          <Input
            type="text"
            placeholder="Enter nickname"
            value={nickName}
            onChange={handleChangeName}
          />
          <Input
            type="text"
            placeholder="Type a message"
            onChange={handleInput}
            value={message}
          />
          <Button onClick={handleSendMessage}>Send</Button>
        </div>
      </div>
    </div>
  );
};

export default ChatMeeting;
