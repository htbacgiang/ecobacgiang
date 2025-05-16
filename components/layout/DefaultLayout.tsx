import { FC, ReactNode } from 'react';
import Head from 'next/head';
import dynamic from 'next/dynamic';
import Footer from '../common/Footer';
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
        <Navbar />
        <GoogleAnalytics />
        <div className="mx-auto max-w-full">{children}</div>
        <MessengerButton />
        <Footer />
        <NavbarMobile />
      </div>
    </>
  );
};

export default DefaultLayout;