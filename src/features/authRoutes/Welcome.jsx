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
import Loader from '../../components/skeletons/Loader.jsx';
import Sidebar2 from '../../components/Sidebar2';
import { AppContext } from '../../App';

const Hero = lazy(() => import('../../components/Hero.jsx'));
const CreatePost = lazy(() => import('../../components/CreatePost.jsx'));
const AllMessages = lazy(() => import('../messageRoutes/allMessages.jsx'));
const MyFriends = lazy(() => import('../messageRoutes/MyFriends.jsx'));
const People = lazy(() => import('../profileRoutes/People.jsx'));
const Person = lazy(() => import('../profileRoutes/Person.jsx'));
const Photos = lazy(() => import('../profileRoutes/Photos.jsx'));
const Setting = lazy(() => import('../SettingRoutes/Setting.jsx'));
const ProfileSetting = lazy(
  () => import('../SettingRoutes/ProfileSetting.jsx')
);

export const context = createContext();

const Welcome = () => {
  const location = useLocation().pathname;
  const navigate = useNavigate();
  const [wrapped, setWrapped] = useState(window.innerWidth <= 640);
  const [searchBox, setSearchBox] = useState(false);
  const [people, setPeople] = useState();
  const [posts, setPosts] = useState();
  const appContext = useContext(AppContext);

  useEffect(() => {
    setWrapped(window.innerWidth <= 640);
    setSearchBox(false);
  }, [location]);

  return (
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
      <div className="w-full z-[99] h-[4.5rem] p-2 relative">
        <Navbar />
      </div>
      <main className="fixed right-0 left-0 bottom-0 top-[4.5rem] flex flex-col items-center">
        <div className="h-full w-full flex justify-between relative">
          <div
            className={`relative h-full flex-center-both p-2 z-[150] ${
              wrapped ? 'max-sm:hidden' : ''
            }`}
          >
            <Sidebar />
          </div>
          <div className="h-full w-full flex justify-between gap-2 overflow-y-scroll scroll-design relative">
            <div className="w-full h-full p-2 relative">
              {appContext ? (
                <Suspense fallback={<Loader />}>
                  <Routes>
                    <Route index element={<Hero />} />
                    <Route path="post" element={<CreatePost />} />
                    <Route path="post/:text" element={<CreatePost />} />
                    <Route path="search" element={<Hero />} />
                    <Route path="profile" element={<Person />} />
                    <Route path="people">
                      <Route index element={<People />} />
                      <Route path="person/:username" element={<Person />}>
                        <Route index element={<Photos />} />
                      </Route>
                    </Route>
                    <Route path="setting">
                      <Route index element={<Setting />} />
                      <Route path="profile" element={<ProfileSetting />} />
                    </Route>
                    <Route path="messages" element={<AllMessages />} />
                    <Route path="message/to/:userId" element={<MyFriends />} />
                  </Routes>
                </Suspense>
              ) : (
                <Loader />
              )}
            </div>
            <div className="sticky top-0 right-2 bottom-0 xl:flex hidden py-2 w-[18rem] px-2">
              <Sidebar2 />
            </div>
          </div>
        </div>
      </main>
    </context.Provider>
  );
};

export default Welcome;
