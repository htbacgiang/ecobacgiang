// components/MessengerButton.tsx

import { FC } from 'react';
import FbMess from '../../public/fbmess.png';
import Image from "next/image";
import styles from "../about/RingPhone.module.css";
import Link from 'next/link';
import Zalo from "../../public/zalo-icon.png";

const MessengerButton: FC = () => {
  const openMessenger = () => {
    window.open('https://m.me/147995528391633', '_blank');
  };

  return (

        <div className={styles.helpContainer}>

      <div className={styles.phoneRing}>
        <div className={styles.phoneRingCircle}></div>
        <div className={styles.phoneRingCircleFill}>
        <button
      onClick={openMessenger}
    >
        <Image src={FbMess} alt="face-book icon" width={60} height={60} />
        </button>

        </div>
      </div>
      <div className={styles.zaloRing}>
        <div className={styles.zaloRingCircle}></div>
        <div className={styles.zaloRingCircleFill}>
          <button>
            <Link href="http://zalo.me/0979842701">
              <Image src={Zalo} alt="Zalo Icon" width={60} height={60} />
            </Link>
          </button>
        </div>
      </div>
    </div>

  );
};

export default MessengerButton;
