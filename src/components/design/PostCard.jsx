import { useContext, useEffect, useState } from 'react';
import {
  commentSvg,
  shareSvg,
  threeDotsVerticalSvg,
  thumbsUpBlueSvg,
  thumbsUpSvg,
  userSvg,
} from '../../assets';
import { AppContext } from '../../App';
import Loader from '../skeletons/Loader';
import axiosInstance from '../../features/utils/axiosInstance';

const PostCard = ({ post, className }) => {
  const context = useContext(AppContext);
  if (!context || !post) return <Loader />;
  const { user } = context;
  const [liked, setLiked] = useState(false);
  const [postLikes, setPostLikes] = useState(post.likes);

  useEffect(() => {
    if (post?.likedBy?.includes(user._id)) {
      setLiked(true);
    } else {
      setLiked(false);
    }
  }, [post, user._id]);

  const handleLike = async () => {
    if (liked) {
      return;
    }

    try {
      const response = await axiosInstance.post(`/posts/like/${post._id}`, {
        userId: user._id,
      });

      if (response.data.message === 'Post liked successfully') {
        setLiked(true);
        setPostLikes(postLikes + 1);
        return;
      }
      alert(response.data.message);
    } catch (err) {
      console.error(
        'Unable to like post:',
        err.response?.data?.message || err.message
      );
      console.log(err);
    }
  };

  function getTime(isoString) {
    if (isoString) {
      const date = new Date(isoString);
      const options = { hour: '2-digit', minute: '2-digit', hour12: false };
      return new Intl.DateTimeFormat('en-US', options).format(date);
    }
    return 'Long Time ago';
  }

  return (
    <div
      className={`h-max flex flex-col gap-2 py-4 my-4 px-4 rounded-md ${
        className ? className : 'bg-zinc-100'
      }`}
    >
      <div className="flex justify-between items-center border-b border-zinc-400/20 pb-2">
        <div className="flex items-center cursor-pointer gap-2 group">
          <img
            loading="lazy"
            src={post.avatar ? post.avatar : userSvg}
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
              Posted{' '}
              {!post.createdAt
                ? getTime(post.createdAt)
                : 'at ' + getTime(post.createdAt)}
            </p>
          </a>
        </div>
        {post.username === user.username && (
          <img
            loading="lazy"
            src={threeDotsVerticalSvg}
            alt="menu"
            className="h-5 cursor-pointer"
          />
        )}
      </div>
      <div
        className="caption leading-[0.82rem] py-2 text-zinc-700 post-description"
        dangerouslySetInnerHTML={{
          __html: post.description.replace(/\n/g, '<br />'),
        }}
      ></div>
      <div className="flex justify-between w-full gap-2 mt-2">
        {post.images &&
          post.images.map((item, index) => (
            <div
              className="w-full flex-center-both aspect-[5/6] rounded-md overflow-hidden relative"
              key={index}
            >
              <div
                className="img absolute inset-0 bg-center bg-cover bg-zinc-200"
                style={{ backgroundImage: `url(${item})` }}
              />
              <img
                loading="lazy"
                src={item}
                className="h-full object-cover z-[100] object-center"
              />
            </div>
          ))}
      </div>
      <div className="w-full grid grid-cols-3 caption tracking-tighter mt-4 body-1 border-t-2 border-zinc-300/50 pt-4">
        <div className="w-full flex-center-hor gap-3 " onClick={handleLike}>
          {postLikes}
          <img
            loading="lazy"
            src={liked ? thumbsUpBlueSvg : thumbsUpSvg}
            className="h-6"
          />
          {liked ? 'Liked' : 'Like'}
        </div>
        <div className="w-full flex-center-hor gap-3">
          <img loading="lazy" src={commentSvg} className="h-6" />
          comment
        </div>
        <div className="w-full flex-center-hor gap-3">
          <img loading="lazy" src={shareSvg} className="h-6" />
          share
        </div>
      </div>
    </div>
  );
};

export default PostCard;
