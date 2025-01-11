import React, { useState, useEffect } from "react";
import { useParams,useNavigate  } from "react-router-dom";
import {
  MessageSquare,
  MapPin,
  Phone,
  Mail,
  User,
  Calendar,
  Clock,
  Activity,
  Tractor,
  Building,
  Tag,
  FileText,
  HashIcon,
} from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "../components/ui/Card2";

const UserProfile = () => {
  const { userId } = useParams();
  const user = JSON.parse(localStorage.getItem('user'));
  const loggedInId = user.userId;
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const handleStartChat = async () => {
    try {
      const response = await fetch('http://localhost:5000/start-chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user1Id: loggedInId,
          user2Id: parseInt(userId)
        })
      });

      if (!response.ok) {
        throw new Error('Failed to initialize chat');
      }

      const data = await response.json();
      // Navigate to inbox with the chat ID
      navigate(`/inbox`);
    } catch (error) {
      console.error('Error starting chat:', error);
      // Handle error appropriately
    }
  };
  const calculateExperience = (registrationDate) => {
    const regDate = new Date(registrationDate);
    const today = new Date();

    let years = today.getFullYear() - regDate.getFullYear();
    let months = today.getMonth() - regDate.getMonth();

    // Adjust for negative months or if we haven't reached the month yet
    if (months < 0 || (months === 0 && today.getDate() < regDate.getDate())) {
      years--;
      months += 12;
    }

    // Format the experience string
    let experienceStr = "";
    if (years > 0) {
      experienceStr += `${years} year${years !== 1 ? "s" : ""}`;
      if (months > 0) experienceStr += " and ";
    }
    if (months > 0 || (years === 0 && months === 0)) {
      experienceStr += `${months} month${months !== 1 ? "s" : ""}`;
    }

    return experienceStr;
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/user-profile/${userId}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch profile data");
        }
        const data = await response.json();
        setProfile(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [userId]);

  if (loading) return <div className="text-center p-8">Loading...</div>;
  if (error)
    return <div className="text-center p-8 text-red-600">Error: {error}</div>;
  if (!profile) return <div className="text-center p-8">User not found</div>;

  // Split specializations into array if it's a comma-separated string
  const specializations = profile.specialization
    ? profile.specialization.split(",").map((s) => s.trim())
    : [];

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      <div className="h-80 w-full relative overflow-hidden">
        <img
          src={profile.profilePicture}
          alt="Cover"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-green-600 to-green-400 opacity-60"></div>
        <div className="absolute inset-0 bg-black opacity-20"></div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-24">
        <Card className="overflow-hidden bg-white/95 backdrop-blur-sm shadow-xl">
          <div className="relative px-8 py-8">
            <div className="flex flex-col md:flex-row items-center md:items-end space-y-4 md:space-y-0">
              <div className="relative">
                <img
                  src={profile.profilePicture || "/api/placeholder/150/150"}
                  alt="Profile"
                  className="w-40 h-40 rounded-full border-4 border-white shadow-2xl bg-white object-cover"
                />
                <div
                  className={`absolute bottom-4 right-4 w-6 h-6 rounded-full border-4 border-white
                  ${
                    profile.accountStatus === "Active"
                      ? "bg-green-500"
                      : "bg-gray-500"
                  }`}
                ></div>
              </div>

              <div className="md:ml-8 text-center md:text-left flex-grow">
                <h1 className="text-4xl font-bold text-gray-900">
                  {profile.firstName} {profile.lastName}
                </h1>
                <p className="text-lg text-gray-600 mt-1">
                  @{profile.userName}
                </p>
                {profile.userType === "Farmer" && (
                  <div className="flex flex-wrap gap-2 mt-3 justify-center md:justify-start">
                    {specializations.map((spec, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm"
                      >
                        {spec}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            {parseInt(userId) !== parseInt(loggedInId) && (
   <button 
   onClick={handleStartChat}
   className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg flex items-center transition-all duration-300 shadow-lg hover:shadow-xl"
 >
   <MessageSquare className="w-5 h-5 mr-2" />
   Send Message
 </button>
            )}
           
            </div>
          </div>

          {/* Main Content */}
          <div className="px-8 py-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Personal Information */}
              <Card className="border border-green-100">
                <CardHeader>
                  <CardTitle className="text-green-800">
                    Personal Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center">
                    <User className="w-5 h-5 text-green-600 mr-4" />
                    <div>
                      <p className="text-sm font-medium text-gray-500">
                        Gender
                      </p>
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
                      <p className="text-sm font-medium text-gray-500">
                        Member Since
                      </p>
                      <p className="text-gray-900">
                        {profile.registrationDate}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Farm Details (Only shown for Farmers) */}
              {profile.userType === "Farmer" && (
                <Card className="border border-green-100">
                  <CardHeader>
                    <CardTitle className="text-green-800">
                      Farm Details
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex items-center">
                      <MapPin className="w-5 h-5 text-green-600 mr-4" />
                      <div>
                        <p className="text-sm font-medium text-gray-500">
                          Farm Address
                        </p>
                        <p className="text-gray-900">{profile.address}</p>
                      </div>
                    </div>

                    <div className="flex items-center">
                      <Activity className="w-5 h-5 text-green-600 mr-4" />
                      <div>
                        <p className="text-sm font-medium text-gray-500">
                          Farm Size
                        </p>
                        <p className="text-gray-900">
                          {profile.farmSize} acres
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center">
                      <Tractor className="w-5 h-5 text-green-600 mr-4" />
                      <div>
                        <p className="text-sm font-medium text-gray-500">
                          Farm Yield Capacity
                        </p>
                        <p className="text-gray-900">
                          {profile.farmYieldCapacity} tons/year
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center">
                      <Clock className="w-5 h-5 text-green-600 mr-4" />
                      <div>
                        <p className="text-sm font-medium text-gray-500">
                          Experience
                        </p>
                        <p className="text-gray-900">
                          {calculateExperience(profile.registrationDate)}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {profile.userType === "Agri-business" && (
                <Card className="border border-green-100">
                  <CardHeader>
                    <CardTitle className="text-green-800">
                      Business Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex items-center">
                      <Building className="w-5 h-5 text-green-600 mr-4" />
                      <div>
                        <p className="text-sm font-medium text-gray-500">
                          Business Name
                        </p>
                        <p className="text-gray-900">
                          {profile.agriBusinessName}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <MapPin className="w-5 h-5 text-green-600 mr-4" />
                      <div>
                        <p className="text-sm font-medium text-gray-500">
                          Business Address
                        </p>
                        <p className="text-gray-900">{profile.address}</p>
                      </div>
                    </div>

                    <div className="flex items-center">
                      <Tag className="w-5 h-5 text-green-600 mr-4" />
                      <div>
                        <p className="text-sm font-medium text-gray-500">
                          Business Type
                        </p>
                        <p className="text-gray-900">{profile.businessType}</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <FileText className="w-5 h-5 text-green-600 mr-4" />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-500 mb-1">
                          Business Description
                        </p>
                        <p className="text-base text-gray-900">
                          {profile.businessDescription}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <HashIcon className="w-5 h-5 text-green-600 mr-4" />
                      <div>
                        <p className="text-sm font-medium text-gray-500">
                          Registration Number
                        </p>
                        <p className="text-gray-900">
                          {profile.businessRegistrationNumber}{" "}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <Clock className="w-5 h-5 text-green-600 mr-4" />
                      <div>
                        <p className="text-sm font-medium text-gray-500">
                          Experience
                        </p>
                        <p className="text-gray-900">
                          {calculateExperience(profile.registrationDate)}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default UserProfile;
