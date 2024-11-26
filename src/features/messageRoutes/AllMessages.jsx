import { useContext, useEffect, useState } from 'react';
import { userSvg } from '../../assets';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../utils/axiosInstance';
import ListSkeleton from '../../components/skeletons/ListSkeleton';
import { AppContext } from '../../components/AppContext';

const MessageComponent = () => {
  const navigate = useNavigate();
  const context = useContext(AppContext);
  if (!context) return <ListSkeleton message />;
  const { user, usePageTitle } = context;
  usePageTitle('Messages | IMConnect');
  const [friends, setfriends] = useState([]);
  const [loading, setloading] = useState(true);

  function getTime(isoString) {
    const date = new Date(isoString);
    const options = { hour: '2-digit', minute: '2-digit', hour12: false };
    return new Intl.DateTimeFormat('en-US', options).format(date);
  }

  const markAsRead = async (chatId) => {
    try {
      const response = await axiosInstance.post('/messages/markAsRead', {
        chatId,
        userId: user._id,
      });

      console.log(`${response.data.modifiedCount} messages marked as read`);
    } catch (error) {
      console.error('Error marking messages as read:', error);
    }
  };

  useEffect(() => {
    const fetchChatParticipants = async () => {
      setloading(true);
      try {
        const response = await axiosInstance.get(`/messages/${user.username}`);
        setfriends(response.data);
      } catch (err) {
        console.log(err);
      } finally {
        setloading(false);
      }
    };
    fetchChatParticipants();
  }, [user]);
  return (
    <div className="bg-zinc-100 rounded-md px-3 w-full py-6 h-full min-h-max overflow-x-hidden relative">
      <h4 className="h4 font-semibold border-b border-zinc-500/50 pb-3 mb-3">
        Messages
      </h4>

      <div className="relative h-full w-full">
        {!loading ? (
          <>
            {friends.length > 0 ? (
              friends?.map((person, index) => (
                <div
                  className={`w-full p-4 rounded-md my-2 bg-zinc-200 flex-between-hor hover:scale-[1.03] transition-transform duration-200 gap-3 ${
                    person.viewed > 0 && 'bg-zinc-100'
                  }`}
                  key={index}
                  onClick={() => {
                    markAsRead(person.userId);
                    navigate(`/dash/message/to/${person.userId}`);
                  }}
                >
                  <img
                    src={person.image ? person.image : userSvg}
                    className="w-16 h-16 rounded-full border border-zinc-100 object-cover object-top"
                  />
                  <div className="w-full">
                    <p className="body-1 font-semibold leading-none">
                      {person.names}
                      {JSON.stringify(person.viewed)}
                      {}
                    </p>
                    <p className="body-2 font-normal">{person.username}</p>
                    <p className="body-2 text-zinc-500 flex-between-hor">
                      <span>{person.lastMessageSnippet} ...</span>
                      <span className="font-semibold">
                        {getTime(person.lastMessageTime)}
                      </span>
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="w-full h-4/5 flex-center-both font-semibold body-1 text-zinc-700/50 rounded-md">
                No message yet
              </div>
            )}
          </>
        ) : (
          <ListSkeleton message />
        )}
      </div>
    </div>
  );
};

export default MessageComponent;
