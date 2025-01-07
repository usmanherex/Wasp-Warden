import React, { useState, useEffect } from "react";

export const CustomInput = ({ className, ...props }) => (
  <input
    className={`border rounded-md px-3 py-2 w-full ${className}`}
    {...props}
  />
);

export const CustomAvatar = ({ userId, name, className }) => {
  const [profilePicture, setProfilePicture] = useState(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchProfilePicture = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/api/users/profile-picture/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        if (response.ok) {
          const blob = await response.blob();
          const imageUrl = URL.createObjectURL(blob);
          setProfilePicture(imageUrl);
        } else {
          setError(true);
        }
      } catch (err) {
        console.error("Error fetching profile picture:", err);
        setError(true);
      }
    };

    if (userId) {
      fetchProfilePicture();
    }

    return () => {
      if (profilePicture) {
        URL.revokeObjectURL(profilePicture);
      }
    };
  }, [userId]);

  return (
    <div
      className={`rounded-full overflow-hidden bg-blue-500 flex items-center justify-center text-white font-bold ${className}`}
    >
      {!error && profilePicture ? (
        <img
          src={profilePicture}
          alt={name}
          className="w-full h-full object-cover"
          onError={() => setError(true)}
        />
      ) : (
        <span className="text-lg">{name?.charAt(0).toUpperCase()}</span>
      )}
    </div>
  );
};