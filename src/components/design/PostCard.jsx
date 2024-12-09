import React, { useContext, useEffect, useState } from 'react';
import {
  commentSvg,
  shareSvg,
  threeDotsVerticalSvg,
  thumbsUpBlueSvg,
  thumbsUpSvg,
  userSvg,
} from '../../assets';
import Loader from '../skeletons/Loader';
import axiosInstance from '../../features/utils/axiosInstance';
import { AppContext } from '../AppContext';
import Notice from './Notice';

const PostCard = ({ post, className }) => {
  const context = useContext(AppContext);
  if (!context) return <Loader />;

  const { user } = context;

  // State Management
  const [liked, setLiked] = useState(false);
  const [notice, setNotice] = useState('');
  const [postLikes, setPostLikes] = useState(post?.likes || 0);

  useEffect(() => {
    if (post?.likedBy?.includes(user?._id)) {
      setLiked(true);
    } else {
      setLiked(false);
    }
    console.log(post);
  }, [post, user?._id]);

  const handleLike = async () => {
    try {
      const response = await axiosInstance.post(`/posts/like/${post._id}`, {
        userId: user._id,
      });

      if (response.data.message === 'ok') {
        setLiked(!liked); // Toggle liked state
        setPostLikes(response.data.likes); // Update likes
      } else {
        setLiked(!liked); // Toggle liked state
        setNotice(response.data.message);
      }
    } catch (err) {
      console.error(
        'Unable to like post:',
        err.response?.data?.message || err.message
      );
    }
  };

  const getTime = (isoString) => {
    if (!isoString) return 'Long time ago';
    const date = new Date(isoString);
    const options = { hour: '2-digit', minute: '2-digit', hour12: false };
    return new Intl.DateTimeFormat('en-US', options).format(date);
  };

  if (!post) return <Loader />; // Ensure `post` exists

  return (
    <div
      className={`h-max flex flex-col py-4 px-4 rounded-md ${
        className ? className : 'bg-zinc-100'
      }`}
    >
      <Notice message={notice} onCancel={() => setNotice('')} />
      <div className="flex justify-between items-center border-b border-zinc-400/20 pb-2">
        <div className="flex items-center cursor-pointer gap-2 group">
          <img
            loading="lazy"
            src={post.avatar || userSvg}
            className={`w-11 aspect-square object-top border object-cover rounded-md bg-zinc-300/50 ${
              !post.avatar && 'p-2'
            }`}
          />
          <a href={`/dash/people/person/${post.username}`}>
            <p className="caption font-semibold">
              <span className="group-hover:underline">{post.person}</span>
              {post.feeling && ' is ' + post.feeling}
            </p>
            <p className="text-[12px] leading-3">
              Posted at {getTime(post.createdAt)}
            </p>
          </a>
        </div>
        {post?.username === user?.username && (
          <img
            loading="lazy"
            src={threeDotsVerticalSvg}
            alt="menu"
            className="h-5 cursor-pointer"
          />
        )}
      </div>
      <div className="caption pb-2 text-zinc-700 post-description pt-6">
        {post.description.split('\n').map((line, index) => (
          <React.Fragment key={index}>
            {line}
            <br />
          </React.Fragment>
        ))}
      </div>

      <div className="flex justify-between h-max gap-2 pb-4">
        {Array.isArray(post.images) &&
          post.images.map((item, index) => (
            <div
              className="w-full flex-center-both h-auto max-h-[30rem] rounded-md overflow-hidden relative"
              key={index}
            >
              <div
                className="img absolute inset-0 bg-center bg-cover bg-zinc-200"
                style={{ backgroundImage: `url(${item})` }}
              />
              <img
                loading="lazy"
                src={item}
                className="object-cover z-[100] object-center"
              />
            </div>
          ))}
      </div>
      <div className="w-full grid grid-cols-3 caption tracking-tighter body-1 border-t-2 border-zinc-300/50 pt-4">
        <div className="w-full flex-center-hor gap-3" onClick={handleLike}>
          {postLikes}
          <img
            loading="lazy"
            src={liked ? thumbsUpBlueSvg : thumbsUpSvg}
            className="h-6"
          />
        </div>
        <div
          className="w-full flex-center-hor gap-3"
          onClick={() => setNotice('Functionality not yet set')}
        >
          <img loading="lazy" src={commentSvg} className="h-6" />
        </div>
        <div
          className="w-full flex-center-hor gap-3"
          onClick={() => setNotice('Functionality not yet set')}
        >
          <img loading="lazy" src={shareSvg} className="h-6" />
        </div>
      </div>
    </div>
  );
};

export default PostCard;
