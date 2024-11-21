import { useContext, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AppContext } from '../../App';
import Loader from '../../components/skeletons/Loader';
import { arrowSvg, editSvg, userSvg } from '../../assets';
import Button from '../../components/design/Button';
import axiosInstance from '../utils/axiosInstance';
import Notice from '../../components/design/Notice';

const ProfileSetting = () => {
  const navigate = useNavigate();
  const context = useContext(AppContext);

  if (!context) return <Loader />;

  const { user } = context;

  const [imagePreview, setImagePreview] = useState(null);
  const [notify, setNotify] = useState('');

  const [names, setnames] = useState('');
  const [username, setUsername] = useState('');
  const [password, setpassword] = useState('');
  const [email, setemail] = useState('');

  const cover = sessionStorage.getItem('coverImage');

  const changeName = async () => {
    try {
      const response = await axiosInstance.patch('/users', {
        id: user._id,
        names,
      });
      console.log(response.data);
      setNotify(response.data);
    } catch (err) {
      console.log(err);
      setNotify(err.response.data.message);
    }
  };

  const handleChangeProfile = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = async () => {
        const result = reader.result;
        const response = await axiosInstance.patch('/users', {
          id: user._id,
          image: result,
        });
        setNotify(response.data);
        images.push({ img: reader.result });
      };
    }
  };

  const handleChangeCover = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = async () => {
        const result = reader.result;
        const response = await axiosInstance.patch('/users', {
          id: user._id,
          cover: result,
        });
        setNotify(response.data);
      };
    }
  };

  const changeusername = async () => {
    try {
      const response = await axiosInstance.patch('/users', {
        id: user._id,
        username,
      });
      console.log(response.data);
      setNotify(response.data);
    } catch (err) {
      console.log(err);
      setNotify(err.response.data.message);
    }
  };

  const changeEmail = async () => {
    try {
      const response = await axiosInstance.patch('/users', {
        id: user._id,
        email,
      });
      console.log(response.data);
      setNotify(response.data);
    } catch (err) {
      console.log(err);
      setNotify(err.response.data.message);
    }
  };

  const changePassword = async () => {
    try {
      const response = await axiosInstance.patch('/users', {
        id: user._id,
        password,
      });
      console.log(response.data);
      setNotify(response.data);
    } catch (err) {
      console.log(err);
      setNotify(err.response.data.message);
    }
  };

  const save = () => {
    sessionStorage.setItem('userConnect', JSON.stringify(user));
    setNotify(true);
    setTimeout(() => {
      setNotify(false);
    }, 5000);
  };

  return (
    <div className="w-full h-max py-3 px-8 bg-zinc-50">
      <span onClick={() => navigate(-1)} className="w-full pb-4">
        <img src={arrowSvg} className="w-6 h-6 rotate-180" />
      </span>
      <h4 className="h4 font-bold mb-6">Setting</h4>
      <div
        className="flex gap-2 items-center mb-16 relative bg-zinc-200 bg-cover bg-center w-[20rem] rounded-md h-32"
        style={{
          backgroundImage: `url(${user?.cover})`,
        }}
      >
        <label
          to={'/profile/edit/add_image_to_gallery/cover/coverImage'}
          className="w-8 h-8 rounded-full p-2 z-10 absolute bottom-0 right-0 bg-zinc-400"
        >
          <img src={editSvg} className="w-full h-full object-contain" />
          <input
            type="file"
            name="image"
            accept="image"
            className="w-0 h-0"
            onChange={handleChangeCover}
          />
        </label>
        <div className="w-24 h-24 absolute top-1/3 left-2 translate-y-1/3">
          <img
            src={user?.image ? user.image : userSvg}
            alt=""
            className="w-full h-full rounded-full object-cover object-center"
          />
          <label
            to={'/profile/edit/add_image_to_gallery/profile/profileImage'}
            className="w-8 h-8 rounded-full p-2 absolute bottom-0 right-0 bg-zinc-400"
          >
            <img src={editSvg} className="w-full h-full object-contain" />
            <input
              type="file"
              name="image"
              accept="image"
              className="w-0 h-0"
              onChange={handleChangeProfile}
            />
          </label>
        </div>
      </div>
      <p className="body font-normal italic text-zinc-500">
        Edit and save your information
      </p>
      <div className="flex flex-col gap-2 py-2 px-3 border border-blue-300/50 rounded-md mb-4">
        <p className="body-1 font-semibold">Names:</p>
        <input
          type="text"
          value={names}
          onChange={() => setnames(event.target.value)}
          className="w-full px-4 py-2 outline-none border border-gray-300 "
          placeholder={user.names}
        />
        <div className="w-full flex justify-end">
          <Button blue onClick={changeName}>
            Save
          </Button>
        </div>
      </div>
      <div className="flex flex-col gap-2 py-2 px-3 border border-blue-300/50 rounded-md mb-4">
        <p className="body-1 font-semibold">Username :</p>
        <input
          type="text"
          value={username}
          onChange={() => setUsername(event.target.value)}
          className="w-full px-4 py-2 outline-none border border-gray-300 "
          placeholder={user.username}
        />
        <div className="w-full flex justify-end">
          <Button blue onClick={changeusername}>
            Save
          </Button>
        </div>
      </div>
      <div className="flex flex-col gap-2 py-2 px-3 border border-blue-300/50 rounded-md mb-4">
        <p className="body-1 font-semibold">E-mail:</p>
        <input
          type="text"
          value={email}
          onChange={() => setemail(event.target.value)}
          className="w-full px-4 py-2 outline-none border border-gray-300 "
          placeholder={user.email}
        />
        <div className="w-full flex justify-end">
          <Button blue onClick={changeEmail}>
            Save
          </Button>
        </div>
      </div>
      <div className="flex flex-col gap-2 py-2 px-3 border border-blue-300/50 rounded-md mb-4">
        <p className="body-1 font-semibold">Location:</p>
        <input
          type="text"
          value={password}
          onChange={() => setpassword(event.target.value)}
          className="w-full px-4 py-2 outline-none border border-gray-300 "
          placeholder="Choose new Password"
        />
        <div className="w-full flex justify-end">
          <Button blue onClick={changePassword}>
            Save
          </Button>
        </div>
      </div>
      {notify !== '' && (
        <Notice message={notify} onClose={() => setNotify('')} />
      )}
    </div>
  );
};

export default ProfileSetting;
