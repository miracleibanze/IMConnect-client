import { useContext, useEffect, useState } from 'react';
import PostCard from './design/PostCard';
import PersonCard from './design/PersonCard';
import axiosInstance from '../features/utils/axiosInstance';
import { useLocation } from 'react-router-dom';
import FeedsSkeleton from './skeletons/FeedsSkeleton';
import { AppContext } from './AppContext';
import Button from './design/Button';

const Feeds = () => {
  const { user } = useContext(AppContext);
  const location = useLocation();

  const [people, setPeople] = useState([]);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [postPage, setPostPage] = useState(1);
  const [peoplePage, setPeoplePage] = useState(1);
  const itemsPerPage = 10;

  const [hasMorePosts, setHasMorePosts] = useState(true);
  const [hasMorePeople, setHasMorePeople] = useState(true);
  const [loadingMorePosts, setLoadingMorePosts] = useState(false);
  const [loadingMorePeople, setLoadingMorePeople] = useState(false);

  const queryParams = new URLSearchParams(location.search);
  const nameParam = queryParams.get('name');
  const textParam = queryParams.get('text');

  const fetchFeeds = async () => {
    if (postPage === 1 && peoplePage === 1) {
      setLoading(true);
    }
    setError(null);

    try {
      const postParams = textParam ? `&text=${textParam}` : '';
      const nameParams = nameParam ? `&name=${nameParam}` : '';

      if (nameParam || textParam) {
        const response = await axiosInstance.get(
          `/search?page=${postPage}&limit=${itemsPerPage}${postParams}${nameParams}`
        );

        if (nameParam) {
          setPeople((prevPeople) => {
            const newPeople = response.data.users || [];
            const uniquePeople = [
              ...prevPeople,
              ...newPeople.filter(
                (newPerson) =>
                  !prevPeople.some((person) => person._id === newPerson._id)
              ),
            ];
            return uniquePeople;
          });
          setHasMorePeople(response.data.users?.length === itemsPerPage);
        }

        if (textParam) {
          setPosts((prevPosts) => {
            const newPosts = response.data.posts || [];
            const uniquePosts = [
              ...prevPosts,
              ...newPosts.filter(
                (newPost) => !prevPosts.some((post) => post._id === newPost._id)
              ),
            ];
            return uniquePosts;
          });
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

        setPeople((prevPeople) => {
          const newPeople = usersResponse.data.users || [];
          const uniquePeople = [
            ...prevPeople,
            ...newPeople.filter(
              (newPerson) =>
                !prevPeople.some((person) => person._id === newPerson._id)
            ),
          ];
          return uniquePeople;
        });
        setHasMorePeople(usersResponse.data.users.length === itemsPerPage);

        setPosts((prevPosts) => {
          const newPosts = postsResponse.data.posts || [];
          const uniquePosts = [
            ...prevPosts,
            ...newPosts.filter(
              (newPost) => !prevPosts.some((post) => post._id === newPost._id)
            ),
          ];
          return uniquePosts;
        });
        setHasMorePosts(postsResponse.data.posts.length === itemsPerPage);
      }
    } catch (err) {
      console.error('Error fetching feeds:', err);
      setError('Failed to fetch feeds. Please try again.');
    } finally {
      if (postPage === 1 && peoplePage === 1) {
        setLoading(false);
      }
    }
  };

  const loadMorePosts = async () => {
    if (loadingMorePosts || !hasMorePosts) return;

    setLoadingMorePosts(true);

    const postParams = textParam ? `&text=${textParam}` : '';
    const nameParams = nameParam ? `&name=${nameParam}` : '';

    try {
      const response = await axiosInstance.get(
        `/search?page=${postPage + 1}&limit=${itemsPerPage}${postParams}${nameParams}`
      );

      setPosts((prevPosts) => [...prevPosts, ...response.data.posts]);
      setHasMorePosts(response.data.posts.length === itemsPerPage);
      setPostPage((prev) => prev + 1);

      // Scroll to the bottom after loading more posts
    } catch (err) {
      console.error('Error fetching more posts:', err);
    } finally {
      setLoadingMorePosts(false);
    }
  };

  const loadMorePeople = async () => {
    if (loadingMorePeople || !hasMorePeople) return;

    setLoadingMorePeople(true);

    const postParams = textParam ? `&text=${textParam}` : '';
    const nameParams = nameParam ? `&name=${nameParam}` : '';

    try {
      const response = await axiosInstance.get(
        `/search?page=${peoplePage + 1}&limit=${itemsPerPage}${postParams}${nameParams}`
      );

      setPeople((prevPeople) => [...prevPeople, ...response.data.users]);
      setHasMorePeople(response.data.users.length === itemsPerPage);
      setPeoplePage((prev) => prev + 1);
    } catch (err) {
      console.error('Error fetching more people:', err);
    } finally {
      setLoadingMorePeople(false);
    }
  };

  useEffect(() => {
    fetchFeeds();
  }, [postPage, peoplePage, nameParam, textParam, user]);

  if (error) return <div className="text-red-500 text-center">{error}</div>;

  return (
    <div className="w-full min-h-screen bg-zinc-200 py-3 rounded-md">
      {/* People Section */}
      {nameParam && (
        <div className="py-3 w-full">
          <h4 className="h4 font-semibold px-4 border-b border-zinc-500/50">
            People
          </h4>
          <div className="relative w-full h-max flex flex-col gap-2 p-3">
            {!loading ? (
              people.length > 0 ? (
                <>
                  {people.map((person) => (
                    <div
                      key={person._id}
                      className="h-max relative bg-zinc-100 rounded-md"
                    >
                      <PersonCard
                        person={person}
                        noAction
                        className="hover:bg-zinc-100/70"
                      />
                    </div>
                  ))}
                  <div className="flex-center-both gap-2">
                    {hasMorePeople ? (
                      <Button
                        blue
                        rounded
                        className="btn btn-primary"
                        onClick={loadMorePeople}
                      >
                        {loadingMorePeople ? 'Loading...' : 'More stories'}
                      </Button>
                    ) : null}
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
                    {hasMorePosts ? (
                      <Button
                        blue
                        rounded
                        className="btn btn-primary"
                        onClick={loadMorePosts}
                      >
                        {loadingMorePosts ? 'Loading...' : 'More stories'}
                      </Button>
                    ) : null}
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
