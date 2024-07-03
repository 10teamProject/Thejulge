import { useState } from 'react';

import Input from '../common/InputComponent';
import styles from './DaumAddressInput.module.scss';
import buttonStyles from '@/components/common/Button.module.scss';

declare global {
  interface Window {
    daum: any;
  }
}

interface InputAddress {
  address: string;
  sido: string;
  sigungu: string;
  buildingName: string;
}

// 부모 컴포넌트에서 전달받는 props 타입 정의
interface AddressInputProps {
  onChangeAddress: (value: string) => void;
  onChangeDetailAddress: (value: string) => void;
  errorAddress?: string;
  errorDetailAddress?: string;
}

export default function DaumAddressInput({
  onChangeAddress,
  onChangeDetailAddress,
  errorAddress,
  errorDetailAddress,
}: AddressInputProps) {
  const [addrValue, setAddrValue] = useState(''); // 도로명주소
  const [detailAddrValue, setDetailAddrValue] = useState(''); // 상세 주소

  const handleSearchAddress = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    // 다음 우편번호 서비스 호출
    new window.daum.Postcode({
      oncomplete(data: InputAddress) {
        // 서울인 경우 '서울시'를 추가하여 주소 설정
        const sigungu =
          data.sido === '서울'
            ? `서울시 ${data.sigungu}`
            : `${data.sido} ${data.sigungu}`;
        setAddrValue(sigungu);
        onChangeAddress(sigungu);

        const loadName = data.address.split(' ').reverse();
        const detailAddress = `${loadName[1]} ${loadName[0]} ${data.buildingName}`;
        setDetailAddrValue(detailAddress);
        onChangeDetailAddress(detailAddress);
      },
    }).open();
  };

  // 상세 주소 입력값 변경 처리
  const handleDetialAddressInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { value } = e.target;
    setDetailAddrValue(value);
    onChangeDetailAddress(value);
  };

  return (
    <div className={styles.addressWrapper}>
      <div className={styles.address1Box}>
        <Input
          label="주소"
          name="address1"
          type="text"
          placeholder="입력"
          value={addrValue}
          required
          error={errorAddress}
        />
        <button
          onClick={handleSearchAddress}
          className={`${styles.searchButton} ${buttonStyles.button}`}
        >
          검색
        </button>
      </div>
      <Input
        label="상세 주소"
        name="address2"
        type="text"
        placeholder="입력"
        value={detailAddrValue}
        required
        error={errorDetailAddress}
        onChange={handleDetialAddressInputChange}
      />
    </div>
  );
}
