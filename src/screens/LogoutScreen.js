// src/screens/LogoutScreen.js
import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

const LogoutScreen = ({ handleLogout }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Are you sure you want to log out?</Text>
      <Button title="Logout" onPress={handleLogout} color="red" />
    </View>
  );
};

export default LogoutScreen;

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
});
