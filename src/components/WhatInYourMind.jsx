import { useContext, useLayoutEffect, useState } from 'react';
import { AppContext } from '../App';
import { userSvg } from '../assets';
import { postIcons } from './constants';
import Button from './design/Button';
import Loader from './skeletons/Loader';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import axiosInstance from '../features/utils/axiosInstance';

const WhatInYourMind = ({ className }) => {
  const navigate = useNavigate();
  const context = useContext(AppContext);

  if (!context) return <Loader />;

  const { user } = context;

  const [text, setText] = useState();

  const handlePost = async () => {
    const myPostObject = {
      user: user._id,
      description: text,
    };
    try {
      const response = await axiosInstance.post('/posts', myPostObject);
      if (response.data.message) {
        console.log(response.data.message);
        setTimeout(() => {
          navigate('/dash');
        }, 1000);
      } else {
        console.log('there is a problem');
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <div
      className={`w-full col-span-2 bg-zinc-200 p-2 rounded-md ${className}`}
    >
      <div className="w-full flex items-center gap-2">
        <img
          loading="lazy"
          src={user?.image ? user.image : userSvg}
          className={`w-8 aspect-square border rounded-md border-zinc-500 ${
            !user ? 'object-fit object-center p-1' : 'object-top object-cover'
          }`}
        />
        <input
          type="text"
          name="post"
          placeholder="What's on your mind?"
          className="outline-none px-4 py-1 border border-zinc-500 rounded-md flex-1"
          onChange={(event) => setText(event.target.value)}
        />
      </div>
      <div className="flex items-center justify-between gap-1 pt-2 relative">
        <div
          className="flex items-center gap-1"
          onClick={() => navigate(`/dash/post/${text}`)}
        >
          {postIcons.map((item) => (
            <div
              className="font-semibold flex gap-2 items-center body-2 px-2"
              key={item.id}
            >
              <img
                loading="lazy"
                src={item.icon}
                alt={item.name}
                className="w-5 aspect-square object-center object-cover"
              />
              {item.name}
            </div>
          ))}
        </div>
        <Button blue onClick={handlePost}>
          Post
        </Button>
      </div>
    </div>
  );
};

export default WhatInYourMind;
