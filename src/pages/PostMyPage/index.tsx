import React, { useState } from 'react';

import { addressOptions } from '../../utils/Options';
import styles from './PostMyPage.module.scss';

function PostMyPage(props: PostMyPageProps) {
  return (
    <main className={styles.main}>
      <div className={styles.postContainer}>
        <h1 className={styles.profileTitle}>내 프로필</h1>
        <form className={styles.formInput}>
          <div className={styles.formarray}>
            <div className={styles.inputSize}>
              <label htmlFor="name" className={styles.inputFont}>
                이름*
              </label>
              <div>
                <input
                  className={styles.input}
                  type="text"
                  id="name"
                  name="name"
                  placeholder="입력"
                />
              </div>
            </div>

            <div className={styles.inputSize}>
              <label htmlFor="tel" className={styles.inputFont}>
                연락처*
              </label>
              <div>
                <input
                  className={styles.input}
                  type="tel"
                  id="tel"
                  name="tel"
                  placeholder="입력"
                />
              </div>
            </div>

            <div className={styles.inputSize}>
              <label htmlFor="region" className={styles.inputFont}>
                선호 지역
              </label>
              <div>
                <select
                  className={styles.selectStyle}
                  name="region"
                  id="region"
                >
                  {' '}
                  선택
                  <option value="" selected disabled hidden>
                    선택
                  </option>
                  {addressValue.map((option) => (
                    <option
                      className={styles.selectPlaceHolder}
                      key={option.value}
                      value={option.value}
                    >
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className={styles.introduceBox}>
            <label htmlFor="intro" className={styles.inputFont}>
              소개
            </label>
            <div>
              <textarea
                className={styles.inputBoard}
                id="intro"
                name="intro"
                placeholder="입력"
              />
            </div>
          </div>

          <button className={styles.button}>
            <span>등록하기</span>
          </button>
        </form>
      </div>
    </main>
  );
}

export default PostMyPage;
