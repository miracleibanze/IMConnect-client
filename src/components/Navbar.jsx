import { memo, useCallback, useContext } from 'react';
import { logo, menuSvg, userSvg, xSvg } from '../assets';
import Search from './Search';
import Button from './design/Button';
import { AppContext } from './AppContext';

const Navbar = (props) => {
  const { wrapped, setWrapped } = props; // Destructure wrapped and setWrapped directly from props
  const appContext = useContext(AppContext);

  if (!appContext)
    return (
      <div className="w-full flex-between-hor bg-zinc-50 rounded-md sm:px-8 px-4 py-2">
        <div className="sm:hidden h-10 w-10 bg-zinc-200 skeleton-loader rounded-md" />
        <div className="relative flex gap-3">
          <div className="h-10 w-32 bg-zinc-200 skeleton-loader rounded-md" />
          <div className="lg:flex hidden h-10 w-[25rem] bg-zinc-200 skeleton-loader rounded-md" />
        </div>
        <div className="h-10 sm:w-32 w-10 bg-zinc-200 skeleton-loader rounded-md" />
      </div>
    );

  const user = appContext?.user;

  // The function to toggle wrapped state on click
  const toggleSidebar = useCallback(() => {
    setWrapped((prevWrapped) => !prevWrapped); // Toggling wrapped state
  }, [setWrapped]);

  return (
    <div className="w-full flex-between-hor bg-zinc-50 rounded-md sm:px-8 px-4 py-2">
      <img
        src={wrapped ? menuSvg : xSvg}
        className="bg-zinc-200 p-1 sm:hidden z-[500] rounded-md w-8 h-8 cursor-pointer"
        onClick={toggleSidebar} // This triggers the toggle
        alt="menu-toggle"
      />
      <div className="flex relative">
        <a href="/dash">
          <img
            src={logo}
            alt="logo"
            width={160}
            height={100}
            className="h-10 max-w-32"
          />
        </a>
        <Search {...props} />
      </div>
      <div className="flex gap-2 h-full">
        <Button light hFull href="/dash/profile">
          {user ? (
            <span className="max-sm:hidden mr-3">{user.username}</span>
          ) : (
            <div className="w-24 h-8 rounded-md bg-transparent mr-4 max-sm:hidden skeleton-loader"></div>
          )}
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
