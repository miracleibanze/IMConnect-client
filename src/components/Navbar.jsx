import { memo, useCallback, useContext } from 'react';
import { logo, menuSvg, userSvg, xSvg } from '../assets';
import Search from './Search';
import { AppContext } from '../App';
import Button from './design/Button';

const Navbar = (props) => {
  const { wrapped, setWrapped } = props;
  const appContext = useContext(AppContext);
  const user = appContext?.user;

  return (
    <div className="w-full flex-between-hor bg-zinc-50 rounded-md sm:px-8 px-4 py-2">
      <img
        src={wrapped ? menuSvg : xSvg}
        className="bg-zinc-200 p-1 sm:hidden rounded-md w-8 h-8 cursor-pointer"
        onClick={useCallback(() => setWrapped(!wrapped), [])}
        alt="menu-toggle"
      />
      <div className="flex relative">
        <img
          src={logo}
          alt="logo"
          width={160}
          height={100}
          className="h-10 max-w-32"
        />
        <Search {...props} />
      </div>
      <div className="flex gap-2 h-full">
        <Button light hFull href="/dash/profile">
          <span className="max-sm:hidden mr-3">
            {user ? user.username : 'loading...'}
          </span>
          <img
            src={user?.image || userSvg}
            alt="user-avatar"
            className="h-9 min-w-9 -my-2 -mx-3 bg-zinc-100 object-fit object-center"
          />
        </Button>
      </div>
    </div>
  );
};

export default memo(Navbar);
