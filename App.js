import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  ActivityIndicator,
  StyleSheet,
  ScrollView,
} from 'react-native';
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
    }
  };

  // Simulate handling Google OAuth callback (manual for now)
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const success = urlParams.get('success');
    if (success === 'true') {
      const email = urlParams.get('email');
      const token = urlParams.get('token');
      if (email && token) {
        localStorage.setItem('user_email', email);
        localStorage.setItem('access_token', token);
        setUserEmail(email);
        setAccessToken(token);
        setIsLoggedIn(true);
      }
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
      alert('CSV uploaded successfully');
    } catch (error) {
      console.error('CSV Upload Error:', error);
    }
  };

  // Send bulk emails
  const handleSendEmails = async () => {
    if (!prompt || csvData.length === 0) {
      alert('Please upload CSV and enter the email content');
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
            Authorization: `Bearer ${accessToken}`, // ✅ Pass token in header
          },
        }
      );
  
      alert(response.data.message);
    } catch (error) {
      console.error('Error sending emails:', error);
      alert('Error sending emails. Check logs.');
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
      alert('Logged out successfully');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {isLoggedIn ? (
        <>
          <Text style={styles.heading}>Welcome, {userEmail}!</Text>

          <TextInput
            style={styles.input}
            placeholder="Enter Email Content with {name}, {email} placeholders"
            value={prompt}
            onChangeText={setPrompt}
          />
          <input
            type="file"
            accept=".csv"
            onChange={handleCsvUpload}
            style={styles.fileInput}
          />
          <Button title="Send Bulk Emails" onPress={handleSendEmails} />
          {loading && <ActivityIndicator size="large" color="#007bff" />}
          <View style={styles.csvPreview}>
            {csvData.length > 0 && (
              <>
                <Text style={styles.previewHeading}>CSV Preview:</Text>
                {csvData.slice(0, 5).map((row, index) => (
                  <Text key={index} style={styles.previewText}>
                    {JSON.stringify(row)}
                  </Text>
                ))}
              </>
            )}
          </View>
          <Button title="Logout" onPress={handleLogout} color="red" />
        </>
      ) : (
        <>
          <Text style={styles.heading}>Connect Your Google Account</Text>
          <Button title="Login with Google" onPress={handleGoogleLogin} />
        </>
      )}
    </ScrollView>
  );
}

// Basic styles
const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    backgroundColor: '#f5f5f5',
  },
  heading: {
    fontSize: 24,
    marginBottom: 20,
    fontWeight: 'bold',
  },
  input: {
    width: '100%',
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
    borderRadius: 5,
    backgroundColor: '#fff',
  },
  fileInput: {
    marginBottom: 10,
  },
  csvPreview: {
    marginTop: 20,
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 5,
    width: '100%',
    maxHeight: 200,
    overflow: 'scroll',
  },
  previewHeading: {
    fontSize: 18,
    marginBottom: 5,
  },
  previewText: {
    fontSize: 12,
    marginBottom: 5,
  },
});
