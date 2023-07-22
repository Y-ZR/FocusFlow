import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const FFScreen = () => {
  const navigation = useNavigation();

  const goToFriendList = () => {
    navigation.navigate('FriendList'); // Navigate to FriendList page
  };

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
      <Image source={require('./assets/ORBIMG13.png')} style={styles.icon} />
      <Text style={styles.heading}>Focus Friends</Text>
      <Text style={styles.subText}>Connect with like-minded individuals.</Text>
      <TouchableOpacity style={styles.buttonGreen} onPress={goToFriendList}>
        <Text style={styles.buttonText}>Friend List</Text>
      </TouchableOpacity>
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
    color: '#FFF', // White text color for dark mode
  },
  subText: {
    fontSize: 16,
    color: '#BBB', // Light gray color for subtext in dark mode
    marginBottom: 10, 
  },
  icon: {
    width: 230, // Adjust the width and height as needed
    height: 230,
    resizeMode: 'contain',
    marginBottom: -60, 
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