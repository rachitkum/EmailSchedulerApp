// src/screens/CsvUploadScreen.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const CsvUploadScreen = ({ csvData }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.heading}>📑 CSV Preview:</Text>
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
  );
};

export default CsvUploadScreen;

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 5,
    width: '100%',
    maxHeight: 200,
    overflow: 'scroll',
  },
  heading: {
    fontSize: 18,
    marginBottom: 5,
  },
  previewText: {
    fontSize: 12,
    marginBottom: 5,
  },
});
