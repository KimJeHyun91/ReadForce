import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import fetchWithAuth from '../../utils/fetchWithAuth';
import './adminpage.css';

const LiteraturePage = () => {
    const navigate = useNavigate();
    const [literatures, setLiteratures] = useState([]);
    const fetchLiterature = async () => {
        try {
            const res = await fetchWithAuth("/admin/literature-list");
            const data = await res.json();
            setLiteratures(data);
        } catch (err) {
            console.error("문학 목록 불러오기 실패", err);
        }
    };

    useEffect(() => {
        fetchLiterature();
    }, []);

    const handleDelete = async (id) => {
        if (!window.confirm("정말 삭제하시겠습니까?")) return;
        try {
            const res = await fetchWithAuth(`/admin/literature-delete?id=${id}`, {
                method: "DELETE",
            });
            if (res.ok) fetchLiterature();
        } catch (err) {
            console.error("문학 삭제 실패", err);
        }
    };

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
            <h2>문학 관리</h2>
            <table className='literatureTable' style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                    <tr>
                        <th>번호</th>
                        <th>제목</th>
                        <th>유형</th>
                        <th>생성일</th>
                        <th>관리</th>
                    </tr>
                </thead>
                <tbody>
                    {literatures.map((lit) => (
                        <tr key={lit.literatureNo}>
                            <td>{lit.literatureNo}</td>
                            <td style={{ cursor: "pointer", color: "blue" }}
                                onClick={() => navigate(`/literature/literaturedetail/${lit.literatureNo}`)}
                            >
                                {lit.title}
                            </td>
                            <td>{lit.type}</td>
                            <td>{new Date(lit.createdDate).toLocaleDateString()}</td>
                            <td>
                                <button style={{ color: "red" }} onClick={() => handleDelete(lit.literatureNo)}>삭제</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default LiteraturePage;