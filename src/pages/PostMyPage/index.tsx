import styles from './PostMyPage.module.scss';

interface PostMyPageProps {}

const addressValue = [
  { value: 'Jongno-gu', label: '서울시 종로구' },
  { value: 'Jung-gu', label: '서울시 중구' },
  { value: 'Yongsan-gu', label: '서울시 용산구' },
  { value: 'Seongdong-gu', label: '서울시 성동구' },
  { value: 'Gwangjin-gu', label: '서울시 광진구' },
  { value: 'Dongdaemun-gu', label: '서울시 동대문구' },
  { value: 'Jungnang-gu', label: '서울시 중랑구' },
  { value: 'Seongbuk-gu', label: '서울시 성북구' },
  { value: 'Gangbuk-gu', label: '서울시 강북구' },
  { value: 'Dobong-gu', label: '서울시 도봉구' },
  { value: 'Nowon-gu', label: '서울시 노원구' },
  { value: 'Eunpyeong-gu', label: '서울시 은평구' },
  { value: 'Seodaemun-gu', label: '서울시 서대문구' },
  { value: 'Mapo-gu', label: '서울시 마포구' },
  { value: 'Yangcheon-gu', label: '서울시 양천구' },
  { value: 'Gangseo-gu', label: '서울시 강서구' },
  { value: 'Guro-gu', label: '서울시 구로구' },
  { value: 'Geumcheon-gu', label: '서울시 금천구' },
  { value: 'Yeongdeungpo-gu', label: '서울시 영등포구' },
  { value: 'Dongjak-gu', label: '서울시 동작구' },
  { value: 'Gwanak-gu', label: '서울시 관악구' },
  { value: 'Seocho-gu', label: '서울시 서초구' },
  { value: 'Gangnam-gu', label: '서울시 강남구' },
  { value: 'Songpa-gu', label: '서울시 송파구' },
  { value: 'Gangdong-gu', label: '서울시 강동구' },
];

function PostMyPage(props: PostMyPageProps) {
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
                  <select className={styles.selectStyle} name="region" id="region"> 선택
                  <option value="" selected disabled hidden>선택</option>
                  {addressValue.map(option => (
                    <option className={styles.selectPlaceHolder} key={option.value} value={option.value}>{option.label}</option>
                  ))}
                  </select>
                </div>
              </div> 
            </div>
            
            <div className={styles.introduceBox}>
              <label htmlFor="intro" className={styles.inputFont}>소개</label>
              <div><textarea className={styles.inputBoard} type="text" id="intro" name="intro" placeholder="입력" /></div>
            </div>

              <button className={styles.button}><span>등록하기</span></button>
        </form>
      </div>
    </main>
  );
};

export default PostMyPage;