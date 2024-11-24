import { customCover, userSvg } from '../assets';

const PersonHeader = ({ person }) => {
  return (
    <>
      {' '}
      <div className="relative h-max">
        <img
          src={person.cover ? person.cover : customCover}
          className="w-full aspect-[3/1] object-cover object-center rounded-md"
        />
        <img
          src={person.image ? person.image : userSvg}
          className="h-[13rem] w-[13rem] rounded-full bg-zinc-100 absolute -bottom-1/4 left-5 p-1 object-cover object-top border-2 border-zinc-100 hidden sm:block"
        />
      </div>
      <img
        src={person.image ? person.image : userSvg}
        className="h-[8rem] w-[8rem] rounded-full bg-zinc-100 p-1 -translate-y-[4rem] mb-[3rem] mx-auto object-cover object-top border-2 border-zinc-100 flex sm:hidden"
      />
      <div className="body-2 font-normal px-4 max-sm:-mt-[6rem] flex text-end lg:ml-[13rem] max-lg:mt-[5rem] gap-x-8 items-center py-2 flex-wrap">
        <h4 className="sm:h4 h5 font-semibold leading-none min-w-fit text-start flex flex-wrap">
          {person.names}
          <span>
            (
            <span className="sm:body-1 body-2 font-semibold">
              {person.username}
            </span>
            )
          </span>
        </h4>

        <span className="italic">{person.email}</span>
      </div>
    </>
  );
};

export default PersonHeader;
