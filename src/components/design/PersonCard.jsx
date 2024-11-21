import { chatDotsSvg, userSvg } from "../../assets";
import Button from "./Button";

const PersonCard = ({ person, className, friends }) => {
  return (
    <div
      className={`px-6 py-2 w-full flex-between-hor gap-5 ${
        className && className
      }`}
    >
      <img
        src={person.image ? person.image : userSvg}
        className="w-[3rem] h-[3rem] rounded-full border border-zinc-50 object-top object-cover"
      />
      <div className="w-full flex-between-hor">
        <a
          href={`/dash/people/person/${person.username}`}
          className="w-full flex-col cursor-pointer group"
        >
          <p className="body-1 font-semibold leading-none group-hover:underline">
            {person.names}
          </p>
          <p className="body-1 font-normal">{person.username}</p>
        </a>
        <Button
          blue={!friends && true}
          border={friends && true}
          rounded={friends && true}
          light={friends && true}
          href={`/dash/message/to/${person._id}`}
        >
          {friends ? (
            <img src={chatDotsSvg} className="w-6 h-6 hover:h-8" />
          ) : (
            "Send a message"
          )}
        </Button>
      </div>
    </div>
  );
};

export default PersonCard;
