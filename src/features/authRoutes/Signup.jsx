import { useNavigate } from 'react-router-dom';
import Button from '../../components/design/Button';
import { useContext, useState } from 'react';
import { checkSvg, loaderSvg, uploadCloud } from '../../assets';
import axiosInstance from '../utils/axiosInstance';
import Loader from '../../components/skeletons/Loader';
import { AppContext } from '../../components/AppContext';
import Notice from '../../components/design/Notice';

const Signup = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState({
    names: '',
    username: '',
    email: '',
    password: '',
    dob: '',
    gender: '',
    image: null,
  });
  const context = useContext(AppContext);
  if (!context) return <Loader />;
  const { setUser, user, setIsLogged, usePageTitle } = context;
  usePageTitle('Sign Up | IMConnect');
  const [registerPage, setRegisterPage] = useState(0);

  const [waitResult, setWaitResult] = useState(false);
  const [uploadStatus, setUploadStatus] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [viewPassword, setViewPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formattedDate, setFormattedDate] = useState('');

  const handleAddUser = (event) => {
    event.preventDefault();
    setUserData((prevFormData) => {
      return {
        ...prevFormData,
        [event.target.name]: event.target.value,
      };
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        setImagePreview(reader.result);
        userData.image = reader.result;
        setUploadStatus(true);
      };
    }
  };
  const handleViewPassword = () => {
    if (!viewPassword) {
      setViewPassword(true);
    } else {
      setViewPassword(false);
    }
    console.log(viewPassword);
  };

  const postData = async () => {
    setLoading(true);
    console.log(userData);
    try {
      const response = await axiosInstance.post('/users', userData);
      setUser(response.data);
      console.log(response.data);
      setIsLogged(true);
      navigate('/dash');
    } catch (error) {
      setError(error?.response?.data?.message || error?.message);
      console.log(error?.response?.data?.message || error?.message);
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  const handleSubmit = () => {
    postData();
  };

  const handleDateChange = (e) => {
    const rawDate = e.target.value; // yyyy-mm-dd
    if (rawDate) {
      const [year, month, day] = rawDate.split('-');
      setFormattedDate(`${day}/${month}/${year}`); // dd/mm/yyyy
    } else {
      setFormattedDate(''); // Reset if input is cleared
    }
  };

  return (
    <div className="w-full relative shadow-2xl shadow-black flex flex-col gap-4 px-8 py-12 max-w-md bg-zinc-50">
      <Notice message={error} onCancel={() => setError('')} />
      <form className="form w-full flex flex-col gap-4 bg-zinc-50 relative">
        <h3 className="h3 text-center font-semibold">Create account</h3>
        {registerPage === 0 && (
          <>
            <input
              type="text"
              name="names"
              placeholder="Your full names"
              onChange={handleAddUser}
            />
            <input
              type="text"
              name="username"
              placeholder="Choose username"
              onChange={handleAddUser}
            />
            <input
              type="email"
              name="email"
              placeholder="Your email"
              onChange={handleAddUser}
            />
            <input
              type={viewPassword ? 'text' : 'password'}
              name="password"
              placeholder="Choose password"
              onChange={handleAddUser}
            />
            <label className="flex items-center gap-2 justify-start w-full">
              <input
                type="checkbox"
                name="show-password"
                onChange={handleViewPassword}
                className="max-w-5 h-5 rounded-md outline-none border-none bg-red-400 relative flex-1"
              />
              Show password
            </label>
          </>
        )}
        {registerPage === 1 && (
          <>
            <label htmlFor="dob" className="body-2 font-semibold">
              <span className="text-zinc-500">Your birth date</span>
              <input
                type="date"
                name="dob"
                onChange={handleDateChange}
                className="block mt-2"
              />
            </label>
            <label htmlFor="gender" className="body-2 font-semibold">
              <span className="text-zinc-500">Gender</span>

              <select name="gender" onChange={handleAddUser}>
                <option value="not mentioned" defaultChecked>
                  Rather not say
                </option>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </label>
          </>
        )}
        {registerPage === 2 && (
          <>
            <label
              className={`${
                waitResult && 'hidden'
              } w-full aspect-[5/3] rounded-md flex-center-both bg-zinc-200 flex-center-both`}
              onClick={() => setWaitResult(true)}
            >
              <img
                loading="lazy"
                src={uploadCloud}
                className="h-8 w-8 mx-auto mt-8"
              />
              <p className="body-2 italic text-zinc-500/50 font-normal mb-8">
                Click to Upload
              </p>
              <span className={`text-zinc-500/50 h-1/2 text-center`}>
                of .JPEG .GIF .JPG .TIFF .PNG and .WEBP
              </span>
              <input
                type="file"
                name="image"
                accept="image"
                className="w-0 h-0"
                onChange={handleImageChange}
              />
            </label>
            {waitResult && !uploadStatus && (
              <div className="w-full aspect-[5/3] rounded-md flex-center-both bg-zinc-200">
                <img src={loaderSvg} className="w-10 h-10" />
              </div>
            )}
            {waitResult && uploadStatus && (
              <div className="w-full relative aspect-[5/3] rounded-md flex-center-both bg-zinc-200">
                <img
                  src={checkSvg}
                  className="z-10 w-10 h-10 bg-blue-600 rounded-full shadow-2xl shadow-blue-600"
                />
                <div
                  className="absolute inset-0"
                  onClick={() => {
                    setWaitResult(false);
                    setUploadStatus(false);
                  }}
                >
                  <img
                    loading="lazy"
                    src={imagePreview}
                    className="w-full h-full object-contain object-center"
                  />
                </div>
              </div>
            )}
          </>
        )}
        <div className="relative w-full px-8 flex flex-col items-center mt-8">
          <div className="w-[10rem] h-1 rounded-full grid grid-cols-3 gap-1">
            <div className="w-full h-full rounded-full bg-blue-700"></div>
            <div
              className={`w-full h-full rounded-full bg-blue-700 ${
                registerPage === 0 && 'hidden'
              }`}
            />
            <div
              className={`w-full h-full rounded-full bg-blue-700 ${
                registerPage !== 2 && 'hidden'
              }`}
            />
            <div
              className={`w-full h-full rounded-full bg-slate-300 ${
                registerPage !== 0 && 'hidden'
              }`}
            />
            <div
              className={`w-full h-full rounded-full bg-slate-300 ${
                registerPage === 2 && 'hidden'
              }`}
            />
          </div>
        </div>
      </form>
      <div
        className={`flex justify-between ${
          registerPage === 0 && 'flex-row-reverse'
        }`}
      >
        <button
          onClick={() => {
            if (registerPage === 1) {
              return setRegisterPage(0);
            } else {
              setRegisterPage(1);
            }
          }}
          className={`w-max px-4 py-2 border border-blue-700 text-blue-700 ${
            registerPage === 0 && 'hidden'
          }`}
        >
          Back
        </button>
        <button
          onClick={() => {
            if (registerPage === 0) {
              return setRegisterPage(1);
            } else if (registerPage === 1) {
              setRegisterPage(2);
            } else {
              handleSubmit();
            }
          }}
          className={`w-max px-4 py-2 bg-blue-700 text-white`}
        >
          {registerPage !== 2 ? 'Next' : 'Done'}
        </button>
      </div>
      <Button light className="text-blue-700 mt-4" href="/auth/login">
        Already have an account
      </Button>
      {loading && (
        <div className="absolute inset-0 flex-center-both opacity-[.4] z-[1000] bg-zinc-100">
          <img src={loaderSvg} className="w-12 h-12" />
        </div>
      )}
    </div>
  );
};

export default Signup;
