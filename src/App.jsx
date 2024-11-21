import {
  Navigate,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from 'react-router-dom';
import { createContext, lazy, Suspense, useEffect, useState } from 'react';
import PageNotFound from './components/PageNotFound.jsx';
import Loader from './components/skeletons/Loader.jsx';
import axiosInstance from './features/utils/axiosInstance.js';

const Register = lazy(() => import('./features/authRoutes/Register.jsx'));
const Public = lazy(() => import('./components/Public.jsx'));
const Welcome = lazy(() => import('./features/authRoutes/Welcome.jsx'));

export const AppContext = createContext();

const App = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [isLogged, setIsLogged] = useState(true);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const savedSession = JSON.parse(sessionStorage.getItem('userSession'));

  useEffect(() => {
    const authenticateUser = async () => {
      try {
        setIsLoading(true);
        if (savedSession) {
          const response = await axiosInstance.get(`/auth/${savedSession}`);
          if (response.data) {
            setUser(response.data);
            setIsLogged(true);
          } else {
            sessionStorage.removeItem('userSession');
            setIsLogged(false);
          }
        } else {
          setIsLogged(false);
        }
      } catch (error) {
        console.error('Error verifying session:', error);
        setIsLogged(false);
      } finally {
        setIsLoading(false);
      }
    };

    authenticateUser();
  }, [savedSession, navigate]);

  useEffect(() => {
    if (!isLoading && isLogged && pathname === '/') {
      navigate('/dash');
    } else if (!isLogged && pathname.startsWith('/dash')) {
      navigate('/');
    }
  }, [isLogged, pathname, navigate, isLoading]);

  return (
    <AppContext.Provider value={{ user, setUser, setIsLogged }}>
      <Suspense fallback={<Loader />}>
        {isLoading ? (
          <Loader />
        ) : (
          <Routes>
            {/* Public Routes (Accessible when not logged in) */}
            {!isLogged && (
              <>
                <Route path="/" element={<Public />} />
                <Route path="/auth/:logType" element={<Register />} />
              </>
            )}

            {/* Routes accessible to logged-in users */}
            {isLogged && (
              <>
                <Route path="/" element={<Public />} />
                <Route path="/dash/*" element={<Welcome />} />
                <Route path="/auth/:logType" element={<Register />} />
                <Route path="*" element={<PageNotFound />} />
              </>
            )}

            {/* Default route to handle page not found */}
          </Routes>
        )}
      </Suspense>
    </AppContext.Provider>
  );
};

export default App;
