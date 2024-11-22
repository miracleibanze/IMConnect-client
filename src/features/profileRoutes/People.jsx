import axios from 'axios';
import { useContext, useEffect, useState } from 'react';
import PersonCard from '../../components/design/PersonCard';
import Loader from '../../components/skeletons/Loader';
import { AppContext } from '../../App';
import { angleDownSvg } from '../../assets';
import axiosInstance from '../utils/axiosInstance';

const People = () => {
  const [friends, setFriends] = useState();
  const [nonFriends, setNonFriends] = useState();
  const [loadingnonFriends, setloadingNonFriends] = useState(false);
  const [viewMyFriends, setViewMyFriends] = useState(false);
  const context = useContext(AppContext);
  if (!context) return <Loader />;
  const { user } = context;

  useEffect(() => {
    const handlePeople = async () => {
      setloadingNonFriends(true);
      try {
        const response = await axiosInstance.get(`/users/${user.username}`);
        setFriends(response.data.friends);
        setNonFriends(response.data.nonFriends);
      } catch (error) {
        console.log('Error fetching feeds:', error);
      } finally {
        setloadingNonFriends(false);
      }
    };

    handlePeople();
  }, []);

  const sendFriendRequest = async (userId) => {
    try {
      const response = await fetch(`/friend-request/${userId}`, {
        method: 'POST',
      });
      if (response.ok) {
        alert('Friend request sent!');
      }
    } catch (error) {
      console.error('Error sending friend request:', error);
    }
  };

  return (
    <div className="h-full min-h-max bg-zinc-100 rounded-md w-full p-4 relative">
      <h4
        className="h4 w-full mb-4 font-semibold px-4 flex-between-hor hover:bg-zinc-200 duration-150 py-2 rounded-md"
        onClick={() => setViewMyFriends(!viewMyFriends)}
      >
        <span>Friends&nbsp;({friends?.length || 0}) </span>
        <img
          src={angleDownSvg}
          className={`w-6 h-6 ${viewMyFriends && 'rotate-180'}`}
        />
      </h4>
      <div className="relative">
        {viewMyFriends && (
          <>
            {friends?.length > 0 ? (
              <>
                {friends.map((user) => (
                  <PersonCard
                    key={user._id}
                    friends
                    person={user}
                    className="hover:bg-zinc-200/50"
                  />
                ))}
              </>
            ) : (
              <div className="w-full py-4 flex-center-both text-zinc-700/50 font-semibold body-1">
                No connected friends yet
              </div>
            )}
          </>
        )}
      </div>
      <h4 className="h4 w-full mb-4 font-semibold px-4">People you may know</h4>
      <div className="relative h-4/5">
        {!loadingnonFriends ? (
          <>
            {nonFriends?.length > 0 ? (
              nonFriends.map((user) => (
                <PersonCard
                  key={user._id}
                  person={user}
                  className="hover:bg-zinc-200/50"
                />
              ))
            ) : (
              <div className="w-full h-full flex-center-both text-zinc-700/50 font-semibold body-1 bg-zinc-200 rounded-md">
                No People found
              </div>
            )}
          </>
        ) : (
          <Loader />
        )}
      </div>
    </div>
  );
};

export default People;
