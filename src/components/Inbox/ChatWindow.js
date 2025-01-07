import React, { useState, useRef, useEffect } from "react";
import { Phone, Video, MoreVertical, Search, FileText, X, Mic, MicOff, Camera, CameraOff } from "lucide-react";
import { CustomAvatar } from "./CustomComponents";
import SearchOverlay from "./SearchOverlay";
import MessageInput from "./MessageInput";

const ChatWindow = ({
  selectedContact,
  messages,
  currentUserId,
  onSendMessage,
  onFileSelect,
  isRecording,
  onStartRecording,
  onStopRecording,
  callState,
  localStream,
  remoteStream,
  onStartCall,
  onAcceptCall,
  onRejectCall,
  onEndCall,
}) => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [highlightedMessageId, setHighlightedMessageId] = useState(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const messageRefs = useRef({});
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const messagesEndRef = useRef(null);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Update video streams when they change
  useEffect(() => {
    if (localVideoRef.current && localStream) {
      localVideoRef.current.srcObject = localStream;
    }
  }, [localStream]);

  useEffect(() => {
    if (remoteVideoRef.current && remoteStream) {
      remoteVideoRef.current.srcObject = remoteStream;
    }
  }, [remoteStream]);

  // Cleanup function for streams
  useEffect(() => {
    return () => {
      if (localStream) {
        localStream.getTracks().forEach(track => track.stop());
      }
    };
  }, [localStream]);

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

  const handlePhoneClick = () => onStartCall('audio');
  const handleVideoClick = () => onStartCall('video');

  const handleMuteToggle = () => {
    if (localStream) {
      localStream.getAudioTracks().forEach(track => {
        track.enabled = !isMuted;
      });
      setIsMuted(!isMuted);
    }
  };

  const handleVideoToggle = () => {
    if (localStream) {
      localStream.getVideoTracks().forEach(track => {
        track.enabled = !isVideoEnabled;
      });
      setIsVideoEnabled(!isVideoEnabled);
    }
  };

  const formatMessageTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], {
      hour: "numeric",
      minute: "2-digit"
    });
  };

  const renderMessage = (message) => {
    const isOwnMessage = message.senderId === currentUserId;

    return (
      <div
        key={message.messageId}
        ref={(el) => {
          messageRefs.current[message.messageId] = el;
        }}
        className={`flex ${isOwnMessage ? "justify-end" : "justify-start"} mb-4`}
      >
        <div
          className={`max-w-[70%] ${
            isOwnMessage ? "order-2" : "order-1"
          }`}
        >
          <div
            className={`rounded-2xl p-3 ${
              isOwnMessage
                ? "bg-blue-500 text-white"
                : "bg-white text-gray-800 shadow-sm"
            } ${
              highlightedMessageId === message.messageId
                ? "ring-2 ring-yellow-400"
                : ""
            }`}
          >
            {message.messageType === "text" && (
              <p className="leading-relaxed whitespace-pre-wrap break-words">
                {message.content}
              </p>
            )}
            
            {message.messageType === "image" && (
              <div className="rounded-lg overflow-hidden">
                <img
                  src={message.fileUrl}
                  alt="Shared"
                  className="max-w-full h-auto"
                  loading="lazy"
                />
              </div>
            )}
            
            {message.messageType === "audio" && (
              <div className="min-w-[200px]">
                <audio controls className="w-full">
                  <source src={message.fileUrl} type="audio/webm" />
                  Your browser does not support the audio element.
                </audio>
              </div>
            )}
            
            {message.messageType === "file" && (
              <a
                href={message.fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center text-sm hover:underline"
              >
                <FileText className="mr-2" size={16} />
                <span>{message.fileName || "Download File"}</span>
              </a>
            )}

            <div
              className={`text-xs mt-1 ${
                isOwnMessage ? "text-blue-100" : "text-gray-500"
              }`}
            >
              {formatMessageTimestamp(message.timestamp)}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderCallOverlay = () => {
    if (!callState) return null;

    const isCaller = callState.callerId === currentUserId;
    const isReceiver = !isCaller && callState.status === 'incoming';
    const contactName = currentUserId === selectedContact.user1Id 
      ? selectedContact.user2Name 
      : selectedContact.user1Name;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center">
        <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4">
          {/* Call Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <CustomAvatar
                userId={currentUserId === selectedContact.user1Id ? selectedContact.user2Id : selectedContact.user1Id}
                name={contactName}
                className="h-12 w-12 mr-3"
              />
              <div>
                <h3 className="font-bold">{contactName}</h3>
                <p className="text-sm text-gray-500">
                  {isCaller ? 'Calling...' : 
                   isReceiver ? 'Incoming call' :
                   'Connected'}
                </p>
              </div>
            </div>
            <button
              onClick={onEndCall}
              className="p-2 bg-red-500 hover:bg-red-600 rounded-full transition-colors"
            >
              <X className="h-6 w-6 text-white" />
            </button>
          </div>

          {/* Video Display */}
          {callState.status === 'connected' && callState.callType === 'video' && (
            <div className="relative h-96 bg-gray-900 rounded-lg mb-4 overflow-hidden">
              {remoteStream && (
                <video
                  ref={remoteVideoRef}
                  autoPlay
                  playsInline
                  className="w-full h-full object-cover"
                />
              )}
              {localStream && (
                <div className="absolute bottom-4 right-4 w-48 h-32 overflow-hidden rounded-lg border-2 border-white">
                  <video
                    ref={localVideoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
            </div>
          )}

          {/* Audio Call UI */}
          {callState.status === 'connected' && callState.callType === 'audio' && (
            <div className="flex justify-center items-center h-48 bg-gray-50 rounded-lg mb-4">
              <div className="text-center">
                <CustomAvatar
                  userId={currentUserId === selectedContact.user1Id ? selectedContact.user2Id : selectedContact.user1Id}
                  name={contactName}
                  className="h-20 w-20 mb-4 mx-auto"
                />
                <div className="text-xl text-gray-700">Audio Call Connected</div>
              </div>
            </div>
          )}

          {/* Call Controls */}
          {callState.status === 'connected' && (
            <div className="flex justify-center space-x-4">
              <button
                onClick={handleMuteToggle}
                className={`p-3 rounded-full transition-colors ${
                  isMuted ? 'bg-red-500 hover:bg-red-600' : 'bg-gray-200 hover:bg-gray-300'
                }`}
              >
                {isMuted ? (
                  <MicOff className="h-6 w-6 text-white" />
                ) : (
                  <Mic className="h-6 w-6 text-gray-700" />
                )}
              </button>
              {callState.callType === 'video' && (
                <button
                  onClick={handleVideoToggle}
                  className={`p-3 rounded-full transition-colors ${
                    !isVideoEnabled ? 'bg-red-500 hover:bg-red-600' : 'bg-gray-200 hover:bg-gray-300'
                  }`}
                >
                  {isVideoEnabled ? (
                    <Camera className="h-6 w-6 text-gray-700" />
                  ) : (
                    <CameraOff className="h-6 w-6 text-white" />
                  )}
                </button>
              )}
            </div>
          )}

          {/* Incoming Call Actions */}
          {isReceiver && (
            <div className="flex justify-center space-x-4 mt-4">
              <button
                onClick={() => onRejectCall()}
                className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              >
                Decline
              </button>
              <button
                onClick={() => onAcceptCall()}
                className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
              >
                Accept
              </button>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="flex-1 flex flex-col bg-gray-50 relative">
      {/* Header */}
      <div className="border-b bg-white p-4 flex justify-between items-center shadow-sm">
        <div className="flex items-center">
          <CustomAvatar
            userId={currentUserId === selectedContact.user1Id ? selectedContact.user2Id : selectedContact.user1Id}
            name={currentUserId === selectedContact.user1Id ? selectedContact.user2Name : selectedContact.user1Name}
            className="h-12 w-12 mr-3 border-2 border-blue-200"
          />
          <div>
            <div className="font-bold text-lg">
              {currentUserId === selectedContact.user1Id ? selectedContact.user2Name : selectedContact.user1Name}
            </div>
            <div className="text-sm text-green-500">Online</div>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <button 
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            onClick={handlePhoneClick}
            title="Start audio call"
          >
            <Phone className="h-5 w-5 text-gray-600" />
          </button>
          <button 
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            onClick={handleVideoClick}
            title="Start video call"
          >
            <Video className="h-5 w-5 text-gray-600" />
          </button>
          <div className="relative">
            <button
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              onClick={() => setDropdownOpen(!dropdownOpen)}
              title="More options"
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
                  className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center transition-colors"
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
      <div className="flex-1 overflow-y-auto p-6">
        {messages.map(renderMessage)}
        <div ref={messagesEndRef} />
      </div>

      {/* Call Overlay */}
      {renderCallOverlay()}

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

export default ChatWindow;