import "./main.css";
import React, { useState, useEffect, useRef, useMemo } from "react";
import mainImage from "../assets/image/mainimage.png";
import slide2Image from "../assets/image/slide2.png";
import api from "../api/axiosInstance";
import { useNavigate } from "react-router-dom";

const Main = () => {
  const [slideIndex, setSlideIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("NEWS");
  const [top5Data, setTop5Data] = useState([]);
  const [wrongArticles, setWrongArticles] = useState([]);
  const navigate = useNavigate();
  const debounceRef = useRef(null);

  const slides = useMemo(() => [
    {
      image: mainImage,
      title: (
        <>
          문해<span style={{ color: "#439395" }}>력</span>,<br />
          세상을 읽는 <span style={{ color: "#439395" }}>힘</span>입니다
        </>
      ),
      description: "한국·일본·미국 뉴스로 나의 문해력을 테스트 해보세요!",
      buttonText: "문해력 테스트 시작하기",
      buttonLink: "/test-start",
    },
    {
      image: slide2Image,
      title: (
        <>
          <span style={{ color: "#264053" }}>AI</span> 추천 콘텐츠와 함께<br />
          문해<span style={{ color: "#264053" }}>력</span>을 성장시키세요
        </>
      ),
      description: "국내 베스트셀러 1위 //누적 30만부 돌파!!",
      buttonText: "책 구매하러가기",
      buttonLink: "https://www.kyobobook.co.kr/",
    },
  ], []);

  const currentSlide = slides[slideIndex];

  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setSlideIndex((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [isPaused, slides]);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      try {
        const [rankingRes, wrongRes] = await Promise.all([
          api.get(`/ranking/get-ranking-list?category=${selectedCategory}&language=KOREAN`),
          api.get(`/learning/get-most-incorrect-passages?language=KOREAN&number=5`), // ✅ 수정된 API
        ]);
        setTop5Data(rankingRes.data.slice(0, 5));
        setWrongArticles(wrongRes.data);
      } catch (err) {

        setTop5Data([]);
        setWrongArticles([]);
      }
    }, 600);
    return () => clearTimeout(debounceRef.current);
  }, [selectedCategory]);

  const handleButtonClick = () => {
    if (!currentSlide.buttonLink) return;
    currentSlide.buttonLink.startsWith("http")
      ? window.open(currentSlide.buttonLink, "_blank")
      : navigate(currentSlide.buttonLink);
  };

  const handleQuizClick = (passage) => {
    if (!passage || !passage.passageNo) return;
    navigate(`/questionpage/${passage.passageNo}`, {
      state: {
        passage: {
          passageNo: passage.passageNo,
          title: passage.title ?? '',
          content: passage.content ?? '',
          author: passage.author ?? '',
          language: passage.language ?? 'KOREAN',
          category: passage.category ?? 'NEWS',
        },
      },
    });
  };

  return (
    <div>
      <section className="hero-fullwidth">
        <div className="hero-overlay">
          <div className="hero-inner">
            <div className="hero-text">
              <h2>{currentSlide.title}</h2>
              <p>{currentSlide.description}</p>
              {currentSlide.buttonText && (
                <button onClick={handleButtonClick}>
                  {currentSlide.buttonText}
                </button>
              )}
            </div>
            <div className="hero-image">
              <img src={currentSlide.image} alt="슬라이드 이미지" />
            </div>
          </div>
          <div className="slide-dots">{slides.map((_, i) => (<div key={i} className={`slide-dot ${slideIndex === i ? "active" : ""}`}onClick={() => setSlideIndex(i)}/>))}</div>
          <div className="slide-ui">
            <button onClick={() => setIsPaused((prev) => !prev)}>
              {isPaused ? "▶" : "⏸"}
            </button>
            <span>{String(slideIndex + 1).padStart(2, "0")} / {String(slides.length).padStart(2, "0")}</span>
          </div>
        </div>
      </section>

      <section className="stats-section">
        <div className="page-container stat-container">
          <div className="stat-box top5">
            <div className="top5-header-row">
              <h3>🏆 <span className="bold">주간 Top 5</span></h3>
              <button className="ranking-more-btn" onClick={() => navigate('/ranking')}>전체보기</button>
            </div>

            <div className="tabs">
              {["NEWS", "NOVEL", "FAIRY_TALE"].map((cat) => (
                <button
                  key={cat}
                  className={selectedCategory === cat ? "active" : ""}
                  onClick={() => setSelectedCategory(cat)}
                >
                  {cat === "NEWS" ? "뉴스" : cat === "NOVEL" ? "소설" : "동화"}
                </button>
              ))}
            </div>

            <table className="top5-table">
              <tbody>
                {top5Data.map((user, idx) => {
                  const rankClass = idx === 0 ? "gold" : idx === 1 ? "silver" : idx === 2 ? "bronze" : "";
                  return (
                    <tr key={user.nickname}>
                      <td className={`rank-number ${rankClass}`}>{idx + 1}</td>
                      <td>{user.nickname}</td>
                      <td className={`point ${rankClass}`}>{user.score ?? 0}p</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="stat-box wrong-articles">
            <h3>📉 가장 많이 틀린 지문</h3>
            {Array.isArray(wrongArticles) && wrongArticles.length === 0 ? (
              <p>데이터가 없습니다.</p>
            ) : (
              wrongArticles.map((passage, index) => (
                <div className={`article rank-${index + 1}`} key={index} onClick={() => handleQuizClick(passage)}>
                  <div>
                    <div className="subtitle" title={passage.title}>
                      <strong>{index + 1}위</strong>{" "}
                      {passage.title?.length > 25 ? `${passage.title.slice(0, 25)}...` : passage.title}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Main;