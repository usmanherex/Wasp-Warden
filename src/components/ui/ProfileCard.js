import React from 'react';
import { Card } from './Card';

export const ProfileCard = ({ name, email, recentActivityCount }) => {
  return (
    <Card className="bg-yellow-400 p-6">
      <div className="flex flex-col items-center">
        <div className="w-24 h-24 rounded-full bg-white p-1 mb-4">
          <img 
            src="/api/placeholder/96/96" 
            alt="User avatar" 
            className="w-full h-full rounded-full object-cover"
          />
        </div>
        <h2 className="text-2xl font-bold text-white mb-1">{name}</h2>
        <p className="text-white text-sm mb-6">{email}</p>
        <button className="w-full bg-white text-yellow-400 py-2 rounded mb-2 font-semibold">Profile</button>
        <button className="w-full bg-white text-yellow-400 py-2 rounded mb-2 font-semibold flex justify-between items-center">
          <span>Recent Activity</span>
          <span className="bg-yellow-400 text-white rounded-full px-2 py-0.5 text-xs">{recentActivityCount}</span>
        </button>
        <button className="w-full bg-white text-yellow-400 py-2 rounded font-semibold">Edit profile</button>
      </div>
    </Card>
  );
};