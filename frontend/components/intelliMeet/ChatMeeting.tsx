import 'react-toastify/dist/ReactToastify.css';
import SockJS from 'sockjs-client';
import Stomp from 'stompjs';
import React, {
  Fragment,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from 'react';
import { ToastContainer } from 'react-toastify';
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
  const [connected, setConnected] = useState(false);

  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([
    {
      sender: '',
      content: '',
    },
  ]);

  const [nickName, setNickName] = useState('');
  const [stompClient, setStompClient] = useState(null);

  const [code, setCode] = useState('');
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const useReference = useRef(null);
  const [peerConnection, setPeerConnection] = useState(null);

  const [isChatOpen, setIsChatOpen] = useState(false);

  const onMessageReceived = (payload: { body: string }) => {
    const newMessage = JSON.parse(payload.body);

    setMessages((prevMessages) => [...prevMessages, newMessage]);
  };
  let userId: string | null;
  if (typeof window !== 'undefined') {
    userId = localStorage.getItem('userId');
  }

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
      console.log(call);
      console.log(remoteVideoRef);
      call.on('stream', (userVideoStream: MediaStream) => {
        console.log('calling');
        console.log('Received userVideoStream:', userVideoStream);

        addVideoStream(remoteVideoRef, userVideoStream);
        // addVideoStream(useReference, userVideoStream);
      });

      call.on('error', (error: any) => {
        console.error('PeerJS call error:', error);
      });
    }
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
          sender: userId,
          content: message,
          peerId: null,
        }),
      );
      setMessage('');
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
    if (localVideoRef.current.srcObject != null) {
      // @ts-ignore
      localVideoRef.current.srcObject.getTracks().forEach((track) => {
        track.stop();
      });

      if (peerConnection) {
        // @ts-ignore
        peerConnection.destroy();
        setPeerConnection(null);
      }
      if (stompClient) {
        // @ts-ignore
        stompClient.unsubscribe(`/topic/room/${code}`);
      }

      // @ts-ignore
      localVideoRef.current.srcObject = null;
      // @ts-ignore
      remoteVideoRef.current.srcObject = null;

      router.push('/intelliMeetHome');
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
          ref={remoteVideoRef}
          autoPlay
        ></video>
        <video
          className="rounded-lg shadow-lg border-2  hover:border-2 hover:border-blue-300 duration-200 transition-all camFormat"
          ref={remoteVideoRef}
          autoPlay
        ></video>
      </div>

      {/* <div className="">
        {connected && (
          <ul>
            {messages.map((msg, index) => (
              <li key={index}>
                <b>{msg.sender}</b> {msg.content}
              </li>
            ))}
          </ul>
        )}
      </div> */}

      {/*Floating bar*/}
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
            onClick={() => setIsChatOpen(!isChatOpen)}
          >
            <FiMessageSquare size={20} />
          </button>

          <button
            className="flexCenter  rounded-r-full bg-red-600"
            onClick={handleDisconnect}
          >
            <FiPhoneOff size={20} className="text-white" />
          </button>
        </div>
      </div>
      {/* Message area */}
      <div
        className={`fixed right-0 top-0 h-full ${isChatOpen ? 'w-96' : 'w-0'
          } transition-width duration-300 ease-in-out bg-white shadow-lg`}
      >
        {isChatOpen && (
          <div className="h-full p-4 flex flex-col">
            <p className="font-bold text-3xl mb-4">Chat</p>
            <div className="flex-1 overflow-y-auto">
              <ul>
                {messages.map((msg, index) => (
                  <li key={index}>
                    <b>{msg.sender}</b> {msg.content}
                  </li>
                ))}
              </ul>
            </div>
            <div className="mt-4 flex">
              <input
                type="text"
                value={message}
                onChange={handleInput}
                placeholder="Type your message..."
                className="flex-1 p-2 border border-gray-300 rounded-l-lg"
              />
              <button
                onClick={handleSendMessage}
                className="p-2 bg-blue-500 text-white rounded-r-lg"
              >
                Send
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatMeeting;
