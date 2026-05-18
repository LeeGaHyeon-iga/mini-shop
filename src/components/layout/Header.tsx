import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useCart } from '../../contexts/CartContext';
import styles from './Header.module.css';

export default function Header() {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();
  const { totalQuantity } = useCart();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <Link to="/" className={styles.logo}>
          Mini Shop
        </Link>

        <nav className={styles.nav}>
          <Link to="/products" className={styles.navLink}>
            상품
          </Link>
          <Link to="/cart" className={styles.navLink}>
            장바구니
            {totalQuantity > 0 && (
              <span className={styles.badge}>{totalQuantity}</span>
            )}
          </Link>
        </nav>

        <div className={styles.auth}>
          {isAuthenticated ? (
            <>
              <span className={styles.userName}>{user?.name}님 반갑습니다!</span>
              <Link to="/mypage" className={styles.mypageLink}>
                마이페이지
              </Link>
              <button onClick={handleLogout} className={styles.logoutButton}>
                로그아웃
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className={styles.navLink}>
                로그인
              </Link>
              <Link to="/signup" className={styles.signupLink}>
                회원가입
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
