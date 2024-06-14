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
  const [isMicHovered, setIsMicHovered] = useState(false);
  const [isCamHovered, setIsCamHovered] = useState(false);
  const [isConnectHovered, setIsConnectHovered] = useState(false);
  const [isChatHovered, setIsChatHovered] = useState(false);
  const [isDisconnectHovered, setIsDisconnectHovered] = useState(false);

  const [isMuted, setIsMuted] = useState(true);
  const [isCameraOff, setIsCameraOff] = useState(true);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [connected, setConnected] = useState(false);

  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<
    { sender: string; content: string; timestamp: string }[]
  >([]);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      // @ts-ignore
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

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
          toast.dark(
            <div className="flex items-center">
              <div className="mr-2 text-blue-500 ">
                <FiMessageSquare size={25} />
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
    // stompClient.send(
    //   `/app/sendMessage/${code}`,
    //   {},
    //   JSON.stringify({
    //     type: 'LEAVE',
    //     sender: userId,
    //     content: null,
    //     timestamp: null,
    //   }),
    // );

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

      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        className="bg-gradient-to-tr from-zinc-900 to-zinc-800 border-zinc-500 border-2"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                <h1 className="text-2xl font-bold text-white">Instruction</h1>
              </ModalHeader>
              <ModalBody>
                <span className="flex text-white">
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
        <div className="relative">
          <video
            className={`camFormat ${isCameraOff ? '' : 'flex'}`}
            ref={localVideoRef}
            autoPlay
          ></video>

          {!isCameraOff && (
            <div className="absolute camOffFormat inset-0 flexCenter sm:flex-row flex-col bg-zinc-800 text-white">
              <FiCameraOff size={25} className="mb-2 sm:mb-0 flexCenter" />
              Camera is off
            </div>
          )}
        </div>

        <video className="camFormat" ref={remoteVideoRef} autoPlay></video>
        <video className="camFormat" ref={remoteVideoRef} autoPlay></video>
        <video className="camFormat" ref={remoteVideoRef} autoPlay></video>
      </div>

      <div className="fixed z-50 w-2/3 max-w-lg sm:max-w-xs h-12 border border-zinc-600 rounded-full bottom-4 bg-zinc-900">
        <div className="grid h-full sm:max-w-lg grid-cols-5 mx-auto ">
          <button
            className="bottomBarFormat border-r-1 relative"
            onClick={handleMicControl}
            onMouseEnter={() => setIsMicHovered(true)}
            onMouseLeave={() => setIsMicHovered(false)}
          >
            {!isMuted ? (
              <FiMicOff className="text-red-500" size={20} />
            ) : (
              <FiMic size={20} />
            )}
            <span
              className={`tooltip absolute bottom-full mb-2 px-2 py-2 text-sm text-white bg-zinc-800 rounded-lg opacity-0 ${isMicHovered ? 'opacity-100' : 'hidden'} transition-all duration-200 w-32`}
            >
              {!isMuted ? 'Turn on mic' : 'Turn off mic'}
            </span>
          </button>

          <button
            className="bottomBarFormat border-r-1 relative"
            onClick={handleCameraControl}
            onMouseEnter={() => setIsCamHovered(true)}
            onMouseLeave={() => setIsCamHovered(false)}
          >
            {!isCameraOff ? (
              <FiCameraOff className="text-red-500" size={20} />
            ) : (
              <FiCamera size={20} />
            )}
            <span
              className={`tooltip absolute bottom-full mb-2 px-2 py-2 text-sm text-white bg-zinc-800 rounded-lg opacity-0 ${isCamHovered ? 'opacity-100' : 'hidden'} transition-all duration-200 w-32`}
            >
              {!isCameraOff ? 'Turn on camera' : 'Turn off camera'}
            </span>
          </button>

          <button
            className="bottomBarFormat border-r-1 relative"
            onClick={handleConnect}
            disabled={connected}
            onMouseEnter={() => setIsConnectHovered(true)}
            onMouseLeave={() => setIsConnectHovered(false)}
          >
            {!connected ? (
              <FiPlayCircle size={20} />
            ) : (
              <FiPlayCircle size={20} className="text-gray-20" />
            )}
            <span
              className={`tooltip absolute bottom-full mb-2 px-2 py-2 text-sm text-white bg-zinc-800 rounded-lg opacity-0 ${isConnectHovered ? 'opacity-100' : 'hidden'} transition-all duration-200 w-32`}
            >
              {!connected ? 'Connect' : ''}
            </span>
          </button>

          <button
            className="bottomBarFormat border-r-1 relative"
            onClick={() => {
              handleOpenChat();
            }}
            onMouseEnter={() => setIsChatHovered(true)}
            onMouseLeave={() => setIsChatHovered(false)}
          >
            {!isChatOpen ? (
              <FiMessageSquare size={20} />
            ) : (
              <FiMessageSquare
                size={20}
                fontSize={1.5}
                className="text-purple-500 font-bold"
              />
            )}
            <span
              className={`tooltip absolute bottom-full mb-2 px-2 py-2 text-sm text-white bg-zinc-800 rounded-lg opacity-0 ${isChatHovered ? 'opacity-100' : 'hidden'} transition-all duration-200 w-32`}
            >
              {!isChatOpen ? 'Open chat box' : 'Close chat box'}
            </span>
          </button>

          <button
            className="bottomBarFormat bg-red-500 rounded-r-full relative"
            onClick={handleDisconnect}
            onMouseEnter={() => setIsDisconnectHovered(true)}
            onMouseLeave={() => setIsDisconnectHovered(false)}
          >
            <FiPhoneOff size={20} className="text-white" />
            <span
              className={`tooltip absolute bottom-full mb-2 px-2 py-2 text-sm text-white bg-zinc-800 rounded-lg opacity-0 ${isDisconnectHovered ? 'opacity-100' : 'hidden'} transition-all duration-200 w-32`}
            >
              {!connected ? 'Disconnect' : ''}
            </span>
          </button>
        </div>
      </div>

      {/* Message area */}
      <div
        className={`fixed right-0 ${
          isChatOpen ? 'w-80' : 'w-0'
        } transition-width duration-300 ease-in-out bg-white h-[80%] shadow-xl rounded-tl-2xl rounded-bl-2xl bg-gradient-to-bl from-zinc-900 to-zinc-800 border-zinc-500 border-2 border-r-0`}
      >
        {isChatOpen && (
          <div className="z-1 h-[93%] p-4 flex flex-col ">
            <p className="font-semibold text-xl mb-4 text-white">
              In-call messages
            </p>
            <span className="bg-blue-100/20 text-center rounded-xl p-3 text-sm mb-4 text-white">
              Messages can only be seen by people in the call when the message
              is sent. All are deleted when the call ends.
            </span>
            <div className="flex-1 overflow-y-auto scroll-smooth">
              <div>
                {messages.map((msg, index) => (
                  <div
                    key={index}
                    className="break-words flex flex-col mb-2 bg-neutral-800 rounded-xl p-2 border-zinc-500 border-1"
                  >
                    <div className="flex space-x-2 items-center">
                      <p className="font-bold text-sm uppercase font-serif text-white">
                        {msg.sender}
                      </p>{' '}
                      <span className="text-gray-200 text-sm">
                        {msg.timestamp}
                      </span>
                    </div>
                    <span className="ml-3 text-sm font-serif font-medium text-white">
                      {msg.content}
                    </span>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            </div>
            <div className="fixed bottom-28 flex pl-3 pt-2">
              <input
                type="text"
                value={message}
                onChange={handleInput}
                onKeyUp={handleKeyPress}
                placeholder="Type your message..."
                className=" p-2 border border-slate-500 font-serif font-medium rounded-l-lg shadow-lg  text-white bg-gradient-to-bl from-zinc-900 to-zinc-800"
              />
              <button
                onClick={handleSendMessage}
                className={`p-4 text-white rounded-r-lg shadow-lg ${message.trim().length === 0 ? 'bg-zinc-600 cursor-not-allowed' : 'bg-purple-500'}`}
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
