// src/screens/DashboardScreen.js
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  ActivityIndicator,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import { AntDesign, MaterialIcons } from '@expo/vector-icons';
import logo from '../assets/logo.png';
import gmailIcon from '../assets/Gmail_Icon.png';
import profileIcon from '../assets/profile-user.png';

const DashboardScreen = ({
  userEmail,
  prompt,
  setPrompt,
  csvData,
  handleCsvUpload,
  handleSendEmails,
  loading,
}) => {
  // Local State for File Preview
  const [fileName, setFileName] = useState('');

  // Handle CSV File Upload
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setFileName(file.name);
    handleCsvUpload(event);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Header Section */}
      <View style={styles.header}>
        <Image source={logo} style={styles.logo} />
        <Text style={styles.heading}>📧 Bulk Email Dashboard</Text>
        <Image source={profileIcon} style={styles.profileIcon} />
      </View>

      <Text style={styles.welcome}>✅ Welcome, {userEmail}!</Text>

      {/* Card 1 - Prompt Input */}
      <View style={styles.card}>
        <AntDesign name="form" size={30} color="#FF9800" />
        <Text style={styles.cardTitle}>Prompt Message</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter Email Content with {name}, {email} placeholders"
          value={prompt}
          onChangeText={setPrompt}
          multiline
        />
      </View>

      {/* Card 2 - Upload CSV */}
      <View style={styles.card}>
        <AntDesign name="upload" size={30} color="#4CAF50" />
        <Text style={styles.cardTitle}>Upload CSV</Text>
        <input
          type="file"
          accept=".csv"
          onChange={handleFileChange}
          style={styles.fileInput}
        />
        {fileName ? (
          <Text style={styles.fileName}>📂 {fileName} uploaded</Text>
        ) : (
          <Text style={styles.fileNamePlaceholder}>No file uploaded</Text>
        )}
      </View>

      {/* CSV Preview Section */}
      {csvData.length > 0 && (
        <View style={styles.card}>
          <MaterialIcons name="preview" size={30} color="#2196F3" />
          <Text style={styles.cardTitle}>📑 CSV Preview</Text>
          <View style={styles.csvPreview}>
            {csvData.slice(0, 5).map((row, index) => (
              <Text key={index} style={styles.previewText}>
                {JSON.stringify(row)}
              </Text>
            ))}
            {csvData.length > 5 && (
              <Text style={styles.previewText}>
                ...and {csvData.length - 5} more rows
              </Text>
            )}
          </View>
        </View>
      )}

      {/* Card 3 - Send Bulk Email Button */}
      <View style={styles.card}>
        <AntDesign name="paperclip" size={30} color="#E91E63" />
        <Text style={styles.cardTitle}>Send Bulk Emails</Text>
        <TouchableOpacity
          style={[
            styles.sendButton,
            loading && { backgroundColor: '#ccc' },
          ]}
          onPress={handleSendEmails}
          disabled={loading}
        >
          <Text style={styles.sendButtonText}>
            {loading ? 'Sending Emails...' : 'Send Emails'}
          </Text>
        </TouchableOpacity>
        {loading && <ActivityIndicator size="large" color="#007bff" />}
      </View>
    </ScrollView>
  );
};

export default DashboardScreen;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingHorizontal: 20,
    backgroundColor: '#f5f5f5',
  },
  header: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    marginBottom: 20,
    backgroundColor: '#fff',
    elevation: 5,
  },
  logo: {
    width: 40,
    height: 40,
    resizeMode: 'contain',
  },
  heading: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  profileIcon: {
    width: 30,
    height: 30,
    resizeMode: 'contain',
  },
  welcome: {
    fontSize: 18,
    marginBottom: 20,
    color: '#333',
    fontWeight: 'bold',
  },
  card: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
    width: '100%',
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10,
  },
  input: {
    width: '100%',
    height: 100,
    borderColor: '#ddd',
    borderWidth: 1,
    marginTop: 10,
    paddingHorizontal: 10,
    borderRadius: 8,
    backgroundColor: '#f9f9f9',
    textAlignVertical: 'top',
  },
  fileInput: {
    marginTop: 10,
  },
  fileName: {
    marginTop: 10,
    fontSize: 12,
    color: '#4CAF50',
  },
  fileNamePlaceholder: {
    marginTop: 10,
    fontSize: 12,
    color: '#999',
  },
  csvPreview: {
    marginTop: 10,
    backgroundColor: '#f9f9f9',
    padding: 10,
    borderRadius: 8,
    width: '100%',
    maxHeight: 150,
    overflow: 'scroll',
  },
  previewText: {
    fontSize: 12,
    marginBottom: 5,
    color: '#333',
  },
  sendButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginTop: 10,
    alignItems: 'center',
  },
  sendButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
