import 'react-toastify/dist/ReactToastify.css';
import SockJS from 'sockjs-client';
import Stomp from 'stompjs';
import React, { SetStateAction, useEffect, useRef, useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';

import { Peer } from 'peerjs';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  FiCamera,
  FiCameraOff,
  FiMessageSquare,
  FiMic,
  FiMicOff,
  FiPhoneOff,
  FiPlayCircle,
  FiSend,
} from 'react-icons/fi';
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from '@nextui-org/react';

const ChatMeeting = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const [isMuted, setIsMuted] = useState(true);
  const [isCameraOff, setIsCameraOff] = useState(true);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [connected, setConnected] = useState(false);

  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<
    { sender: string; content: string; timestamp: string }[]
  >([]);

  const [nickName, setNickName] = useState('');
  const [stompClient, setStompClient] = useState(null);

  const [code, setCode] = useState('');
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const [peerConnection, setPeerConnection] = useState(null);

  let userId: string | null;
  if (typeof window !== 'undefined') {
    userId = localStorage.getItem('userId');
  }

  const onMessageReceived = (payload: { body: string }) => {
    const newMessage = JSON.parse(payload.body);
    if (newMessage.type === 'CHAT') {
      setMessages((prevMessages) => [...prevMessages, newMessage]);
      if (newMessage.userid != userId) {
        if (!isChatOpen) {
          toast(
            <div className="flex items-center">
              <div className="mr-2 text-blue-500 ">
                <FiMessageSquare size={20} />
              </div>
              <div className="flex items-end">
                <div className="flex-col">
                  <div className="text-sm">{newMessage.timestamp}</div>
                  <div className="mr-1 font-semibold font-serif">
                    {newMessage.sender}:
                  </div>
                </div>

                <div className="font-serif font-medium">
                  {newMessage.content}
                </div>
              </div>
            </div>,
          );
        }
      }
    } else if (newMessage.type === 'LEAVE') {
      // @ts-ignore
      remoteVideoRef.current.srcObject = null;
    }
  };

  const handleOpenChat = () => {
    setIsChatOpen((prevIsChatOpen) => !prevIsChatOpen);
    toast.dismiss();
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
        (error: any) => {
          console.error(error);
        },
      );
    }
    onOpen();
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
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const sock = new SockJS(
      'https://intelli-space-v1.azurewebsites.net/api/ws-message',
    );
    const stompClient = Stomp.over(sock);
    // @ts-ignore
    const peer = new Peer({
      config: {
        iceServers: [{ url: 'stun:stun.l.google.com:19302' }],
      },
    });
    // @ts-ignore
    setPeerConnection(peer);

    // @ts-ignore
    setStompClient(stompClient); // Set stompClient immediately

    stompClient.connect({}, (frame) => {
      console.log('Connected:', frame);
      setConnected(true);
      localStorage.setItem('nickName', nickName);

      // @ts-ignore
      peer.on('open', (id) => {
        console.log('My peerId: ' + id);
        stompClient.send(
          `/app/sendMessage/${code}`,
          {},
          JSON.stringify({
            type: 'JOIN',
            sender: userId,
            content: null,
            peerId: id,
            timestamp: null,
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
            call.on('close', () => {
              // @ts-ignore
              remoteVideoRef.current.srcObject = null;
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
    } else {
      const call = peer.call(userId, stream);

      call.on('stream', (userVideoStream: MediaStream) => {
        console.log('calling');
        console.log('Received userVideoStream:', userVideoStream);

        addVideoStream(remoteVideoRef, userVideoStream);
      });

      call.on('error', (error: any) => {
        console.error('PeerJS call error:', error);
      });
    }
  };

  const handleSendMessage = () => {
    if (stompClient && connected) {
      if (message.trim().length > 0) {
        const currentTime = new Date();
        const formattedTime = currentTime.toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        });
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
            sender: userId,
            content: message,
            peerId: null,
            userid: userId,
            timestamp: formattedTime,
          }),
        );
        // setMessages([...messages, { sender: 'You', content: message, timestamp: formattedTime }]);
        setMessage('');
      }
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  const handleMicControl = () => {
    console.log(isMuted);
    // @ts-ignore
    localVideoRef.current.srcObject.getAudioTracks()[0].enabled = !isMuted;
    setIsMuted(!isMuted);
  };

  const handleCameraControl = () => {
    // @ts-ignore
    localVideoRef.current.srcObject.getVideoTracks()[0].enabled = !isCameraOff;
    setIsCameraOff(!isCameraOff);
  };

  const handleDisconnect = () => {
    // @ts-ignore
    localVideoRef.current.srcObject.getTracks().forEach((track) => {
      track.stop();
    });
    // @ts-ignore
    stompClient.send(
      `/app/sendMessage/${code}`,
      {},
      JSON.stringify({
        type: 'LEAVE',
        sender: userId,
        content: null,
        timestamp: null,
      }),
    );

    // @ts-ignore
    peerConnection.destroy();
    setPeerConnection(null);

    // @ts-ignore
    stompClient.disconnect();
    // @ts-ignore
    stompClient.unsubscribe(`/topic/room/${code}`);

    // @ts-ignore
    localVideoRef.current.srcObject = null;
    // @ts-ignore
    remoteVideoRef.current.srcObject = null;

    router.push('/intelliMeetHome');
  };

  return (
    <div className="flexCenter flex-col h-screen">
      {!isChatOpen && (
        <ToastContainer
          onClick={() => {
            handleOpenChat();
          }}
          position="bottom-right"
          autoClose={90000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="colored"
        />
      )}

      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                <h1 className="text-2xl font-bold">Instruction</h1>
              </ModalHeader>
              <ModalBody>
                <span className="flex">
                  User must click on &nbsp;
                  <FiPlayCircle size={20} />
                  &nbsp; to connect.
                </span>
              </ModalBody>
              <ModalFooter>
                <Button color="primary" onPress={onClose}>
                  Agree
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      <div className="grid sm:grid-cols-2 grid-cols-1 gap-4 p-4 sm:mt-3">
        <video className="camFormat" ref={localVideoRef} autoPlay></video>
        <video className="camFormat" ref={remoteVideoRef} autoPlay></video>
        <video className="camFormat" ref={remoteVideoRef} autoPlay></video>
        <video className="camFormat" ref={remoteVideoRef} autoPlay></video>
      </div>

      <div className="fixed z-50 w-2/3 max-w-lg sm:max-w-xs h-12 bg-white border border-gray-200 rounded-full bottom-4">
        <div className="grid h-full sm:max-w-lg grid-cols-5 mx-auto ">
          <button
            className="flexCenter hover:bg-gray-200 rounded-l-full border-r-1"
            onClick={handleMicControl}
          >
            {!isMuted ? <FiMicOff size={20} /> : <FiMic size={20} />}
          </button>

          <button
            className="flexCenter hover:bg-gray-200 border-r-1"
            onClick={handleCameraControl}
          >
            {!isCameraOff ? <FiCameraOff size={20} /> : <FiCamera size={20} />}
          </button>

          <button
            className="flexCenter hover:bg-gray-200 border-r-1"
            onClick={handleConnect}
            disabled={connected}
          >
            {!connected ? (
              <FiPlayCircle size={20} />
            ) : (
              <FiPlayCircle size={20} className="text-gray-20" />
            )}
          </button>

          <button
            className="flexCenter hover:bg-gray-200 border-r-1"
            onClick={() => {
              handleOpenChat();
            }}
          >
            {!isChatOpen ? (
              <FiMessageSquare size={20} />
            ) : (
              <FiMessageSquare
                size={20}
                fontSize={1.5}
                className="text-blue-500 font-bold"
              />
            )}
          </button>

          <button
            className="flexCenter rounded-r-full bg-red-600"
            onClick={handleDisconnect}
          >
            <FiPhoneOff size={20} className="text-white" />
          </button>
        </div>
      </div>

      {/* Message area */}
      <div
        className={`fixed right-0 ${
          isChatOpen ? 'w-80' : 'w-0'
        } transition-width duration-300 ease-in-out bg-white h-[80%] shadow-xl rounded-tl-2xl rounded-bl-2xl`}
      >
        {isChatOpen && (
          <div className="z-1 h-[93%] p-4 flex flex-col ">
            <p className="font-semibold text-xl mb-4">In-call messages</p>
            <span className="bg-blue-100/30 text-center rounded-xl p-3 text-sm mb-4">
              Messages can only be seen by people in the call when the message
              is sent. All are deleted when the call ends.
            </span>
            <div className="flex-1 overflow-y-auto">
              <div>
                {messages.map((msg, index) => (
                  <div
                    key={index}
                    className="break-words flex flex-col mb-2 bg-gradient-to-l from-slate-50 to-slate-100 rounded-xl p-2"
                  >
                    <div className="flex space-x-2 items-center">
                      <p className="text-gray-900 font-bold text-sm uppercase font-serif">
                        {msg.sender}
                      </p>{' '}
                      <span className="text-gray-500 text-sm">
                        {msg.timestamp}
                      </span>
                    </div>
                    <span className="ml-3 text-sm font-serif font-medium">
                      {msg.content}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            <div className="fixed bottom-28 flex pl-3 pt-2">
              <input
                type="text"
                value={message}
                onChange={handleInput}
                onKeyUp={handleKeyPress}
                placeholder="Type your message..."
                className=" p-2 border border-slate-300 font-serif font-medium rounded-l-lg shadow-lg focus:border-blue-300"
              />
              <button
                onClick={handleSendMessage}
                className={`p-4 text-white rounded-r-lg shadow-lg ${message.trim().length === 0 ? 'bg-gray-300 cursor-not-allowed' : 'bg-blue-500'}`}
                disabled={message.trim().length === 0}
              >
                <FiSend />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatMeeting;
