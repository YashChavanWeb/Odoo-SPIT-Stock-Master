// AuthContext.js (Conceptual Implementation)
import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

// Get API base URL from environment variables
// Assuming import.meta.env.API_BASE_URL is defined somewhere accessible, 
// or you use a fallback like VITE_API_BASE_URL or a fixed URL.
const API_BASE_URL = `${import.meta.env.API_BASE_URL || 'http://localhost:3000'}/api/v1/auth`;

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  // ... (Existing state: user, loading, etc.)
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  // --- Helper Functions (setAuthData, logout remain the same) ---
  const setAuthData = (token, loginId, role) => {
    localStorage.setItem('authToken', token);
    setUser({ loginId, role, isAuthenticated: true });
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    setUser(null);
    delete axios.defaults.headers.common['Authorization'];
  };

  // ... (Existing login, signup functions) ...

  // --- Forgot Password/Reset Password Functions ---

  /**
   * Step 1: Sends OTP to the provided email.
   */
  const sendOTP = async ({ email }) => {
    setLoading(true);
    try {
      const response = await axios.post(`${API_BASE_URL}/forgot-password`, { email });
      return { success: true, message: response.data.message };
    } catch (error) {
      console.error("Send OTP Error:", error.response?.data?.message || error.message);
      return {
        success: false,
        message: error.response?.data?.message || 'Email not found or server error.'
      };
    } finally {
      setLoading(false);
    }
  };

  /**
   * Step 2: Verifies the OTP sent to the email.
   */
  const verifyOTP = async ({ email, otp }) => {
    setLoading(true);
    try {
      const response = await axios.post(`${API_BASE_URL}/verify-otp`, { email, otp });
      return { success: true, message: response.data.message };
    } catch (error) {
      console.error("Verify OTP Error:", error.response?.data?.message || error.message);
      return {
        success: false,
        message: error.response?.data?.message || 'Invalid or expired OTP.'
      };
    } finally {
      setLoading(false);
    }
  };

  /**
   * Step 3: Resets the password after successful OTP verification.
   */
  const resetPassword = async ({ email, newPassword }) => {
    setLoading(true);
    try {
      const response = await axios.post(`${API_BASE_URL}/reset-password`, {
        email,
        newPassword // Backend expects 'newPassword'
      });
      return { success: true, message: response.data.message };
    } catch (error) {
      console.error("Reset Password Error:", error.response?.data?.message || error.message);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to update password.'
      };
    } finally {
      setLoading(false);
    }
  };

  // ... (Optional useEffect for token check) ...

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, sendOTP, verifyOTP, resetPassword }}>
      {children}
    </AuthContext.Provider>
  );
};