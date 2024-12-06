import { useContext, useEffect, useState } from 'react';
import Button from '../../components/design/Button';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../utils/axiosInstance';
import { loaderSvg } from '../../assets';
import { AppContext } from '../../components/AppContext';
import Notice from '../../components/design/Notice';

const Login = () => {
  const navigate = useNavigate();
  const { setUser, setIsLogged, usePageTitle } = useContext(AppContext);
  usePageTitle('Login | IMConnect');
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [errorMessage, setErrorMessage] = useState();
  const [viewPassword, setViewPassword] = useState(false);
  const [loading, setloading] = useState(false);

  const emailChange = (event) => {
    setEmail(event.target.value);
  };

  const passwordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleLogin = async (event) => {
    event.preventDefault();

    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;

    if (!emailRegex.test(email)) {
      setErrorMessage('Invalid email format');
      return;
    }

    try {
      setloading(true);
      const response = await axiosInstance.post('/auth', {
        email,
        password,
      });

      if (response.data) {
        console.log(response);
        setUser(response.data);
        setIsLogged(true);
        sessionStorage.setItem(
          'userSession',
          JSON.stringify(response.data.email)
        );
        navigate('/dash');
      } else {
        alert(response.data.message);
        navigate(0);
        console.log(response);
      }
    } catch (error) {
      console.log(error);
      setErrorMessage('Service not available now, Please try again Later');
    } finally {
      setloading(false);
    }
  };

  const handleViewPassword = () => {
    setViewPassword((prevState) => !prevState);
  };

  return (
    <div className="w-full shadow-2xl shadow-black flex flex-col gap-4 px-8 py-12 max-w-md bg-zinc-50 relative">
      <Notice message={errorMessage} onCancel={() => setErrorMessage('')} />
      <form
        className="form w-full flex flex-col gap-4 bg-zinc-50"
        onSubmit={handleLogin}
      >
        <h3 className="h3 text-center font-semibold">Welcome back</h3>

        <div>
          <input
            type="text"
            name="email"
            onChange={emailChange}
            placeholder="Enter your username or email"
            required
          />
          {errorMessage === 'user' && (
            <span className="italic text-red-500">
              Email not found! Please check
            </span>
          )}
        </div>

        <div>
          <input
            type={viewPassword ? 'text' : 'password'}
            name="password"
            onChange={passwordChange}
            required
            placeholder="Enter your password"
          />
          {errorMessage === 'password' && (
            <span className="italic text-red-500 leading-none">
              Incorrect password! Try again
            </span>
          )}
          <label className="flex items-center gap-2 justify-start w-full mt-4">
            <input
              type="checkbox"
              name="show-password"
              onChange={handleViewPassword}
              className="max-w-5 h-5 rounded-md border-none bg-red-400"
            />
            Show password
          </label>
        </div>

        <span className="body-2 text-blue-500 font-normal">
          Forgot password?
        </span>

        <input
          type="submit"
          value="Login"
          className="bg-blue-700 text-zinc-50"
        />
      </form>

      <Button light className="text-blue-700 mt-4" href="/auth/signup">
        Create account
      </Button>
      {loading && (
        <div className="absolute inset-0 flex-center-both opacity-[.4] z-10 bg-zinc-100">
          <img src={loaderSvg} className="w-12 h-12" />
        </div>
      )}
    </div>
  );
};

export default Login;
