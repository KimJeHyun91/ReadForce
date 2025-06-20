import React, { useState } from 'react';
import './css/ArticleQuestionPage.css';
import { useNavigate, useLocation } from 'react-router-dom';

const dummyArticle = {
  id: 1,
  title: '후 대통령, 트럼프 첫 통화...무슨 얘기 나눴나',
  summary: 'CBS노컷뉴스 이한형 기자 | 2025-06-06 23:52',
  content: `2025년 6월 6일, 이재명 대통령은 미국의 도널드 트럼프 대통령과 첫 전화 통화를 진행했다. 이 통화는 약 20분간 이어졌으며, 주요 현안에 대한 논의가 있었다.2025년 6월 6일, 이재명 대통령은 미국의 도널드 트럼프 대통령과 첫 전화 통화를 진행했다. 이 통화는 약 20분간 이어졌으며, 주요 현안에 대한 논의가 있었다.2025년 6월 6일, 이재명 대통령은 미국의 도널드 트럼프 대통령과 첫 전화 통화를 진행했다. 이 통화는 약 20분간 이어졌으며, 주요 현안에 대한 논의가 있었다.2025년 6월 6일, 이재명 대통령은 미국의 도널드 트럼프 대통령과 첫 전화 통화를 진행했다. 이 통화는 약 20분간 이어졌으며, 주요 현안에 대한 논의가 있었다.2025년 6월 6일, 이재명 대통령은 미국의 도널드 트럼프 대통령과 첫 전화 통화를 진행했다. 이 통화는 약 20분간 이어졌으며, 주요 현안에 대한 논의가 있었다.2025년 6월 6일, 이재명 대통령은 미국의 도널드 트럼프 대통령과 첫 전화 통화를 진행했다. 이 통화는 약 20분간 이어졌으며, 주요 현안에 대한 논의가 있었다.2025년 6월 6일, 이재명 대통령은 미국의 도널드 트럼프 대통령과 첫 전화 통화를 진행했다. 이 통화는 약 20분간 이어졌으며, 주요 현안에 대한 논의가 있었다.2025년 6월 6일, 이재명 대통령은 미국의 도널드 트럼프 대통령과 첫 전화 통화를 진행했다. 이 통화는 약 20분간 이어졌으며, 주요 현안에 대한 논의가 있었다.2025년 6월 6일, 이재명 대통령은 미국의 도널드 트럼프 대통령과 첫 전화 통화를 진행했다. 이 통화는 약 20분간 이어졌으며, 주요 현안에 대한 논의가 있었다.2025년 6월 6일, 이재명 대통령은 미국의 도널드 트럼프 대통령과 첫 전화 통화를 진행했다. 이 통화는 약 20분간 이어졌으며, 주요 현안에 대한 논의가 있었다.2025년 6월 6일, 이재명 대통령은 미국의 도널드 트럼프 대통령과 첫 전화 통화를 진행했다. 이 통화는 약 20분간 이어졌으며, 주요 현안에 대한 논의가 있었다.`,
  sourceUrl: '#',
  question: '이재명 대통령과 도널드 트럼프 미국 대통령은 언제 처음으로 통화를 했나요? 이재명 대통령과 도널드 트럼프 미국 대통령은 언제 처음으로 통화를 했나요?',
  options: ['2025년 6월 6일', '2025년 6월 7일', '2025년 6월 5일', '2025년 6월 8일'],
  answer: '2025년 6월 6일',
  explanation: '기사에 따르면, 이재명 대통령은 6월 6일 오후 10시부터 약 20분간 트럼프 대통령과 첫 통화를 가졌다고 명시되어 있습니다.',
};

const ArticleQuestionPage = () => {
  const [selected, setSelected] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  const article = location.state?.article || dummyArticle;
  const language = location.state?.language || '한국어';

   const handleSubmit = () => {
    if (selected) {
      navigate('/question-result', {
        state: {
          isCorrect: selected === article.answer,
          explanation: article.explanation,
          language: language,
        }
      });
    }
  };

  return (
    <div className="page-container article-question-layout">
      <div className="article-box">
        <h3 className="article-title">{article.title}</h3>
        <p className="article-summary">{article.summary}</p>
        <p className="article-content">{article.content}</p>
      </div>

      <div className="quiz-box">
        <h4 className="quiz-title">💡 문제</h4>
        <p className="quiz-question">{article.question}</p>
        <div className="quiz-options">
          {article.options.map((opt, idx) => (
            <button
              key={idx}
              className={`quiz-option ${selected === opt ? 'selected' : ''}`}
              onClick={() => setSelected(opt)}
            >
              {String.fromCharCode(65 + idx)}. {opt}
            </button>
          ))}
        </div>

        <div className="quiz-button-container">
          <button className="submit-button" disabled={!selected} onClick={handleSubmit}>
            정답 제출
          </button>
        </div>
      </div>
    </div>
  );
};

export default ArticleQuestionPage;
