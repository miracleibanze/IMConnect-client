import { useState, useEffect } from 'react';
import { chatDotsSvg, userSvg } from '../../assets';
import Button from './Button';
import axiosInstance from '../../features/utils/axiosInstance';
import Notice from './Notice';

const PersonCard = ({ person, className, friends, userId, requests }) => {
  const [isRequestSent, setIsRequestSent] = useState(
    person.requestSent || false
  ); // Set initial state based on person.requestSent
  const [isFriend, setIsFriend] = useState(friends);
  const [confirmed, setConfirmed] = useState(false);
  const [notice, setNotice] = useState('');
  const [declined, setDeclined] = useState(false);

  const sendFriendRequest = async () => {
    try {
      console.log('Sending a friend request');
      // Send API call to send friend request
      const response = await axiosInstance.post(
        `/users/send-friend-request/${person._id}`,
        {
          senderId: userId,
        }
      );

      if (response.status === 200) {
        setIsRequestSent(true);
        setNotice('Friend request sent.');
      } else {
        setNotice('Failed to send friend request.');
      }
    } catch (error) {
      console.error(error);
      setNotice('An error occurred while sending the request.');
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
        setConfirmed(true);
        setNotice('Friend request accepted!');
        setIsFriend(true);
      } else {
        setNotice('Failed to accept friend request.');
      }
    } catch (error) {
      console.error('Error accepting friend request:', error);
      setNotice('An error occurred while accepting the request.');
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
        setDeclined(true);
        setNotice('Friend request declined.');
      } else {
        setNotice('Failed to decline friend request.');
      }
    } catch (error) {
      setNotice('An error occurred while processing the request.');
    }
  };

  const toggleRequest = () => {
    setIsRequestSent(false);
    setNotice('Your friend request is being withdrawn.');
  };

  useEffect(() => {
    if (isRequestSent) {
      setNotice('Friend request sent.');
    }
  }, [isRequestSent]);

  return (
    <div className={`px-6 py-2 w-full flex-between-hor gap-5 ${className}`}>
      <Notice message={notice} onClose={() => setNotice('')} />
      <img
        src={person.image ? person.image : userSvg}
        className="w-[3rem] h-[3rem] rounded-full border border-zinc-50 object-top object-cover"
      />
      <div className="w-full flex-between-hor gap-2">
        <a
          href={`/dash/people/person/${person.username}`}
          className="w-full flex-col cursor-pointer group"
        >
          <p className="body-1 font-semibold leading-none group-hover:underline">
            {person.names}
          </p>
          <p className="body-1 font-normal">{person.username}</p>
        </a>

        {requests && !declined && (
          <Button border rounded light onClick={declineRequest}>
            Decline
          </Button>
        )}

        {requests && !declined && (
          <Button border rounded light onClick={acceptRequest}>
            Confirm
          </Button>
        )}

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
          className={isFriend && 'p-1'}
        >
          {isRequestSent ? (
            isFriend ? (
              <img src={chatDotsSvg} className="w-6 h-6 hover:h-8" />
            ) : (
              'Request Sent'
            )
          ) : isFriend ? (
            <img src={chatDotsSvg} className="w-7 h-7" />
          ) : (
            'Add Friend'
          )}
        </Button>
      </div>
    </div>
  );
};

export default PersonCard;
