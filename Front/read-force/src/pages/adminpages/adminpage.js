import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import fetchWithAuth from '../../utils/fetchWithAuth';
import './adminpage.css';

const AdminPage = () => {
    const navigate = useNavigate();
    const [users, setUsers] = useState([]);

    useEffect(() => {
        const nickname = localStorage.getItem("nickname");
        if (nickname !== "관리자") {
            alert("접근 권한이 없습니다.");
            navigate("/");
        }
    }, []);

    const fetchUsers = async () => {
        try {
            const res = await fetchWithAuth("/admin/get-all-member-list");
            if (!res.ok) throw new Error("권한 없음 또는 토큰 문제");

            const data = await res.json();

            // 출석일 수 병렬 요청
            const usersWithAttendance = await Promise.all(
                data.map(async (user) => {
                    try {
                        const countRes = await fetchWithAuth(`/admin/get-attendance-count?email=${user.email}`);
                        const countData = await countRes.json();
                        return { ...user, attendanceCount: countData.count ?? 0 };
                    } catch {
                        return { ...user, attendanceCount: 0 };
                    }
                })
            );

            setUsers(usersWithAttendance);
        } catch (error) {
            console.error("회원 목록 불러오기 실패", error);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const updateUserStatus = (email, newStatus) => {
        setUsers((prev) =>
            prev.map((user) =>
                user.email === email ? { ...user, status: newStatus } : user
            )
        );
    };

    const handleDeactivate = async (email) => {
        try {
            const res = await fetchWithAuth(`/admin/deactivate-member?email=${email}`, { method: "PATCH" });
            if (!res.ok) throw new Error("비활성화 실패");
            updateUserStatus(email, "PENDING_DELETION");
        } catch (err) {
            console.error(err);
            alert("계정 비활성화 실패");
        }
    };

    const handleActivate = async (email) => {
        try {
            const res = await fetchWithAuth(`/admin/activate-member?email=${email}`, { method: "PATCH" });
            if (!res.ok) throw new Error("활성화 실패");
            updateUserStatus(email, "ACTIVE");
        } catch (err) {
            console.error(err);
            alert("계정 활성화 실패");
        }
    };

    return (
        <div style={{ padding: "24px" }}>
            <span className='admbtns'>
                <button onClick={() => navigate("/newscreate")}>뉴스 기사 생성</button>
                <button onClick={() => navigate("/AdminNewsListPage")}>뉴스 기사 목록</button>
                <button onClick={() => navigate('/literature')}>문학 관리</button>
            </span>
            <h2>회원 목록</h2>
            <table className='membertable' style={{ width: "100%", borderCollapse: "collapse", marginTop: "16px" }}>
                <thead>
                    <tr>
                        <th>닉네임</th>
                        <th>이메일</th>
                        <th>가입일</th>
                        <th>출석일 수</th>
                        <th>상태</th>
                        <th>관리</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((user) => (
                        <tr key={user.email}>
                            <td>{user.nickname}</td>
                            <td>{user.email}</td>
                            <td>{new Date(user.createDate).toLocaleDateString()}</td>
                            <td>{user.attendanceCount}</td>
                            <td>{user.status}</td>
                            <td>
                                {user.nickname !== "관리자" && (
                                    user.status === "PENDING_DELETION" ? (
                                        <button onClick={() => handleActivate(user.email)} style={{ color: "green" }}>
                                            계정 활성화
                                        </button>
                                    ) : (
                                        <button onClick={() => handleDeactivate(user.email)} style={{ color: "red" }}>
                                            계정 비활성화
                                        </button>
                                    )
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default AdminPage;