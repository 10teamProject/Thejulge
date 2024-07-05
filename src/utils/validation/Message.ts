const Messages = {
  EMAIL_REQUIRED: '이메일을 입력해주세요.',
  INVALID_EMAIL: '잘못된 이메일 형식입니다.',
  PASSWORD_REQUIRED: '비밀번호를 입력해주세요.',
  INVALID_PASSWORD: '비밀번호는 최소 8자 이상이어야 합니다.',
  CONFIRM_PASSWORD_REQUIRED: '비밀번호 확인란을 입력해주세요.',
  PASSWORDS_MUST_MATCH: '비밀번호와 비밀번호 확인란의 값이 일치하지 않습니다.',
  NICKNAME_REQUIRED: '닉네임을 입력해주세요.',
  INVALID_TYPE: '사장님 혹은 알바생중 선택해주세요',
  TYPE_REQUIRED: '사용자 유형을 선택해주세요.',

  NAME_REQUIRED: '가게 이름을 입력해주세요.',
  CATEGORY_REQUIRED: '분류를 선택해주세요.',
  ADDRESS_REQUIRED: '주소를 검색해 주세요.',
  ADDRESS_SEOUL_ONLY: '현재 서울에 위치한 가게만 등록이 가능합니다.',
  ADDRESS_DETAIL_REQUIRED: '상세 주소를 입력해주세요.',
  HOURLY_PAY_REQUIRED: '기본 시급을 입력해주세요.',
  INVALID_HOURLY_PAY: '최저시급(9,620원) 이상의 값을 입력해주세요.',

  REGISTER_FAILED: '가게 정보 등록 중 에러가 발생했습니다.',
  NETWORK_ERROR: '네트워크 연결 문제가 발생했습니다.',

  ERROR_PRE_SIGNED_URL_CREATION:
    'Presigned URL 생성 중 오류 발생가 발생했습니다.',
  ERROR_PRE_SIGNED_URL_FAILED: 'Presigned URL 생성에 실패했습니다.',

  ERROR_S3_UPLOAD: 'S3 업로드 중 오류 발생가 발생했습니다.',
  ERROR_S3_UPLOAD_FAILED: '파일을 S3에 업로드하는 데 실패했습니다.',
};

export default Messages;
