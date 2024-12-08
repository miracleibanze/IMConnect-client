import { useContext, useEffect, useRef, useState } from 'react';
import PostCard from './design/PostCard';
import PersonCard from './design/PersonCard';
import axiosInstance from '../features/utils/axiosInstance';
import { useLocation } from 'react-router-dom';
import FeedsSkeleton from './skeletons/FeedsSkeleton';
import { AppContext } from './AppContext';

const Feeds = () => {
  const { user } = useContext(AppContext);
  const location = useLocation();

  const [people, setPeople] = useState([]);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const topRef = useRef(null);

  const [postPage, setPostPage] = useState(1);
  const [peoplePage, setPeoplePage] = useState(1);
  const itemsPerPage = 10;

  const [hasMorePosts, setHasMorePosts] = useState(true);
  const [hasMorePeople, setHasMorePeople] = useState(true);

  const queryParams = new URLSearchParams(location.search);
  const nameParam = queryParams.get('name');
  const textParam = queryParams.get('text');

  const fetchFeeds = async () => {
    setLoading(true);
    setError(null);

    try {
      const postParams = textParam ? `&text=${textParam}` : '';
      const nameParams = nameParam ? `&name=${nameParam}` : '';

      if (nameParam || textParam) {
        const response = await axiosInstance.get(
          `/search?page=${postPage}&limit=${itemsPerPage}${postParams}${nameParams}`
        );

        if (nameParam) {
          setPeople(response.data.users || []);
          setHasMorePeople(response.data.users?.length === itemsPerPage);
        }

        if (textParam) {
          setPosts(response.data.posts || []);
          setHasMorePosts(response.data.posts?.length === itemsPerPage);
        }
      } else if (user) {
        const [postsResponse, usersResponse] = await Promise.all([
          axiosInstance.get(
            `/latest-posts?page=${postPage}&limit=${itemsPerPage}`
          ),
          axiosInstance.get(
            `/latest-users/${user.username}?page=${peoplePage}&limit=${itemsPerPage}`
          ),
        ]);
        setPeople(usersResponse.data.users || []);
        setHasMorePeople(usersResponse.data.users.length === itemsPerPage);

        setPosts(postsResponse.data.posts || []);
        setHasMorePosts(postsResponse.data.posts.length === itemsPerPage);
      }
    } catch (err) {
      console.error('Error fetching feeds:', err);
      setError('Failed to fetch feeds. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeeds();
  }, [postPage, peoplePage, nameParam, textParam, user]);

  if (error) return <div className="text-red-500 text-center">{error}</div>;

  useEffect(() => {
    if (topRef.current) {
      topRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [postPage, peoplePage]);

  if (error) return <div className="text-red-500 text-center">{error}</div>;

  return (
    <div className="w-full min-h-screen bg-zinc-200 py-3 rounded-md">
      <div ref={topRef} className="-translate-y-[12rem]" />
      {/* People Section */}
      {nameParam && (
        <div className="py-3 w-full">
          <h4 className="h4 font-semibold px-4 border-b border-zinc-500/50">
            People
          </h4>
          <div className="relative w-full h-max flex flex-col gap-2">
            {!loading ? (
              people.length > 0 ? (
                <>
                  {people.map((person) => (
                    <div key={person._id} className="h-max relative">
                      <PersonCard
                        person={person}
                        className="hover:bg-zinc-100/70"
                      />
                    </div>
                  ))}
                  <div className="flex justify-between">
                    {peoplePage > 1 && (
                      <button
                        className="btn btn-secondary"
                        onClick={() => setPeoplePage((prev) => prev - 1)}
                      >
                        Previous
                      </button>
                    )}
                    {hasMorePeople && (
                      <button
                        className="btn btn-primary"
                        onClick={() => setPeoplePage((prev) => prev + 1)}
                      >
                        Next
                      </button>
                    )}
                  </div>
                </>
              ) : (
                <div className="body-2 font-semibold text-zinc-700/50 flex-center-both min-h-[10rem]">
                  No people found
                </div>
              )
            ) : (
              <FeedsSkeleton />
            )}
          </div>
        </div>
      )}

      {/* Posts Section */}
      {(location.pathname === '/dash' || textParam) && (
        <div className="w-full flex flex-col gap-4 relative h-full p-2">
          <h4 className="h4 font-semibold px-4 border-b border-zinc-500/50">
            Posts
          </h4>
          <div className="w-full px-4 flex flex-col gap-4 h-full relative">
            {!loading ? (
              posts.length > 0 ? (
                <>
                  {posts.map((post) => (
                    <PostCard key={post._id} post={post} />
                  ))}
                  <div className="flex-center-hor">
                    {postPage > 1 && (
                      <button
                        className="btn btn-secondary"
                        onClick={() => setPostPage((prev) => prev - 1)}
                      >
                        Previous
                      </button>
                    )}
                    {hasMorePosts && (
                      <button
                        className="btn btn-primary"
                        onClick={() => setPostPage((prev) => prev + 1)}
                      >
                        More
                      </button>
                    )}
                  </div>
                </>
              ) : (
                <h4 className="body-2 text-zinc-700/50 min-h-[7rem] w-full text-center font-semibold">
                  No posts found
                </h4>
              )
            ) : (
              <FeedsSkeleton />
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Feeds;
