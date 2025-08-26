// HelpComponent.js

import React from "react";
import styles from "./RingPhone.module.css";
import { FaPhoneAlt } from "react-icons/fa";
import Zalo from "../../public/zalo-icon.png";
import Image from "next/image";
const RingPhone = () => {
  return (
    <div className={styles.helpContainer}>
      <div className={styles.zaloRing}>
        <div className={styles.zaloRingCircle}></div>
        <div className={styles.zaloRingCircleFill}>
          <a href="http://zalo.me/0866572271">
            <Image src={Zalo} alt="Zalo Icon" width={50} height={50} />
          </a>
        </div>
      </div>
    </div>
  );
};

export default RingPhone;
