import { useContext, useEffect, useState } from 'react';
import PostCard from './design/PostCard';
import PersonCard from './design/PersonCard';
import { context } from '../features/authRoutes/Welcome';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import Loader from './skeletons/Loader';
import { AppContext } from '../App';
import axiosInstance from '../features/utils/axiosInstance';

const Feeds = () => {
  const myContext = useContext(context);
  if (!myContext) return <Loader />;

  const { user } = useContext(AppContext);
  const location = useLocation();
  const navigate = useNavigate();
  const [people, setPeople] = useState([]);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const queryParams = new URLSearchParams(location.search);
  const nameParam = queryParams.get('name');
  const textParam = queryParams.get('text');

  useEffect(() => {
    const handleGetFeeds = async () => {
      setLoading(true);
      try {
        let response;
        if (nameParam && textParam) {
          response = await axiosInstance.get(
            `/search?text=${textParam}&name=${nameParam}`
          );
          setPeople(response.data.users);
          setPosts(response.data.posts);
        } else if (textParam) {
          response = await axiosInstance.get(`/search?text=${textParam}`);
          setPosts(response.data.posts);
        } else if (nameParam) {
          response = await axiosInstance.get(`/search?name=${nameParam}`);
          setPeople(response.data.users);
        } else {
          const postsResponse = await axiosInstance.get('/latest-posts');
          const usersResponse = await axiosInstance.get(
            `/latest-users/${user.username}`
          );
          setPeople(usersResponse.data);
          setPosts(postsResponse.data);
        }
        setLoading(false);
      } catch (error) {
        console.log('Error fetching feeds:', error);
        setTimeout(() => {
          navigate(0);
        }, 500);
      }
    };

    handleGetFeeds();
  }, [location.search, nameParam, textParam]);

  const content = (
    <>
      {(nameParam || textParam) && (
        <>
          <div className="w-full p-3 bg-zinc-200 rounded-md">
            <h2 className="h2">Results of search "{nameParam || textParam}"</h2>
          </div>
        </>
      )}

      {nameParam && (
        <div className="bg-zinc-200 py-3 rounded-md relative w-full min-h-full">
          <h4 className="h4 w-full mb-4 font-semibold px-4 border-b border-zinc-500/50">
            People
          </h4>
          {!loading ? (
            <>
              {people.length > 0 ? (
                <>
                  {people.map((item, index) => (
                    <PersonCard
                      key={index}
                      person={item}
                      className="hover:bg-zinc-100/70"
                    />
                  ))}
                  <a
                    href="/dash/people"
                    className="body-1 px-4 underline text-blue-700"
                  >
                    See all people
                  </a>
                </>
              ) : (
                <div className="body-2 font-semibold text-zinc-700/50 text-center min-h-[10rem] w-full flex-center-both">
                  No people found
                </div>
              )}
            </>
          ) : (
            <Loader />
          )}
        </div>
      )}

      {/* Posts Section */}
      {(location.pathname === '/dash' ||
        location.pathname === '/dash/' ||
        textParam) && (
        <div className="bg-zinc-200 py-8 px-4 relative h-full flex flex-col">
          <h4 className="h4 mb-4 font-semibold px-4 border-b border-zinc-500/50">
            Posts
          </h4>
          <div className="relative min-h-full w-full">
            {!loading ? (
              <>
                {posts.length > 0 ? (
                  <>
                    {posts.map((item, index) => (
                      <PostCard key={index} post={item} />
                    ))}
                    <a
                      href="/dash/posts"
                      className="body-1 px-4 underline text-blue-700"
                    >
                      See all Posts
                    </a>
                  </>
                ) : (
                  <h4 className="body-2 text-zinc-700/50 min-h-[7rem] w-full text-center flex-center-both font-semibold">
                    No posts found
                  </h4>
                )}
              </>
            ) : (
              <Loader />
            )}
          </div>
        </div>
      )}
    </>
  );

  return content;
};

export default Feeds;
