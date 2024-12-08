import { useLocation, useNavigate } from 'react-router-dom';
import { arrowSvg } from '../assets';
import { useEffect, useState } from 'react';

const NotYetDesigned = () => {
  const navigate = useNavigate();
  const [lastSegment, setLastSegment] = useState();
  const { pathname } = useLocation();
  useEffect(() => {
    const getLastPathSegment = (path) => {
      const segments = path.split('/').filter(Boolean); // Split by "/" and remove empty strings
      return segments[segments.length - 1]; // Get the last segment
    };

    setLastSegment(getLastPathSegment(pathname));
  }, [pathname]);
  return (
    <div className="w-full p-2 h-full rounded-md bg-zinc-100">
      <span onClick={() => navigate(-1)} className="w-full pb-4">
        <img src={arrowSvg} className="w-6 h-6 rotate-180" />
      </span>
      <div className="body-1 font-semibold text-zinc-900/50 h-full w-full flex-center-both">
        No {lastSegment !== 'help' ? lastSegment + ' settings' : lastSegment}
        &nbsp;yet
      </div>
    </div>
  );
};

export default NotYetDesigned;
