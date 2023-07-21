import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, Image, StyleSheet, Alert, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { getFirestore, collection, doc, getDoc, onSnapshot, query, where, getDocs, updateDoc } from 'firebase/firestore';
import { auth, db } from './firebase';

const screenWidth = Dimensions.get('window').width;
const friendSlotWidth = screenWidth * 0.6;

const LeaderboardScreen = () => {
  const navigation = useNavigation();
  const [userFriends, setUserFriends] = useState([]);
  const [getArrayFriends, setGetArrayFriends] = useState([]);
  const maxSlots = 5;

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

            // Set up real-time listener for user's friends
            const userFriendsListener = onSnapshot(userDocRef, (docSnapshot) => {
              const userData = docSnapshot.data();
              setUserFriends(userData.friends);
            });

            // Clean up the listener when the component unmounts
            return () => userFriendsListener();
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
              const totalCoinsEarned = friendData.totalcoinsever || 0;
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
  
      // Sort the userFriendData array in descending order based on totalCoinsEarned
      userFriendData.sort((a, b) => b.totalCoinsEarned - a.totalCoinsEarned);
      return userFriendData;
    } catch (error) {
      console.log('Error fetching user friend data:', error);
      return [];
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const friendData = await fetchUserFriendData(userFriends);
      setGetArrayFriends(friendData);
    };

    fetchData();
  }, [userFriends]);

  const renderFriendSlot = ({ item }) => (
    <View style={[styles.friendSlot, { width: friendSlotWidth }]}>
      <View style={styles.friendContent}>
        <Text style={styles.friendUsername}>{item.username}</Text>
      </View>
      <View style={styles.friendContent}>
        <Text style={styles.friendCoins}>{item.totalCoinsEarned} coins</Text>
      </View>
    </View>
  );

  const handleTouchGrassPress = () => {
    // Handle the Touch Grass button press to navigate to the AddFriendsScreen
    navigation.navigate('AddFriends');
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Text style={styles.backButtonText}>Back</Text>
      </TouchableOpacity>

      <View style={styles.podiumContainer}>
        <Image source={require('./assets/ORBIMG9.png')} style={styles.podiumImage} />
        <View style={styles.lineContainer}>
          <View style={styles.line} />
          <Text style={styles.focusFriendsText}>Top 5 FocusFriends</Text>
        </View>
      </View>

      {getArrayFriends.length > 0 ? (
        <FlatList
          data={getArrayFriends.slice(0, maxSlots)}
          renderItem={renderFriendSlot}
          keyExtractor={(item, index) => index.toString()}
          contentContainerStyle={[styles.leaderboardContainer, { marginTop: friendSlotWidth / 2 - 32 }]}
        />
      ) : (
        <View style={styles.leaderboardContainer}>
          <Text style={styles.noFriendsText}>Sadly, you have no friends.</Text>
          <TouchableOpacity style={styles.touchGrassButton} onPress={handleTouchGrassPress}>
            <Text style={styles.touchGrassButtonText}>Touch Grass</Text>
          </TouchableOpacity>
        </View>
      )}
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
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 120, // Adjust the marginTop to move the podium below the back button
  },
  lineContainer: {
    alignItems: 'center',
    marginTop: 12,
  },
  line: {
    width: 200,
    height: 2,
    backgroundColor: '#004600' , // Red line color
  },
  focusFriendsText: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#004600', // Red text color
    marginTop: 4,
  },
  podiumImage: {
    width: 150,
    height: 150,
    resizeMode: 'contain',
  },
  leaderboardContainer: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  noFriendsText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#004600',
    textAlign: 'center',
    marginTop: 120, // Adjust the marginTop to move the text higher up
  },
  touchGrassButton: {
    marginTop: 16,
    backgroundColor: '#004600', // Green button color
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  touchGrassButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFF',
    textAlign: 'center',
  },
  friendSlot: {
    borderRadius: 16, // Make the friend slot rounded
    backgroundColor: '#006400', // Darker background for friend request item in dark mode
    paddingVertical: 16,
    paddingHorizontal: 24,
    marginBottom: 8,
    elevation: 2, // Add shadow for a card-like effect
  },
  friendContent: {
    alignItems: 'center', // Center the content inside the friend slot
  },
  friendUsername: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFF',
  },
  friendCoins: {
    fontSize: 16,
    color: '#BBB',
  },
});

export default LeaderboardScreen;