import {
  Navigate,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from 'react-router-dom';
import { lazy, Suspense, useContext, useEffect } from 'react';
import PageNotFound from './components/PageNotFound.jsx';
import Loader from './components/skeletons/Loader.jsx';
import Register from './features/authRoutes/Register.jsx'; // Non-lazy import
import Public from './components/Public.jsx'; // Non-lazy import
import WelcomeSkeleton from './components/skeletons/WelcomeSkeleton.jsx';
import { AppContext } from './components/AppContext.jsx';

const Welcome = lazy(() => import('./features/authRoutes/Welcome.jsx'));

const App = () => {
  const { isLogged, isLoading } = useContext(AppContext); // Access context
  const { pathname } = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && isLogged && pathname === '/') {
      navigate('/dash');
    } else if (!isLogged && pathname.startsWith('/dash')) {
      navigate('/');
    }
  }, [isLogged, pathname, navigate, isLoading]);

  return (
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
  );
};

export default App;
