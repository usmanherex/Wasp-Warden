import React, { useState, useEffect, useRef } from "react";
import { jwtDecode } from "jwt-decode";
import io from "socket.io-client";
import ContactList from "../components/Inbox/ContactList";
import ChatWindow from "../components/Inbox/ChatWindow";

const InboxPage = () => {
  const [contacts, setContacts] = useState([]);
  const [selectedContact, setSelectedContact] = useState(null);
  const [messages, setMessages] = useState([]);
  const [isRecording, setIsRecording] = useState(false);
  const socketRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const [currentUserId, setCurrentUserId] = useState(null);
  const mediaStreamRef = useRef(null);
  
  // New state for call handling
  const [callState, setCallState] = useState(null);
  const [localStream, setLocalStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  const peerConnectionRef = useRef(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const userData = jwtDecode(token);
      setCurrentUserId(userData.user.userId);
    }
  }, []);

  useEffect(() => {
    initializeSocket();
    fetchContacts();
    return () => {
      socketRef.current?.disconnect();
      cleanupCall();
    };
  }, [currentUserId]);

  useEffect(() => {
    if (selectedContact) {
      fetchMessages();
      joinChat();
    }
    return () => {
      if (selectedContact) {
        leaveChat();
      }
    };
  }, [selectedContact]);

  const initializeSocket = () => {
    socketRef.current = io("http://localhost:5000", {
      query: { token: localStorage.getItem("token") },
    });

    socketRef.current.on("new_message", (message) => {
      setMessages((prev) => [...prev, message]);
    });

    // Add call-related socket event listeners
    socketRef.current.on("incoming_call", handleIncomingCall);
    socketRef.current.on("call_accepted", handleCallAccepted);
    socketRef.current.on("call_rejected", handleCallRejected);
    socketRef.current.on("call_ended", handleCallEnded);
    socketRef.current.on("ice_candidate", handleIceCandidate);
  };

  // Call handling functions
  const initializePeerConnection = async () => {
    const configuration = {
      iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
    };

    const pc = new RTCPeerConnection(configuration);

    pc.onicecandidate = (event) => {
      if (event.candidate && socketRef.current) {
        socketRef.current.emit("ice_candidate", {
          chatId: selectedContact.chatId,
          candidate: event.candidate,
        });
      }
    };

    pc.ontrack = (event) => {
      setRemoteStream(event.streams[0]);
    };

    peerConnectionRef.current = pc;
    return pc;
  };

  const startCall = async (callType) => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: callType === "video",
        audio: true,
      });

      setLocalStream(stream);
      const pc = await initializePeerConnection();
      stream.getTracks().forEach((track) => {
        pc.addTrack(track, stream);
      });

      socketRef.current.emit("initiate_call", {
        chatId: selectedContact.chatId,
        receiverId:
          currentUserId === selectedContact.user1Id
            ? selectedContact.user2Id
            : selectedContact.user1Id,
        callType,
      });

      setCallState("calling");
    } catch (error) {
      console.error("Error starting call:", error);
      alert("Could not access camera/microphone");
    }
  };

  const handleIncomingCall = async (data) => {
    setCallState({ ...data, status: "incoming" });
  };

  const acceptCall = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: callState.callType === "video",
        audio: true,
      });

      setLocalStream(stream);
      const pc = await initializePeerConnection();
      stream.getTracks().forEach((track) => {
        pc.addTrack(track, stream);
      });

      socketRef.current.emit("accept_call", {
        chatId: selectedContact.chatId,
        callId: callState.callId,
      });

      setCallState((prev) => ({ ...prev, status: "connected" }));
    } catch (error) {
      console.error("Error accepting call:", error);
      rejectCall("Failed to access media devices");
    }
  };

  const rejectCall = (reason = "declined") => {
    socketRef.current.emit("reject_call", {
      chatId: selectedContact.chatId,
      callId: callState.callId,
      reason,
    });
    cleanupCall();
  };

  const handleCallAccepted = async (data) => {
    setCallState((prev) => ({ ...prev, status: "connected" }));
  };

  const handleCallRejected = (data) => {
    cleanupCall();
  };

  const handleCallEnded = () => {
    cleanupCall();
  };

  const handleIceCandidate = (data) => {
    if (peerConnectionRef.current) {
      peerConnectionRef.current.addIceCandidate(new RTCIceCandidate(data.candidate));
    }
  };

  const endCall = () => {
    if (socketRef.current && callState) {
      socketRef.current.emit("end_call", {
        chatId: selectedContact.chatId,
        callId: callState.callId  // Make sure this is being passed
      });
    }
    cleanupCall();
  };

  const cleanupCall = () => {
    if (localStream) {
      localStream.getTracks().forEach((track) => track.stop());
    }
    if (peerConnectionRef.current) {
      peerConnectionRef.current.close();
      peerConnectionRef.current = null;
    }
    setLocalStream(null);
    setRemoteStream(null);
    setCallState(null);
  };

  const joinChat = () => {
    if (socketRef.current && selectedContact) {
      socketRef.current.emit("join_chat", { chatId: selectedContact.chatId });
    }
  };

  const leaveChat = () => {
    if (socketRef.current && selectedContact) {
      socketRef.current.emit("leave_chat", { chatId: selectedContact.chatId });
    }
  };

  const fetchContacts = async () => {
    if (!currentUserId) return;

    try {
      const response = await fetch(
        `http://localhost:5000/api/chats/${currentUserId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      const data = await response.json();
      setContacts(data);
    } catch (error) {
      console.error("Error fetching contacts:", error);
    }
  };

  const fetchMessages = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/messages/${selectedContact.chatId}`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      const data = await response.json();
      setMessages(data);
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  const handleSendMessage = (content) => {
    const messageData = {
      chatId: selectedContact.chatId,
      receiverId:
        currentUserId === selectedContact.user1Id
          ? selectedContact.user2Id
          : selectedContact.user1Id,
      messageType: "text",
      content,
    };
    socketRef.current.emit("send_message", messageData);
  };

  const handleFileSelect = async (file) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      const messageData = {
        chatId: selectedContact.chatId,
        receiverId:
          currentUserId === selectedContact.user1Id
            ? selectedContact.user2Id
            : selectedContact.user1Id,
        messageType: file.type.startsWith("image/") ? "image" : "file",
        fileData: e.target.result,
        contentType: file.type,
      };
      socketRef.current.emit("send_message", messageData);
    };

    reader.readAsDataURL(file);
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaStreamRef.current = stream;
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorderRef.current.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, {
          type: "audio/webm",
        });

        if (mediaStreamRef.current) {
          mediaStreamRef.current.getTracks().forEach((track) => track.stop());
          mediaStreamRef.current = null;
        }

        const formData = new FormData();
        formData.append("file", audioBlob, "voice_message.webm");

        try {
          const response = await fetch("http://localhost:5000/api/upload", {
            method: "POST",
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            body: formData,
          });
          const data = await response.json();

          const messageData = {
            chatId: selectedContact.chatId,
            receiverId:
              currentUserId === selectedContact.user1Id
                ? selectedContact.user2Id
                : selectedContact.user1Id,
            messageType: "audio",
            fileUrl: data.fileUrl,
          };
          socketRef.current.emit("send_message", messageData);
        } catch (error) {
          console.error("Error uploading audio:", error);
        }
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
    } catch (error) {
      console.error("Error starting recording:", error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  useEffect(() => {
    return () => {
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach((track) => track.stop());
        mediaStreamRef.current = null;
      }
      if (mediaRecorderRef.current) {
        mediaRecorderRef.current = null;
      }
      audioChunksRef.current = [];
    };
  }, []);

  return (
    <div className="flex h-screen bg-white">
      <ContactList
        contacts={contacts}
        setSelectedContact={setSelectedContact}
        currentUserId={currentUserId}
      />
      {selectedContact ? (
        <ChatWindow
          selectedContact={selectedContact}
          messages={messages}
          currentUserId={currentUserId}
          onSendMessage={handleSendMessage}
          onFileSelect={handleFileSelect}
          isRecording={isRecording}
          onStartRecording={startRecording}
          onStopRecording={stopRecording}
          callState={callState}
          localStream={localStream}
          remoteStream={remoteStream}
          onStartCall={startCall}
          onAcceptCall={acceptCall}
          onRejectCall={rejectCall}
          onEndCall={endCall}
        />
      ) : (
        <div className="flex-1 flex items-center justify-center">
          <p className="text-gray-500">Select a contact to start chatting</p>
        </div>
      )}
    </div>
  );
};

export default InboxPage;