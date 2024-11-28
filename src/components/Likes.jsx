import { useState, useEffect, useContext } from 'react';
import axiosInstance from '../features/utils/axiosInstance';
import { AppContext } from './AppContext';
import ListSkeleton from './skeletons/ListSkeleton';
import Notice from './design/Notice';
import PostCard from './design/PostCard';

const Likes = () => {
  const context = useContext(AppContext);
  if (!context) return <ListSkeleton />;
  const { user } = context;
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getPosts = async () => {
      try {
        const response = await axiosInstance.get(`/posts/likes/${user?._id}`);
        setPosts(response.data.posts);
      } catch (err) {
        console.log(err);
        setError(err?.response?.data?.message);
      } finally {
        setLoading(false);
      }
    };

    getPosts();
  }, [user]);

  return (
    <div className="w-full h-full min-h-max relative bg-zinc-100 rounded-md p-3 flex flex-col">
      <Notice message={error} onCancel={() => setError('')} />
      <h5 className="h5 w-full mb-4 font-semibold px-4 py-2 flex items-center border-b border-zinc-800/30 pb-3">
        My posts&nbsp;
        {loading ? (
          <div className="w-16 h-10 rounded-md b-zinc-200 skeleton-loader" />
        ) : (
          `(${posts?.length || 0})`
        )}
      </h5>
      <div className="relative h-full min-h-max w-full flex">
        {loading && <ListSkeleton />}
        {posts.length > 0 ? (
          posts.map((post) => <PostCard post={post} />)
        ) : (
          <p className="h-max w-full rounded-md flex-center-both text-zinc-700/70 font-semibold body-1">
            You don't have post yet.
          </p>
        )}
      </div>
    </div>
  );
};

export default Likes;
