// src/App.js
import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import LoginScreen from './src/screens/LoginScreen';
import DashboardScreen from './src/screens/DashboardScreen';
import Header from './src/components/Header';
import axios from 'axios';

// API base URL from Railway
const API_BASE_URL = 'https://custom-email-sender-production.up.railway.app/api';

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [accessToken, setAccessToken] = useState('');
  const [csvData, setCsvData] = useState([]);
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);

  // Check if login data exists in localStorage
  useEffect(() => {
    const storedEmail = localStorage.getItem('user_email');
    const storedToken = localStorage.getItem('access_token');
    if (storedEmail && storedToken) {
      setUserEmail(storedEmail);
      setAccessToken(storedToken);
      setIsLoggedIn(true);
    }
  }, []);

  // Handle OAuth login with Google
  const handleGoogleLogin = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/google-login/`);
      window.location.href = response.data.auth_url;
    } catch (error) {
      console.error('Login error:', error);
      alert('Error during login. Please try again.');
    }
  };

  // Capture token and email after login & force redirect
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    const email = urlParams.get('email');

    if (token && email) {
      localStorage.setItem('user_email', email);
      localStorage.setItem('access_token', token);
      setUserEmail(email);
      setAccessToken(token);
      setIsLoggedIn(true);

      // Remove token from URL and reload to update state
      window.history.replaceState(null, '', window.location.pathname);
      window.location.reload();
    }
  }, []);

  // Upload CSV and parse data
  const handleCsvUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('csv_file', file);

    try {
      const response = await axios.post(`${API_BASE_URL}/upload-csv/`, formData);
      setCsvData(response.data.rows);
      alert('✅ CSV uploaded successfully!');
    } catch (error) {
      console.error('CSV Upload Error:', error);
      alert('❌ Error uploading CSV. Try again.');
    }
  };

  // Send bulk emails
  const handleSendEmails = async () => {
    if (!prompt || csvData.length === 0) {
      alert('❗ Please upload a CSV and enter the email content');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(
        `${API_BASE_URL}/send-bulk-emails/`,
        {
          prompt,
          csv_rows: csvData,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`, // ✅ Send token in header
          },
        }
      );

      alert(response.data.message || '✅ Emails sent successfully!');
    } catch (error) {
      console.error('Error sending emails:', error);
      alert('❌ Error sending emails. Check logs.');
    } finally {
      setLoading(false);
    }
  };

  // Logout user
  const handleLogout = async () => {
    try {
      await axios.post(`${API_BASE_URL}/logout/`);
      localStorage.removeItem('user_email');
      localStorage.removeItem('access_token');
      setIsLoggedIn(false);
      setUserEmail('');
      setAccessToken('');
      alert('✅ Logged out successfully');
      window.location.reload(); // Ensure full logout
    } catch (error) {
      console.error('Logout error:', error);
      alert('❌ Error during logout.');
    }
  };

  return (
    <View style={styles.container}>
      {/* Show Header with Gmail/Profile Icon */}
      <Header
        isLoggedIn={isLoggedIn}
        handleGoogleLogin={handleGoogleLogin}
        handleLogout={handleLogout}
        userEmail={userEmail}
      />

      {/* Show Dashboard or Login Screen */}
      {isLoggedIn ? (
        <DashboardScreen
          userEmail={userEmail}
          prompt={prompt}
          setPrompt={setPrompt}
          csvData={csvData}
          handleCsvUpload={handleCsvUpload}
          handleSendEmails={handleSendEmails}
          loading={loading}
          handleLogout={handleLogout}
        />
      ) : (
        <LoginScreen handleGoogleLogin={handleGoogleLogin} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
