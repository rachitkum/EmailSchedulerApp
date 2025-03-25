// src/components/Header.js
import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  Modal,
  Pressable,
  TouchableWithoutFeedback,
} from 'react-native';
import { AntDesign, MaterialIcons } from '@expo/vector-icons';
import logo from '../assets/logo.png';
import gmailIcon from '../assets/Gmail_Icon.png';
import profileIcon from '../assets/profile-user.png';

const Header = ({ isLoggedIn, handleGoogleLogin, handleLogout, userEmail }) => {
  const [modalVisible, setModalVisible] = useState(false);

  // Close dropdown if tapped outside
  const closeDropdown = () => {
    if (modalVisible) {
      setModalVisible(false);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={closeDropdown}>
      <View style={styles.header}>
        {/* Left: Logo */}
        <Image source={logo} style={styles.logo} />

        {/* Right: Navigation Links */}
        <View style={styles.navLinks}>
          {['Products', 'About us', 'Community', 'Resources', 'Pricing', 'Contact', 'Link'].map(
            (item, index) => (
              <TouchableOpacity key={index} style={styles.navItem}>
                <Text style={styles.navText}>{item}</Text>
              </TouchableOpacity>
            )
          )}
        </View>

        {/* Right: Gmail/Profile Button */}
        <TouchableOpacity
          onPress={() => (isLoggedIn ? setModalVisible(!modalVisible) : handleGoogleLogin())}
        >
          <Image
            source={isLoggedIn ? profileIcon : gmailIcon}
            style={styles.profileIcon}
          />
        </TouchableOpacity>

        {/* Modal for Dropdown */}
        {isLoggedIn && (
          <Modal
            animationType="fade"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => setModalVisible(false)}
          >
            <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
              <View style={styles.modalOverlay} />
            </TouchableWithoutFeedback>
            <View style={styles.dropdown}>
              <TouchableOpacity
                style={styles.dropdownItem}
                onPress={() => {
                  alert('Go to Profile');
                  setModalVisible(false);
                }}
              >
                <AntDesign name="user" size={20} color="#333" />
                <Text style={styles.dropdownText}>Profile</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.dropdownItem}
                onPress={() => {
                  alert('Open Settings');
                  setModalVisible(false);
                }}
              >
                <MaterialIcons name="settings" size={20} color="#333" />
                <Text style={styles.dropdownText}>Settings</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.dropdownItem}
                onPress={() => {
                  handleLogout();
                  setModalVisible(false);
                }}
              >
                <AntDesign name="logout" size={20} color="red" />
                <Text style={[styles.dropdownText, { color: 'red' }]}>Logout</Text>
              </TouchableOpacity>
            </View>
          </Modal>
        )}
      </View>
    </TouchableWithoutFeedback>
  );
};

export default Header;

const styles = StyleSheet.create({
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 60,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    zIndex: 1000,
    elevation: 4,
  },
  logo: {
    width: 40,
    height: 40,
    resizeMode: 'contain',
  },
  navLinks: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  navItem: {
    marginLeft: 15,
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  navText: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  profileIcon: {
    width: 30,
    height: 30,
    resizeMode: 'contain',
    marginLeft: 15,
  },
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.1)',
  },
  dropdown: {
    position: 'absolute',
    right: 10,
    top: 50,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    elevation: 5,
    zIndex: 2000,
  },
  dropdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  dropdownText: {
    marginLeft: 10,
    fontSize: 14,
    color: '#333',
  },
});
