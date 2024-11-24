import { memo, useContext, useEffect, useState } from 'react';
import Loader from './skeletons/Loader';
import { userSvg } from '../assets';
import axiosInstance from '../features/utils/axiosInstance';
import { AppContext } from './AppContext';

const Sidebar2 = () => {
  const [people, setPeople] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const context = useContext(AppContext);

  if (!context) return <Loader />;

  const { user } = context;

  useEffect(() => {
    const handlePeople = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await axiosInstance.get(`/users/friends/${user?._id}`);
        setPeople(response.data);
      } catch (error) {
        console.error('Error fetching friends:', error);
        setError('Failed to fetch friends. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    if (user?._id) handlePeople();
  }, [user?._id]);

  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="flex flex-col rounded-md w-full bg-zinc-100 pt-16 p-2 flex-between-vert">
      <div className="w-full mb-4 h-full">
        <p className="body-2 mb-2 font-bold h-5">Friends</p>
        <div className="relative w-full h-">
          {!loading ? (
            people.length > 0 ? (
              people.map((person, index) => (
                <a
                  href={`/dash/people/person/${person?.username || 'username'}`}
                  className="flex gap-1 items-center"
                  key={person?._id || index}
                >
                  <img
                    src={person.image || userSvg}
                    className="h-8 w-8 rounded-md object-cover object-top p-1 border"
                  />
                  <p className="caption leading-none hover:underline cursor-pointer">
                    {person?.names || 'unknown'}
                  </p>
                </a>
              ))
            ) : (
              <div className="w-full min-h-32 bg-zinc-200 rounded-md flex-center-both text-center font-semibold text-zinc-500/50">
                No connected friends yet
              </div>
            )
          ) : (
            <div className=" p-3 rounded-md bg-zinc-100 skeleton-loader">
              <div className="w-full h-8 rounded-md bg-zinc-200 skeleton-loader mb-3" />
              <div className="w-full h-8 rounded-md bg-zinc-200 skeleton-loader mb-3" />
              <div className="w-full h-8 rounded-md bg-zinc-200 skeleton-loader mb-3" />
              <div className="w-full h-8 rounded-md bg-zinc-200 skeleton-loader mb-3" />
              <div className="w-full h-8 rounded-md bg-zinc-200 skeleton-loader mb-3" />
            </div>
          )}
        </div>
      </div>

      <a
        href="https://ibanze.vercel.app/"
        className="text-end cursor-pointer group"
      >
        <span className="group-hover:text-blue-800">IBANZE Miracle</span>
        <br />
        <span>&copy;{new Date().getFullYear()},&nbsp;All rights reserved.</span>
        <br />
      </a>
    </div>
  );
};

export default memo(Sidebar2);
