import React, { useState, useEffect } from "react";
import { Search, X } from "lucide-react";

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

export default SearchOverlay;