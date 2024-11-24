import { useNavigate } from 'react-router-dom';
import { arrowSvg } from '../../assets';
import Button from '../../components/design/Button';
import { useContext, useState } from 'react';
import Loader from '../../components/skeletons/Loader';
import DeleteModal from '../../components/DeleteModal';
import axiosInstance from '../utils/axiosInstance';
import { AppContext } from '../../components/AppContext';

const Setting = () => {
  const navigate = useNavigate();
  const context = useContext(AppContext);

  if (!context) {
    return <Loader />;
  }

  const { user } = context;
  const [deleteAccountPrompt, setDeleteAccountPrompt] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.delete('/users', {
        data: { id: user._id },
      });

      if (response.status === 200) {
        navigate('/auth/login');
      } else {
        console.error('Unexpected response:', response.data);
      }
    } catch (error) {
      console.error('Error deleting account:', error);
    } finally {
      setLoading(false);
    }
  };

  return loading ? (
    <Loader />
  ) : (
    <div className="p-4 bg-zinc-50 h-max min-h-full w-full">
      {/* Back Button */}
      <img
        src={arrowSvg}
        alt="Back"
        className="h-8 w-8 rotate-180 mb-4 p-1 rounded-md hover:bg-zinc-200 cursor-pointer"
        onClick={() => navigate(-1)}
      />
      <h3 className="h3 font-semibold">Setting</h3>

      {/* Settings Links */}
      <div className="flex-center-both w-full max-w-lg">
        <a
          href="/dash/setting/profile"
          className="w-full px-4 py-2 rounded-md hover:bg-zinc-200/50"
        >
          Personal Information
        </a>
        <a
          href="/dash/setting/account"
          className="w-full px-4 py-2 rounded-md hover:bg-zinc-200/50"
        >
          Account Setting
        </a>
        <a
          href="/dash/setting/notifications"
          className="w-full px-4 py-2 rounded-md hover:bg-zinc-200/50"
        >
          Notification Preferences
        </a>
        <a
          href="/dash/setting/messaging"
          className="w-full px-4 py-2 rounded-md hover:bg-zinc-200/50"
        >
          Messaging Setting
        </a>
        <a
          href="/dash/setting/info"
          className="w-full px-4 py-2 rounded-md hover:bg-zinc-200/50"
        >
          Notification Information
        </a>
        <a
          href="/dash/setting/help"
          className="w-full px-4 py-2 rounded-md hover:bg-zinc-200/50"
        >
          Help & Support
        </a>
      </div>

      {/* About Section */}
      <h3 className="h3 font-semibold mt-12">About</h3>
      <p className="body-1 font-normal">
        Welcome to our platform, a dynamic space built for real-time interaction
        and community connection. Leveraging cutting-edge technologies like the
        MERN stack and Socket.io, our website empowers users to:
      </p>
      <p className="body-1">
        Share their thoughts through posts. Engage with others by exploring
        shared content. Connect in real-time with seamless messaging features.
        Whether you're here to express yourself, explore perspectives, or simply
        have meaningful conversations, our mission is to make every interaction
        instant, enjoyable, and impactful. Thank you for being part of our
        growing community!
      </p>

      {/* Danger Zone */}
      <div className="w-full p-4 mt-16 border border-[#ff0000] rounded-2xl relative pt-8">
        <h5 className="h5 font-normal text-[#ff0000] absolute top-0 -translate-y-[60%] bg-zinc-50 px-3 left-6">
          Danger Zone
        </h5>
        <Button
          border
          onClick={() => setDeleteAccountPrompt(true)}
          className="w-full px-4 py-2 rounded-md hover:bg-zinc-200/50 bg-[#ff0000] text-white bg-clip-padding"
        >
          Delete account
        </Button>
      </div>

      {/* Delete Account Prompt Overlay */}
      {deleteAccountPrompt && (
        <DeleteModal
          title="Confirm account deletion"
          action="delete"
          onConfirm={handleDelete}
          onCancel={() => setDeleteAccountPrompt(false)}
          name="Account"
        />
      )}
    </div>
  );
};

export default Setting;
