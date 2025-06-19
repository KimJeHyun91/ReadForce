import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import fetchWithAuth from '../../utils/fetchWithAuth';

const AdminNewsListPage = () => {
    const navigate = useNavigate();
    const [newsList, setNewsList] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const nickname = localStorage.getItem("nickname");
        if (nickname !== "관리자") {
            alert("접근 권한이 없습니다.");
            navigate("/");
        }
    }, [navigate]);

    const fetchNews = async () => {
        try {
            const res = await fetchWithAuth("/news/get-news-passage-list-by-country-and-level?country=kr&level=중급");
            if (!res.ok) throw new Error("불러오기 실패");
            const data = await res.json();
            setNewsList(data);
        } catch (err) {
            console.error(err);
            setError("뉴스 기사 불러오기에 실패했습니다.");
        }
    };

    useEffect(() => {
        fetchNews();
    }, []);

    return (
        <div style={{ padding: "24px" }}>
            <button
                onClick={() => navigate("/adminpage")}
                style={{
                    marginBottom: "16px",
                    padding: "8px 16px",
                    backgroundColor: "#6c757d",
                    color: "white",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer"
                }}
            >
                ⬅ 돌아가기
            </button>
            <h2>생성된 뉴스 기사 리스트</h2>
            {error && <p style={{ color: "red" }}>{error}</p>}
            <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "16px" }}>
                <thead>
                    <tr>
                        <th style={{ border: "1px solid #ccc", padding: "8px" }}>제목</th>
                        <th style={{ border: "1px solid #ccc", padding: "8px" }}>난이도</th>
                        <th style={{ border: "1px solid #ccc", padding: "8px" }}>국가</th>
                        <th style={{ border: "1px solid #ccc", padding: "8px" }}>등록일</th>
                    </tr>
                </thead>
                <tbody>
                    {newsList.map((news, idx) => (
                        <tr key={idx}>
                            <td style={{ border: "1px solid #ddd", padding: "8px" }}>{news.title}</td>
                            <td style={{ border: "1px solid #ddd", padding: "8px" }}>{news.level}</td>
                            <td style={{ border: "1px solid #ddd", padding: "8px" }}>{news.country}</td>
                            <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                                {new Date(news.createDate).toLocaleString()}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default AdminNewsListPage;