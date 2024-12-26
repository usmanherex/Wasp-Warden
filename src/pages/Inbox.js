import React, { useState, useEffect, useRef } from "react";
import {
  Search,
  X,
  FileText,
  Send,
  Mic,
  Paperclip,
  MoreVertical,
  Phone,
  Video,
} from "lucide-react";
import io from "socket.io-client";
import { jwtDecode } from "jwt-decode";

const CustomInput = ({ className, ...props }) => (
  <input
    className={`border rounded-md px-3 py-2 w-full ${className}`}
    {...props}
  />
);

const CustomAvatar = ({ userId, name, className }) => {
  const [profilePicture, setProfilePicture] = useState(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchProfilePicture = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/api/users/profile-picture/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        if (response.ok) {
          const blob = await response.blob();
          const imageUrl = URL.createObjectURL(blob);
          setProfilePicture(imageUrl);
        } else {
          setError(true);
        }
      } catch (err) {
        console.error("Error fetching profile picture:", err);
        setError(true);
      }
    };

    if (userId) {
      fetchProfilePicture();
    }

    // Cleanup
    return () => {
      if (profilePicture) {
        URL.revokeObjectURL(profilePicture);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  return (
    <div
      className={`rounded-full overflow-hidden bg-blue-500 flex items-center justify-center text-white font-bold ${className}`}
    >
      {!error && profilePicture ? (
        <img
          src={profilePicture}
          alt={name}
          className="w-full h-full object-cover"
          onError={() => setError(true)}
        />
      ) : (
        <span className="text-lg">{name?.charAt(0).toUpperCase()}</span>
      )}
    </div>
  );
};

const ContactList = ({ contacts, setSelectedContact, currentUserId }) => {
  const [searchTerm, setSearchTerm] = useState("");

  // Filter contacts based on search term
  const filteredContacts = contacts.filter((contact) => {
    const contactName =
      currentUserId === contact.user1Id
        ? contact.user2Name.toLowerCase()
        : contact.user1Name.toLowerCase();
    return contactName.includes(searchTerm.toLowerCase());
  });

  return (
    <div className="w-64 border-r p-4">
      <div className="relative mb-4">
        <CustomInput
          type="text"
          placeholder="Search..."
          className="pl-8"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Search className="h-4 w-4 text-gray-400 absolute left-2 top-1/2 transform -translate-y-1/2" />
      </div>
      {filteredContacts.map((contact) => (
        <div
          key={contact.chatId}
          className="flex items-center mb-2 p-2 hover:bg-gray-100 cursor-pointer"
          onClick={() => setSelectedContact(contact)}
        >
          <CustomAvatar
            userId={
              currentUserId === contact.user1Id
                ? contact.user2Id
                : contact.user1Id
            }
            name={
              currentUserId === contact.user1Id
                ? contact.user2Name
                : contact.user1Name
            }
            className="h-10 w-10 mr-3"
          />
          <div>
            <div className="font-semibold">
              {currentUserId === contact.user1Id
                ? contact.user2Name
                : contact.user1Name}
            </div>
          </div>
        </div>
      ))}
      {filteredContacts.length === 0 && searchTerm && (
        <div className="text-center text-gray-500 mt-4">No contacts found</div>
      )}
    </div>
  );
};

const SearchOverlay = ({
  isOpen,
  onClose,
  onSearch,
  messages,
  scrollToMessage,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
    if (searchTerm) {
      const results = messages.filter(
        (msg) =>
          msg.messageType === "text" &&
          msg.content.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setSearchResults(results);
    } else {
      setSearchResults([]);
    }
  }, [searchTerm, messages]);

  if (!isOpen) return null;

  return (
    <div className="absolute top-0 right-0 w-80 h-full bg-white shadow-lg border-l z-50">
      <div className="p-4 border-b">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-semibold">Search Messages</h3>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>
        <div className="relative">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search in conversation..."
            className="w-full px-4 py-2 pr-10 rounded-lg border focus:border-blue-300 focus:ring focus:ring-blue-200"
          />
          <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        </div>
      </div>
      <div className="overflow-y-auto h-[calc(100%-80px)]">
        {searchResults.map((result) => (
          <div
            key={result.messageId}
            onClick={() => {
              scrollToMessage(result.messageId);
              onClose();
            }}
            className="p-4 hover:bg-gray-50 cursor-pointer border-b"
          >
            <div className="text-sm text-gray-500 mb-1">
              {new Date(result.timestamp).toLocaleTimeString([], {
                hour: "numeric",
                minute: "2-digit",
              })}
            </div>
            <div className="text-sm">
              {result.content.length > 100
                ? `${result.content.substring(0, 100)}...`
                : result.content}
            </div>
          </div>
        ))}
        {searchTerm && searchResults.length === 0 && (
          <div className="p-4 text-center text-gray-500">No messages found</div>
        )}
      </div>
    </div>
  );
};

const ChatWindow = ({
  selectedContact,
  messages,
  currentUserId,
  onSendMessage,
  onFileSelect,
  isRecording,
  onStartRecording,
  onStopRecording,
}) => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [highlightedMessageId, setHighlightedMessageId] = useState(null);
  const messageRefs = useRef({});

  const scrollToMessage = (messageId) => {
    setHighlightedMessageId(messageId);
    if (messageRefs.current[messageId]) {
      messageRefs.current[messageId].scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
      setTimeout(() => setHighlightedMessageId(null), 2000);
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-gray-50 relative">
      {/* Header */}
      <div className="border-b bg-white p-4 flex justify-between items-center shadow-sm">
        <div className="flex items-center">
          <CustomAvatar
            userId={
              currentUserId === selectedContact.user1Id
                ? selectedContact.user2Id
                : selectedContact.user1Id
            }
            name={
              currentUserId === selectedContact.user1Id
                ? selectedContact.user2Name
                : selectedContact.user1Name
            }
            className="h-12 w-12 mr-3 border-2 border-blue-200"
          />
          <div>
            <div className="font-bold text-lg">
              {currentUserId === selectedContact.user1Id
                ? selectedContact.user2Name
                : selectedContact.user1Name}
            </div>
            <div className="text-sm text-green-500">Online</div>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <button className="p-2 hover:bg-gray-100 rounded-full">
            <Phone className="h-5 w-5 text-gray-600" />
          </button>
          <button className="p-2 hover:bg-gray-100 rounded-full">
            <Video className="h-5 w-5 text-gray-600" />
          </button>
          <div className="relative">
            <button
              className="p-2 hover:bg-gray-100 rounded-full"
              onClick={() => setDropdownOpen(!dropdownOpen)}
            >
              <MoreVertical className="h-5 w-5 text-gray-600" />
            </button>
            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border z-50">
                <button
                  onClick={() => {
                    setIsSearchOpen(true);
                    setDropdownOpen(false);
                  }}
                  className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center"
                >
                  <Search className="h-4 w-4 mr-2" />
                  Search Messages
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        <div className="text-center">
          <span className="bg-gray-200 text-gray-600 text-xs px-3 py-1 rounded-full">
            Today
          </span>
        </div>
        {messages.map((message) => (
          <div
            key={message.messageId}
            ref={(el) => (messageRefs.current[message.messageId] = el)}
            className={`flex ${message.senderId === currentUserId
                ? "justify-end"
                : "justify-start"
              }`}
          >
            <div
              className={`max-w-[70%] ${message.senderId === currentUserId ? "order-2" : "order-1"
                }`}
            >
              <div
                className={`rounded-2xl p-3 ${message.senderId === currentUserId
                    ? "bg-blue-500 text-white mr-2"
                    : "bg-white text-gray-800 ml-2 shadow-sm"
                  } ${highlightedMessageId === message.messageId
                    ? "bg-yellow-100 text-gray-900"
                    : ""
                  }`}
              >
                {message.messageType === "text" && (
                  <p className="leading-relaxed">{message.content}</p>
                )}
                {message.messageType === "image" && (
                  <img
                    src={message.fileUrl}
                    alt="Shared"
                    className="rounded-lg max-w-sm"
                  />
                )}
                {message.messageType === "audio" && (
                  <audio controls className="max-w-xs">
                    <source src={message.fileUrl} type="audio/webm" />
                  </audio>
                )}
                {message.messageType === "file" && (
                  <a
                    href={message.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center text-sm"
                  >
                    <FileText className="mr-2" size={16} />
                    <span>Download File</span>
                  </a>
                )}
                <div
                  className={`text-xs mt-1 ${message.senderId === currentUserId
                      ? "text-blue-100"
                      : "text-gray-500"
                    }`}
                >
                  {new Date(message.timestamp).toLocaleTimeString([], {
                    hour: "numeric",
                    minute: "2-digit",
                  })}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Search Overlay */}
      <SearchOverlay
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        messages={messages}
        scrollToMessage={scrollToMessage}
      />

      {/* Message Input */}
      <MessageInput
        onSendMessage={onSendMessage}
        onFileSelect={onFileSelect}
        isRecording={isRecording}
        onStartRecording={onStartRecording}
        onStopRecording={onStopRecording}
      />
    </div>
  );
};

const MessageInput = ({
  onSendMessage,
  onFileSelect,
  isRecording,
  onStartRecording,
  onStopRecording,
}) => {
  const [message, setMessage] = useState("");
  const fileInputRef = useRef(null);
  const [recordingTime, setRecordingTime] = useState(0);
  const streamRef = useRef(null);

  useEffect(() => {
    let interval;
    if (isRecording) {
      interval = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
    } else {
      setRecordingTime(0);
      // Clean up media stream when recording stops
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
      }
    }
    return () => {
      clearInterval(interval);
      // Also clean up on component unmount
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
      }
    };
  }, [isRecording]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handleSubmit = () => {
    if (message.trim()) {
      onSendMessage(message);
      setMessage("");
    }
  };

  const handleStartRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      onStartRecording();
    } catch (error) {
      console.error("Error accessing microphone:", error);
    }
  };

  const handleStopRecording = () => {
    onStopRecording();
  };

  return (
    <div className="border-t bg-white p-4">
      <div className="flex items-center space-x-3 max-w-4xl mx-auto relative">
        <button
          onClick={() => fileInputRef.current?.click()}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <Paperclip className="h-5 w-5 text-gray-600" />
        </button>
        <div className="flex-1 relative">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSubmit();
              }
            }}
            className="w-full px-4 py-3 rounded-full border border-gray-200 focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50 transition-all"
            placeholder="Type a message..."
            disabled={isRecording}
          />
        </div>
        <input
          type="file"
          className="hidden"
          ref={fileInputRef}
          onChange={(e) => onFileSelect(e.target.files[0])}
        />
        {message ? (
          <button
            onClick={handleSubmit}
            className="p-3 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors shadow-lg"
          >
            <Send className="h-5 w-5" />
          </button>
        ) : (
          <button
            onClick={isRecording ? handleStopRecording : handleStartRecording}
            className={`p-3 rounded-full transition-colors shadow-lg relative ${isRecording
                ? "bg-red-500 hover:bg-red-600"
                : "bg-blue-500 hover:bg-blue-600"
              } text-white`}
          >
            <Mic className={`h-5 w-5 ${isRecording ? "animate-pulse" : ""}`} />
            {isRecording && (
              <span className="absolute -top-2 -right-2 bg-red-600 text-xs rounded-full px-2 py-1">
                {formatTime(recordingTime)}
              </span>
            )}
          </button>
        )}
      </div>
    </div>
  );
};

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
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedContact]);

  const initializeSocket = () => {
    socketRef.current = io("http://localhost:5000", {
      query: { token: localStorage.getItem("token") },
    });

    socketRef.current.on("new_message", (message) => {
      setMessages((prev) => [...prev, message]);
    });
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
    if (!currentUserId) {
      return;
    }

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
        fileData: e.target.result, // Base64 encoded file data
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
          mediaStreamRef.current.getTracks().forEach((track) => {
            track.stop();
          });
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

  const handleRecordingComplete = async (audioBlob) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      const messageData = {
        chatId: selectedContact.chatId,
        receiverId:
          currentUserId === selectedContact.user1Id
            ? selectedContact.user2Id
            : selectedContact.user1Id,
        messageType: "audio",
        fileData: e.target.result,
        contentType: "audio/webm",
      };
      socketRef.current.emit("send_message", messageData);
    };

    reader.readAsDataURL(audioBlob);
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);

      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, {
          type: "audio/webm",
        });
        handleRecordingComplete(audioBlob);
        audioChunksRef.current = [];
      };

      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach((track) => {
          track.stop();
        });
        mediaStreamRef.current = null;
      }

      mediaRecorderRef.current = null;
      audioChunksRef.current = [];
    }
  };

  useEffect(() => {
    return () => {
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach((track) => {
          track.stop();
        });
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
