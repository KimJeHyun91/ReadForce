import React from 'react';
import './testresultpage.css';
import { useLocation, useNavigate } from 'react-router-dom';

const TestResultPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const result = location.state?.result;

  if (!result || !result.testResultComment) {
    return <div>결과를 불러올 수 없습니다.</div>;
  }

  return (
    <div className="TestResult-wrapper">
      <div className="TestResult-card">
        <h2>🎉 문해력 테스트 결과</h2>
        <p className="TestResult-comment">{result.testResultComment}</p>

        <div className="TestResult-actions">
          <button onClick={() => navigate('/')}>메인으로 돌아가기</button>
        </div>
      </div>
    </div>
  );
};

export default TestResultPage;
