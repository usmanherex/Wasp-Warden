import React, { useState,useRef } from 'react';
import { User, Calendar, Edit3, MapPin, Phone, Mail, Briefcase, Globe, Save, X,CheckCircle,PlusIcon } from 'lucide-react';
import Image5 from '../assets/images/5.jpg';
import { Camera } from 'react-camera-pro';

const ImageUpload = ({ currentImage, onImageChange }) => {
  const fileInputRef = useRef(null);
  const [previewUrl, setPreviewUrl] = useState(currentImage);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
        onImageChange(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="relative w-32 h-32 mx-auto mb-6">
      <div className="w-full h-full rounded-full overflow-hidden border-4 border-white shadow-lg">
        <img
          src={previewUrl}
          alt="Profile"
          className="w-full h-full object-cover"
        />
      </div>
      <button
        type="button"
        onClick={() => fileInputRef.current.click()}
        className="absolute bottom-0 right-0 bg-green-600 text-white p-2 rounded-full hover:bg-green-700 transition-colors"
      >
        <PlusIcon size={18} />
      </button>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleImageChange}
        accept="image/*"
        className="hidden"
      />
    </div>
  );
};
// Custom Card component to maintain consistent styling
const Card = ({ children, className = "" }) => (
  <div className={`bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow ${className}`}>
    {children}
  </div>
);

// Stats Card Component
const StatsCard = ({ value, label, sublabel, bgColor, textColor, icon: Icon }) => (
  <Card className={`${bgColor} transform hover:scale-105 transition-transform`}>
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className={`text-4xl font-bold ${textColor}`}>{value}</h3>
        <Icon className={`${textColor} opacity-80`} size={24} />
      </div>
      <p className="text-gray-700 font-medium mb-1">{label}</p>
      <p className="text-sm text-gray-500">{sublabel}</p>
    </div>
  </Card>
);

const UserProfilePage = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [userInfo, setUserInfo] = useState({
    firstName: "Anas",
    lastName: "Nauman",
    email: "anas@gmail.com",
    phone: "+923236100368",
    landline: "042372854",
    country: "Pakistan",
    role: "Agri-Business",
    birthday: "13 July 2001",
    bio: "Harvesting success, one seed at a time.",
    address: "Lahore, Pakistan",
    expertise: "Organic Farming",
    experience: "5 years",
    profileImage: Image5
  });

  const handleSave = (updatedInfo) => {
    setUserInfo(updatedInfo);
    setIsEditing(false);
  };

  if (isEditing) {
    return <EditProfileForm userInfo={userInfo} onSave={handleSave} onCancel={() => setIsEditing(false)} />;
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-4 gap-6">
          {/* Left Column - Profile Card */}
          <div className="lg:col-span-1">
            <Card className="sticky top-6">
              <div className="relative h-32 bg-gradient-to-r from-green-600 to-green-400 rounded-t-lg">
                <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2">
                  <div className="w-24 h-24 rounded-full border-4 border-white shadow-lg">
                  <img
      src={userInfo.profileImage}
      alt="User avatar"
      className="w-full h-full rounded-full object-cover"
    />
                  </div>
                </div>
              </div>
              
              <div className="pt-16 pb-6 px-6">
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-800">{`${userInfo.firstName} ${userInfo.lastName}`}</h2>
                  <p className="text-gray-500 text-sm">{userInfo.email}</p>
                  <p className="mt-2 text-sm text-gray-600 bg-green-50 rounded-full px-3 py-1 inline-block">
                    {userInfo.role}
                  </p>
                </div>

                <div className="space-y-3">
                  <button className="w-full bg-green-100 text-green-700 py-2 px-4 rounded-lg font-medium hover:bg-green-200 transition-colors flex items-center justify-center">
                    <User className="mr-2" size={18} />
                    View Profile
                  </button>
                  
                  <button className="w-full bg-green-100 text-green-700 py-2 px-4 rounded-lg font-medium hover:bg-green-200 transition-colors flex items-center justify-between">
                    <span className="flex items-center">
                      <Calendar className="mr-2" size={18} />
                      Activity
                    </span>
                    <span className="bg-green-600 text-white rounded-full px-2 py-0.5 text-xs">9</span>
                  </button>
                  
                  <button 
                    onClick={() => setIsEditing(true)}
                    className="w-full bg-green-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center justify-center"
                  >
                    <Edit3 className="mr-2" size={18} />
                    Edit Profile
                  </button>
                </div>
              </div>
            </Card>
          </div>

          {/* Right Column - Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* Bio Section */}
            <Card>
              <div className="p-6">
                <div className="bg-gradient-to-r from-green-500 to-green-400 text-white p-4 rounded-lg mb-6">
                  <p className="text-lg italic font-light">{userInfo.bio}</p>
                </div>
                
                <h3 className="text-xl font-semibold mb-6 text-gray-800 border-b pb-2">Personal Information</h3>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <User className="text-green-600" size={20} />
                      <div>
                        <p className="text-sm text-gray-500">Full Name</p>
                        <p className="font-medium text-gray-800">{`${userInfo.firstName} ${userInfo.lastName}`}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <MapPin className="text-green-600" size={20} />
                      <div>
                        <p className="text-sm text-gray-500">Location</p>
                        <p className="font-medium text-gray-800">{userInfo.country}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <Phone className="text-green-600" size={20} />
                      <div>
                        <p className="text-sm text-gray-500">Contact</p>
                        <p className="font-medium text-gray-800">{userInfo.phone}</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <Mail className="text-green-600" size={20} />
                      <div>
                        <p className="text-sm text-gray-500">Email</p>
                        <p className="font-medium text-gray-800">{userInfo.email}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <Briefcase className="text-green-600" size={20} />
                      <div>
                        <p className="text-sm text-gray-500">Experience</p>
                        <p className="font-medium text-gray-800">{userInfo.experience}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <Globe className="text-green-600" size={20} />
                      <div>
                        <p className="text-sm text-gray-500">Expertise</p>
                        <p className="font-medium text-gray-800">{userInfo.expertise}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Stats Grid */}
            <div className="grid md:grid-cols-2 gap-6">
              <StatsCard
                value="4"
                label="Pending Orders"
                sublabel="Last Order Deadline: 15 July"
                bgColor="bg-red-50"
                textColor="text-red-500"
                icon={Calendar}
              />
              <StatsCard
                value="37"
                label="Completed Orders"
                sublabel="Last Order: 15 July"
                bgColor="bg-blue-50"
                textColor="text-blue-500"
                icon={CheckCircle}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const EditProfileForm = ({ userInfo, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    ...userInfo,
    profileImage: Image5
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  const handleImageChange = (imageData) => {
    setFormData({ ...formData, profileImage: imageData });
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-50 p-6">
      <div className="max-w-3xl mx-auto">
        <Card>
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Edit Profile</h2>
              <button
                onClick={onCancel}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <ImageUpload
                currentImage={formData.profileImage}
                onImageChange={handleImageChange}
              />

              {/* Rest of the form fields remain the same */}
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    First Name
                  </label>
                  <input
                    type="text"
                    value={formData.firstName}
                    onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Last Name
                  </label>
                  <input
                    type="text"
                    value={formData.lastName}
                    onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Country
                  </label>
                  <input
                    type="text"
                    value={formData.country}
                    onChange={(e) => setFormData({...formData, country: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Bio
                </label>
                <textarea
                  value={formData.bio}
                  onChange={(e) => setFormData({...formData, bio: e.target.value})}
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Tell us about yourself..."
                />
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Expertise
                  </label>
                  <input
                    type="text"
                    value={formData.expertise}
                    onChange={(e) => setFormData({...formData, expertise: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="e.g., Organic Farming"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Experience
                  </label>
                  <input
                    type="text"
                    value={formData.experience}
                    onChange={(e) => setFormData({...formData, experience: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="e.g., 5 years"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={onCancel}
                  className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center"
                >
                  <Save className="mr-2" size={18} />
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </Card>
      </div>
    </div>
  );
};
export default UserProfilePage;