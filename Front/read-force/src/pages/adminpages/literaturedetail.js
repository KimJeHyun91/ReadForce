import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import fetchWithAuth from '../../utils/fetchWithAuth';

const LiteratureDetail = () => {
    const { id } = useParams();
    const [literature, setLiterature] = useState(null);

    useEffect(() => {
        const fetchDetail = async () => {
            try {
                const res = await fetchWithAuth(`/admin/literature?id=${id}`);
                const data = await res.json();
                setLiterature(data);
            } catch (err) {
                console.error("문학 상세 불러오기 실패", err);
            }
        };
        fetchDetail();
    }, [id]);

    if (!literature) return <div>로딩 중...</div>;

    return (
        <div style={{ padding: "24px" }}>
            <h2>{literature.title}</h2>
            <p><strong>작성일:</strong> {new Date(literature.created_date).toLocaleDateString()}</p>
            <p><strong>번호:</strong> {literature.literature_no}</p>
            {/* 추후 문학 단락, 퀴즈 등 여기에 이어 붙이면 됨 */}
        </div>
    );
};

export default LiteratureDetail;