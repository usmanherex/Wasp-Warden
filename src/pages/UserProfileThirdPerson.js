import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { MessageSquare, MapPin, Building, Phone, Mail, User, Briefcase, Calendar, Link, Globe } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card2';
import Image5 from '../assets/images/4.png';
import Image6 from '../assets/images/cover.jpg';
const UserProfile = () => {
  const { userId } = useParams();
  const [profile, setProfile] = useState(null);

  // Dummy profiles database
  const dummyProfiles = {
    '1': {
      username: "GreenHarvest123",
      realName: "John Anderson",
      email: "john.anderson@farmtech.com",
      address: "1234 Agriculture Valley, Green County",
      gender: "Male",
      age: 45,
      phoneNumber: "+1 (555) 123-4567",
      businessName: "Anderson Family Farms",
      farmLocation: "Green Valley, Agricultural District",
      businessDescription: "Third-generation family farm specializing in organic vegetables and sustainable farming practices. We focus on crop rotation and natural pest control methods to ensure the highest quality produce.",
      profileImage:  Image5 ,
      coverImage: Image5,
      memberSince: "2020",
      website: "www.andersonfarms.com",
      specialties: ["Organic Vegetables", "Sustainable Farming", "Crop Rotation"],
      certifications: ["Organic Certified", "Sustainable Agriculture"]
    },
    '2': {
      username: "EcoFarmer",
      realName: "Sarah Johnson",
      email: "sarah.j@ecofarm.com",
      address: "789 Harvest Road, Blue County",
      gender: "Female",
      age: 38,
      phoneNumber: "+1 (555) 987-6543",
      businessName: "EcoGrow Solutions",
      farmLocation: "Blue Valley, Agricultural Zone",
      businessDescription: "Leading innovator in hydroponics and vertical farming. Specializing in urban agriculture solutions and sustainable growing practices.",
      profileImage: "/api/placeholder/150/150",
      coverImage: "/api/placeholder/1200/300",
      memberSince: "2019",
      website: "www.ecogrowsolutions.com",
      specialties: ["Hydroponics", "Vertical Farming", "Urban Agriculture"],
      certifications: ["Hydroponic Expert", "Urban Farming Certified"]
    }
  };

  useEffect(() => {
    // Simulate API fetch with dummy data
    const fetchProfile = () => {
      const profileData = dummyProfiles[userId] || dummyProfiles['1'];
      setProfile(profileData);
    };

    fetchProfile();
  }, [userId]);

  if (!profile) return null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      {/* Cover Image */}
      <div className="h-80 w-full relative overflow-hidden">
        <img
          src={profile.coverImage}
          alt="Cover"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-green-600 to-green-400 opacity-60"></div>
        <div className="absolute inset-0 bg-black opacity-20"></div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-48">
        <Card className="overflow-hidden bg-white/95 backdrop-blur-sm shadow-xl">
          {/* Profile Header */}
          <div className="relative px-8 py-8">
            <div className="flex flex-col md:flex-row items-center md:items-end space-y-4 md:space-y-0">
              <div className="relative">
                <img
                  src={profile.profileImage}
                  alt="Profile"
                  className="w-40 h-40 rounded-full border-4 border-white shadow-2xl bg-white"
                />
                <div className="absolute bottom-4 right-4 w-6 h-6 bg-green-500 rounded-full border-4 border-white"></div>
              </div>
              
              <div className="md:ml-8 text-center md:text-left flex-grow">
                <h1 className="text-4xl font-bold text-gray-900">{profile.realName}</h1>
                <p className="text-lg text-gray-600 mt-1">@{profile.username}</p>
                <div className="flex flex-wrap gap-2 mt-3 justify-center md:justify-start">
                  {profile.certifications.map((cert, index) => (
                    <span key={index} className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                      {cert}
                    </span>
                  ))}
                </div>
              </div>

              <button className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg flex items-center transition-all duration-300 shadow-lg hover:shadow-xl">
                <MessageSquare className="w-5 h-5 mr-2" />
                Send Message
              </button>
            </div>
          </div>

          {/* Main Content */}
          <div className="px-8 py-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Left Column */}
              <div className="space-y-8">
                <Card className="border border-green-100">
                  <CardHeader>
                    <CardTitle className="text-green-800">Personal Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex items-center">
                      <User className="w-5 h-5 text-green-600 mr-4" />
                      <div>
                        <p className="text-sm font-medium text-gray-500">Gender</p>
                        <p className="text-gray-900">{profile.gender}</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <Mail className="w-5 h-5 text-green-600 mr-4" />
                      <div>
                        <p className="text-sm font-medium text-gray-500">Email</p>
                        <p className="text-gray-900">{profile.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <Phone className="w-5 h-5 text-green-600 mr-4" />
                      <div>
                        <p className="text-sm font-medium text-gray-500">Phone</p>
                        <p className="text-gray-900">{profile.phoneNumber}</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <Calendar className="w-5 h-5 text-green-600 mr-4" />
                      <div>
                        <p className="text-sm font-medium text-gray-500">Member Since</p>
                        <p className="text-gray-900">{profile.memberSince}</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <Globe className="w-5 h-5 text-green-600 mr-4" />
                      <div>
                        <p className="text-sm font-medium text-gray-500">Website</p>
                        <p className="text-green-600 hover:text-green-700">{profile.website}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Right Column */}
              <div className="space-y-8">
                <Card className="border border-green-100">
                  <CardHeader>
                    <CardTitle className="text-green-800">Farm Details</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex items-center">
                      <Building className="w-5 h-5 text-green-600 mr-4" />
                      <div>
                        <p className="text-sm font-medium text-gray-500">Business Name</p>
                        <p className="text-gray-900">{profile.businessName}</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <MapPin className="w-5 h-5 text-green-600 mr-4" />
                      <div>
                        <p className="text-sm font-medium text-gray-500">Farm Location</p>
                        <p className="text-gray-900">{profile.farmLocation}</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <Briefcase className="w-5 h-5 text-green-600 mr-4 mt-1" />
                      <div>
                        <p className="text-sm font-medium text-gray-500">Business Description</p>
                        <p className="text-gray-900 mt-1">{profile.businessDescription}</p>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500 mb-2">Specialties</p>
                      <div className="flex flex-wrap gap-2">
                        {profile.specialties.map((specialty, index) => (
                          <span key={index} className="px-3 py-1 bg-green-50 text-green-700 rounded-full text-sm">
                            {specialty}
                          </span>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default UserProfile;