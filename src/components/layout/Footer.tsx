import styles from './Footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.info}>
          <h3 className={styles.title}>Mini Shop</h3>
          <p className={styles.description}>
            React 실무 학습을 위한 미니 이커머스 프로젝트
          </p>
        </div>
        <div className={styles.links}>
          <div className={styles.linkGroup}>
            <h4 className={styles.linkTitle}>고객센터</h4>
            <p>이메일: support@minishop.com</p>
            <p>전화: 1234-5678</p>
          </div>
          <div className={styles.linkGroup}>
            <h4 className={styles.linkTitle}>운영시간</h4>
            <p>평일 09:00 - 18:00</p>
            <p>주말/공휴일 휴무</p>
          </div>
        </div>
        <div className={styles.copyright}>
          <p>© 2024 Mini Shop. All rights reserved.</p>
          <p>본 사이트는 학습용 샘플 프로젝트입니다.</p>
        </div>
      </div>
    </footer>
  );
}
