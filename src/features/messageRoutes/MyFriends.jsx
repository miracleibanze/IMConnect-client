import React, { useState, useEffect, useContext, useCallback } from 'react';
import axios from 'axios';
import { AppContext } from '../../App';
import { useNavigate, useParams } from 'react-router-dom';
import Button from '../../components/design/Button';
import { arrowSvg, sendSvg, threeDotsVerticalSvg, userSvg } from '../../assets';
import { connectSocket } from '../utils/Socket';
import Loader from '../../components/skeletons/Loader';
import axiosInstance from '../utils/axiosInstance';

const MyFriends = () => {
  const { user } = useContext(AppContext);
  const [messageContent, setMessageContent] = useState('');
  const [messages, setMessages] = useState([]);
  const [person, setperson] = useState();
  const [messageMenu, setmessageMenu] = useState('');
  const navigate = useNavigate();
  const { userId } = useParams();
  const otherUserId = userId || 'unknown';
  const [lodingMessages, setLoadingMessages] = useState();

  useEffect(() => {
    const socket = connectSocket();

    socket.emit('joinRoom', user._id);

    socket.on('newMessage', (newMessage) => {
      if (
        (newMessage.senderId === otherUserId &&
          newMessage.receiverId === user._id) ||
        (newMessage.senderId === user._id &&
          newMessage.receiverId === otherUserId)
      ) {
        setMessages((prevMessages) => [newMessage.message, ...prevMessages]);
      }
    });

    socket.on('messages', (updatedMessages) => {
      const filteredMessages = updatedMessages.filter(
        (msg) =>
          (msg.senderId === user._id || msg.receiverId === user._id) &&
          (msg.senderId === otherUserId || msg.receiverId === otherUserId)
      );
      setMessages(filteredMessages);
    });

    return () => {
      socket.off('messages');
      socket.off('newMessage');
    };
  }, [user._id, otherUserId]);

  const handleSendMessage = async () => {
    if (!messageContent) return;

    const messageData = {
      senderId: user._id,
      receiverId: otherUserId,
      message: messageContent,
    };

    try {
      const response = await axiosInstance.post('/messages/send', messageData);

      setMessages((prevMessages) => [
        { ...messageData, _id: response.data.message._id },
        ...prevMessages,
      ]);

      setMessageContent('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const handleDeleteMessage = async (messageId) => {
    console.log('Deleting message:', messageId);
    try {
      await axiosInstance.delete(`/messages/delete/${messageId}`);
      setmessageMenu('');
    } catch (error) {
      console.error('Error deleting message:', error);
    }
  };

  useEffect(() => {
    const fetchMessages = async () => {
      setLoadingMessages(true);
      try {
        const response = await axiosInstance.get(
          `/messages/${user._id}/${otherUserId}/`
        );
        if (Array.isArray(response.data.messages)) {
          setMessages(response.data.messages);
        } else {
          console.error('Invalid response format', response.data.messages);
          setMessages([]);
        }
        setperson(response.data.user);
        await markMessagesAsRead();
        setLoadingMessages(false);
      } catch (error) {
        console.error('Error fetching messages:', error);
        setMessages([]);
      }
    };

    fetchMessages();
  }, [user.username, otherUserId]);

  const markMessagesAsRead = async () => {
    try {
      await axiosInstance.post('/messages/markAsRead', {
        senderId: user._id,
        receiverId: otherUserId,
      });
    } catch (error) {
      console.error('Error marking messages as read:', error);
    }
  };

  function getTime(isoString) {
    const date = new Date(isoString);
    const options = { hour: '2-digit', minute: '2-digit', hour12: false };
    return new Intl.DateTimeFormat('en-US', options).format(date);
  }
  const handleKeyDown = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="w-full h-full bg-zinc-100 flex-between-vert p-2 relative">
      <span className="w-full border-b border-zinc-300 py-2">
        <img
          src={arrowSvg}
          className="h-8 w-8 rotate-180 p-1 hover:bg-zinc-200 rounded-md cursor-pointer"
          onClick={() => navigate(-1)}
        />
      </span>
      <div
        className="w-full p-2 flex-between-hor gap-4"
        onClick={() => navigate(`/dash/people/person/${person.username}`)}
      >
        <img
          src={person?.image ? person.image : userSvg}
          className="w-12 h-12 rounded-md object-cover object-top bg-zinc-200"
        />
        <div className="w-full flex flex-col group cursor-pointer">
          <p className="body-1 font-semibold group-hover:underline">
            {person?.names ? person.names : 'Unknown user'}
          </p>
          <p className="body-2 font-semibold flex gap-x-6 flex-wrap leading-none">
            <span className=" group-hover:underline">
              {person?.username ? person.username : 'username'}
            </span>
            <span className="font-normal italic text-zinc-600">
              {person?.email ? person.email : 'email'}
            </span>
          </p>
        </div>
      </div>
      <div className="bg-zinc-200 h-full w-full flex flex-col-reverse relative overflow-y-scroll scroll-design py-4 overflow-hidden">
        {lodingMessages ? (
          <Loader />
        ) : (
          <>
            {messages.length > 0 ? (
              <>
                {messages.map((msg, index) => (
                  <div
                    key={index}
                    className={`w-full min-h-max flex flex-wrap items-center relative px-6 py-2 group ${
                      msg.senderId === user._id
                        ? 'text-end justify-end'
                        : 'bg-zinc-100/50 flex-row-reverse justify-end'
                    }`}
                  >
                    <div
                      className={`relative ${
                        msg.senderId !== user._id
                          ? 'hidden'
                          : 'hidden group-hover:flex'
                      }`}
                    >
                      <img
                        src={threeDotsVerticalSvg}
                        className="w-8 h-8 rounded-full flex-center-both mx-3 bg-zinc-300 p-2 hover:border border-zinc-500/40"
                        onClick={() => setmessageMenu(index)}
                      />
                      {messageMenu === index && (
                        <ul className="w-max h-auto flex-center-both px-3 py-4 rounded-md absolute bottom-full z-[10] right-0 bg-zinc-50">
                          <li className="hover:bg-zinc-200 w-full pl-3 pr-6 py-2 max-w-md">
                            Forward
                          </li>
                          <li
                            className="hover:bg-zinc-200 w-full pl-3 pr-6 py-2 max-w-md"
                            onClick={() => handleDeleteMessage(msg._id)}
                          >
                            Delete
                          </li>
                        </ul>
                      )}
                    </div>
                    <span
                      className={` px-6 py-2 max-w-xs rounded-2xl shadow-lg cursor-pointer ${
                        msg.senderId === user._id
                          ? 'bg-teal-100 text-teal-800 rounded-br-none'
                          : 'bg-neutral-300 text-teal-800 rounded-bl-none'
                      }`}
                    >
                      {msg.message}
                    </span>
                  </div>
                ))}
              </>
            ) : (
              <p className="w-full h-full flex-center-both body-1 font-semibold text-zinc-400">
                No messages yet.
              </p>
            )}
          </>
        )}
      </div>
      <div className="w-full p-2 flex-between-hor border-t border-black/30 gap-4">
        <textarea
          className="w-full px-4 py-2 max-h-[3rem] resize-none text-lg outline-none bg-transparent no-scrollbar"
          value={messageContent}
          onChange={(e) => setMessageContent(e.target.value)}
          placeholder="Type your message..."
          onKeyDown={handleKeyDown}
        />
        <Button
          rounded
          blue
          onClick={handleSendMessage}
          className="px-6"
          disabled={!messageContent.trim()}
        >
          <span className="max-sm:hidden">Send</span>
          <img src={sendSvg} className="w-8 h-8 sm:hidden -mr-2" />
        </Button>
      </div>
    </div>
  );
};

export default MyFriends;
