import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Button,
  Alert,
  TextInput,
  Platform,
} from "react-native";
import axios from "axios";

const BACKEND_URL = "https://custom-email-sender-production.up.railway.app/api";

const EmailScreen = ({ navigation }) => {
  const [csvFile, setCsvFile] = useState(null);
  const [prompt, setPrompt] = useState("");
  const [csvRows, setCsvRows] = useState([]);
  const [accessToken, setAccessToken] = useState("");

  // Get the access token from local storage when the component loads
  useEffect(() => {
    const token = localStorage.getItem("google_access_token");
    if (token) {
      setAccessToken(token);
    } else {
      Alert.alert("Error", "No access token found. Please reconnect.");
      navigation.navigate("ConnectScreen"); // Redirect to login page
    }
  }, []);

  // Handle file selection for web
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file && file.type === "text/csv") {
      setCsvFile(file);
      Alert.alert("Success", "CSV selected successfully!");
    } else {
      Alert.alert("Error", "Please select a valid CSV file.");
    }
  };

  // Upload CSV to backend
  const handleUploadCsv = async () => {
    if (!csvFile) {
      Alert.alert("Error", "Please select a CSV file first.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("csv_file", csvFile);

      // Upload CSV to backend
      const uploadResponse = await axios.post(
        `${BACKEND_URL}/upload-csv/`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (uploadResponse.status === 200) {
        Alert.alert("Success", "CSV uploaded successfully!");
        console.log("Upload Success:", uploadResponse.data);
        setCsvRows(uploadResponse.data.rows); // Store uploaded rows
      } else {
        console.error("CSV Upload Error:", uploadResponse);
        Alert.alert("Error", "Failed to upload CSV.");
      }
    } catch (error) {
      console.error("CSV Upload Error:", error.message);
      Alert.alert("Error", `Failed to upload CSV: ${error.message}`);
    }
  };

  // Send Bulk Emails with the access token
  const handleSendEmails = async () => {
    if (!prompt.trim()) {
      Alert.alert("Error", "Please enter a custom prompt.");
      return;
    }

    if (csvRows.length === 0) {
      Alert.alert("Error", "No CSV data found. Upload CSV first.");
      return;
    }

    if (!accessToken) {
      Alert.alert("Error", "User not authenticated. Please reconnect.");
      navigation.navigate("ConnectScreen");
      return;
    }

    try {
      // Prepare email data to send to backend
      const emailData = {
        prompt: prompt,
        csv_rows: csvRows,
      };

      // Send emails with Google token in headers
      const emailResponse = await axios.post(
        `${BACKEND_URL}/send-bulk-emails/`,
        emailData,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (emailResponse.status === 200) {
        Alert.alert("Success", "Emails sent successfully!");
        console.log("Emails Sent:", emailResponse.data);
      } else {
        console.error("Email Send Error:", emailResponse);
        Alert.alert("Error", "Failed to send emails.");
      }
    } catch (error) {
      console.error("Email Send Error:", error.response?.data || error.message);

      // Check if unauthorized, redirect to login if token expired
      if (error.response?.status === 401) {
        Alert.alert("Error", "Session expired. Please reconnect.");
        localStorage.removeItem("google_access_token");
        navigation.navigate("ConnectScreen"); // Redirect to login screen
      } else {
        Alert.alert("Error", `Failed to send emails: ${error.message}`);
      }
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", padding: 20 }}>
      <Text style={{ fontSize: 20, marginBottom: 20 }}>
        Upload CSV and Send Bulk Emails
      </Text>

      {/* File Input for Web */}
      {Platform.OS === "web" && (
        <input
          type="file"
          accept=".csv"
          onChange={handleFileChange}
          style={{ marginBottom: 20 }}
        />
      )}

      {csvFile && (
        <View style={{ marginTop: 20, marginBottom: 20 }}>
          <Text style={{ marginBottom: 10 }}>Selected File: {csvFile.name}</Text>
          <Button title="Upload CSV" onPress={handleUploadCsv} />
        </View>
      )}

      {csvRows.length > 0 && (
        <View style={{ marginTop: 20 }}>
          <Text style={{ fontSize: 18, marginBottom: 10 }}>
            CSV Uploaded Successfully!
          </Text>

          {/* Custom Prompt Input */}
          <TextInput
            placeholder="Enter your custom email content here..."
            value={prompt}
            onChangeText={(text) => setPrompt(text)}
            multiline
            style={{
              height: 100,
              borderColor: "gray",
              borderWidth: 1,
              padding: 10,
              marginBottom: 20,
              width: "100%",
            }}
          />

          {/* Send Emails Button */}
          <Button title="Send Bulk Emails" onPress={handleSendEmails} />
        </View>
      )}
    </View>
  );
};

export default EmailScreen;
