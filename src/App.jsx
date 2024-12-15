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

const Welcome = lazy(() => import('./features/authRoutes/Welcome.jsx'));

const App = () => {
  const context = useContext(AppContext); // Access context
  if (!context) return <Loader />;
  const { isLogged, isLoading, user, messageChanged, setIsLogged } = context;
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [notice, setNotice] = useState(null);

  useEffect(() => {
    if (!isLoading && !isLogged && pathname.startsWith('/dash')) {
      navigate('/');
    }
  }, [isLogged, pathname, navigate, isLoading]);

  useEffect(() => {
    if (!messageChanged) return;
    if (pathname !== `/dash/message/to/${messageChanged?.senderId}`) {
      setNotice('you have a new message.');
    }
  }, [messageChanged]);

  useEffect(() => {
    if (pathname === '/dash' && !isLogged && user?.names) {
      setIsLogged(true);
    }
  }, [pathname, isLogged]);

  useEffect(() => {
    setTimeout(() => {
      if (notice) setNotice('');
    }, 1000);
  }, []);
  return (
    <>
      <Notice
        message={notice}
        onClose={() => setNotice(null)}
        onClick={() => {
          if (notice === 'you have a new message.')
            navigate(`/dash/message/to/${messageChanged?.senderId}`);
        }}
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
                isLoading ? (
                  <WelcomeSkeleton />
                ) : (
                  <Suspense fallback={<WelcomeSkeleton />}>
                    <Welcome />
                  </Suspense>
                )
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
