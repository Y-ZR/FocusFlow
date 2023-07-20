import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { collection, query, where, doc, getDoc, getDocs, updateDoc, arrayRemove, onSnapshot } from 'firebase/firestore';
import { auth, db } from './firebase';

const FriendRequestScreen = () => {
  const navigation = useNavigation();
  const [friendRequests, setFriendRequests] = useState([]);
  const [username, setUsername] = useState([]);

  useEffect(() => {
    // Fetch the user's friend requests from Firestore
    const fetchFriendRequests = async () => {
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
                    setFriendRequests(userData.requests || []);
                    setUsername(userData.username);
                  }
                  return () => unsubscribe();
                });
              }
            }
      } catch (error) {
        console.log('Error fetching friend requests:', error);
      }
    };

    fetchFriendRequests();
  }, []);

  const handleAcceptRequest = async (senderUsername) => {
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
          const currentFriends = userData.friends || [];
          const newFriends = [...currentFriends, senderUsername];
          await updateDoc(userDocRef, { friends: newFriends });

          // Remove the sender's username from the friend requests
          await updateDoc(userDocRef, { requests: arrayRemove(senderUsername) });
        }
      }

      // Now, update the sender's friends list
      const senderQuerySnapshot = await getDocs(query(usersCollectionRef, where('username', '==', senderUsername)));
      if (!senderQuerySnapshot.empty) {
        const senderDocumentSnapshot = senderQuerySnapshot.docs[0];
        const senderDocRef = doc(db, 'users', senderDocumentSnapshot.id);
        const senderDocSnap = await getDoc(senderDocRef);
        if (senderDocSnap.exists()) {
          const senderData = senderDocSnap.data();
          const senderCurrentFriends = senderData.friends || [];
          const senderNewFriends = [...senderCurrentFriends, username];
          await updateDoc(senderDocRef, { friends: senderNewFriends });
        }
      }
      Alert.alert('Success', 'Friend request accepted!');
    } catch (error) {
      console.error('Error accepting friend request:', error);
    }
  };

  const handleRejectRequest = async (senderUsername) => {
    try {
      const userId = auth.currentUser?.uid; // Get the currently authenticated user's ID
      const usersCollectionRef = collection(db, 'users');
      const querySnapshot = await getDocs(query(usersCollectionRef, where('userId', '==', userId)));
      if (!querySnapshot.empty) {
        const documentSnapshot = querySnapshot.docs[0];
        const userDocRef = doc(db, 'users', documentSnapshot.id);
        const userDocSnap = await getDoc(userDocRef);
        if (userDocSnap.exists()) {
          // Remove the sender's username from the friend requests
          await updateDoc(userDocRef, { requests: arrayRemove(senderUsername) });
        }
      }
      Alert.alert('Success', 'Friend request rejected!');
    } catch (error) {
      console.error('Error rejecting friend request:', error);
    }
  };

  const renderFriendRequest = ({ item }) => (
    <View style={styles.friendRequestItem}>
      <Text style={styles.friendUsername}>{item}</Text>
      <View style={styles.buttonsContainer}>
        <TouchableOpacity
          style={[styles.button, styles.acceptButton]}
          onPress={() => handleAcceptRequest(item)}
        >
          <Text style={styles.buttonText}>Accept</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, styles.rejectButton]}
          onPress={() => handleRejectRequest(item)}
        >
          <Text style={styles.buttonText}>Reject</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Text style={styles.backButtonText}>Back</Text>
      </TouchableOpacity>
      <Text style={styles.heading}>Friend Requests</Text>
      <FlatList
        data={friendRequests}
        renderItem={renderFriendRequest}
        keyExtractor={(item) => item}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={() => <Text style={styles.emptyText}>No friend requests</Text>}
      />
    </View>
  );
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#121212', // Dark background color for dark mode
    },
    heading: {
      fontSize: 40,
      fontWeight: 'bold',
      marginBottom: 24, // Move the heading down with more margin
      color: '#FFF', // White text color for dark mode
      textAlign: 'center',
      marginTop: 80, // Add top margin for spacing
    },
    listContainer: {
      paddingHorizontal: 16,
      paddingVertical: 8,
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
    friendRequestItem: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      backgroundColor: '#1E1E1E', // Darker background for friend request item in dark mode
      borderRadius: 8,
      padding: 16,
      marginBottom: 8,
      elevation: 2, // Add shadow for a card-like effect
    },
    friendUsername: {
      fontSize: 16,
      fontWeight: 'bold',
      color: '#FFF', // White text color for friend username in dark mode
    },
    buttonsContainer: {
      flexDirection: 'row',
    },
    button: {
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 8,
      marginLeft: 8,
    },
    acceptButton: {
      backgroundColor: '#00AA00', // Green color for accept button
    },
    rejectButton: {
      backgroundColor: '#AA0000', // Red color for reject button
    },
    buttonText: {
      fontSize: 14,
      fontWeight: 'bold',
      color: '#FFF', // White text color for buttons in dark mode
    },
    emptyText: {
      fontSize: 16,
      color: '#BBB', // Light gray color for empty text in dark mode
      textAlign: 'center',
      marginTop: 16, // Add top margin for spacing
    },
  });

export default FriendRequestScreen;