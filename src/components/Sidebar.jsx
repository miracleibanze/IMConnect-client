import { memo, useContext, useState } from 'react';
import { menuSvg, xSvg } from '../assets';
import {
  bottomSidebarLinks,
  homeSidebarLinks,
  utilitySidebarLinks,
} from './constants';
import { useLocation, useNavigate } from 'react-router-dom';
import Loader from './skeletons/Loader';
import DeleteModal from './DeleteModal';
import { AppContext } from './AppContext';

const Sidebar = ({ wrapped, setWrapped, setSearchBox }) => {
  const appContext = useContext(AppContext);
  const [logout, setLogout] = useState(false);

  if (!appContext) return <Loader />;
  const { setUser } = appContext;
  const navigate = useNavigate();
  const location = useLocation().pathname;
  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = () => {
    setLoggingOut(true);
    sessionStorage.removeItem('userSession');
    navigate('/');
    setTimeout(() => {
      setUser('');
    }, 1000);
    setLoggingOut(false);
  };
  const toggleWrapped = () => {
    setWrapped(!wrapped);
  };
  return (
    <>
      <div
        className={`${
          !wrapped
            ? 'w-[12rem] max-sm:absolute left-2 top-2 bottom-2 z-[300] max-sm:border-r-2 max-sm:border-zinc-400'
            : 'h-full max-w-[5rem] min-w-[5rem] '
        } bg-zinc-100 rounded-md flex-between-vert sm:h-full`}
      >
        <img
          src={wrapped ? menuSvg : xSvg}
          className={` bg-zinc-200 p-1 ${
            wrapped
              ? 'w-8 h-8 mx-auto mt-4'
              : 'w-6 rounded-tr-md h-6 mb-7 absolute max-sm:hidden sm:top-4 sm:right-4 top-2 right-2'
          }`}
          onClick={toggleWrapped}
        />
        <div
          className={`h-full min-w-full max-w-full flex flex-col pt-4 justify-between items-center ${
            !wrapped && 'mt-10'
          }`}
        >
          <div
            className={`${wrapped ? 'w-max' : 'w-full'} flex flex-col gap-y-2`}
          >
            {homeSidebarLinks.map((item) => (
              <button
                className={`w-full outline-none py-2 font-semibold px-4 hover:bg-slate-300/50 flex items-center gap-2 ${
                  location === item.link && 'bg-zinc-200 rounded-full'
                } ${item.id === 1 && 'lg:hidden'} cursor-pointer`}
                key={item.id}
                onClick={() => {
                  if (item.id === 1) {
                    setSearchBox(true);
                  } else {
                    navigate(item.link);
                  }
                  setWrapped(true);
                }}
              >
                <img
                  src={item.icon}
                  className={`${!wrapped ? 'h-4' : 'h-5 '} aspect-square`}
                />
                <p className={`${wrapped ? 'hidden' : 'flex'}`}>{item.name}</p>
              </button>
            ))}
          </div>
          <div
            className={`${
              wrapped ? 'w-max' : 'w-full'
            } flex flex-col max-h-1/3 gap-y-2`}
          >
            {utilitySidebarLinks.map((item) => (
              <button
                className={`w-full outline-none border-none py-2 cursor-pointer font-semibold px-4 hover:bg-slate-300/50 flex items-center gap-2 ${
                  item.id === 2 && 'bg-zinc-50 rounded-md'
                }`}
                key={item.id}
                onClick={() => {
                  navigate(item.link);
                  setWrapped(true);
                }}
              >
                <img
                  src={item.icon}
                  className={`${!wrapped ? 'h-4' : 'h-5'} aspect-square`}
                />
                <p className={`${wrapped ? 'hidden' : 'flex'}`}>{item.name}</p>
              </button>
            ))}
          </div>
          <div
            className={`${wrapped ? 'w-max' : 'w-full'} h-1/4 flex flex-col gap-y-2`}
          >
            {bottomSidebarLinks.map((item) => (
              <button
                className={`cursor-pointer w-full py-2 font-semibold px-4 hover:bg-slate-300/50 flex items-center gap-2  ${
                  location === `${item.link}` && 'bg-zinc-50 rounded-md'
                }`}
                key={item.id}
                onClick={() => {
                  if (item.logOut === true) {
                    setLogout(true);
                  } else {
                    navigate(`${item.link}`);
                    setWrapped(true);
                  }
                }}
              >
                <img
                  src={item.icon}
                  className={`${!wrapped ? 'h-4' : 'h-6'} aspect-square`}
                />
                <p className={`${wrapped ? 'hidden' : 'flex'}`}>{item.name}</p>
              </button>
            ))}
          </div>
        </div>
      </div>
      {logout && (
        <>
          <DeleteModal
            title="Confirm Logout"
            action="logout"
            onConfirm={handleLogout}
            onCancel={() => setLogout(false)}
            loading={loggingOut}
          />
        </>
      )}
    </>
  );
};

export default memo(Sidebar);
