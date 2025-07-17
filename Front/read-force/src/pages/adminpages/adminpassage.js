import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from 'react-router-dom'; // ✅ 추가
import axiosInstance from '../../api/axiosInstance';

const AdminPassage = () => {
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams(); // ✅ 추가

    const [loadingTestPassage, setLoadingTestPassage] = useState(false);
    const [loadingTestQuestion, setLoadingTestQuestion] = useState(false);
    const [loadingPassage, setLoadingPassage] = useState(false);
    const [loadingChallenge, setLoadingChallenge] = useState(false);
    const [passageList, setPassageList] = useState([]);
    const [count, setCount] = useState(1);

    const [showPassageModal, setShowPassageModal] = useState(false);
    const [showUploadModal, setShowUploadModal] = useState(false);

    const [language, setLanguage] = useState("KOREAN");
    const [level, setLevel] = useState(1);
    const [category, setCategory] = useState("NEWS");
    const [type, setType] = useState("ECONOMY");
    const [classification, setClassification] = useState("NORMAL");

    const [newPassage, setNewPassage] = useState({
        title: "",
        content: "",
        author: "",
        language: "KOREAN",
        classification: "NORMAL",
        category: "NEWS",
        type: "ECONOMY",
        level: 1
    });

    // ✅ 필터 상태를 URL 쿼리 기반으로 초기화
    const [filterLanguage, setFilterLanguage] = useState(searchParams.get("language") || "ALL");
    const [filterCategory, setFilterCategory] = useState(searchParams.get("category") || "ALL");
    const [filterLevel, setFilterLevel] = useState(searchParams.get("level") || "ALL");
    const [filterClassification, setFilterClassification] = useState(searchParams.get("classification") || "ALL");

    // ✅ URL 쿼리 동기화
    useEffect(() => {
        setSearchParams({
            language: filterLanguage,
            category: filterCategory,
            level: filterLevel,
            classification: filterClassification
        });
    }, [filterLanguage, filterCategory, filterLevel, filterClassification]);

    const TYPE_OPTIONS = {
        NEWS: [
            { value: "1", label: "정치" },
            { value: "2", label: "경제" },
            { value: "3", label: "사회" },
            { value: "4", label: "문화생활" },
            { value: "5", label: "IT과학" },
            { value: "6", label: "세계" },
            { value: "7", label: "스포츠" },
            { value: "8", label: "연예" }
        ],
        NOVEL: [
            { value: "9", label: "추리" },
            { value: "10", label: "공상과학" },
            { value: "11", label: "판타지" },
            { value: "12", label: "로맨스" },
            { value: "13", label: "역사" },
            { value: "14", label: "모험" },
            { value: "15", label: "스릴러" }
        ],
        FAIRY_TALE: [
            { value: "16", label: "생활" },
            { value: "17", label: "전통" },
            { value: "18", label: "정보" }
        ]
    };

    useEffect(() => {
        const defaultType = TYPE_OPTIONS[category]?.[0]?.value || "";
        setType(defaultType);
    }, [category]);

    useEffect(() => {
        const fetchPassages = async () => {
            try {
                const res = await axiosInstance.get("/passage/get-all-passages");
                setPassageList(res.data);
            } catch (err) {
                console.error("전체 지문 불러오기 실패", err);
            }
        };
        fetchPassages();
    }, []);

    const handleGenerateTestPassage = async () => {
        setLoadingTestPassage(true);
        try {
            const res = await axiosInstance.post("/ai/generate-test-passage?language=KOREAN");
            alert("성공 : " + res.data.message);
        } catch (err) {
            console.error(err);
            alert("실패 : 지문 생성 중 오류");
        } finally {
            setLoadingTestPassage(false);
        }
    };

    const handleGenerateTestQuestion = async () => {
        setLoadingTestQuestion(true);
        try {
            const res = await axiosInstance.post("/ai/generate-test-question?language=KOREAN");
            alert("성공 : " + res.data.message);
        } catch (err) {
            console.error(err);
            alert("실패 : 문제 생성 중 오류");
        } finally {
            setLoadingTestQuestion(false);
        }
    };

    const handleGeneratePassageWithParams = async () => {
        setLoadingPassage(true);
        try {
            await axiosInstance.post("/ai/generate-passage", {
                language, level, category, type, classification, count
            });
            alert("일반 지문 생성 성공!");
            setShowPassageModal(false);
        } catch (err) {
            console.error(err);
            alert("실패 : 지문 생성 오류");
        } finally {
            setLoadingPassage(false);
        }
    };

    const handleUpdateToChallenge = async () => {
        setLoadingChallenge(true);
        try {
            await axiosInstance.post("/challenge/update-to-challenges");
            alert("성공: 챌린지 문제로 전환");
        } catch (err) {
            console.error("오류:", err);
            alert("실패: 챌린지 문제 전환 실패");
        } finally {
            setLoadingChallenge(false);
        }
    };

    const handleDeletePassage = async (passageNo) => {
        if (!window.confirm("정말 삭제하시겠습니까?")) return;
        try {
            await axiosInstance.delete(`/administrator/passage/delete`, { params: { passageNo } });
            alert("삭제 성공");
            setPassageList(prev => prev.filter(p => p.passageNo !== passageNo));
        } catch (err) {
            alert("삭제 실패");
        }
    };

    const handleUploadPassage = async () => {
        try {
            await axiosInstance.post("/administrator/passage/upload-passage", newPassage);
            alert("지문 등록 성공");
            setShowUploadModal(false);
            const refreshed = await axiosInstance.get("/passage/get-all-passages");
            setPassageList(refreshed.data);
        } catch (err) {
            console.error("등록 실패:", err);
            alert("지문 등록 실패");
        }
    };

    // 필터링된 목록
    const filteredPassages = passageList
        .filter(p => filterLanguage === "ALL" || p.language === filterLanguage)
        .filter(p => filterCategory === "ALL" || p.category === filterCategory)
        .filter(p => filterLevel === "ALL" || p.level === parseInt(filterLevel))
        .filter(p => filterClassification === "ALL" || p.classification === filterClassification);

    return (
        <div style={{ padding: "24px" }}>
            <button onClick={() => navigate("/adminpage")} style={backbtn}>뒤로가기</button>

            <div style={ADMIN_PASSAGE_TITLE}>
                <h2>전체 지문 목록</h2>
                <div style={ADMIN_BUTTONS_LIST}>
                    <button style={ADMIN_BUTTONS} onClick={handleGenerateTestPassage} disabled={loadingTestPassage}>
                        {loadingTestPassage ? '생성 중...' : '테스트 지문 생성'}
                    </button>
                    <button style={ADMIN_BUTTONS} onClick={handleGenerateTestQuestion} disabled={loadingTestQuestion}>
                        {loadingTestQuestion ? '생성 중...' : '테스트 문제 생성'}
                    </button>
                    <button style={ADMIN_BUTTONS} onClick={() => setShowPassageModal(true)}>
                        일반 지문 생성
                    </button>
                    <button style={ADMIN_BUTTONS} onClick={handleUpdateToChallenge} disabled={loadingChallenge}>
                        챌린지 문제 변환
                    </button>
                    <button style={ADMIN_BUTTONS_2} onClick={() => setShowUploadModal(true)}>
                        지문 직접 등록
                    </button>
                </div>
            </div>

            <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "16px" }}>
                <thead>
                    <tr>
                        <th style={thStyle}>번호</th>
                        <th style={thStyle}>제목</th>
                        <th style={thStyle}>언어</th>
                        <th style={thStyle}>카테고리</th>
                        <th style={thStyle}>난이도</th>
                        <th style={thStyle}>유형</th>
                        <th style={thStyle}>작성자</th>
                        <th style={thStyle}>삭제</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td></td>
                        <td></td>
                        <td>
                            <select value={filterLanguage} onChange={e => setFilterLanguage(e.target.value)}>
                                <option value="ALL">전체</option>
                                <option value="KOREAN">한국어</option>
                                <option value="ENGLISH">영어</option>
                                <option value="JAPANESE">일본어</option>
                            </select>
                        </td>
                        <td>
                            <select value={filterCategory} onChange={e => setFilterCategory(e.target.value)}>
                                <option value="ALL">전체</option>
                                <option value="NEWS">뉴스</option>
                                <option value="NOVEL">소설</option>
                                <option value="FAIRY_TALE">동화</option>
                                <option value="VOCABULARY">어휘</option>
                                <option value="FACTUAL">사실</option>
                                <option value="INFERENTIAL">추론</option>
                            </select>
                        </td>
                        <td>
                            <select value={filterLevel} onChange={e => setFilterLevel(e.target.value)}>
                                <option value="ALL">전체</option>
                                {[...Array(10)].map((_, i) => (
                                    <option key={i + 1} value={i + 1}>{i + 1}</option>
                                ))}
                            </select>
                        </td>
                        <td>
                            <select value={filterClassification} onChange={e => setFilterClassification(e.target.value)}>
                                <option value="ALL">전체</option>
                                <option value="NORMAL">일반</option>
                                <option value="CHALLENGE">도전</option>
                                <option value="TEST">테스트</option>
                            </select>
                        </td>
                        <td></td>
                        <td></td>
                    </tr>

                    {filteredPassages.map((passage) => (
                        <tr key={passage.passageNo}>
                            <td style={tdStyle}>{passage.passageNo}</td>
                            <td style={tdStyle}>
                                <span style={{ color: "blue", cursor: "pointer" }}
                                    onClick={() => navigate(`/adminpage/passage/${passage.passageNo}`, { state: { passage } })}>
                                    {passage.title}
                                </span>
                            </td>
                            <td style={tdStyle}>{LANGUAGE_LABELS[passage.language]}</td>
                            <td style={tdStyle}>{CATEGORY_LABELS[passage.category]}</td>
                            <td style={tdStyle}>{passage.level}</td>
                            <td style={tdStyle}>{CLASSIFICATION_LABELS[passage.classification]}</td>
                            <td style={tdStyle}>{AUTHOR_LABELS[passage.author] || passage.author}</td>
                            <td style={tdStyle}>
                                <button onClick={() => handleDeletePassage(passage.passageNo)}
                                    style={{ color: "red", border: "none", background: "none", cursor: "pointer" }}>
                                    삭제
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

// ✅ 아래는 상수 정의들
const thStyle = { border: "1px solid #ccc", padding: "8px", backgroundColor: "#f2f2f2" };
const tdStyle = { border: "1px solid #ddd", padding: "8px" };
const backbtn = { marginBottom: "16px", padding: "8px 16px", backgroundColor: "#6c757d", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" };
const ADMIN_PASSAGE_TITLE = { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" };
const ADMIN_BUTTONS_LIST = { display: "flex", gap: "8px" };
const ADMIN_BUTTONS = { padding: "8px 16px", backgroundColor: "#007BFF", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" };
const ADMIN_BUTTONS_2 = { ...ADMIN_BUTTONS, backgroundColor: "red" };

const LANGUAGE_LABELS = { KOREAN: "ko", JAPANESE: "jp", ENGLISH: "en" };
const AUTHOR_LABELS = { GEMINI: "ai" };
const CATEGORY_LABELS = {
    NEWS: "뉴스", NOVEL: "소설", FAIRY_TALE: "동화",
    VOCABULARY: "어휘", FACTUAL: "사실", INFERENTIAL: "추론"
};
const CLASSIFICATION_LABELS = {
    NORMAL: "일반문제", CHALLENGE: "도전문제", TEST: "테스트문제"
};

export default AdminPassage;
