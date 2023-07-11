import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import { collection, query, where, doc, getDoc, getDocs  } from 'firebase/firestore';
import { db, auth } from './firebase';

const ProfileScreen = () => {
  const navigation = useNavigation();
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

  const handleAvatarsUnlocked = () => {
    navigation.navigate('Screen4');
    // CREATE A PAGE OF ALL AVATARS COLLECTED
    // REPLACE THE LIU ZHENGYANG TEXT WITH A FIREBASE-STORED USERNAME
  };

  const handleBack = () => {
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <Text style={styles.backButtonText}>Back</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.profileContainer}>
        <View style={styles.profilePictureContainer}>
          <Icon name="ios-person" size={120} color="#FFF" />
        </View>
        <Text style={styles.username}>{username}</Text>
      </View>
      <View style={styles.coinsContainer}>
        <View style={styles.coinsBox}>
          <Text style={styles.coinsText}>Coins Earned</Text>
          <Text style={styles.coinsNumber}>{coins}</Text>
        </View>
      </View>
      <TouchableOpacity style={styles.avatarsButton} onPress={handleAvatarsUnlocked}>
        <Text style={styles.avatarsButtonText}>Avatars Unlocked</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#000',
      alignItems: 'center',
      justifyContent: 'center',
    },
    header: {
      position: 'absolute',
      top: 0,
      left: 0,
      padding: 16,
      flexDirection: 'row',
    },
    backButton: {
      position: 'absolute',
      top: 16,
      left: 16,
      zIndex: 1,
    },
    backButtonText: {
      fontSize: 18,
      fontWeight: 'bold',
      color: '#FFF',
    },
    avatarsButton: {
      backgroundColor: 'green',
      padding: 12,
      borderRadius: 8,
      marginTop: 40,
    },
    avatarsButtonText: {
      fontSize: 18,
      color: '#000',
      textAlign: 'center',
    },
    profileContainer: {
      alignItems: 'center',
      marginBottom: 40,
    },
    profilePictureContainer: {
      width: 150,
      height: 150,
      borderRadius: 75,
      backgroundColor: 'grey',
      alignItems: 'center',
      justifyContent: 'center',
    },
    username: {
      marginTop: 16,
      fontSize: 24,
      color: 'white',
    },
    coinsContainer: {
      alignItems: 'center',
    },
    coinsBox: {
      borderWidth: 2,
      borderColor: 'green',
      padding: 16,
      borderRadius: 8,
      marginTop: 24,
    },
    coinsText: {
      fontSize: 20,
      fontWeight: 'bold',
      color: '#FFF',
      textAlign: 'center',
    },
    coinsNumber: {
      fontSize: 40,
      fontWeight: 'bold',
      color: '#FFF',
      textAlign: 'center',
      marginTop: 8,
    },
});
  

export default ProfileScreen;