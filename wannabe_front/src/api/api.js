import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { API_URL } from "./url";

const api = axios.create({
    baseURL: API_URL
});

api.interceptors.request.use(
    (config) => {
        return config;
    },
    (err) => {
        return Promise.reject(err);
    }
)

api.interceptors.response.use(
    (response) => {
        const res = response.data;
        if (res.code === 200) {
            return res;
        }
    },
    (err) => {
        return useRefreshHandler(err)
    }
);

const useRefreshHandler = async (error) => {
    const originalReq = error.config;
    if (error.response.status !== 403) {
        return Promise.reject(error);
    } else {
        // accessToken으로 검증 요청 API
        const res = await axios.post(`${API_URL}/auth/refresh`,{
                accessToken: localStorage.getItem('token')
        });
        if (res.status === 200) {
            localStorage.setItem('token', res.data.accessResult);
            originalReq.headers.Authorization = res.data.accessResult;
            return api(originalReq);
        }
    }
}

export default api;
