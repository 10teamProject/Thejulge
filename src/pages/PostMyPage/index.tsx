import React, { useState } from 'react';

import { addressOptions } from '../../utils/Options';
import styles from './PostMyPage.module.scss';

interface Option {
  value: string;
}

interface PostMyPageProps {}

const PostMyPage: React.FC<PostMyPageProps> = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string>('선택');

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleOptionClick = (option: Option) => {
    setSelectedOption(option.value);
    setIsDropdownOpen(false);
  };

  return (
    <main className={styles.main}>
      <div className={styles.postContainer}>
        <h1 className={styles.profileTitle}>내 프로필</h1>
        <form className={styles.formInput}>
          <div className={styles.formarray}>
            <div className={styles.inputSize}>
              <label htmlFor="name" className={styles.inputFont}>이름*</label>
              <div><input className={styles.input} type="text" id="name" name="name" placeholder="입력" /></div>
            </div>

            <div className={styles.inputSize}>
              <label htmlFor="tel" className={styles.inputFont}>연락처*</label>
              <div><input className={styles.input} type="tel" id="tel" name="tel" placeholder="입력" /></div>
            </div>

            <div className={styles.inputSize}>
              <label htmlFor="region" className={styles.inputFont}>선호 지역</label>
              <div>
                <div className={styles.selectStyle} onClick={toggleDropdown}>
                  {selectedOption}
                  <span>
                    {isDropdownOpen ? (
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                        <path d="M7 14l5-5 5 5z" />
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                        <path d="M7 10l5 5 5-5z" />
                      </svg>
                    )}
                  </span>
                  <ul className={`${styles.options} ${isDropdownOpen ? styles.show : ''}`}>
                    {addressOptions.map((option: Option) => (
                      <li key={option.value} className={styles.option} onClick={() => handleOptionClick(option)}>
                        {option.value}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div> 
          </div>

          <div className={styles.introduceBox}>
            <label htmlFor="intro" className={styles.inputFont}>소개</label>
            <div><textarea className={styles.inputBoard} id="intro" name="intro" placeholder="입력" /></div>
          </div>

          <button className={styles.button}><span>등록하기</span></button>
        </form>
      </div>
    </main>
  );
};

export default PostMyPage;