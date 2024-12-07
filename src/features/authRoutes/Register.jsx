import { memo } from 'react';
import { registerBg } from '../../assets';
import { useParams } from 'react-router-dom';
import Login from './Login';
import Signup from './Signup';

const Register = () => {
  const { logType } = useParams();

  return (
    <div
      className="w-full min-h-screen bg-center bg-cover flex-center-both p-8 bg-blue-950"
      style={{ backgroundImage: `url(${registerBg})` }}
    >
      {logType === 'login' && <Login />}
      {logType === 'signup' && <Signup />}
    </div>
  );
};

export default memo(Register);
