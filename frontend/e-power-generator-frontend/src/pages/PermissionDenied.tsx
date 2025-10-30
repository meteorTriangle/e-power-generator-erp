// src/pages/PermissionDenied/PermissionDenied.tsx

import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MdOutlineGppBad } from 'react-icons/md'; // 一個很棒的 "權限錯誤" 圖示
import styles from './PermissionDenied.module.css';

const PermissionDenied: React.FC = () => {
  const navigate = useNavigate();

  // 處理「回上一頁」的函式
  const handleGoBack = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    // navigate(-1) 會返回瀏覽器歷史紀錄的上一頁
    navigate(-1);
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <MdOutlineGppBad className={styles.icon} />

        <h1 className={styles.title}>權限不足 (Access Denied)</h1>

        <p className={styles.message}>
          抱歉，您的帳號沒有存取此頁面的權限。
          <br />
          如果您認為這是一個錯誤，請聯絡您的系統管理員。
        </p>

        <div className={styles.buttonGroup}>
          <button
            onClick={handleGoBack}
            className={`${styles.button} ${styles.secondaryButton}`}
          >
            返回上一頁
          </button>
          
          <Link
            to="/" 
            className={`${styles.button} ${styles.primaryButton}`}
          >
            回首頁
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PermissionDenied;
