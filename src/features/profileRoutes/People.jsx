import { useContext, useEffect, useState } from 'react';
import PersonCard from '../../components/design/PersonCard';
import ListSkeleton from '../../components/skeletons/ListSkeleton';
import { angleDownSvg } from '../../assets';
import axiosInstance from '../utils/axiosInstance';
import WelcomeSkeleton from '../../components/skeletons/WelcomeSkeleton';
import { AppContext } from '../../components/AppContext';

const People = () => {
  const [friends, setFriends] = useState();
  const [nonFriends, setNonFriends] = useState();
  const [loadingnonFriends, setloadingNonFriends] = useState(true);
  const [viewMyFriends, setViewMyFriends] = useState(false);
  const [viewRequests, setViewRequests] = useState(false);
  const [requests, setRequests] = useState();
  const context = useContext(AppContext);
  const { user, usePageTitle } = context;
  if (!context || !user) return <WelcomeSkeleton />;
  usePageTitle('People | IMConnect');

  useEffect(() => {
    if (!user) return; // Only trigger the fetch if user is available

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
    const handleRequest = async () => {
      try {
        const response = await axiosInstance.get(
          `/users/confirm-request/${user._id}`
        );
        setRequests(response.data);
      } catch (error) {
        console.log('Error fetching feeds:', error);
      }
    };

    handlePeople();
    handleRequest();
  }, [user]);

  const confirmRequest = (person) => {
    const index = requests.findIndex((req) => req === person);

    if (index > -1) {
      requests.splice(index, 1);
    }

    requests.push(person);
  };

  return (
    <div className="min-h-full h-max bg-zinc-100 rounded-md w-full p-4 relative flex flex-col">
      <h5
        className="h5 w-full mb-4 font-semibold px-4 flex-between-hor hover:bg-zinc-200 duration-150 py-2 rounded-md"
        onClick={() => setViewRequests(!viewRequests)}
      >
        <span className="flex items-center">
          Friend Requests&nbsp;
          {loadingnonFriends ? (
            <div className="w-16 h-10 rounded-md b-zinc-200 skeleton-loader" />
          ) : (
            `(${requests?.length || 0})`
          )}
        </span>
        <img
          src={angleDownSvg}
          className={`w-6 h-6 ${viewMyFriends && 'rotate-180'}`}
        />
      </h5>
      {viewRequests && (
        <div className="relative flex flex-col gap-y-2">
          {requests?.length > 0 ? (
            <>
              {requests.map((person) => (
                <PersonCard
                  key={person._id}
                  person={person}
                  requests
                  userId={user._id}
                  className="hover:bg-zinc-200/50"
                  confirmRequest={confirmRequest}
                />
              ))}
            </>
          ) : (
            <div className="w-full py-4 flex-center-both text-zinc-700/50 font-semibold body-1">
              No friends requests yet
            </div>
          )}
        </div>
      )}
      <h5
        className="h5 w-full mb-4 font-semibold px-4 flex-between-hor hover:bg-zinc-200 duration-150 py-2 rounded-md"
        onClick={() => setViewMyFriends(!viewMyFriends)}
      >
        <span className="flex items-center">
          Friends&nbsp;
          {loadingnonFriends ? (
            <div className="w-16 h-10 rounded-md b-zinc-200 skeleton-loader" />
          ) : (
            `(${friends?.length || 0})`
          )}
        </span>
        <img
          src={angleDownSvg}
          className={`w-6 h-6 ${viewMyFriends && 'rotate-180'}`}
        />
      </h5>
      <div className="relative flex flex-col gap-y-2">
        {viewMyFriends && (
          <>
            {friends?.length > 0 ? (
              <>
                {friends.map((person) => (
                  <PersonCard
                    key={[person]._id}
                    friends
                    person={person}
                    userId={user._id}
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
      <h5 className="h5 w-full mb-4 font-semibold px-4">People you may know</h5>
      <div className="relative flex flex-col gap-y-2 h-full flex-1">
        {!loadingnonFriends ? (
          <>
            {nonFriends?.length > 0 ? (
              nonFriends.map((person) => (
                <PersonCard
                  key={person._id}
                  person={person}
                  userId={user._id}
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
          <ListSkeleton />
        )}
      </div>
    </div>
  );
};

export default People;
