import React, { useState } from 'react';
import { Search, Phone, Image, Settings, FileText, Send } from 'lucide-react';

import Image4 from '../assets/images/7.png';
import Image5 from '../assets/images/5.jpg';
import Image6 from '../assets/images/6.jpg';

const CustomInput = ({ className, ...props }) => (
  <input
    className={`border rounded-md px-3 py-2 w-full ${className}`}
    {...props}
  />
);

const CustomButton = ({ children, className, ...props }) => (
  <button
    className={`px-4 py-2 rounded-md bg-blue-500 text-white hover:bg-blue-600 ${className}`}
    {...props}
  >
    {children}
  </button>
);

const CustomAvatar = ({ src, alt, className }) => (
  <div className={`rounded-full overflow-hidden ${className}`}>
    <img src={src} alt={alt} className="w-full h-full object-cover" />
  </div>
);

const ContactList = ({ contacts, setSelectedContact }) => (
  <div className="w-64 border-r p-4">
    <div className="relative mb-4">
      <CustomInput
        type="text"
        placeholder="Search..."
        className="pl-8"
      />
      <Search className="h-4 w-4 text-gray-400 absolute left-2 top-1/2 transform -translate-y-1/2" />
    </div>
    {contacts.map((contact) => (
      <div
        key={contact.id}
        className="flex items-center mb-2 p-2 hover:bg-gray-100 cursor-pointer"
        onClick={() => setSelectedContact(contact)}
      >
        <CustomAvatar src={contact.avatar} alt={contact.name} className="h-10 w-10 mr-3" />
        <div>
          <div className="font-semibold">{contact.name}</div>
          <div className="text-sm text-gray-500">
            {contact.status === 'online' ? (
              <span className="text-green-500">● online</span>
            ) : (
              contact.lastSeen
            )}
          </div>
        </div>
      </div>
    ))}
  </div>
);

const ChatWindow = ({ selectedContact, messages }) => (
  <div className="flex-1 flex flex-col">
    <div className="border-b p-4 flex justify-between items-center">
      <div className="flex items-center">
        <CustomAvatar src={selectedContact.avatar} alt={selectedContact.name} className="h-10 w-10 mr-3" />
        <div>
          <div className="font-semibold">{selectedContact.name}</div>
          <div className="text-sm text-gray-500">
            {selectedContact.status === 'online' ? 'online' : `Last seen: ${selectedContact.lastSeen}`}
          </div>
        </div>
      </div>
      <div className="flex space-x-2">
        {[Phone, Image, Settings, FileText].map((Icon, index) => (
          <button key={index} className="p-2 hover:bg-gray-100 rounded-full">
            <Icon className="h-5 w-5" />
          </button>
        ))}
      </div>
    </div>
    <div className="flex-1 overflow-y-auto p-4">
      {messages.map((message, index) => (
        <div
          key={index}
          className={`mb-4 ${
            message.sender === 'user' ? 'text-right' : 'text-left'
          }`}
        >
          <div
            className={`inline-block p-2 rounded-lg ${
              message.sender === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-200'
            }`}
          >
            {message.text}
          </div>
          <div className="text-xs text-gray-500 mt-1">{message.time}</div>
        </div>
      ))}
    </div>
    <div className="border-t p-4">
      <div className="flex items-center">
        <CustomInput
          type="text"
          placeholder="Enter text here..."
          className="flex-1 mr-2"
        />
        <CustomButton>
          <Send className="h-4 w-4" />
        </CustomButton>
      </div>
    </div>
  </div>
);

const InboxPage = () => {
  const [contacts] = useState([
    { id: 1, name: 'Anas Nauman', avatar: Image4, status: 'offline', lastSeen: 'left 7 mins ago' },
    { id: 2, name: 'Adnan Umar', avatar: Image5, status: 'online' },
    { id: 3, name: 'Rabia', avatar: Image6, status: 'online' },
    { id: 4, name: 'Umer Zia', avatar: Image4, status: 'offline', lastSeen: 'left 10 hours ago' },
    { id: 5, name: 'Monica', avatar: Image5, status: 'online' },
    { id: 6, name: 'Hamza', avatar: Image6, status: 'offline', lastSeen: 'offline since Oct 28' },
  ]);

  const [selectedContact, setSelectedContact] = useState(contacts[1]);
  const [messages] = useState([
    { sender: 'user', text: 'Hi Adnan, Can we negotiate on the Seeds?', time: '10:10 AM, Today' },
    { sender: 'contact', text: 'How much do you need?', time: '10:12 AM, Today' },
    { sender: 'user', text: 'Request for a Fair Price , will look into it', time: '10:15 AM, Today' },
  ]);

  return (
    <div className="flex h-screen bg-white">
      <ContactList contacts={contacts} setSelectedContact={setSelectedContact} />
      <ChatWindow selectedContact={selectedContact} messages={messages} />
    </div>
  );
};

export default InboxPage;