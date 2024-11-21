import { publicBg } from "../assets";
import Button from "./design/Button";

const Public = () => {
  const welcome = (
    <div className="sm:min-h-full max-h-max border-b border-blue-300 sm:max-w-[25rem] text-black w-full bg-zinc-200 p-5 flex flex-col justify-center gap-4 py-16">
      <h2 className="h2 font-semibold text-center">
        Welcome to <span className="text-blue-700 font-bold">IMConnect</span>
        &nbsp;chat
      </h2>
      <Button blue wFull href="/auth/login">
        Login
      </Button>
      <Button
        blue
        wFull
        href="/auth/signup"
        onClick={() => {
          sessionStorage.clear("userSession");
        }}
      >
        Sign up
      </Button>
    </div>
  );
  return (
    <div className="flex justify-between flex-row-reverse max-sm:flex-col min-h-screen">
      <div className="sm:block hidden">{welcome}</div>
      <div
        className="bg-center bg-cover h-screen w-full flex flex-col justify-center gap-4 text-zinc-50 p-4"
        style={{ backgroundImage: `url(${publicBg})` }}
      >
        <div className="flex flex-col gap-4 h-1/2 min-h-max">
          <h1 className="md:text-[4.5rem] sm:text-[3.5rem] text-[3rem] font-bold">
            <span className="text-blue-700 text-shadow">IM</span>Connect
          </h1>
          <h4 className="h4">
            <b>Connect</b> your friends, <b>Chat</b>&nbsp;smarter, <b>Post</b>
            &nbsp;wiser <br className="lg:flex hidden" />
            with&nbsp;<b>IMConnect</b>
          </h4>
        </div>
        <div className="sm:hidden block">{welcome}</div>
      </div>
    </div>
  );
};

export default Public;
