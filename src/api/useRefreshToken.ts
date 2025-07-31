import axiosInstance from "@/lib/axios";
import { useMutation } from "@tanstack/react-query";
import Cookies from "js-cookie";

const useRefreshToken = () => {
    return useMutation({
        mutationFn: async () => {
            const refreshToken = Cookies.get("refreshToken");

            if (!refreshToken) {
                throw new Error("No refresh token available");
            }

            const path = '/api/auth/refresh-token';
            const res = await axiosInstance.post(path, {
                refreshToken,
            });

            if (res.data.success) {
                const { token, refreshToken: newRefreshToken } = res.data.data;

                // Lưu token mới
                Cookies.set("accessToken", token, {
                    expires: 1, // 1 ngày
                    path: '/',
                    sameSite: 'strict'
                });

                Cookies.set("refreshToken", newRefreshToken, {
                    expires: 7, // 7 ngày
                    path: '/',
                    sameSite: 'strict'
                });

                return {
                    token,
                    refreshToken: newRefreshToken,
                    user: res.data.data.user,
                };
            }

            throw new Error("Failed to refresh token");
        },
    });
};

export default useRefreshToken; 