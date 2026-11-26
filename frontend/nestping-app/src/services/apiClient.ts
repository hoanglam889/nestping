import axios from 'axios';

// Tự động nhận diện domain đang chạy
const hostname = window.location.hostname;

// Nếu deploy lên duckdns thì trỏ về api của duckdns, còn chạy local thì trỏ về cổng 3000 của backend
export const BASE_URL = hostname.includes('duckdns.org')
  ? 'https://nestping-api.duckdns.org' // Domain backend khi deploy (thay theo tên của bạn)
  : `http://${hostname}:3000`;

const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
//  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor (tùy chọn): Tự động gắn Token đăng nhập sau này
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default apiClient;