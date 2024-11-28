import { useContext, useEffect, useState } from 'react';
import { userSvg } from '../../assets';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../utils/axiosInstance';
import ListSkeleton from '../../components/skeletons/ListSkeleton';
import { AppContext } from '../../components/AppContext';
import { connectSocket, getSocket } from '../utils/Socket'; // Import connectSocket and getSocket

const MessageComponent = () => {
  const navigate = useNavigate();
  const context = useContext(AppContext);

  if (!context) return <ListSkeleton message />;

  const { user, usePageTitle } = context;
  usePageTitle('Messages | IMConnect');

  const [friends, setFriends] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const getTime = (isoString) => {
    if (!isoString) return 'Just now';
    const date = new Date(isoString);
    const options = { hour: '2-digit', minute: '2-digit', hour12: false };
    return new Intl.DateTimeFormat('en-US', options).format(date);
  };

  useEffect(() => {
    // Establish socket connection
    connectSocket();

    const fetchChatParticipants = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axiosInstance.get(`/messages/${user.username}`);
        setFriends(response.data);
      } catch (err) {
        console.error(err);
        setError('Failed to load messages. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchChatParticipants();

    // Listen for 'newMessage' event from the server
    const socket = getSocket(); // Get the active socket connection
    socket.on('newMessage', (newMessage) => {
      console.log('New message received:', newMessage);

      // Update the friend list with the new message
      setFriends((prevFriends) => {
        const updatedFriends = [...prevFriends];
        const participantIndex = updatedFriends.findIndex(
          (friend) => friend.userId === newMessage.senderId
        );

        if (participantIndex !== -1) {
          // Update existing participant's details
          const participant = updatedFriends[participantIndex];
          participant.earliestMessageSnippet = newMessage.message;
          participant.earliestMessageTime = newMessage.timestamp;
          participant.unread = true; // Mark as unread
          updatedFriends.splice(participantIndex, 1, participant);
        } else {
          // Add new participant to the list
          updatedFriends.unshift({
            userId: newMessage.senderId,
            names: newMessage.senderName || 'Unknown',
            username: newMessage.senderUsername || '',
            image: newMessage.senderImage || null,
            earliestMessageSnippet: newMessage.message,
            earliestMessageTime: newMessage.timestamp,
            unread: true,
          });
        }

        return updatedFriends;
      });
    });

    // Cleanup on component unmount
    return () => {
      const socket = getSocket();
      socket.disconnect();
    };
  }, [user]);

  return (
    <div className="bg-zinc-100 rounded-md px-3 w-full py-6 h-full min-h-max overflow-x-hidden relative">
      <h4 className="h4 font-semibold border-b border-zinc-500/50 pb-3 mb-3">
        Messages
      </h4>

      <div className="relative h-full w-full">
        {loading ? (
          <ListSkeleton message />
        ) : error ? (
          <div className="w-full h-4/5 flex-center-both font-semibold body-1 text-red-500 rounded-md">
            {error}
          </div>
        ) : friends.length > 0 ? (
          friends.map((person, index) => (
            <div
              className={`w-full p-4 rounded-md my-2 flex-between-hor transition-transform duration-200 gap-3 
              ${person.unread ? 'bg-zinc-100 hover:scale-[1.03]' : 'bg-zinc-200'}`}
              key={index}
              onClick={() => navigate(`/dash/message/to/${person.userId}`)}
            >
              <img
                src={person.image || userSvg}
                alt={`${person.names || 'User'}'s avatar`}
                className="w-16 h-16 rounded-full border border-zinc-100 object-cover object-top"
              />
              <div className="w-full">
                <p className="body-1 font-semibold leading-none">
                  {person.names || 'Unknown User'}
                </p>
                <p className="body-2 font-normal">{person.username || ''}</p>
                <p className="body-2 text-zinc-500 flex-between-hor">
                  <span>
                    {person.earliestMessageSnippet
                      ? `${person.earliestMessageSnippet} ...`
                      : 'No message'}
                  </span>
                  <span className="font-semibold">
                    {getTime(person.earliestMessageTime)}
                  </span>
                </p>
              </div>
            </div>
          ))
        ) : (
          <div className="w-full h-4/5 flex-center-both font-semibold body-1 text-zinc-700/50 rounded-md">
            No messages yet
          </div>
        )}
      </div>
    </div>
  );
};

export default MessageComponent;
