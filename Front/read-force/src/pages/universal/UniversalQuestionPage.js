import React, { useEffect, useState } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import "./css/UniversalQuestionPage.css";
import fetchWithAuth from "../../utils/fetchWithAuth";
import clockImg from "../../assets/image/clock.png";
import axiosInstance from "../../api/axiosInstance";

const UniversalQuestionPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [quizList, setQuizList] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selected, setSelected] = useState(null);
  const [passage, setPassage] = useState(null);
  const [error, setError] = useState(null);
  const [answers, setAnswers] = useState([]);

  const [startTime, setStartTime] = useState(Date.now());
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [isWaiting, setIsWaiting] = useState(true);

  const currentQuiz = quizList[currentIndex];

  const formatTime = (seconds) => {
    const m = String(Math.floor(seconds / 60)).padStart(2, "0");
    const s = String(seconds % 60).padStart(2, "0");
    return `${m}:${s}`;
  };

  useEffect(() => {
    const newStart = Date.now();
    setStartTime(newStart);
    setElapsedSeconds(0);
    setIsWaiting(true);
    setSelected(null);

    const timer = setInterval(() => {
      const secondsPassed = Math.floor((Date.now() - newStart) / 1000);
      setElapsedSeconds(secondsPassed);
    }, 1000);

    const waitTimer = setTimeout(() => {
      setIsWaiting(false);
    }, 10000);

    return () => {
      clearInterval(timer);
      clearTimeout(waitTimer);
    };
  }, [currentIndex]);

  useEffect(() => {
    const loadedPassage = location.state?.passage || {
      passageNo: Number(id),
      title: "",
      summary: "",
      content: "",
      language: "한국어",
    };

    if (!loadedPassage.passageNo) {
      setError("뉴스 또는 퀴즈 정보를 불러오지 못했습니다.");
      return;
    }

    setPassage(loadedPassage);

    axiosInstance
      .get(
        `/multiple_choice/get-multiple-choice-question-list?passageNo=${loadedPassage.passageNo}`
      )
      .then((res) => {
        setQuizList(res.data);
      })
      .catch(() => {
        setError("퀴즈 로딩 중 오류 발생");
      });
  }, [id, location.state]);

  const handleNext = async () => {
    if (selected === null) return;

    const solvingTime = Math.floor((Date.now() - startTime) / 1000);

    try {
      await axiosInstance.post("/learning/save-multiple-choice", {
        questionNo: currentQuiz.questionNo,
        selectedIndex: selected,
        questionSolvingTime: solvingTime,
        isFavorit: false,
      });
    } catch (err) {
      alert("답안 저장 중 오류가 발생했습니다. 다시 시도해주세요.");
      return;
    }

    const updatedAnswers = [
      ...answers,
      {
        questionNo: currentQuiz.questionNo,
        selectedIndex: selected,
        questionSolvingTime: solvingTime,
      },
    ];

    setAnswers(updatedAnswers);

    if (currentIndex < quizList.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      const categoryPath =
        passage.category === "NEWS"
          ? "article"
          : passage.category === "NOVEL"
          ? "novel"
          : "fairytale";

      navigate(`/${categoryPath}/result`, {
        state: {
          passage,
          total: updatedAnswers.length,
          answers: updatedAnswers,
          quizList,
          category: passage.category,
        },
      });
    }
  };

  if (error) return <div className="PassageQuestion-container">{error}</div>;
  if (!passage || quizList.length === 0 || !currentQuiz)
    return <div className="PassageQuestion-container">로딩 중...</div>;

  return (
    <div className="page-container quiz-layout">
      <div className="quiz-passage">
        <h3 className="passage-title">{passage.title}</h3>
        <p className="passage-text">{passage.summary}</p>
        <p className="passage-text">{passage.content}</p>
      </div>

      <div className="quiz-box">
        <div className="quiz-header">
          <h4 className="question-heading">💡 문제 {currentIndex + 1}</h4>
          <div className="quiz-timer">
            <img src={clockImg} alt="clock" className="clock-icon" />
            {formatTime(elapsedSeconds)}
          </div>
        </div>

        <div className="quiz-content">
          <p className="question-text">{currentQuiz.question}</p>

          {isWaiting && (
            <div className="wait-message">
              ⏳ 선택은 {Math.max(0, 10 - elapsedSeconds)}초 후에 가능합니다.
            </div>
          )}

          <div className="quiz-options">
            {currentQuiz.choiceList.map((choice, idx) => (
              <button
                key={idx}
                className={`quiz-option ${selected === idx ? "selected" : ""}`}
                disabled={isWaiting}
                onClick={() => setSelected(idx)}
              >
                {String.fromCharCode(65 + idx)}.{" "}
                {choice.content.replace(/^[A-Z]\.\s*/, "")}
              </button>
            ))}
          </div>
        </div>

        <div className="quiz-button-container">
          <button
            className="submit-button"
            disabled={selected === null}
            onClick={handleNext}
          >
            {currentIndex < quizList.length - 1 ? "다음 문제" : "제출"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UniversalQuestionPage;
