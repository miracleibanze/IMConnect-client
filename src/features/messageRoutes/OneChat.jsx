import React, { useState, useEffect, useContext, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Button from '../../components/design/Button';
import {
  angleDownWhiteSvg,
  arrowSvg,
  imageSvg,
  loaderSvg,
  sendSvg,
  threeDotsVerticalSvg,
  userSvg,
  xSvg,
} from '../../assets';
import Loader from '../../components/skeletons/Loader';
import axiosInstance from '../utils/axiosInstance';
import Notice from '../../components/design/Notice';
import { AppContext } from '../../components/AppContext';

const MyFriends = () => {
  const { user, messages, setMessages } = useContext(AppContext);
  const navigate = useNavigate();
  const { userId } = useParams();
  const otherUserId = userId || 'unknown';

  const [messageContent, setMessageContent] = useState('');
  const [person, setPerson] = useState(null);
  const [messageMenu, setMessageMenu] = useState('');
  const [loadingMessages, setLoadingMessages] = useState(true);
  const [error, setError] = useState('');
  const [sendImage, setSendImage] = useState(false);
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const menuRef = useRef(null);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [isSendingMessage, setIsSendingMessage] = useState(false);
  const [isAtBottom, setIsAtBottom] = useState(true);
  const messagesEndRef = useRef(null);
  const messageContainerRef = useRef(null);

  const markMessagesAsRead = async () => {
    try {
      await axiosInstance.post('/messages/markAsRead', {
        senderId: user._id,
        receiverId: otherUserId,
      });
    } catch (err) {
      console.error('Error marking messages as read:', err);
    }
  };

  const fetchMessages = async () => {
    setLoadingMessages(true);
    try {
      const response = await axiosInstance.get(
        `/messages/${user?._id}/${otherUserId}/`
      );
      if (Array.isArray(response.data.messages)) {
        setMessages(response.data.messages);
        setPerson(response.data.user);
        await markMessagesAsRead();
      } else {
        console.error('Invalid response format:', response.data.messages);
        setMessages([]);
      }
    } catch (err) {
      setError('Failed to fetch messages');
      console.error('Error fetching messages:', err);
    } finally {
      setLoadingMessages(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, [otherUserId, user?._id]);

  const handleSendMessage = async () => {
    messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    if (!messageContent.trim() && !image) return;

    setIsSendingMessage(true);

    const messageData = {
      senderId: user._id,
      receiverId: otherUserId,
      message: image ? image : messageContent.trim(),
      isImage: image ? true : false,
    };

    try {
      const response = await axiosInstance.post('/messages/send', messageData);

      setMessages((prevMessages) => [
        { ...messageData, _id: response.data.message._id },
        ...prevMessages,
      ]);

      setMessageContent('');
      if (sendImage) {
        setSendImage(false);

        setImage(null);
      }
    } catch (err) {
      setError('Failed to send message');
      console.error('Error sending message:', err);
    } finally {
      setIsSendingMessage(false);
    }
  };
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleUploadImage = async (event) => {
    setIsUploadingImage(true);
    setSendImage(true);
    const file = event.target.files[0];

    try {
      const base64 = await convertToBase64(file);
      setImage(base64);
    } catch (error) {
      console.error('Error converting file:', error);
    } finally {
      setIsUploadingImage(false);
    }
  };
  function getTime(isoString) {
    const inputDate = new Date(isoString);
    const now = new Date();

    if (isNaN(inputDate)) {
      return '';
    }

    const formatTimeOnly = (date) => {
      const options = { hour: '2-digit', minute: '2-digit', hour12: false };
      return new Intl.DateTimeFormat('en-US', options).format(date);
    };

    const isSameDay = (date1, date2) =>
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate();

    inputDate.setSeconds(0, 0);
    now.setSeconds(0, 0);

    if (+inputDate === +now) {
      return 'Just now';
    }

    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);

    if (isSameDay(inputDate, yesterday)) {
      return `Yesterday, ${formatTimeOnly(inputDate)}`;
    }

    const oneWeekAgo = new Date(now);
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    if (inputDate > oneWeekAgo && inputDate < yesterday) {
      return 'Last week';
    }

    if (isSameDay(inputDate, now)) {
      return formatTimeOnly(inputDate);
    }

    const options = {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    };
    return new Intl.DateTimeFormat('en-US', options).format(inputDate);
  }
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMessageMenu(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  const handleDeleteMessage = async (msgId, index) => {
    setMessageMenu(null);
    try {
      await axiosInstance.delete(`/messages/delete/${msgId}`);

      setMessages((prevMessages) => prevMessages.filter((_, i) => i !== index));
    } catch (error) {
      console.error('Error deleting message:', error);
      setError(error.response?.data?.message || 'Failed to delete the message');
    }
  };

  useEffect(() => {
    const checkIfAtBottom = () => {
      const container = messageContainerRef.current;
      if (container) {
        const isBottom =
          container.scrollHeight - container.scrollTop ===
          container.clientHeight;
        setIsAtBottom(isBottom);
      }
    };

    checkIfAtBottom();

    const container = messageContainerRef.current;
    if (container) {
      container.addEventListener('scroll', checkIfAtBottom);
    }

    return () => {
      if (container) {
        container.removeEventListener('scroll', checkIfAtBottom);
      }
    };
  }, [messages]);

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });

      setTimeout(() => {
        if (!isAtBottom) {
          setIsAtBottom(true);
        }
      }, 500);
    }
  };

  return (
    <div className="w-full h-full bg-zinc-100 flex-between-vert p-2 relative">
      <Notice message={error} onClose={() => setError('')} />

      <header className="w-full border-b border-zinc-300 py-2">
        <img
          src={arrowSvg}
          className="h-8 w-8 rotate-180 p-1 hover:bg-zinc-200 rounded-md cursor-pointer"
          alt="Back"
          onClick={() => navigate(-1)}
        />
      </header>

      <section
        className="w-full p-2 flex-between-hor gap-4"
        onClick={() => navigate(`/dash/people/person/${person?.username}`)}
      >
        <img
          src={person?.image || userSvg}
          className="w-12 h-12 rounded-md object-cover object-top bg-zinc-200"
          alt="Profile"
        />
        <div className="w-full flex flex-col group cursor-pointer">
          <p className="body-1 font-semibold group-hover:underline">
            {person?.names || 'Unknown user'}
          </p>
          <p className="body-2 font-semibold flex gap-x-6 flex-wrap leading-none">
            <span className="group-hover:underline">
              {person?.username || 'username'}
            </span>
            <span className="font-normal italic text-zinc-600">
              {person?.email || 'email'}
            </span>
          </p>
        </div>
      </section>
      <main
        ref={messageContainerRef}
        className="bg-zinc-200 h-full w-full flex flex-col-reverse overflow-x-hidden relative overflow-y-scroll scroll-design py-4"
      >
        <div
          ref={messagesEndRef}
          className="text-center caption italic text-zinc-500/80 pt-4"
        >
          You are now connected to {person.names}.
        </div>
        {loadingMessages ? (
          <Loader />
        ) : messages.length > 0 ? (
          messages.map((msg, index) => (
            <div
              key={index}
              className={`w-full flex items-center px-6 py-2 group ${msg.senderId === user._id ? 'text-end justify-end group' : 'justify-start'}`}
            >
              {msg.senderId === user._id && (
                <span className="relative">
                  <img
                    src={threeDotsVerticalSvg}
                    className="w-6 h-6 mx-3 cursor-pointer hover:bg-zinc-300 rounded-full p-1 group-hover:flex hidden"
                    alt="Options"
                    onClick={() => setMessageMenu(index)}
                  />
                  {messageMenu === index && (
                    <ul
                      ref={menuRef}
                      className="w-max bg-zinc-50 p-2 absolute bottom-full right-2"
                    >
                      <li
                        className="py-1 px-3 hover:bg-zinc-100"
                        onClick={() => handleDeleteMessage(msg._id, index)}
                      >
                        Delete
                      </li>
                    </ul>
                  )}
                </span>
              )}

              <span
                className={`relative py-2 text-start max-w-xs flex flex-col gap-0 rounded-2xl shadow-lg ${msg.senderId === user._id ? 'bg-teal-100 text-teal-800 rounded-br-none' : 'bg-neutral-300 text-teal-800 rounded-bl-none'} ${msg.isImage ? 'min-h-[10rem] max-w-[50vw] min-w-[10rem]' : ''} px-2`}
                onClick={() => {
                  if (msg.isImage) setPreview(msg.message);
                }}
              >
                {!msg.isImage && (
                  <>
                    <span className="pr-6 pl-2">{msg.message}</span>
                    <span className="caption min-w-full text-end pl-10">
                      {getTime(msg.timestamp)}
                    </span>
                  </>
                )}
                {msg.isImage && (
                  <span className="relative flex">
                    <img
                      src={msg.message}
                      className="w-full h-auto rounded-md"
                    />
                    <span
                      className={`absolute text-zinc-50 right-0 left-0 bottom-0 bg-gradient-to-b from-black/10 to-black h-8 z-[100] text-end pr-2 ${msg.senderId === user._id ? 'rounded-bl-md' : 'rounded-br-md'}`}
                    >
                      {getTime(msg.timestamp)}
                    </span>
                  </span>
                )}
              </span>
            </div>
          ))
        ) : (
          <p className="body-1 h-full w-full flex-center-both font-semibold text-zinc-500/60">
            No messages yet.
          </p>
        )}
      </main>
      {!isAtBottom && (
        <img
          src={angleDownWhiteSvg}
          className="absolute bottom-[5rem] right-6 bg-teal-500 text-white rounded-full p-2 shadow-lg w-10 h-10"
          onClick={scrollToBottom}
        />
      )}

      {/* Scroll to Bottom Button */}
      {preview && (
        <div className="absolute z-[100] inset-0 p-4 bg-zinc-900/50">
          <img
            src={preview}
            alt=""
            className="w-full h-full bg-zinc-400/30 object-contain object-center"
          />
          <img
            src={xSvg}
            className="absolute top-4 right-4 w-10 h-10 bg-zinc-300/60 p-2 rounded-md"
            onClick={() => {
              setPreview(null);
            }}
          />
        </div>
      )}

      <footer
        className={`sticky bottom-0 bg-zinc-100 border border-zinc-300 w-full py-2 px-4 flex gap-2 ${sendImage ? 'items-end' : 'items-center'}`}
      >
        <div
          className={`w-full p-1 flex justify-between flex-col gap-2 h-[10rem] ${!sendImage && 'hidden'}`}
        >
          <img
            className="w-[7rem] h-[7rem] bg-zinc-200 border rounded-md object-contain"
            src={image ? image : loaderSvg}
          />
          <Button
            rounded
            blue
            onClick={() => {
              setSendImage(false);
              setImage(null);
            }}
          >
            Discard
          </Button>
        </div>
        <label className={`flex items-center ${sendImage && 'hidden'}`}>
          <img
            src={imageSvg}
            className="h-8 min-w-8 border-zinc-300 flex-center-both"
          />
          <input
            type="file"
            name="image"
            className="w-0 h-0"
            onChange={handleUploadImage}
          />
        </label>
        <input
          type="text"
          placeholder="Type a message..."
          value={messageContent}
          onChange={(e) => setMessageContent(e.target.value)}
          onKeyDown={handleKeyDown}
          className={`w-full py-2 px-4 rounded-full border border-zinc-300 focus:outline-none ${sendImage && 'hidden'}`}
        />
        <Button
          className={!sendImage && 'rounded-full'}
          rounded={sendImage ? true : false}
          blue
          onClick={handleSendMessage}
        >
          {isSendingMessage ? (
            <span>Sending...</span>
          ) : (
            <>
              <img
                src={sendSvg}
                alt="Send"
                className={sendImage ? 'hidden' : ''}
              />
              {sendImage && 'Send'}
            </>
          )}
        </Button>

        {isUploadingImage && (
          <div className="absolute bottom-10 right-0 bg-gray-800 text-white p-2 rounded-md">
            Uploading Image...
          </div>
        )}
      </footer>
    </div>
  );
};

export default MyFriends;
