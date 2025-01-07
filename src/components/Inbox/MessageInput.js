import React, { useState, useRef, useEffect } from "react";
import { Send, Paperclip, Mic } from "lucide-react";

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
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
      }
    }
    return () => {
      clearInterval(interval);
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
            onClick={isRecording ? onStopRecording : handleStartRecording}
            className={`p-3 rounded-full transition-colors shadow-lg relative ${
              isRecording ? "bg-red-500 hover:bg-red-600" : "bg-blue-500 hover:bg-blue-600"
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

export default MessageInput;