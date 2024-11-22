import { useLocation } from 'react-router-dom';
import WhatInYourMind from './WhatInYourMind';
import Feeds from './Feeds';
const Hero = () => {
  const { pathname } = useLocation();
  return (
    <div className="bg-zinc-100 p-3 rounded-md w-full h-full relative">
      {pathname !== '/dash/search' && <WhatInYourMind />}
      <Feeds />
    </div>
  );
};

export default Hero;
