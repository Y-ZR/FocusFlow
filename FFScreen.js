import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const FFScreen = () => {
  const navigation = useNavigation();

  const addFriends = () => {
    navigation.navigate('AddFriends'); // Navigate to AddFriends page
  };

  const removeFriends = () => {
    navigation.navigate('RemoveFriends'); // Navigate to RemoveFriends
  };

  const handleGoToFriendRequests = () => {
    navigation.navigate('FriendRequests');
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Text style={styles.backButtonText}>Back</Text>
      </TouchableOpacity>
      <Text style={styles.heading}>Add Friends!</Text>
      <TouchableOpacity style={styles.buttonGreen} onPress={addFriends}>
        <Text style={styles.buttonText}>Make A Friend!</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.buttonGreen} onPress={removeFriends}>
        <Text style={styles.buttonText}>Say Goodbye!</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.buttonGreen} onPress={handleGoToFriendRequests}>
        <Text style={styles.buttonText}>Friend Requests</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212', // Dark background color for dark mode
    justifyContent: 'center',
    alignItems: 'center',
  },
  heading: {
    fontSize: 40,
    fontWeight: 'bold',
    marginBottom: 24, // Move the heading down with more margin
    color: '#FFF', // White text color for dark mode
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
    width: '40%', // Set a fixed width for the buttons
    justifyContent: 'center', // Center the text inside the button
    alignItems: 'center', // Center the text inside the button
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFF', // White text color for buttons in dark mode
  },
});

export default FFScreen;