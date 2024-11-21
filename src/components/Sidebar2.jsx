import { memo, useContext, useEffect, useState } from 'react';
import { AppContext } from '../App';
import axios from 'axios';
import Loader from './skeletons/Loader';
import { userSvg } from '../assets';
import axiosInstance from '../features/utils/axiosInstance';

const Sidebar2 = () => {
  const [people, setPeople] = useState();
  const context = useContext(AppContext);
  if (!context) return <Loader />;
  const { user } = context;
  const [loading, setloading] = useState(true);
  useEffect(() => {
    const handlePeople = async () => {
      try {
        setloading(true);
        const response = await axiosInstance.get(`/users/friends/${user._id}`);
        setPeople(response.data);
        setloading(false);
      } catch (error) {
        console.log('Error fetching feeds:', error);
      }
    };

    handlePeople();
  }, []);

  return !loading ? (
    <div className="flex flex-col rounded-md w-full bg-zinc-100 pt-16 p-2 flex-between-vert">
      <div className="flex flex-col w-full gap-2 mb-4">
        <p className="body-2 font-bold h-5">Friends</p>
        {people?.length > 0 ? (
          people.map((person) => (
            <a
              href={`/dash/people/person/${person.username}`}
              className="flex gap-1 items-center"
              key={person._id}
            >
              <img
                src={person.image ? person.image : userSvg}
                className="h-8 w-8 rounded-md object-cover object-top p-1 border"
              />
              <p className="caption leading-none hover:underline cursor-pointer">
                {person.names}
              </p>
            </a>
          ))
        ) : (
          <div className="w-full min-h-32 bg-zinc-200 rounded-md flex-center-both text-center font-semibold text-zinc-500/50">
            No connected friends yet
          </div>
        )}
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
  ) : (
    <p>Loading</p>
  );
};

export default memo(Sidebar2);
