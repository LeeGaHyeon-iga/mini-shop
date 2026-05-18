import { useState, FormEvent } from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { userApi } from '../utils/api';
import { Button, Input } from '../components/common';
import styles from './MyPage.module.css';

interface FormErrors {
  name?: string;
  phone?: string;
}

export default function MyPage() {
  const { user, updateUser } = useAuth();

  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [address, setAddress] = useState(user?.address || '');
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const validate = (): boolean => {
    const newErrors: FormErrors = {};

    if (!name.trim()) {
      newErrors.name = '이름을 입력해주세요';
    }

    if (phone && !/^[0-9-]*$/.test(phone)) {
      newErrors.phone = '올바른 연락처 형식이 아닙니다';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSuccessMessage('');

    if (!validate()) return;

    try {
      setIsLoading(true);
      const response = await userApi.update({
        name: name.trim(),
        phone: phone.trim() || undefined,
        address: address.trim() || undefined,
      });

      if (response.success && response.user) {
        updateUser(response.user);
        setSuccessMessage('정보가 업데이트되었습니다.');
      }
    } catch (err) {
      alert(err instanceof Error ? err.message : '업데이트에 실패했습니다');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>마이페이지</h1>

      <div className={styles.content}>
        <nav className={styles.sidebar}>
          <NavLink
            to="/mypage"
            end
            className={({ isActive }) => `${styles.navLink} ${isActive ? styles.active : ''}`}
          >
            내 정보
          </NavLink>
          <NavLink
            to="/mypage/orders"
            className={({ isActive }) => `${styles.navLink} ${isActive ? styles.active : ''}`}
          >
            주문 내역
          </NavLink>
          <NavLink
            to="/mypage/wishlist"
            className={({ isActive }) => `${styles.navLink} ${isActive ? styles.active : ''}`}
          >
            찜 목록
          </NavLink>
        </nav>

        <main className={styles.main}>
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>내 정보</h2>

            {successMessage && (
              <div className={styles.successMessage}>{successMessage}</div>
            )}

            <form onSubmit={handleSubmit} className={styles.form}>
              <Input
                label="이메일"
                type="email"
                value={user?.email || ''}
                disabled
                fullWidth
              />

              <Input
                label="이름"
                name="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="이름을 입력하세요"
                error={errors.name}
                fullWidth
                required
              />

              <Input
                label="연락처"
                name="phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="010-1234-5678"
                error={errors.phone}
                fullWidth
              />

              <Input
                label="주소"
                name="address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="주소를 입력하세요"
                fullWidth
              />

              <Button type="submit" isLoading={isLoading}>
                정보 수정
              </Button>
            </form>
          </section>
        </main>
      </div>
    </div>
  );
}
