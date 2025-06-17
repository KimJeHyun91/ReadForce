import './header.css';
import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";

const Header = () => {
  const [showLangMenu, setShowLangMenu] = useState(false);
  const [selectedLang, setSelectedLang] = useState('한국어');
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [nickname, setNickname] = useState('');
  const [hoveredMenu, setHoveredMenu] = useState(null);
  const navigate = useNavigate();

  const isLoggedIn = !!localStorage.getItem("token");

  useEffect(() => {
    if (isLoggedIn) {
      const storedNickname = localStorage.getItem("nickname");
      setNickname(storedNickname || "사용자");
    }
  }, [isLoggedIn]);

  const handleLangSelect = (lang) => {
    setSelectedLang(lang);
    setShowLangMenu(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("nickname");
    setShowUserMenu(false);
    navigate("/");
  };

  return (
    <header className="header">
      <div className="container header-inner">
        <div className="header-left">
          <h1 className="title">
            <a href="/" style={{ textDecoration: 'none', color: 'inherit' }}>
              리드 <span style={{ color: "#439395" }}>포스</span>
            </a>
          </h1>
        </div>

        <div className="header-center">
          <nav className="nav">
            <div
              className="menu-wrapper"
              onMouseEnter={() => setHoveredMenu('article')}
              onMouseLeave={() => setHoveredMenu(null)}
            >
              <div className="nav-item">기사 콘텐츠</div>
              {hoveredMenu === 'article' && (
                <div className="mega-menu">
                  <Link to="/korea">한국기사</Link>
                  <Link to="/japan">일본기사</Link>
                  <Link to="/usa">미국기사</Link>
                </div>
              )}
            </div>

            <div
              className="menu-wrapper"
              onMouseEnter={() => setHoveredMenu('literature')}
              onMouseLeave={() => setHoveredMenu(null)}
            >
              <div className="nav-item">문학 작품</div>
              {hoveredMenu === 'literature' && (
                <div className="mega-menu">
                  <Link to="/classic">고전소설</Link>
                  <Link to="/poetry">시/한시</Link>
                  <Link to="/fairy">동화/우화</Link>
                  <Link to="/folk">민담/설화</Link>
                </div>
              )}
            </div>

            <Link to="/challenge" className="nav-item">문해력 도전</Link>
            <Link to="/community" className="nav-item">커뮤니티</Link>
          </nav>
        </div>

        <div className="header-right auth-buttons">
          <div className="lang-selector">
            <button
              className="lang-button"
              onClick={() => setShowLangMenu(!showLangMenu)}
            >
              {selectedLang} ▼
            </button>
            {showLangMenu && (
              <div className="lang-menu">
                <div onClick={() => handleLangSelect('한국어')}>🇰🇷 한국어</div>
                <div onClick={() => handleLangSelect('日本語')}>🇯🇵 日本語</div>
                <div onClick={() => handleLangSelect('English')}>🇺🇸 English</div>
              </div>
            )}
          </div>

          {isLoggedIn ? (
            <div className="user-menu-wrapper">
              <button className="nickname-button" onClick={() => setShowUserMenu(!showUserMenu)}>
                <span>{nickname}</span>
                <span style={{ color: '#0d9488' }}>님 ▼</span>
              </button>
              {showUserMenu && (
                <div className="user-dropdown">
                  <div onClick={() => { setShowUserMenu(false); navigate("/mypage"); }}>마이페이지</div>
                  {/* 관리자 전용 메뉴 */}
                  {nickname === "관리자" && (
                    <div onClick={() => { setShowUserMenu(false); navigate("/adminpage"); }}>
                      관리자 페이지
                    </div>
                  )}

                  <div onClick={handleLogout}>로그아웃</div>
                </div>
              )}
            </div>
          ) : (
            <>
              <button onClick={() => navigate("/login")}>로그인</button>
              <button onClick={() => navigate("/signup/signupchoice")}>회원가입</button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
