import { useNavigate } from 'react-router-dom';
import { angleDownSvg, arrowSvg, visitSvg } from '../../assets';
import Button from '../../components/design/Button';
import { useContext, useState } from 'react';
import Loader from '../../components/skeletons/Loader';
import DeleteModal from '../../components/DeleteModal';
import axiosInstance from '../utils/axiosInstance';
import { AppContext } from '../../components/AppContext';
import { settings } from '../../components/constants';

const Setting = () => {
  const navigate = useNavigate();
  const context = useContext(AppContext);
  const [viewAbout, setViewAbout] = useState();

  const toggleAbout = () => setViewAbout(!viewAbout);

  if (!context) {
    return <Loader />;
  }

  const { user, usePageTitle } = context;
  usePageTitle('Setting | IMConnect');
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
        {settings.map((item) => (
          <span
            onClick={() => navigate(`/dash/setting/${item.link}`)}
            key={item.id}
            className="w-full px-4 py-2 rounded-md hover:bg-zinc-200/50"
          >
            {item.name}
          </span>
        ))}
      </div>
      <div
        className={`relative w-full hover:bg-zinc-200 ${viewAbout && 'lg:p-4 p-2 rounded-xl bg-zinc-200'}`}
      >
        <div
          onClick={toggleAbout}
          className={`w-full px-4 py-2 rounded-md ${viewAbout ? 'hover:bg-zinc-100 font-semibold h5' : 'hover:bg-zinc-200/50'} flex-between-hor`}
        >
          <span>About IMConnect</span>
          <img
            src={angleDownSvg}
            className={`h-5 w-5 ${viewAbout && 'rotate-180'}`}
          />
        </div>
        {/* About Section */}
        {viewAbout && (
          <>
            <div className="relative about">
              <i>
                Hello, and welcome to **IMConnect**, your new go-to platform for
                real-time messaging and social posting! We're thrilled to have
                you here as one of our first visitors. Together, we’ll shape
                this community into something truly amazing.
              </i>
              <p className="font-semibold h5 mt-12">
                Here’s what you can do on IMConnect:
              </p>
              <p className="h5 mt-6 font-medium">1. Real-Time Messaging</p>
              <i>
                Chat instantly with friends and contacts. Start a conversation,
                connect with others, and enjoy seamless communication with no
                delays.
              </i>
              <i>
                Head over to the **Messages** section to start a new chat or
                select an existing contact to begin.
              </i>
              <p className="h5 mt-6 font-medium">2. Create Posts</p>
              <i>
                Express yourself by sharing updates, thoughts, or announcements.
                Whether it's a short message or a big idea, the **Post** section
                is your space to share.
              </i>
              <i>
                You can also interact with others by liking and commenting on
                their posts.
              </i>
              <p className="h5 mt-6 font-medium">3. Engage with Others</p>
              <i>
                Discover and interact with posts from the community. Like,
                comment, and expand your network while building connections with
                others.
              </i>
              <p className="h5 mt-6 font-medium">4. Send Feedback</p>
              <i>
                Your feedback matters! Have a suggestion, noticed an issue, or
                simply want to say hello? Use the **Message** feature to reach
                out directly to me.
              </i>
              <i>
                We’re constantly improving IMConnect, and your input will help
                shape its future. Together, we can make this platform truly
                amazing!
              </i>
              <i>
                Thank you for being part of the early days of IMConnect. Dive
                in, explore, and let us know what you think!
              </i>
              <p className="mt-8 body-1">Warm regards,</p>
            </div>
            <h4 className="h5 italic font-hand">IBANZE Miracle</h4>
            <a
              href="https://ibanze.vercel.app"
              className="text-blue-600 underline flex items-center "
            >
              Know more about me
              <img src={visitSvg} className="w-5 h-5" />
            </a>
          </>
        )}
      </div>
      <div className="w-full p-4 mt-16 border border-[#ff0000] rounded-2xl relative pt-8">
        <h5 className="h5 font-normal text-[#ff0000] absolute top-0 -translate-y-[60%] bg-zinc-50 px-3 left-6">
          Danger Zone
        </h5>
        <Button
          onClick={() => setDeleteAccountPrompt(true)}
          className="w-full px-4 py-2 rounded-md hover:bg-red-500/90 bg-[#ff0000] text-white bg-clip-padding"
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
