import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SettingsScreen = () => {
  const navigation = useNavigation();

  const handleUsernameChange = () => {
    navigation.navigate('ChangeUsername'); // Navigate to ChangeUsername page
  };

  const handlePasswordChange = () => {
    navigation.navigate('ChangePassword'); // Navigate to ChangePassword page
  };

  const handleLogout = async () => {
    try {
      // Implement logout functionality
      // Example: Clear user session, navigate to login screen, etc.
    
      // Clear user session
      await AsyncStorage.clear();
    
      // Navigate to the login screen
      navigation.navigate('Login');
    } catch (error) {
      console.error('Error logging out:', error);
      // Show an error message or perform any necessary error handling
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Text style={styles.backButtonText}>Back</Text>
      </TouchableOpacity>
      <Image source={require('./assets/ORBIMG11.png')} style={styles.icon} />
      <Text style={styles.heading}>Settings</Text>
      <Text style={styles.subText}>Customize the app to your liking here.</Text> 
      <TouchableOpacity style={styles.buttonGreen} onPress={handleUsernameChange}>
        <Text style={styles.buttonText}>Change Username</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.buttonGreen} onPress={handlePasswordChange}>
        <Text style={styles.buttonText}>Change Password</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.buttonText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    width: 120,
    height: 120,
    resizeMode: 'contain',
    marginBottom: 15,
  },
  heading: {
    fontSize: 40,
    fontWeight: 'bold',
    marginBottom: 5, // Move the heading down with more margin
    color: '#FFF', // White text color for dark mode
  },
  subText: {
    fontSize: 16,
    color: '#BBB', // Light gray color for subtext in dark mode
    marginBottom: 10,
  },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 16,
    zIndex: 1,
  },
  backButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#BBB', // Light gray color for back button text in dark mode
  },
  buttonGreen: {
    marginTop: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#006400', // Duller green color for buttons
    borderRadius: 8,
    width: '43%', // Set a fixed width for the buttons
    justifyContent: 'center', // Center the text inside the button
    alignItems: 'center', // Center the text inside the button
  },
  logoutButton: {
    marginTop: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#006400', // Duller green color for buttons
    borderRadius: 8,
    width: '22%', // Set a fixed width for the buttons
    justifyContent: 'center', // Center the text inside the button
    alignItems: 'center', // Center the text inside the button
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFF', // White text color for buttons in dark mode
  },
});

export default SettingsScreen;