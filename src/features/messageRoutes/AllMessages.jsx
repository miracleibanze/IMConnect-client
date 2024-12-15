import { useContext, useEffect, useRef, useState } from 'react';
import { userSvg } from '../../assets';
import { useNavigate } from 'react-router-dom';
import ListSkeleton from '../../components/skeletons/ListSkeleton';
import { AppContext } from '../../components/AppContext';
import axiosInstance from '../utils/axiosInstance';
import GetTime from '../utils/GetTime';

export const MessageCard = ({ person, messageChanged }) => {
  const navigate = useNavigate();
  const containerRef = useRef();
  const [messageSnippet, setMessageSnippet] = useState(
    person.earliestMessage.message
  );
  const [messageTime, setMessageTime] = useState(
    person.earliestMessage.timestamp
  );

  useEffect(() => {
    if (
      messageChanged &&
      (messageChanged.senderId === person.userId ||
        messageChanged.receiverId === person.userId)
    ) {
      setMessageSnippet(messageChanged.message);
      setMessageTime(messageChanged.timestamp);
    }
  }, [messageChanged, person]);

  const truncateText = (text, maxLength = 40) =>
    text.length > maxLength ? text.slice(0, maxLength) + '...' : text;

  const mouseMove = (e) => {
    const container = containerRef.current;
    if (container) {
      const rect = container.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      container.style.setProperty('--x', `${x}px`);
      container.style.setProperty('--y', `${y}px`);
    }
  };

  const mouseLeave = () => {
    const container = containerRef.current;
    if (container) {
      container.style.setProperty('--x', `-50%`);
      container.style.setProperty('--y', `-50%`);
    }
  };

  return (
    <div
      ref={containerRef}
      className={`hover-effect-container cursor-pointer relative overflow-hidden w-full p-4 rounded-md my-2 flex-between-hor transition-transform duration-200 gap-3 
        ${person.chatNotRead ? 'bg-zinc-200' : 'border border-zinc-300'}`}
      onClick={() => navigate(`/dash/message/to/${person.userId}`)}
      onMouseMove={mouseMove}
      onMouseLeave={mouseLeave}
    >
      <img
        src={person.image || userSvg}
        alt={`${person.names || 'User'}'s avatar`}
        className="w-16 aspect-square rounded-full z-[10] border border-zinc-300 bg-zinc-300 object-cover object-top"
      />
      <div className="w-full z-[10]">
        <p className="body-1 font-semibold leading-none flex-between-hor">
          {person.names || 'Unknown User'}
          {person.chatNotRead && (
            <span className="caption leading-tight tracking-tighter text-blue-700">
              unread
            </span>
          )}
        </p>
        <p className="body-2 font-normal">{person.username || ''}</p>
        <p className="body-2 text-zinc-500 flex-between-hor">
          <span className="flex items-center">
            {person.earliestMessage.senderId !== person.userId && 'You: '}
            {person.earliestMessage.isImage
              ? `🖼️ Sent${person.earliestMessage.senderId === person.userId ? ' you ' : ' '}an image.`
              : truncateText(messageSnippet)}
          </span>
          <span className="font-semibold">
            <GetTime time={messageTime} />
          </span>
        </p>
      </div>
    </div>
  );
};

const MessageComponent = () => {
  const context = useContext(AppContext);
  const { user, usePageTitle, messageChanged } = context || {};
  const [friends, setFriends] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  if (!context || !context?.user) return <ListSkeleton message />;

  usePageTitle('Messages | IMConnect');

  useEffect(() => {
    const fetchChatParticipants = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get(`/messages/${user?.username}`);
        setFriends(response.data || []);
      } catch (err) {
        console.error(err);
        setError('Failed to load messages. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    if (user) fetchChatParticipants();
  }, [user]);

  useEffect(() => {
    if (messageChanged) {
      setFriends((prevFriends) => {
        // Find the person associated with the new message
        const personIndex = prevFriends.findIndex(
          (person) =>
            person.userId === messageChanged.senderId ||
            person.userId === messageChanged.receiverId
        );

        if (personIndex === -1) return prevFriends; // If not found, return the array as is

        // Update the person's details
        const updatedPerson = {
          ...prevFriends[personIndex],
          earliestMessage: messageChanged,
          chatNotRead: true, // Add or update the chatNotRead field
        };

        // Move the updated person to the top of the array
        const updatedFriends = [
          updatedPerson,
          ...prevFriends.filter((_, index) => index !== personIndex),
        ];

        return updatedFriends;
      });
    }
  }, [messageChanged]);

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
          friends.map((person) => (
            <MessageCard
              key={person.userId}
              person={person}
              messageChanged={messageChanged}
            />
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
