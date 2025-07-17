// // fetchWithAuth.js

// let isRefreshing = false; 
// let failedQueue = [];

// const addRequestToQueue = (originalRequest) => {
//   return new Promise(resolve => {
//     failedQueue.push({ originalRequest, resolve });
//   });
// };

// const processQueue = (error, newAccessToken) => {
//   failedQueue.forEach(promise => {
//     if (error) {
//       promise.resolve(Promise.reject(error));
//     } else {
//       const updatedOptions = {
//         ...promise.originalRequest.options,
//         headers: {
//           ...(promise.originalRequest.options.headers || {}),
//           Authorization: `Bearer ${newAccessToken}`,
//         },
//       };
//       promise.resolve(fetch(promise.originalRequest.url, updatedOptions));
//     }
//   });
//   failedQueue = [];
// };

// export const fetchWithAuth = async (url, options = {}) => {
//   const accessToken = localStorage.getItem('token');
//   const refreshToken = localStorage.getItem('refresh_token');

//   if (accessToken) {
//     options.headers = {
//       ...(options.headers || {}),
//       Authorization: `Bearer ${accessToken}`,
//     };
//   }

//   let res = await fetch(url, options);

//   if (res.status === 401 && refreshToken) {
//     if (isRefreshing) {
//       return addRequestToQueue({ url, options });
//     }

//     isRefreshing = true;

//     try {
//       const refreshRes = await fetch(`/authentication/reissue-refresh-token?refreshToken=${refreshToken}`, {
//         method: 'POST',
//       });

//       if (refreshRes.ok) {
//         const data = await refreshRes.json();
//         const newAccessToken = data.ACCESS_TOKEN;
//         const newRefreshToken = data.REFRESH_TOKEN;

//         localStorage.setItem('token', newAccessToken);
//         localStorage.setItem('refresh_token', newRefreshToken);

//         isRefreshing = false;
//         processQueue(null, newAccessToken);

//         const retryOptions = {
//           ...options,
//           headers: {
//             ...(options.headers || {}),
//             Authorization: `Bearer ${newAccessToken}`,
//           },
//         };
//         res = await fetch(url, retryOptions);
//       } else {
//         console.error('❌ RefreshToken 재발급 실패:', refreshRes.status, await refreshRes.text());
//         isRefreshing = false;
//         const error = new Error('RefreshToken 재발급 실패');
//         processQueue(error);
//         localStorage.clear();
//         window.location.href = '/login';
//         throw error;
//       }
//     } catch (refreshError) {
//       console.error('🚨 RefreshToken 재발급 중 예외 발생:', refreshError);
//       isRefreshing = false;
//       processQueue(refreshError);
//       localStorage.clear();
//       window.location.href = '/login';
//       throw refreshError;
//     }
//   } else if (res.status === 401 && !refreshToken) {
//     console.warn('AccessToken 만료. 하지만 RefreshToken이 없습니다. 로그인 페이지로 이동합니다.');
//     localStorage.clear();
//     window.location.href = '/login';
//     throw new Error('인증 토큰 없음. 재로그인 필요.');
//   }

//   return res;
// };

// export const toggleFavoritePassage = async (passageNo, isFavorite) => {
//   try {
//     const res = await fetchWithAuth('/passage/change-favorite-state', {
//       method: 'PATCH',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify({ passageNo, isFavorite }),
//     });

//     if (!res.ok) throw new Error('서버 응답 실패');

//     const data = await res.json();
//     return true;
//   } catch (err) {
//     console.error('❌ 즐겨찾기 변경 실패:', err);
//     return false;
//   }
// };

// export const fetchFavoritePassageList = async () => {
//   const res = await fetchWithAuth('/passage/get-favorite-passage-list');
//   if (!res.ok) throw new Error('즐겨찾기 목록 실패');
//   return res.json();              // [passageNo, passageNo ...]
// };

// export default fetchWithAuth;