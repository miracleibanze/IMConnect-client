import { memo, useContext, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Button from './design/Button';
import { AppContext } from './AppContext';

const PageNotFound = ({ error, onRetry }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { usePageTitle } = useContext(AppContext);
  usePageTitle('400 Page not Found | IMConnect');

  return (
    <div className="flex-center-both flex-1 h-full bg-zinc-50 absolute inset-0">
      <h4 className="h4 font-normal">400 {error ? error : 'Not found.'}</h4>

      <p className="font-normal max-w-[20rem] text-center pb-10">
        We didn't find what you are looking for, Please go back or reflesh that
        page.
      </p>
      <Button
        blue
        onClick={() => {
          if (onRetry) {
            onRetry();
          } else {
            navigate(-1);
          }
        }}
      >
        Go back
      </Button>
    </div>
  );
};

export default memo(PageNotFound);
