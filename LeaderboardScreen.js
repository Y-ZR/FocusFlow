import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { getFirestore, collection, addDoc, doc, getDoc, onSnapshot, query, where, getDocs, updateDoc } from 'firebase/firestore';
import { auth, db } from './firebase';

const LeaderboardScreen = () => {
  const navigation = useNavigation();
  const [userFriends, setUserFriends] = useState([]);
  const [friendUsername, setFriendName] = useState('');
  const RetrieveData = [
    { username: 'Go Touch Grass & Make Friends!', coins: 0 },
    { username: 'Go Touch Grass & Make Friends!', coins: 0 },
    { username: 'Go Touch Grass & Make Friends!', coins: 0 },
    { username: 'Go Touch Grass & Make Friends!', coins: 0 },
    { username: 'Go Touch Grass & Make Friends!', coins: 0 },
  ];

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
          }
        }
      } catch (error) {
        console.log('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, []);

  const fetchUserFriendData = async (fri) => {
    try {
      const userFriendData = await Promise.all(
        fri.map(async (friendUsername) => {
          try {
            const usersCollectionRef = collection(db, 'users');
            const querySnapshot = await getDocs(query(usersCollectionRef, where('username', '==', friendUsername)));
  
            if (!querySnapshot.empty) {
              const friendData = querySnapshot.docs[0].data();
              const totalCoinsEarned = friendData.totalcoinsearned || 0; 
              return { username: friendUsername, totalCoinsEarned };
            } else {
              return { username: friendUsername, totalCoinsEarned: 0 };
            }
          } catch (error) {
            console.log('Error fetching friend data:', error);
            return { username: friendUsername, totalCoinsEarned: 0 };
          }
        })
      );
  
      // Sort the userFriendData array in descending order
      userFriendData.sort((a, b) => b.totalCoinsEarned - a.totalCoinsEarned);
      return userFriendData;
    } catch (error) {
      console.log('Error fetching user friend data:', error);
      return [];
    }
  };

  const [getArrayFriends, setGetArrayFriends] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const friendData = await fetchUserFriendData(userFriends);
      setGetArrayFriends(friendData);
    };

    fetchData();
  }, [userFriends]);

  const mergeArrays = (getArrayFriends, RetrieveData) => {
    const mergedArray = [...RetrieveData];
  
    // Determine how many elements to replace in RetrieveData
    const numElementsToReplace = Math.min(getArrayFriends.length, RetrieveData.length);
  
    // Replace the corresponding elements in RetrieveData
    for (let i = 0; i < numElementsToReplace; i++) {
      mergedArray[i].username = getArrayFriends[i].username;
      mergedArray[i].coins = getArrayFriends[i].totalCoinsEarned;
    }
  
    return mergedArray;
  };

  const SampleData = mergeArrays(getArrayFriends, RetrieveData);

  return (
    <View style={styles.container}>
      <View style={styles.podiumContainer}>
         <Image source={require('./assets/ORBIMG9.png')} style={styles.podiumImage} />
      </View>

      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Text style={styles.backButtonText}>Back</Text>
      </TouchableOpacity>

      <View style={styles.leaderboardContainer}>
        {SampleData.map((user, index) => (
          <View key={index} style={styles.leaderboardBox}>
            <Text style={styles.username}>{user.username}</Text>
            <Text style={styles.coinAmount}>{user.coins} coins</Text>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    padding: 16,
  },
  backButton: {
    position: 'absolute',
    top: 60,
    left: 16,
    zIndex: 1,
  },
  backButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFF',
  },
  podiumContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  podiumImage: {
    width: 150, 
    height: 150,
    resizeMode: 'contain',
  },
  leaderboardContainer: {
    flex: 1,
    marginTop: -150,
    alignItems: 'center',
  },
  leaderboardBox: {
    width: '80%',
    padding: 16,
    marginVertical: 8,
    borderRadius: 12,
    backgroundColor: '#222',
    alignItems: 'center',
  },
  username: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFF',
  },
  coinAmount: {
    fontSize: 16,
    color: '#BBB',
  },
});

export default LeaderboardScreen;