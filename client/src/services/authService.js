import api from "./api";
import { API_ROUTES } from "../utils/constants";

export const authService = {
  requestOTP: async (email) => {
    const response = await api.post(API_ROUTES.AUTH.REQUEST_OTP, { email });
    return response.data;
  },

  verifyOTP: async (email, otp) => {
    const response = await api.post(API_ROUTES.AUTH.VERIFY_OTP, { email, otp });
    return response.data;
  },

  googleAuth: async (token) => {
    const response = await api.post(API_ROUTES.AUTH.GOOGLE, { token });
    return response.data;
  },
};
