import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { collection, query, where, doc, getDoc, getDocs, onSnapshot } from 'firebase/firestore';
import { auth, db } from './firebase';

const LeaderboardScreen = () => {
  const navigation = useNavigation();
  const [userFriends, setUserFriends] = useState([]);

  useEffect(() => {
    // Fetch the user's data and their friends' data from Firestore in real-time
    const fetchUserAndFriendsData = async () => {
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
            const friends = userData.friends;
            // Loop through friends to get friends coins data and add it into userFriends array
            const userFriendsData = [];
            for (const friendName of friends) {
              const friendQuerySnapshot = await getDocs(query(usersCollectionRef, where('username', '==', friendName)));
              if (!friendQuerySnapshot.empty) {
                const friendDocumentSnapshot = friendQuerySnapshot.docs[0];
                const friendDocRef = doc(db, 'users', friendDocumentSnapshot.id);
                const friendDocSnap = await getDoc(friendDocRef);
                if (friendDocSnap.exists()) {
                  const friendData = friendDocSnap.data();
                  userFriendsData.push({ username: friendName, coins: friendData.coins });
                }
              }
            }
            userFriendsData.push({ username: userData.username, coins: userData.coins });
            setUserFriends(userFriendsData);
          }
        }
      } catch (error) {
        console.log('Error fetching user and friends data:', error);
      }
    };

    fetchUserAndFriendsData();
  }, []);

  // Sort userFriends based on coins (highest to lowest)
  const sortedFriends = userFriends.sort((a, b) => b.coins - a.coins);

  // FlatList renderItem function to render each friend's data
  const renderFriendItem = ({ item }) => {
    return (
      <View style={styles.friendContainer}>
        <Text style={styles.friendRank}>#{sortedFriends.indexOf(item) + 1}</Text>
        <Text style={styles.friendUsername}>{item.username}</Text>
        <Text style={styles.friendCoins}>{item.coins}</Text>
        <Text style={styles.coins}> coins</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Text style={styles.backButtonText}>Back</Text>
      </TouchableOpacity>
      <View style={styles.headerContainer}>
        <Image source={require('./assets/ORBIMG9.png')} style={styles.headerImage} />
        <Text style={styles.headerText}>Leaderboard</Text>
        <Text style={styles.subText}>Check out the rankings among your friends!</Text>
      </View>
      <FlatList
        data={sortedFriends}
        keyExtractor={(item) => item.username} // Assuming username is unique
        renderItem={renderFriendItem}
      />
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.navigate('AddFriends')}
      >
        <Text style={styles.addButtonText}>Go Touch Grass!</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: 160,
    marginBottom: 20,
    marginTop: 40,
  },
  headerImage: {
    width: 100,
    height: 100,
    marginRight: 10,
  },
  headerText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFF',
  },
  subText: {
    fontSize: 16,
    color: '#BBB',
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
  addButton: {
    backgroundColor: '#006400',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginBottom: 20,
  },
  addButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFF',
  },
  container: {
    flex: 1,
    backgroundColor: '#121212',
    alignItems: 'center',
    paddingTop: 20,
  },
  friendContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#888',
    width: '90%',
  },
  friendRank: {
    fontSize: 16,
    color: '#BBB', // Light gray color for rank number
    marginRight: 8,
    fontWeight: 'bold',
  },
  friendUsername: {
    flex: 1,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFF',
  },
  friendCoins: {
    fontSize: 16,
    color: 'yellow',
    fontWeight: 'bold',
  },
  coins: {
    fontSize: 16,
    color: '#FFF',
  },
});

export default LeaderboardScreen;