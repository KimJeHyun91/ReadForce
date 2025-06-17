import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import fetchWithAuth from '../../utils/fetchWithAuth';

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
            const res = await fetchWithAuth("/member/get-all-members");
            if (!res.ok) throw new Error("권한 없음 또는 토큰 문제");

            const data = await res.json();

            // 출석일 수 병렬 요청
            const usersWithAttendance = await Promise.all(
                data.map(async (user) => {
                    try {
                        const countRes = await fetchWithAuth(`/member/get-attendance-count?email=${user.email}`);
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
            const res = await fetchWithAuth(`/member/deactivate-member?email=${email}`, { method: "PATCH" });
            if (!res.ok) throw new Error("비활성화 실패");
            updateUserStatus(email, "PENDING_DELETION");
        } catch (err) {
            console.error(err);
            alert("계정 비활성화 실패");
        }
    };

    const handleActivate = async (email) => {
        try {
            const res = await fetchWithAuth(`/member/activate-member?email=${email}`, { method: "PATCH" });
            if (!res.ok) throw new Error("활성화 실패");
            updateUserStatus(email, "ACTIVE");
        } catch (err) {
            console.error(err);
            alert("계정 활성화 실패");
        }
    };

    return (
        <div style={{ padding: "24px" }}>
            <h2>회원 목록</h2>
            <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "16px" }}>
                <thead>
                    <tr>
                        <th style={{ border: "1px solid #ccc", padding: "8px" }}>닉네임</th>
                        <th style={{ border: "1px solid #ccc", padding: "8px" }}>이메일</th>
                        <th style={{ border: "1px solid #ccc", padding: "8px" }}>가입일</th>
                        <th style={{ border: "1px solid #ccc", padding: "8px" }}>출석일 수</th>
                        <th style={{ border: "1px solid #ccc", padding: "8px" }}>상태</th>
                        <th style={{ border: "1px solid #ccc", padding: "8px" }}>관리</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((user) => (
                        <tr key={user.email}>
                            <td style={{ border: "1px solid #ddd", padding: "8px" }}>{user.nickname}</td>
                            <td style={{ border: "1px solid #ddd", padding: "8px" }}>{user.email}</td>
                            <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                                {new Date(user.createDate).toLocaleDateString()}
                            </td>
                            <td style={{ border: "1px solid #ddd", padding: "8px" }}>{user.attendanceCount}</td>
                            <td style={{ border: "1px solid #ddd", padding: "8px" }}>{user.status}</td>
                            <td style={{ border: "1px solid #ddd", padding: "8px" }}>
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