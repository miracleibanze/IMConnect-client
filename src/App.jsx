import {
  Navigate,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from 'react-router-dom';
import { lazy, Suspense, useContext, useEffect, useState } from 'react';
import PageNotFound from './components/PageNotFound.jsx';
import Loader from './components/skeletons/Loader.jsx';
import Register from './features/authRoutes/Register.jsx'; // Non-lazy import
import Public from './components/Public.jsx'; // Non-lazy import
import WelcomeSkeleton from './components/skeletons/WelcomeSkeleton.jsx';
import { AppContext } from './components/AppContext.jsx';
import Notice from './components/design/Notice.jsx';
import { connectSocket } from './features/utils/Socket.js';

const Welcome = lazy(() => import('./features/authRoutes/Welcome.jsx'));

const App = () => {
  const context = useContext(AppContext); // Access context
  if (!context) return <Loader />;
  const { isLogged, isLoading } = context;
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [notice, setNotice] = useState(null);

  useEffect(() => {
    if (!isLoading && isLogged && pathname === '/') {
    } else if (!isLogged && pathname.startsWith('/dash')) {
      navigate('/');
    }
  }, [isLogged, pathname, navigate, isLoading]);

  useEffect(() => {
    const socket = connectSocket();
    socket.on('newMessage', (newMessage) => {
      // Check if the current page is not the conversation page with the sender
      if (pathname !== `/dash/message/to/${newMessage.senderId}`) {
        const content = newMessage.image
          ? 'image'
          : newMessage.message.slice(0, 30); // Trim content or set to 'image'

        setNotice({
          message: 'New Message',
          name: newMessage.username,
          senderId: newMessage.senderId,
          content,
        });
      }
    });

    // Cleanup the socket listener when component unmounts
    return () => {
      socket.off('newMessage');
    };
  }, [pathname]);

  return (
    <>
      <Notice
        name={notice?.name}
        message={notice?.content}
        title={notice?.message}
        redirect={notice?.senderId}
        onClose={() => setNotice(null)}
      />
      <Routes>
        {!isLogged && (
          <>
            <Route path="/" element={!isLoading ? <Public /> : <Loader />} />
            <Route
              path="/auth/:logType"
              element={!isLoading ? <Register /> : <Loader />}
            />
          </>
        )}

        {isLogged && (
          <>
            <Route path="/" element={!isLoading ? <Public /> : <Loader />} />
            <Route
              path="/dash/*"
              element={
                <Suspense fallback={<WelcomeSkeleton />}>
                  <Welcome />
                </Suspense>
              }
            />
            <Route
              path="/auth/:logType"
              element={!isLoading ? <Register /> : <Loader />}
            />
            <Route path="*" element={<PageNotFound />} />
          </>
        )}
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </>
  );
};

export default App;
