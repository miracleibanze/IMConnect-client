import { useState } from 'react';
import Button from '../../components/design/Button';
import Notice from '../../components/design/Notice';
import { angleDownSvg, arrowSvg } from '../../assets';
import { useNavigate } from 'react-router-dom';

const AccountSetting = () => {
  const [password, setpassword] = useState('');
  const [notify, setNotify] = useState('');
  const navigate = useNavigate();

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

  return (
    <div className="w-full h-max py-3 px-8 bg-zinc-50 rounded-md">
      <span onClick={() => navigate(-1)} className="w-full pb-4">
        <img src={arrowSvg} className="w-6 h-6 rotate-180" />
      </span>
      <h5 className="h5 font-bold mb-6 flex items-center gap-2">
        <span className="max-sm:hidden block">Setting</span>
        <img
          src={angleDownSvg}
          className="max-sm:hidden rotate-90 h-6 translate-y-1 w-4"
        />
        Account setting
      </h5>
      <p className="body font-normal mb-4 italic text-zinc-500">
        Edit and save your Account information
      </p>
      <div className="flex flex-col gap-2 py-2 px-3 border border-blue-300/50 rounded-md mb-4">
        <p className="body-1 font-semibold">Change Password:</p>
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

export default AccountSetting;
