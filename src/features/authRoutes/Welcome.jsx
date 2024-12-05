import {
  createContext,
  lazy,
  Suspense,
  useContext,
  useEffect,
  useState,
} from 'react';
import {
  Outlet,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from 'react-router-dom';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import Sidebar2 from '../../components/Sidebar2';
import WelcomeSkeleton from '../../components/skeletons/WelcomeSkeleton.jsx';
import useWrappedState from '../../components/useWrappedState.jsx';
import { AppContext } from '../../components/AppContext.jsx';
import MyPosts from '../../components/MyPosts.jsx';
import ProfileSetting from '../SettingRoutes/ProfileSetting.jsx';
import OutletContainer from '../../components/Outlet.jsx';
import AccountSetting from '../SettingRoutes/AccountSetting.jsx';
import DeleteModal from '../../components/DeleteModal.jsx';

const Hero = lazy(() => import('../../components/Hero.jsx'));
const CreatePost = lazy(() => import('../../components/CreatePost.jsx'));
const AllMessages = lazy(() => import('../messageRoutes/AllMessages.jsx'));
const MyFriends = lazy(() => import('../messageRoutes/OneChat.jsx'));
const People = lazy(() => import('../profileRoutes/People.jsx'));
const Person = lazy(() => import('../profileRoutes/Person.jsx'));
const Photos = lazy(() => import('../profileRoutes/Photos.jsx'));
const Setting = lazy(() => import('../SettingRoutes/Setting.jsx'));

export const context = createContext();

const Welcome = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { wrapped, setWrapped, searchBox, setSearchBox } = useWrappedState();
  const [people, setPeople] = useState();
  const [posts, setPosts] = useState();
  const appContext = useContext(AppContext);
  const { isLogged, isLoading, user } = appContext;

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!appContext) {
        alert('Session expired or context unavailable.');
        navigate('/login');
      }
    }, 12000);

    return () => clearTimeout(timer);
  }, [appContext, pathname]);

  useEffect(() => {
    const handleResize = () => setWrapped(window.innerWidth <= 640);
    handleResize();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [setWrapped]);

  return (
    <>
      <div className="w-full z-[99] h-[4.5rem] p-2 relative">
        <Navbar
          wrapped={wrapped}
          setWrapped={setWrapped}
          searchBox={searchBox}
          setSearchBox={setSearchBox}
        />
      </div>
      <main className="fixed right-0 left-0 bottom-0 top-[4.5rem] pl-2 py-2 flex flex-col items-center">
        <div className="h-full w-full flex justify-between relative gap-2">
          <div
            className={`relative h-full flex-center-both z-[150] ${
              wrapped ? 'max-sm:hidden' : ''
            }`}
          >
            <Sidebar
              wrapped={wrapped}
              setWrapped={setWrapped}
              setSearchBox={setSearchBox}
            />
          </div>
          <div className="h-full w-full flex justify-between gap-2 overflow-y-scroll scroll-design relative">
            <div className="w-full h-full relative">
              <context.Provider
                value={{
                  searchBox,
                  setSearchBox,
                  wrapped,
                  setWrapped,
                  setPeople,
                  people,
                  posts,
                  setPosts,
                }}
              >
                {appContext ? (
                  <Suspense fallback={<WelcomeSkeleton />}>
                    <Routes>
                      <Route index element={<Hero />} />
                      <Route path="post" element={<CreatePost />} />
                      <Route path="post/:text" element={<CreatePost />} />
                      <Route path="search" element={<Hero />} />
                      <Route path="profile" element={<Person />} />
                      <Route path="my_posts" element={<MyPosts />} />
                      <Route path="people" element={<Outlet />}>
                        <Route index element={<People />} />
                        <Route path="person/:username" element={<Person />}>
                          <Route index element={<Photos />} />
                        </Route>
                      </Route>
                      <Route path="setting" element={<Outlet />}>
                        <Route index element={<Setting />} />
                        <Route path="profile" element={<ProfileSetting />} />
                        <Route path="account" element={<AccountSetting />} />
                      </Route>
                      <Route path="messages" element={<AllMessages />} />
                      <Route
                        path="message/to/:userId"
                        element={<MyFriends />}
                      />
                    </Routes>
                  </Suspense>
                ) : (
                  <WelcomeSkeleton />
                )}
              </context.Provider>
            </div>
            <div className="sticky top-0 right-2 bottom-0 xl:flex hidden py-2 w-[18rem] px-2">
              <Sidebar2 />
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default Welcome;
