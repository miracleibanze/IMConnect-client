import { useLocation } from 'react-router-dom';
import WhatInYourMind from './WhatInYourMind';
import Feeds from './Feeds';
import { useContext } from 'react';
import { AppContext } from './AppContext';
const Hero = () => {
  const { pathname } = useLocation();
  const { usePageTitle } = useContext(AppContext);
  usePageTitle('Home | IMConnect');
  return (
    <div className="bg-zinc-100 p-3 rounded-md w-full h-full min-h-max flex-between-vert relative gap-2">
      {pathname !== '/dash/search' && <WhatInYourMind />}
      <Feeds />
    </div>
  );
};

export default Hero;
