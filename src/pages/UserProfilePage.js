import React, { useState, useRef, useEffect } from "react";
import {
  User,
  Calendar,
  Edit3,
  MapPin,
  Phone,
  Mail,
  Tractor,
  Crop,
  Activity,
  Save,
  X,
  CheckCircle,
  PlusIcon,
  Lock,
  CreditCard,
  UserCheck,
  Eye,
  EyeOff,
  Building,
  FileText,
  Tag,
  HashIcon,
  Building2,
  Users,
} from "lucide-react";
import axios from "axios";
import ViewProfileButton from "../components/ui/ViewProfileButton";
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
          src={previewUrl || "/api/placeholder/128/128"}
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

const Card = ({ children, className = "" }) => (
  <div
    className={`bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow ${className}`}
  >
    {children}
  </div>
);
const BusinessInfoCard = ({ userInfo }) => (
  <Card>
    <div className="p-6">
      <h3 className="text-xl font-semibold mb-6 text-gray-800 border-b pb-2">
        Business Information
      </h3>
      <div className="grid md:grid-cols-2 gap-4">
        <InfoField
          icon={Building}
          label="Business Name"
          value={userInfo.agriBusinessName}
        />
        <InfoField
          icon={Tag}
          label="Business Type"
          value={userInfo.businessType}
        />
        <InfoField
          icon={MapPin}
          label="Business Address"
          value={userInfo.address}
        />
        <InfoField
          icon={HashIcon}
          label="Registration Number"
          value={userInfo.businessRegistrationNumber}
        />
        <div className="md:col-span-2">
          <InfoField
            icon={FileText}
            label="Business Description"
            value={userInfo.businessDescription}
          />
        </div>
      </div>
    </div>
  </Card>
);

const FarmInfoCard = ({ userInfo }) => (
  <Card>
    <div className="p-6">
      <h3 className="text-xl font-semibold mb-6 text-gray-800 border-b pb-2">
        Farm Information
      </h3>
      <div className="grid md:grid-cols-2 gap-4">
        <InfoField
          icon={MapPin}
          label="Farm Address"
          value={userInfo.address}
        />
        <InfoField
          icon={Activity}
          label="Farm Size"
          value={userInfo.farmSize}
        />
        <InfoField2
          icon={Crop}
          label="Specialization"
          value={userInfo.specialization}
        />
        <InfoField
          icon={Tractor}
          label="Farm Yield Capacity"
          value={userInfo.farmYieldCapacity}
        />
      </div>
    </div>
  </Card>
);

const ConsumerInfoCard = ({ userInfo }) => (
  <Card>
    <div className="p-6">
      <h3 className="text-xl font-semibold mb-6 text-gray-800 border-b pb-2">
        Consumer Information
      </h3>
      <div className="grid md:grid-cols-2 gap-4">
        {userInfo.associatedCompany && (
          <InfoField
            icon={Building2}
            label="Associated Company"
            value={userInfo.associatedCompany}
          />
        )}

        <InfoField
          icon={Users}
          label="Consumer Type"
          value={userInfo.consumerType}
        />
      </div>
    </div>
  </Card>
);

const InfoField2 = ({
  icon: Icon = Crop,
  label = "Specialization",
  value = "",
}) => {
  // Split the value by comma and trim whitespace
  const specializations = value
    .split(",")
    .map((item) => item.trim())
    .filter((item) => item.length > 0);

  return (
    <div className="flex flex-col space-y-2">
      <div className="p-3 bg-gray-50 rounded-lg">
        <div className="flex items-center gap-2 mb-2">
          <Icon className="w-5 h-5 text-gray-600" />
          <span className="text-sm text-gray-500">{label}</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {specializations.map((specialization, index) => (
            <span
              key={index}
              className="px-3 py-1 text-sm bg-white rounded-full border border-gray-200 font-medium"
            >
              {specialization}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

const InfoField = ({ icon: Icon, label, value }) => (
  <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
    <Icon className="text-green-600 flex-shrink-0" size={20} />
    <div>
      <p className="text-sm text-gray-500">{label}</p>
      <p className="font-medium text-gray-800">{value}</p>
    </div>
  </div>
);

const UserProfilePage = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user.userId;
  const fetchUserProfile = async () => {
    try {
      // Replace with actual user ID

      const response = await axios.get(
        `http://localhost:5000/user-profile/${userId}`
      );
      setUserInfo(response.data);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to fetch user profile");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const handleSave = async (updatedInfo) => {
    try {
      setLoading(true);
      const userId = userInfo.userId;
      await axios.put(
        `http://localhost:5000/update-profile/${userId}`,
        updatedInfo
      );
      await fetchUserProfile(); // Refresh the data
      setIsEditing(false);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-green-600">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-600">{error}</div>
      </div>
    );
  }

  if (!userInfo) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-600">User not found</div>
      </div>
    );
  }

  if (isEditing) {
    return (
      <EditProfileForm
        userInfo={userInfo}
        onSave={handleSave}
        onCancel={() => setIsEditing(false)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-12 gap-6">
          {/* Left Column - Profile Card */}
          <div className="lg:col-span-4">
            <Card className="sticky top-6">
              <div className="relative h-40 bg-gradient-to-r from-green-600 to-green-400 rounded-t-xl">
                <div className="absolute -bottom-16 left-1/2 transform -translate-x-1/2">
                  <div className="w-32 h-32 rounded-full border-4 border-white shadow-lg overflow-hidden">
                    <img
                      src={userInfo.profilePicture}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-20 pb-6 px-6">
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-800">{`${userInfo.firstName} ${userInfo.lastName}`}</h2>
                  <p className="text-gray-500 text-sm">@{userInfo.userName}</p>
                  <div className="flex items-center justify-center mt-2 space-x-2">
                    <span className="text-sm text-green-600 bg-green-50 rounded-full px-3 py-1 inline-block">
                      {userInfo.userType}
                    </span>
                    <span className="text-sm text-blue-600 bg-blue-50 rounded-full px-3 py-1 inline-block">
                      {userInfo.accountStatus}
                    </span>
                  </div>
                </div>
                <div className="space-y-4">
                  {" "}
                  {/* Container with vertical spacing */}
                  <ViewProfileButton userId={userId} />
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
          <div className="lg:col-span-8 space-y-6">
            {userInfo.userType === "Agri-business" ? (
              <BusinessInfoCard userInfo={userInfo} />
            ) : userInfo.userType === "Farmer" ? (
              <FarmInfoCard userInfo={userInfo} />
            ) : userInfo.userType === "Consumer" ? (
              <ConsumerInfoCard userInfo={userInfo} />
            ) : (
              <></>
            )}

            <Card>
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-6 text-gray-800 border-b pb-2">
                  Personal Information
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <InfoField icon={Mail} label="Email" value={userInfo.email} />
                  <InfoField
                    icon={Phone}
                    label="Phone"
                    value={userInfo.phoneNumber}
                  />
                  <InfoField
                    icon={User}
                    label="Gender"
                    value={userInfo.gender}
                  />
                  <InfoField
                    icon={CreditCard}
                    label="National ID"
                    value={userInfo.nationalID}
                  />
                  <InfoField
                    icon={Calendar}
                    label="Registration Date"
                    value={userInfo.registrationDate}
                  />
                  <InfoField
                    icon={UserCheck}
                    label="Account Status"
                    value={userInfo.accountStatus}
                  />
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

const EditProfileForm = ({ userInfo, onSave, onCancel }) => {
  const [formData, setFormData] = useState({ ...userInfo });
  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await onSave(formData);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleImageChange = (imageData) => {
    setFormData({ ...formData, profilePicture: imageData });
  };

  const renderBusinessFields = () => (
    <>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Business Address
        </label>
        <input
          type="text"
          value={formData.address}
          onChange={(e) =>
            setFormData({ ...formData, address: e.target.value })
          }
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Business Description
        </label>
        <textarea
          type="text"
          value={formData.businessDescription}
          onChange={(e) =>
            setFormData({ ...formData, businessDescription: e.target.value })
          }
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
        />
      </div>
    </>
  );

  const renderFarmerFields = () => (
    <>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Farm Address
        </label>
        <input
          type="text"
          value={formData.address}
          onChange={(e) =>
            setFormData({ ...formData, address: e.target.value })
          }
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
        />
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Farm Size
          </label>
          <input
            type="text"
            value={formData.farmSize}
            onChange={(e) =>
              setFormData({ ...formData, farmSize: e.target.value })
            }
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Specialization
          </label>
          <input
            type="text"
            value={formData.specialization}
            onChange={(e) =>
              setFormData({
                ...formData,
                specialization: e.target.value,
              })
            }
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Farm Yield Capacity
          </label>
          <input
            type="text"
            value={formData.farmYieldCapacity}
            onChange={(e) =>
              setFormData({
                ...formData,
                farmYieldCapacity: e.target.value,
              })
            }
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
        </div>
      </div>
    </>
  );
  const renderConsumerFields = () => (
    <>
      {formData.consumerType === "Corporate" && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Associated Company
          </label>
          <input
            type="text"
            value={formData.associatedCompany}
            onChange={(e) =>
              setFormData({ ...formData, associatedCompany: e.target.value })
            }
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
        </div>
      )}
    </>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-50 p-6">
      <div className="max-w-3xl mx-auto">
        <Card>
          <div className="p-6">
            {error && (
              <div className="mb-4 p-4 bg-red-50 text-red-600 rounded-lg">
                {error}
              </div>
            )}

            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-800">
                Edit {formData.userType} Profile
              </h2>
              <button
                onClick={onCancel}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <ImageUpload
                currentImage={formData.profilePicture}
                onImageChange={handleImageChange}
              />

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    First Name
                  </label>
                  <input
                    type="text"
                    value={formData.firstName}
                    onChange={(e) =>
                      setFormData({ ...formData, firstName: e.target.value })
                    }
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
                    onChange={(e) =>
                      setFormData({ ...formData, lastName: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={formData.phoneNumber}
                    onChange={(e) =>
                      setFormData({ ...formData, phoneNumber: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>

                <div className="relative">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={(e) =>
                        setFormData({ ...formData, password: e.target.value })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                    >
                      {showPassword ? (
                        <EyeOff size={20} className="text-green-600" />
                      ) : (
                        <Eye size={20} className="text-green-600" />
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {formData.userType === "Agri-business"
                ? renderBusinessFields()
                : formData.userType === "Consumer"
                ? renderConsumerFields()
                : renderFarmerFields()}

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
