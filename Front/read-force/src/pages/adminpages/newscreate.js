import React, { useState } from 'react';
import fetchWithAuth from '../../utils/fetchWithAuth';

const AdminNewsCreatePage = () => {
    const [country, setCountry] = useState("kr");
    const [level, setLevel] = useState("중급");
    const [topic, setTopic] = useState("");
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async () => {
        if (!topic.trim()) {
            alert("주제를 입력해주세요.");
            return;
        }

        setLoading(true);
        try {
            const res = await fetchWithAuth("/news/generate-news", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ country, level, topic })
            });

            if (!res.ok) throw new Error("생성 실패");

            const data = await res.json();
            setResult(data);
        } catch (err) {
            alert("뉴스 생성 중 오류 발생");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ padding: "24px" }}>
            <h2>뉴스 기사 생성</h2>

            <div style={{ marginBottom: "16px" }}>
                <label>국가: </label>
                <select value={country} onChange={(e) => setCountry(e.target.value)}>
                    <option value="kr">한국</option>
                    <option value="us">미국</option>
                    <option value="jp">일본</option>
                    <option value="uk">영국</option>
                </select>
            </div>

            <div style={{ marginBottom: "16px" }}>
                <label>난이도: </label>
                <select value={level} onChange={(e) => setLevel(e.target.value)}>
                    <option value="초급">초급</option>
                    <option value="중급">중급</option>
                    <option value="고급">고급</option>
                </select>
            </div>

            <div style={{ marginBottom: "16px" }}>
                <label>주제 키워드: </label>
                <input
                    type="text"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    style={{ width: "300px", padding: "8px" }}
                />
            </div>

            <button onClick={handleSubmit} disabled={loading}>
                {loading ? "생성 중..." : "📄 기사 생성하기"}
            </button>

            {result && (
                <div style={{ marginTop: "32px", borderTop: "1px solid #ccc", paddingTop: "24px" }}>
                    <h3>생성된 기사 미리보기</h3>
                    <p><strong>제목:</strong> {result.title}</p>
                    <p><strong>내용:</strong> {result.content}</p>
                </div>
            )}
        </div>
    );
};

export default AdminNewsCreatePage;