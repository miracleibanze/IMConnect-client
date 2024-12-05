import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useContext, useEffect, useState } from 'react';
import Button from './design/Button';
import { plusSvg, userSvg } from '../assets';
import { postFeeling, postIcons } from './constants';
import Loader from './skeletons/Loader';
import axiosInstance from '../features/utils/axiosInstance';
import { AppContext } from './AppContext';

const CreatePost = () => {
  const context = useContext(AppContext);
  if (!context) return <Loader />;
  const { user, usePageTitle } = context;
  usePageTitle('Create Post | IMConnect');
  const location = useLocation().pathname;
  const navigate = useNavigate();
  const [postPartToEdit, setPostPartToEdit] = useState('myPost');
  const [feeling, setFeeling] = useState('');
  const { text } = useParams();
  const [uploadStatus, setUploadStatus] = useState(false);
  const [images, setImages] = useState([]);
  const [myDescription, setMyDescription] = useState(``);

  const savePost = async () => {
    const myPostObject = {
      user: user._id,
      images: images,
      feeling: `feeling ${feeling}`,
      description: myDescription, // Save raw text
    };
    try {
      const response = await axiosInstance.post('/posts', myPostObject);
      if (response.data.message) {
        navigate('/dash');
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        const result = reader.result;
        setUploadStatus(true);
        setImagePreview(reader.result);
        images.push(reader.result);
      };
    }
  };

  useEffect(() => {
    if (postPartToEdit === 'image') {
      setUploadStatus(false);
      setWaitResult(false);
    }
  }, [location]);

  return (
    <>
      <div className="h-full w-full flex-center-both bg-zinc-100 rounded-md">
        <div className=" relative w-full max-w-lg h-[32rem] min-h-max shadow-2xl bg-zinc-50 border p-3 shadow-zinc-500">
          <p className="body-1 font-semibold">Create a Post</p>
          <div className="flex-between-hor gap-3 mt-4">
            <img
              src={user?.image ? user.image : userSvg}
              alt="profile"
              className="w-10 h-10 object-fit bg-zinc-200/50 border border-zinc-200 object-top"
            />
            <div className="w-full h-full">
              <p className="font-semibold">
                {user.names}
                {feeling && ` is feeling ${feeling}`}
              </p>
              <p className="body-2">
                {new Date().getHours()}:{new Date().getMinutes()}
                &nbsp;
                {new Date().getDay()}/{new Date().getMonth()}/
                {new Date().getFullYear()}
              </p>
            </div>
          </div>
          {uploadStatus && (
            <div className="w-full p-2 border flex items-center gap-2">
              {images.map((item, index) => (
                <img
                  src={item}
                  alt={'image' + (index + 1)}
                  className={`h-10 w-10 object-cover rounded-md`}
                  key={index}
                />
              ))}
              <label className="w-10 h-10 flex-center-both rounded-md border border-zinc-300 bg-zinc-200">
                <img
                  src={plusSvg}
                  className="p-1 rounded-full border h-6 w-6"
                />
                <input
                  type="file"
                  name="image"
                  accept="image"
                  className="w-0 h-0"
                  onChange={handleImageChange}
                />
              </label>
            </div>
          )}
          <div
            className={`w-full my-3 rounded-md border border-zinc-300 p-3 ${
              !uploadStatus ? 'h-[15rem]' : 'h-[10rem]'
            } relative`}
          >
            <textarea
              className="w-full outline-none h-full bg-transparent resize-none"
              placeholder="Description.."
              onChange={(event) => setMyDescription(event.target.value)}
              defaultValue={text && text !== 'content' ? text : ''}
            ></textarea>
          </div>

          <div className="absolute bottom-2 p-4 right-0 left-0">
            <div className="flex items-center gap-3">
              <label className="body-2 font-semibold flex-center-hor gap-1 relative">
                <img src={postIcons[0].icon} className="w-5 h-5" />{' '}
                {postIcons[0].name}
                <input
                  type="file"
                  name="image"
                  accept="image"
                  className="w-0 h-0"
                  onChange={handleImageChange}
                />
              </label>
              <div className="relative">
                <span
                  className="body-2 font-semibold flex-center-hor gap-1"
                  onClick={() => {
                    setPostPartToEdit(postIcons[1].name);
                  }}
                >
                  <img src={postIcons[1].icon} className="w-5 h-5" />{' '}
                  {postIcons[1].name}
                </span>
                {postPartToEdit === 'feeling' && (
                  <ul className="w-max h-auto overflow-y-scroll scroll-design p-3 absolute bottom-full left-1/2 bg-zinc-50 z-[100] border border-zinc-200">
                    {postFeeling.map((item) => (
                      <li
                        onClick={() => {
                          setFeeling(item);
                          setPostPartToEdit('myPost');
                        }}
                        className="cursor-pointer py-2 px-4 hover:bg-zinc-200 font-semibold"
                      >
                        feeling {item}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
            <div className="w-full py-3 flex justify-end">
              <Button blue onClick={savePost}>
                Post
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CreatePost;
