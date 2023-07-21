import React, { useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { collection, query, where, doc, getDoc, getDocs, onSnapshot } from 'firebase/firestore';
import { auth, db } from './firebase';

const FriendListScreen = () => {
  const navigation = useNavigation();
  const [friends, setFriends] = useState([]);

  useEffect(() => {
    // Fetch the user's friends from Firestore in real-time
    const fetchFriends = async () => {
      try {
        const userId = auth.currentUser?.uid; // Get the currently authenticated user's ID
        const usersCollectionRef = collection(db, 'users');
        const querySnapshot = await getDocs(query(usersCollectionRef, where('userId', '==', userId)));
        if (!querySnapshot.empty) {
          const documentSnapshot = querySnapshot.docs[0];
          const userDocRef = doc(db, 'users', documentSnapshot.id);
          const userDocSnap = await getDoc(userDocRef);
          if (userDocSnap.exists()) {
            const unsubscribe = onSnapshot(userDocRef, (docSnapshot) => {
            const userData = docSnapshot.data();
              if (userData) {
                setFriends(userData.friends || []);
              }
            });
            return () => unsubscribe();
          }
        }
      } catch (error) {
        console.log('Error fetching user friends:', error);
      }
    };

    fetchFriends();
  }, []);

  const handleGoBack = () => {
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={handleGoBack}>
        <Text style={styles.backButtonText}>Back</Text>
      </TouchableOpacity>
      <Text style={styles.heading}>My Friends</Text>
      {friends.length === 0 ? (
        <Text style={styles.emptyText}>You have no friends yet :(</Text>
      ) : (
        <FlatList
          data={friends}
          renderItem={({ item }) => (
            <View style={styles.friendContainer}>
              <Text style={styles.friendUsername}>{item}</Text>
            </View>
          )}
          keyExtractor={(item) => item}
          contentContainerStyle={styles.friendList}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212', // Dark background color for dark mode
    paddingTop: 40,
    paddingHorizontal: 20,
  },
  heading: {
    fontSize: 40,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#FFF', // White text color for dark mode
    textAlign: 'center',
    marginTop: 40
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
  friendList: {
    paddingBottom: 20,
  },
  friendContainer: {
    backgroundColor: '#006400', // Green background for friend container
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    width: '80%',
  },
  friendUsername: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFF', // White text color for friend usernames
    textAlign: 'center',
  },
  emptyText: {
    fontSize: 18,
    color: '#FFF', // White text color for empty message
    textAlign: 'center',
    marginTop: 40,
  },
});

export default FriendListScreen;
