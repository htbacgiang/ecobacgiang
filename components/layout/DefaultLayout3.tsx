import { FC, ReactNode } from 'react';
import Head from 'next/head';
import dynamic from 'next/dynamic';
import Navbar from '../header/Navbar';
import MessengerButton from '../button/MessengerButton';
import NavbarMobile from './NavbarMobile';

const GoogleAnalytics = dynamic(() => import('../common/GoogleAnalytics'), { ssr: false });

interface Props {
  title?: string;
  desc?: string;
  thumbnail?: string;
  children: ReactNode;
}

const DefaultLayout: FC<Props> = ({ title, desc, thumbnail, children }): JSX.Element => {
  return (
    <>
      <div className="min-h-screen bg-primary dark:bg-primary-dark transition">
        <div className='hidden md:block'>
        <Navbar />
        </div>
        <div className="mx-auto max-w-full">{children}</div>
        <NavbarMobile />
      </div>
    </>
  );
};

export default DefaultLayout;