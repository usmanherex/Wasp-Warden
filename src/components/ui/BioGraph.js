import React from 'react';

export const BioGraph = ({ firstName, lastName, country, birthday, role, email, mobile, phone }) => {
  return (
    <>
      <h3 className="text-xl font-semibold mb-4">Bio Graph</h3>
      <div className="grid grid-cols-2 gap-y-2">
        <div>
          <p><span className="font-semibold">First Name:</span> {firstName}</p>
          <p><span className="font-semibold">Country:</span> {country}</p>
          <p><span className="font-semibold">Role:</span> {role}</p>
          <p><span className="font-semibold">Mobile:</span> {mobile}</p>
        </div>
        <div>
          <p><span className="font-semibold">Last Name:</span> {lastName}</p>
          <p><span className="font-semibold">Birthday:</span> {birthday}</p>
          <p><span className="font-semibold">Email:</span> {email}</p>
          <p><span className="font-semibold">Phone:</span> {phone}</p>
        </div>
      </div>
    </>
  );
};