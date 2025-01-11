import { useNavigate } from 'react-router-dom';
import { User } from 'lucide-react'; // Replace with the actual library you are using

function ViewProfileButton({ userId }) {
    const navigate = useNavigate();

    const handleViewProfile = () => {
        navigate(`/user-profile/${userId}`);
    };

    return (
        <button
            className="w-full bg-green-100 text-green-700 py-2 px-4 rounded-lg font-medium hover:bg-green-200 transition-colors flex items-center justify-center"
            onClick={handleViewProfile}
        >
            <User className="mr-2" size={18} />
            View Profile
        </button>
    );
}

export default ViewProfileButton;
