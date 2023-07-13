import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { collection, query, where, doc, getDoc, getDocs, updateDoc } from 'firebase/firestore';
import { db, auth } from './firebase';

const ChangeUsernameScreen = () => {
  const navigation = useNavigation();
  const [newUsername, setNewUsername] = useState('');
  const [username, setUsername] = useState('');
  const [coins, setCoins] = useState(0);

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
            setUsername(userData.username);
            setCoins(userData.coins);
          }
        }
      } catch (error) {
        console.log('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, []);

  const handleUsernameUpdate = async () => {
    console.log(newUsername);
    try {
      const userId = auth.currentUser?.uid; // Get the currently authenticated user's ID
      const usersCollectionRef = collection(db, 'users');
      const querySnapshot = await getDocs(query(usersCollectionRef, where('userId', '==', userId)));

      if (!querySnapshot.empty) {
        const documentSnapshot = querySnapshot.docs[0];
        const userDocRef = doc(db, 'users', documentSnapshot.id);

        await updateDoc(userDocRef, { username: newUsername });
        console.log('Username updated successfully.');
        Alert.alert('Success', 'Username updated successfully');
        setNewUsername('');
        navigation.goBack();
      }
    } catch (error) {
      console.log('Error updating username:', error);
    }
  };

  const handleCancel = () => {
    navigation.goBack(); // Navigate back to the previous screen
  };

  const handleChange = (event) => {
    const { text } = event.nativeEvent;
    setNewUsername(text);
    console.log('New username:', text);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Change Username</Text>
      <Text style={styles.username}>Current username: {username}</Text>
      <TextInput
        style={styles.input}
        placeholder="New Username"
        onChange={handleChange}
        value={newUsername}
      />
      <TouchableOpacity style={styles.button} onPress={handleUsernameUpdate}>
        <Text style={styles.buttonText}>Update Username</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={handleCancel}>
        <Text style={styles.buttonText}>Cancel</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  heading: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#FFF',
  },
  username: {
    marginTop: 16,
    fontSize: 24,
    color: 'white',
  },
  input: {
    width: '80%',
    height: 40,
    backgroundColor: '#FFF',
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 16,
    marginTop: 16,
  },
  button: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#00FF00',
    borderRadius: 8,
    marginBottom: 8,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
});

export default ChangeUsernameScreen;