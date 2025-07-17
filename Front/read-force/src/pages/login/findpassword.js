import React, { useState } from 'react';
import './findpassword.css';

export default function FindPassword() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    try {
      const response = await fetch('/email/send-password-reset-link', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.message || '링크 전송에 실패했습니다.');
      }

      setMessage('📧 비밀번호 재설정 링크가 이메일로 전송되었습니다.');
    } catch (error) {
      setMessage(`❌ 오류: ${error.message}`);
    }
  };

  return (
    <div className="page-container">
    <div className="findpassword-wrapper">
      <h2 className="findpassword-title">비밀번호 찾기</h2>
      <form onSubmit={handleSubmit} className="findpassword-form">
        <label htmlFor="email">가입한 이메일 주소를 입력하세요</label>
        <input
          type="email"
          id="email"
          placeholder="이메일 주소"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button type="submit">비밀번호 재설정 링크 전송</button>
      </form>
      {message && <p className="findpassword-message">{message}</p>}
    </div>
    </div>
  );
}
