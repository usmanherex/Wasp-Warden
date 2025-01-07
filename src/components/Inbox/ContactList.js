import React, { useState } from "react";
import { Search } from "lucide-react";
import { CustomInput, CustomAvatar } from "./CustomComponents";

const ContactList = ({ contacts, setSelectedContact, currentUserId }) => {
  const [searchTerm, setSearchTerm] = useState("");

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

export default ContactList;