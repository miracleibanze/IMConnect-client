import {
  arrowRightOnRectangleSvg,
  bellSvg,
  commentsSvg,
  envelopeSvg,
  gearFillSvg,
  homeSvg,
  imageSvg,
  mapPinSvg,
  plusSquareSvg,
  searchSvg,
  smileSvg,
  thumbsUpSvg,
  usersSvg,
} from '../assets';

export const navbarIcons = [
  {
    id: 0,
    icon: commentsSvg,
    link: '/dash/profile/comments',
  },
  {
    id: 1,
    icon: bellSvg,
    link: '/dash/profile/notification',
  },
];

export const homeSidebarLinks = [
  {
    id: 0,
    name: 'Home',
    icon: homeSvg,
    link: '/dash',
  },
  {
    id: 1,
    name: 'Explore',
    icon: searchSvg,
  },
  {
    id: 2,
    name: 'Inbox',
    icon: envelopeSvg,
    link: '/dash/messages',
  },
  {
    id: 3,
    name: 'People',
    icon: usersSvg,
    link: '/dash/people',
  },
];
export const utilitySidebarLinks = [
  {
    id: 0,
    name: 'Create Post',
    link: '/dash/post',
    icon: plusSquareSvg,
  },
  {
    id: 1,
    name: 'My Posts',
    link: '/dash/my_posts',
    icon: thumbsUpSvg,
  },
];

export const bottomSidebarLinks = [
  {
    id: 0,
    name: 'Setting',
    link: '/dash/setting',
    icon: gearFillSvg,
  },
  {
    id: 1,
    name: 'Log Out',
    icon: arrowRightOnRectangleSvg,
    logOut: true,
  },
];

export const postIcons = [
  {
    id: 0,
    name: 'image',
    icon: imageSvg,
  },
  {
    id: 2,
    name: 'feeling',
    icon: smileSvg,
  },
];
export const postFeeling = ['Happy', 'Sad', 'Excited', 'Anxiety', 'Sick'];

export const settings = [
  {
    id: 0,
    name: 'Personal Information',
    link: 'profile',
  },
  {
    id: 1,
    name: 'Account Setting',
    link: 'account',
  },
  {
    id: 2,
    name: 'Notification Preferences',
    link: 'notifications',
  },
  {
    id: 3,
    name: 'Messaging Setting',
    link: 'messages',
  },
  {
    id: 4,
    name: 'Help & Support',
    link: 'help_support',
  },
];
