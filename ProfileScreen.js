import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import { collection, query, where, doc, getDoc, getDocs } from 'firebase/firestore';
import { db, auth } from './firebase';

const ProfileScreen = () => {
  const navigation = useNavigation();
  const [username, setUsername] = useState('');
  const [totalCoinsEarned, setTotalCoinsEarned] = useState(0);
  const [currentCoins, setCurrentCoins] = useState(0);
  const [numOfFriends, setNumFriends] = useState(0);
  const [mostTimeEver, setTime] = useState(0);

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
            setTotalCoinsEarned(userData.totalcoinsever);
            setCurrentCoins(userData.coins); // Assuming userData.coins is the property for current coins
            setNumFriends(userData.friends.length);
            setTime(userData.mosttimeever);
          }
        }
      } catch (error) {
        console.log('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, []);

  const handleAvatarsUnlocked = () => {
    navigation.navigate('OwnedAvatar');
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
      <View style={styles.facebookLayout}>
        <View style={styles.profileContainer}>
          <View style={styles.profilePictureContainer}>
            <Icon name="ios-person" size={120} color="#FFF" />
          </View>
          <Text style={styles.username}>{username}</Text>
        </View>
        <View style={styles.greenBoxesContainer}>
          <View style={styles.greenBox}>
            <Text style={styles.coinsText}>Total Coins Earned</Text>
            <Text style={styles.coinsNumber}>{totalCoinsEarned}</Text>
          </View>
          <View style={styles.greenBox}>
            <Text style={styles.coinsText}>Current Coins in Account</Text>
            <Text style={styles.coinsNumber}>{currentCoins}</Text>
          </View>
          <View style={styles.greenBox}>
            <Text style={styles.coinsText}>Number of Friends</Text>
            <Text style={styles.coinsNumber}>{numOfFriends}</Text>
          </View>
          <View style={styles.greenBox}>
            <Text style={styles.coinsText}>Longest Session</Text>
            <Text style={styles.coinsNumber}>{mostTimeEver} min</Text>
          </View>
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
    backgroundColor: '#121212',
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
    top: 40,
    left: 16,
    zIndex: 1,
  },
  backButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#BBB', // Light gray color for back button text in dark mode
  },
  avatarsButton: {
    backgroundColor: '#006400',
    padding: 12,
    borderRadius: 8,
    marginTop: 10,
  },
  avatarsButtonText: {
    fontSize: 16,
    color: '#FFF',
    fontWeight: 'bold',
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
    marginTop: 10
  },
  username: {
    fontSize: 50,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: -24,
  },
  facebookLayout: {
    backgroundColor: '#121212',
    borderColor: '#006400',
    borderWidth: 2,
    width: '90%',
    padding: 16,
    borderRadius: 8,
    marginTop: 80, // Adjust marginTop to position the box below the Back button
    marginBottom: 16, // Add some marginBottom for spacing
  },
  greenBoxesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  greenBox: {
    backgroundColor: '#006400',
    width: '48%', // Adjust width to create 2x2 layout with spacing
    padding: 10, // Reduce padding for the green boxes
    borderRadius: 8,
    marginBottom: 16, // Add marginBottom for spacing between the green boxes
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