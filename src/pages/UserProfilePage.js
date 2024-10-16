import React from 'react';
import { Card } from '../components/ui/Card';
import { User, Calendar, Edit3 } from 'lucide-react';
import Image5 from '../assets/images/5.jpg';

const UserProfilePage = () => {
  return (
    <div className="bg-gray-100 min-h-screen p-4">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-4">
        {/* Left Column */}
        <div className="w-full md:w-1/4">
          <Card className="bg-green-700 p-6">
            <div className="flex flex-col items-center">
              <div className="w-24 h-24 rounded-full bg-white p-1 mb-4">
                <img
                  src={Image5}
                  alt="User avatar"
                  className="w-full h-full rounded-full object-cover"
                />
              </div>
              <h2 className="text-2xl font-bold text-white mb-1">Anas Nauman</h2>
              <p className="text-white text-sm mb-6">anas@gmail.com</p>
              <button className="w-full bg-white text-green-400 py-2 rounded mb-2 font-semibold flex items-center justify-center">
                <User className="mr-2" size={18} />
                Profile
              </button>
              <button className="w-full bg-white text-green-400 py-2 rounded mb-2 font-semibold flex items-center justify-between px-4">
  <span className="flex items-center justify-center w-full">
    <Calendar className="mr-2" size={18} />
    Recent Activity
  </span>
  <span className="bg-green-400 text-white rounded-full px-2 py-0.5 text-xs ml-auto">9</span>
</button>

              <button className="w-full bg-white text-green-400 py-2 rounded font-semibold flex items-center justify-center">
                <Edit3 className="mr-2" size={18} />
                Edit profile
              </button>
            </div>
          </Card>
        </div>

        {/* Right Column */}
        <div className="w-full md:w-3/4">
          <Card className="mb-4">
            <div className="p-6">
              <div className="bg-green-400 text-white p-2 mb-4">
                <p className="text-sm italic">Harvesting success, one seed at a time.</p>
              </div>
              <h3 className="text-xl font-semibold mb-4">Bio Graph</h3>
              <div className="grid grid-cols-2 gap-y-2">
                <div>
                  <p><span className="font-semibold">First Name:</span> Anas</p>
                  <p><span className="font-semibold">Country:</span> Pakistan</p>
                  <p><span className="font-semibold">Role:</span> Agri-Business</p>
                  <p><span className="font-semibold">Mobile:</span> +923236100368</p>
                </div>
                <div>
                  <p><span className="font-semibold">Last Name:</span> Nauman</p>
                  <p><span className="font-semibold">Birthday:</span> 13 July 2001</p>
                  <p><span className="font-semibold">Email:</span> anas@gmail.com</p>
                  <p><span className="font-semibold">Phone:</span> 042372854</p>
                </div>
              </div>
            </div>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="bg-red-50">
              <div className="p-6">
                <h3 className="text-3xl font-bold text-red-500 mb-1">4</h3>
                <p className="text-gray-600 mb-2">Pending Orders</p>
                <p className="text-sm text-gray-500">Last Order Deadline: 15 July</p>
              </div>
            </Card>
            <Card className="bg-blue-50">
              <div className="p-6">
                <h3 className="text-3xl font-bold text-blue-500 mb-1">37</h3>
                <p className="text-gray-600 mb-2">Completed Orders</p>
                <p className="text-sm text-gray-500">Last Order: 15 July</p>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfilePage;