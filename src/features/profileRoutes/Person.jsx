import { useContext, useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { arrowSvg } from '../../assets';
import Button from '../../components/design/Button';
import PostCard from '../../components/design/PostCard';
import PersonHeader from '../../components/PersonHeader';
import axiosInstance from '../utils/axiosInstance';
import PersonSkeleton from '../../components/skeletons/PersonSkeleton';
import Notice from '../../components/design/Notice';
import { AppContext } from '../../components/AppContext';

const Person = () => {
  const context = useContext(AppContext);
  const { pathname } = useLocation();

  const { username } = useParams();
  const user = context?.user;

  if (!username && !user?.username) {
    return <PersonSkeleton />;
  }

  const navigate = useNavigate();
  const [person, setPerson] = useState(null);
  const [posts, setPosts] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const handlePeople = async () => {
      if (!username && !user?.username) return; // Wait until data is available
      setLoading(true);
      try {
        const response = await axiosInstance.get(
          `/users/one/${username || user.username}`
        );
        setPerson(response.data.user);
        setPosts(response.data.posts);
      } catch (error) {
        setError('Error fetching user and posts:', error?.response?.data);
        setTimeout(() => {
          navigate(0);
        }, 500);
      } finally {
        setLoading(false);
      }
    };

    handlePeople();
  }, [username, user?.username, pathname]); // Ensure proper dependencies
  return !loading ? (
    <div className="w-full h-max min-h-screen bg-zinc-100 rounded-md p-4 relative">
      <Notice message={error} onClose={() => setError('')} />
      <>
        <img
          src={arrowSvg}
          className="h-5 w-5 rotate-180 mb-4 cursor-pointer"
          onClick={() => navigate(-1)}
        />
        <div className="relative w-full h-auto">
          <PersonHeader person={person} />
        </div>
        <div className="w-full flex items-center gap-3 mt-12 active flex-wrap">
          <Button
            wFull
            blue
            href={
              !username ? '/dash/messages' : `/dash/message/to/${person?._id}`
            }
          >
            Messages
          </Button>
          <Button wFull blue>
            Photos
          </Button>
          {!username && (
            <Button wFull blue href="/dash/setting/profile">
              Edit profile
            </Button>
          )}
        </div>
        <div className="flex w-full lg:flex-row flex-col mt-4 gap-4">
          <div className="lg:w-1/3 w-full flex flex-col gap-y-2">
            <h4 className="h4 font-semibold">About</h4>
            <p
              className={`leading-tight text-zinc-700/90 bg-zinc-50 lg:text-justify ${
                !person.about && 'h-[20rem] flex-center-both'
              }`}
            >
              {person.about
                ? person.about
                : "Hy there, I'am using IMConnect, feel free to start conversation with me."}
            </p>
          </div>
          <div className="lg:w-2/3 w-full flex flex-col gap-y-2 sm:max-h-[40rem] sm:overflow-y-scroll scroll-design">
            <h4 className="h4 font-semibold px-4">Posts</h4>
            {posts.length > 0 ? (
              Array(5)
                .fill('')
                .map((item, index) => {
                  if (posts[index]) {
                    return (
                      <PostCard
                        key={index}
                        post={posts[index]}
                        className="bg-zinc-200"
                      />
                    );
                  }
                })
            ) : (
              <div className="w-full h-full bg-zinc-200 rounded-md flex-center-both body-1 font-semibold text-zinc-700/60">
                No Post yet
              </div>
            )}
          </div>
        </div>
      </>
    </div>
  ) : (
    <PersonSkeleton />
  );
};

export default Person;
