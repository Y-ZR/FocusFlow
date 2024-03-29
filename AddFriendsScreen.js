import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { getFirestore, collection, addDoc, doc, getDoc, onSnapshot, query, where, getDocs, updateDoc } from 'firebase/firestore';
import { auth, db } from './firebase';

const AddFriendsScreen = () => {
  const navigation = useNavigation();
  const [username, setUsername] = useState('');
  const [userFriends, setUserFriends] = useState([]);
  const [friendUsername, setFriendName] = useState('');

  useEffect(() => {
    // Fetch the user's data from Firestore
    const fetchUserData = async () => {
      try {
        const userId = auth.currentUser?.uid; // Get the currently authenticated user's ID
        const usersCollectionRef = collection(db, 'users');
        const querySnapshot = await getDocs(query(usersCollectionRef, where('userId', '==', userId)));
        if (!querySnapshot.empty) {
          const documentSnapshot = querySnapshot.docs[0];
          const userDocRef = doc(db, 'users', documentSnapshot.id);
          const userDocSnap = await getDoc(userDocRef);
          if (userDocSnap.exists()) {
            const userData = userDocSnap.data();
            setUserFriends(userData.friends);
            setUsername(userData.username);
          }
        }
      } catch (error) {
        console.log('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, []);

  
  const checkExists = async (test) => {
    try {
      const userId = auth.currentUser?.uid; // Get the currently authenticated user's ID
      const usersCollectionRef = collection(db, 'users');
      const querySnapshot = await getDocs(query(usersCollectionRef, where('username', '==', test)));

      if (!querySnapshot.empty) {
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.log('Error:', error);
    }
  };


  const handleAddFriend = async () => {
    const updateFriends = async (recipientUsername) => {
      try {
        const userId = auth.currentUser?.uid;
        const usersCollectionRef = collection(db, 'users');
        const querySnapshot = await getDocs(query(usersCollectionRef, where('username', '==', recipientUsername)));
  
        if (!querySnapshot.empty) {
          const documentSnapshot = querySnapshot.docs[0];
          const recipientDocRef = doc(db, 'users', documentSnapshot.id);
          const recipientDocSnap = await getDoc(recipientDocRef);
  
          if (recipientDocSnap.exists()) {
            const recipientData = recipientDocSnap.data();
            const currentRequests = recipientData.requests || [];

            if (currentRequests.includes(username)) {
              Alert.alert('Error', 'You have already sent a request to this user!');
            } else {
              const newRequests = [...currentRequests, username];
              await updateDoc(recipientDocRef, { requests: newRequests });
            }
          }
        }
      } catch (error) {
        console.error('Error updating Requests:', error);
      }
    };
  
    const userExists = await checkExists(friendUsername);

    if (!userExists) {
      Alert.alert('Error', 'User does not exist!');
    } else if (userFriends.includes(friendUsername)) {
      Alert.alert('Error', 'Your bromance has already started!');
    } else {
      updateFriends(friendUsername);     
      Alert.alert('Success', 'What a baller!');
      navigation.goBack();
    }
  };

  const handleCancel = () => {
    navigation.goBack(); // Navigate back to the previous screen
  };

  const handleChange = (event) => {
    const { text } = event.nativeEvent;
    setFriendName(text);
  };


  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Text style={styles.backButtonText}>Back</Text>
      </TouchableOpacity>
      <Text style={styles.heading}>Add a Friend!</Text>
      <Text style={styles.subText}>Enter your friend's username below:</Text>
      <TextInput
        style={styles.input}
        placeholder="Friend's Username"
        onChange={handleChange}
        value={friendUsername}
      />
      <TouchableOpacity style={styles.buttonGreen} onPress={handleAddFriend}>
        <Text style={styles.buttonText}>Add Friend</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
        <Text style={styles.buttonText}>Cancel</Text>
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
    marginBottom: 8,
    color: '#FFF', // White text color for dark mode
  },
  subText: {
    fontSize: 16,
    color: 'lightgrey', // Light grey color for subtext
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
  input: {
    width: '45%',
    height: 40,
    backgroundColor: '#FFF',
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 10,
    marginTop: 16,
  },
  buttonGreen: {
    marginTop: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#006400', // Duller green color for buttons
    borderRadius: 8,
    width: '29%', // Set a fixed width for the buttons
    justifyContent: 'center', // Center the text inside the button
    alignItems: 'center', // Center the text inside the button
  },
  cancelButton: {
    marginTop: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#006400', // Duller green color for buttons
    borderRadius: 8,
    width: '23%', // Set a fixed width for the buttons
    justifyContent: 'center', // Center the text inside the button
    alignItems: 'center', // Center the text inside the button
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFF', // White text color for buttons in dark mode
  },
});

export default AddFriendsScreen;