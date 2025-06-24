import "./main.css";
import React, { useState, useEffect, useRef, useMemo } from "react";
import mainImage from "../assets/image/mainimage.png";
import slide2Image from "../assets/image/slide2.png";
import api from "../api/axiosInstance";
import { useNavigate } from "react-router-dom";

const Main = () => {
  const [slideIndex, setSlideIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState("KOREAN");
  const [top5Data, setTop5Data] = useState([]);
  const navigate = useNavigate();
  const debounceRef = useRef(null);

  const slides = useMemo(() => [
    {
      image: mainImage,
      title: (
        <>
          문해<span style={{ color: "#439395" }}>력</span>,<br />
          세상을 읽는 힘입니다
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
          AI 추천 콘텐츠와 함께<br />
          문해력을 성장시키세요
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
        const res = await api.get(`/ranking/get-news-ranking?language=${selectedLanguage}`);
        setTop5Data(res.data.slice(0, 5));
      } catch (err) {
        console.error("Top5 fetch error", err);
        setTop5Data([]);
      }
    }, 600);
    return () => clearTimeout(debounceRef.current);
  }, [selectedLanguage]);

  const handleButtonClick = () => {
    if (!currentSlide.buttonLink) return;
    currentSlide.buttonLink.startsWith("http")
      ? window.open(currentSlide.buttonLink, "_blank")
      : navigate(currentSlide.buttonLink);
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

          <button
            className="slide-arrow left"
            onClick={() =>
              setSlideIndex((prev) => (prev - 1 + slides.length) % slides.length)
            }
          >
            ⮜
          </button>

          <button
            className="slide-arrow right"
            onClick={() =>
              setSlideIndex((prev) => (prev + 1) % slides.length)
            }
          >
            ⮞
          </button>

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
            <h3>🏆 <span className="bold">주간 Top 5</span></h3>
            <div className="tabs">
              {["KOREAN", "JAPANESE", "ENGLISH"].map((lang) => (
                <button
                  key={lang}
                  className={selectedLanguage === lang ? "active" : ""}
                  onClick={() => setSelectedLanguage(lang)}
                >
                  {lang === "KOREAN" ? "한국" : lang === "JAPANESE" ? "일본" : "미국"}
                </button>
              ))}
            </div>
            <table className="top5-table">
              <tbody>
                {top5Data.map((user, idx) => {
                  const rankClass = idx === 0 ? "gold" : idx === 1 ? "silver" : idx === 2 ? "bronze" : "";
                  const scoreKey = `${selectedLanguage.toLowerCase()}_news`;
                  return (
                    <tr key={user.nickname}>
                      <td className={`rank-number ${rankClass}`}>{idx + 1}</td>
                      <td>{user.nickname}</td>
                      <td className={`point ${rankClass}`}>{user[scoreKey] ?? 0}p</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="stat-box wrong-articles">
            <h3>가장 많이 틀린 기사</h3>
            <div className="article">
              <div className="flag">🇯🇵</div>
              <div>
                <div className="title">福島：花の癒し力</div>
                <div className="author">Ueno Yamamoto<br /><span className="sub">NHK World</span></div>
              </div>
            </div>
            <div className="article">
              <div className="flag">🇺🇸</div>
              <div>
                <div className="title">How 'big, beautiful' bill led to big ugly breakup for Trump and Musk</div>
                <div className="author">Anthony Zurcher<br /><span className="sub">North America Correspondent</span></div>
              </div>
            </div>
            <div className="article">
              <div className="flag">🇰🇷</div>
              <div>
                <div className="title">성남·경기도 라인 ‘7인회’ 대통령실 속속 합류</div>
                <div className="author">송경모 기자<br /><span className="sub">국민일보</span></div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Main;
