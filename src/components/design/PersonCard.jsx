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
  const [sendingRequest, setSendingRequest] = useState(false);

  useEffect(() => {
    if (person.requestSent) {
      setIsRequestSent(true);
    }
  });
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
    setSendingRequest(true);
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
    } finally {
      setSendingRequest(false);
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
    <div
      className={`px-6 py-2 w-full flex-between-hor border border-zinc-400/50 rounded-xl gap-5 ${className}`}
    >
      <Notice message={notice} onClose={() => setNotice('')} />
      <img
        src={person.image ? person.image : userSvg}
        className="h-[3rem] aspect-square rounded-full border border-zinc-50 object-top object-cover"
      />
      <div className="w-full md:flex-between-hor flex-center-vert gap-2">
        <a
          href={`/dash/people/person/${person.username}`}
          className="w-full flex-col cursor-pointer group"
        >
          <p className="body-2 font-semibold leading-none group-hover:underline">
            {person.names}
          </p>
          <p className="text-sm font-light">{person.username}</p>
        </a>
        <div className="flex justify-end items-center gap-2">
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
          {!requests && (
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
              className={isFriend && 'py-1 px-6'}
            >
              {isRequestSent ? (
                isFriend ? (
                  <img src={chatDotsSvg} className="w-6 h-6 hover:h-8" />
                ) : (
                  'Request Sent'
                )
              ) : isFriend ? (
                <img src={chatDotsSvg} className="w-7 h-7" />
              ) : !sendingRequest ? (
                'Add Friend'
              ) : (
                'sending'
              )}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default PersonCard;
