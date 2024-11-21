import { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { arrowSvg, customCover, userSvg } from '../../assets';
import Button from '../../components/design/Button';
import PostCard from '../../components/design/PostCard';
import { AppContext } from '../../App';
import PersonHeader from '../../components/PersonHeader';
import Loader from '../../components/skeletons/Loader';
import axiosInstance from '../utils/axiosInstance';

const Person = () => {
  const context = useContext(AppContext);

  if (!context) return <Loader />;

  const { user } = context;

  const { username } = useParams();
  const navigate = useNavigate();
  const [person, setPerson] = useState(null);
  const [posts, setPosts] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const handlePeople = async () => {
      setLoading(true);
      try {
        const response = await axiosInstance.get(
          `/users/one/${username ? username : user.username}`
        );
        setPerson(response.data.user);
        setPosts(response.data.posts);
        setLoading(false);
      } catch (error) {
        console.log('Error fetching user and posts:', error);
        setTimeout(() => {
          navigate(0);
        }, 500);
      }
    };

    handlePeople();
  }, [username]);

  return (
    <div className="w-full h-max min-h-screen bg-zinc-100 rounded-md p-4 relative flex flex-col">
      {!loading ? (
        <>
          <img
            src={arrowSvg}
            className="h-5 w-5 rotate-180 mb-4 cursor-pointer"
            onClick={() => navigate(-1)}
          />
          {person ? <PersonHeader person={person} /> : <Loader />}
          <div className="w-full flex items-center gap-3 mt-12 active flex-wrap">
            <Button wFull blue href={`/dash/message/to/${person?._id}`}>
              Messages
            </Button>
            <Button wFull blue>
              Photos
            </Button>
            {person?._id === user._id && (
              <Button wFull blue href="/dash/setting/profile">
                Edit profile
              </Button>
            )}
          </div>
          {person ? (
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
          ) : (
            <Loader />
          )}
        </>
      ) : (
        <Loader />
      )}
    </div>
  );
};

export default Person;
