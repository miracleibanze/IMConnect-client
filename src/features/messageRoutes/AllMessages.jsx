import { useContext, useEffect, useState } from 'react';
import { userSvg } from '../../assets';
import { useNavigate } from 'react-router-dom';
import ListSkeleton from '../../components/skeletons/ListSkeleton';
import { AppContext } from '../../components/AppContext';
import axiosInstance from '../utils/axiosInstance';

const MessageComponent = () => {
  const navigate = useNavigate();
  const context = useContext(AppContext);
  const { user, usePageTitle } = context || {};
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

  function getTime(isoString) {
    const inputDate = new Date(isoString);
    const now = new Date();

    // Check for invalid date
    if (isNaN(inputDate)) {
      throw new Error('Invalid ISO date string');
    }

    // Helper function to format time in "hh:mm" format
    const formatTimeOnly = (date) => {
      const options = { hour: '2-digit', minute: '2-digit', hour12: false };
      return new Intl.DateTimeFormat('en-US', options).format(date);
    };

    // Helper function to check if two dates are the same day
    const isSameDay = (date1, date2) =>
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate();

    // Round both input time and current time to minutes
    inputDate.setSeconds(0, 0);
    now.setSeconds(0, 0);

    // "Just now" if rounded input time equals the current time
    if (+inputDate === +now) {
      return 'Just now';
    }

    // Check if it's yesterday
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);

    if (isSameDay(inputDate, yesterday)) {
      return `Yesterday, ${formatTimeOnly(inputDate)}`;
    }

    // Check if it's within the last week
    const oneWeekAgo = new Date(now);
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    if (inputDate > oneWeekAgo && inputDate < yesterday) {
      return 'Last week';
    }

    // Check if it's today
    if (isSameDay(inputDate, now)) {
      return formatTimeOnly(inputDate);
    }

    // Default: return the formatted date and time
    const options = {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    };
    return new Intl.DateTimeFormat('en-US', options).format(inputDate);
  }

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
              ${person.chatNotRead ? 'bg-zinc-200' : 'border border-zinc-300'}`}
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
