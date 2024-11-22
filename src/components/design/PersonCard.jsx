import { useState } from 'react';
import { chatDotsSvg, userSvg } from '../../assets';
import Button from './Button';
import axiosInstance from '../../features/utils/axiosInstance';
import Notice from './Notice';

const PersonCard = ({ person, className, friends, userId }) => {
  const [isRequestSent, setIsRequestSent] = useState(false);
  const [isFriend, setIsFriend] = useState(friends);
  const [notice, setNotice] = useState('');

  const sendFriendRequest = async () => {
    try {
      // Send API call to send friend request
      const response = await axiosInstance.post(
        `/users/send-friend-request/${person._id}`,
        {
          senderId: userId,
        }
      );

      if (response.status === 200) {
        setIsRequestSent(true);
      } else {
        alert('Failed to send friend request.');
      }
    } catch (error) {
      console.log(error);
      alert('An error occurred while sending the request.');
    }
  };

  const acceptRequest = async () => {
    try {
      const response = await axiosInstance.post(
        `/users/respond-friend-request/${person._id}`,
        {
          recipientId: userId,
          action: 'accept',
        }
      );

      if (response.status === 200) {
        setIsFriend(true);
        alert('Friend request accepted!');
      } else {
        alert('Failed to accept friend request.');
      }
    } catch (error) {
      console.error('Error accepting friend request:', error);
      alert('An error occurred while accepting the request.');
    }
  };

  const declineRequest = async () => {
    try {
      const response = await axiosInstance.post(
        `/users/respond-friend-request/${person._id}`,
        {
          recipientId: userId,
          action: 'decline',
        }
      );

      if (response.status === 200) {
        setIsRequestSent(false);
        alert('Friend request declined.');
      } else {
        alert('Failed to decline friend request.');
      }
    } catch (error) {
      setNotice('request already made');
    }
  };

  const toggleRequest = () => {
    setIsRequestSent(false);
  };

  return (
    <div
      className={`px-6 py-2 w-full flex-between-hor gap-5 ${className && className}`}
    >
      {notice && <Notice message={notice} onClose={() => setNotice('')} />}
      <img
        src={person.image ? person.image : userSvg}
        className="w-[3rem] h-[3rem] rounded-full border border-zinc-50 object-top object-cover"
      />
      <div className="w-full flex-between-hor">
        <a
          href={`/dash/people/person/${person.username}`}
          className="w-full flex-col cursor-pointer group"
        >
          <p className="body-1 font-semibold leading-none group-hover:underline">
            {person.names}
          </p>
          <p className="body-1 font-normal">{person.username}</p>
        </a>
        <Button
          blue={!isFriend && !isRequestSent}
          border={isRequestSent || isFriend}
          rounded={isRequestSent || isFriend}
          light={isRequestSent || isFriend}
          onClick={
            isRequestSent
              ? isFriend
                ? null
                : toggleRequest
              : sendFriendRequest
          }
          href={isFriend ? `/dash/message/to/${person._id}` : null}
        >
          {isRequestSent ? (
            isFriend ? (
              <img src={chatDotsSvg} className="w-6 h-6 hover:h-8" />
            ) : (
              'Request Sent'
            )
          ) : isFriend ? (
            'Friend'
          ) : (
            'Add Friend'
          )}
        </Button>
      </div>
    </div>
  );
};

export default PersonCard;
