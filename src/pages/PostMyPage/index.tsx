import axios, { AxiosError } from 'axios';
import { useRouter } from 'next/router';
import React, { useEffect, useRef, useState } from 'react';

import Modal from '@/components/common/ConfirmModal';

import { addressOptions } from '../../utils/Options';
import { updateUserProfile } from '../api/ProfilePost';
import styles from './PostMyPage.module.scss';

interface Option {
  value: string;
}

interface UpdateUserRequestBody {
  name?: string;
  phone?: string;
  address?: string;
  bio?: string;
}

function getUserIdFromSessionStorage(): string | null {
  const userIdString = sessionStorage.getItem('user');
  if (userIdString) {
    try {
      const userId = JSON.parse(userIdString).id;
      return userId;
    } catch (error) {
      console.error('에러입니다.', error);
    }
  }
  return null;
}

function PostMyPage() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string>('선택');
  const [userId, setUserId] = useState<string | null>(null);
  const [profileUpdated, setProfileUpdated] = useState(false); // 프로필 업데이트 성공 상태

  const dropdownRef = useRef<HTMLDivElement>(null);
  const nameRef = useRef<HTMLInputElement>(null);
  const telRef = useRef<HTMLInputElement>(null);
  const introRef = useRef<HTMLTextAreaElement>(null);

  const router = useRouter();


  useEffect(() => {
    const storedUserId = getUserIdFromSessionStorage(); // 세션 스토리지에서 ID 가져옴
    if (storedUserId) {
      setUserId(storedUserId);
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleClickOutside = (event: MouseEvent) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
      setIsDropdownOpen(false);
    }
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleOptionClick = (option: Option) => {
    setSelectedOption(option.value);
    setIsDropdownOpen(false);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const name = nameRef.current?.value;
    const phone = telRef.current?.value;
    const bio = introRef.current?.value;
    const address = selectedOption;

    if (!userId) {
      alert('로그인 후 작성해주세요.');
      return;
    }

    const data: UpdateUserRequestBody = {
      name,
      phone,
      address,
      bio,
    };

    try {
      const response = await updateUserProfile(userId, data);

      if (response && 'item' in response) {
        setProfileUpdated(true); // 프로필 업데이트 성공 시 상태 변경
      } else {
        alert('프로필 등록에 실패했습니다.');
      }
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const axiosError: AxiosError<{ message: string }> = error;
        if (axiosError.response) {
          const errorMessage = axiosError.response.data.message;
          if (axiosError.response.status === 400) {
            alert('요청 양식 오류입니다.');
          } else if (axiosError.response.status === 403) {
            alert('권한이 없습니다.');
          } else if (axiosError.response.status === 404) {
            alert('존재하지 않는 사용자입니다.');
          } else {
            alert('프로필 등록 중 오류가 발생했습니다.');
          }
        } else if (axiosError.request) {
          alert('서버로의 요청 실패');
        } else {
          alert('네트워크 오류');
        }
      } else {
        alert('전화번호를 양식에 맞게 작성하세요.');
      }
    }
  };

  return (
    <main className={styles.main}>
      <div className={styles.postContainer}>
        <h1 className={styles.profileTitle}>내 프로필</h1>
        <form className={styles.formInput} onSubmit={handleSubmit}>
          <div className={styles.formarray}>
            <div className={styles.inputSize}>
              <label htmlFor="name" className={styles.inputFont}>이름*</label>
              <div><input className={styles.input} type="text" id="name" name="name" placeholder="입력" ref={nameRef} required /></div>
            </div>

            <div className={styles.inputSize}>
              <label htmlFor="tel" className={styles.inputFont}>연락처(-)*</label>
              <div><input className={styles.input} type="tel" id="tel" name="tel" placeholder="입력" ref={telRef} required /></div>
            </div>

            <div className={styles.inputSize}>
              <label htmlFor="region" className={styles.inputFont}>선호 지역</label>
              <div>
                <input
                  type="hidden"
                  id="region"
                  name="region"
                  value={selectedOption}
                />
                <div className={styles.selectStyle} ref={dropdownRef} onClick={toggleDropdown}>
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
            <div><textarea className={styles.inputBoard} id="intro" name="intro" placeholder="입력" ref={introRef} /></div>
          </div>

          <button type="submit" className={styles.button}><span>등록하기</span></button>
        </form>
      </div>
      {/* 프로필 업데이트 성공 시 모달 */}
      {profileUpdated && (
        <Modal
          isOpen={profileUpdated}
          onClose={() => setProfileUpdated(false)}
          message="등록이 완료되었습니다."
          buttons={[
            {
              text: "확인",
              onClick: () => {
                setProfileUpdated(false); 
                router.push("../DetailedMyPage"); // 다음 페이지로 이동
              },
              variant: "primary"
            }
          ]}
        />
      )}
    </main>
  );
}

export default PostMyPage;