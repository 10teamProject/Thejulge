import Image from 'next/image';
import Link from 'next/link';

import facebookIcon from '@/public/assets/icon/icon_facebook.svg';
import intsagramIcon from '@/public/assets/icon/icon_instagram.svg';
import mailIcon from '@/public/assets/icon/icon_mail.svg';

import styles from './Footer.module.scss';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.copyright}>ⓒ codeit-2024</div>
      <div className={styles.footerInfo}>
        <Link children="Privacy Policy" href="/NotfoundPage" />
        <Link children="FAQ" href="/NotfoundPage" />
      </div>
      <div className={styles.snsLinks}>
        <Link href="/NotfoundPage">
          <Image src={mailIcon} alt="메일 아이콘" />
        </Link>
        <Link href="/NotfoundPage">
          <Image src={facebookIcon} alt="페이스북 아이콘" />
        </Link>
        <Link href="/NotfoundPage">
          <Image src={intsagramIcon} alt="인스타그램 아이콘" />
        </Link>
      </div>
    </footer>
  );
}
