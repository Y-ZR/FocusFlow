import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { getFirestore, collection, doc, getDoc, onSnapshot, query, where, getDocs } from 'firebase/firestore';
import { auth, db } from './firebase';

const OwnedAvatarScreen = () => {
  const navigation = useNavigation();
  const [userAvatars, setUserAvatars] = useState([]);
  const user = auth.currentUser;

  useEffect(() => {
    if (user) {
      // Set up a real-time listener for the user document
      const userCollectionRef = collection(db, 'users');
      const userQuery = query(userCollectionRef, where('userId', '==', user.uid));
      const unsubscribe = onSnapshot(userQuery, (querySnapshot) => {
        querySnapshot.forEach((doc) => {
          const userData = doc.data();
          setUserAvatars(userData.avatars || []);
        });
      });

      // Clean up the listener when the component unmounts
      return () => unsubscribe();
    }
  }, [user]);

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Text style={styles.backButtonText}>Back</Text>
      </TouchableOpacity>
      <Text style={styles.heading}>Owned Avatars</Text>
      {userAvatars.length === 0 ? (
        <Text style={styles.emptyText}>You don't own any avatars yet.</Text>
      ) : (
        <ScrollView contentContainerStyle={styles.gridContainer}>
          <View style={styles.itemContainer}>
            {userAvatars.includes('ORBIMG1') ? (
              <View style={styles.itemContainer}>
                <Image source={require('./assets/ORBIMG1.jpg')} style={styles.image} />
              </View>
            ) : (<Image source={require('./assets/adaptive-icon.png')} style={styles.image} />)}
          </View>

          <View style={styles.itemContainer}>
            {userAvatars.includes('ORBIMG2') ? (
              <View style={styles.itemContainer}>
                <Image source={require('./assets/ORBIMG2.jpg')} style={styles.image} />
              </View>
            ) : (<Image source={require('./assets/adaptive-icon.png')} style={styles.image} />)}
          </View>

          <View style={styles.itemContainer}>
            {userAvatars.includes('ORBIMG3') ? (
              <View style={styles.itemContainer}>
                <Image source={require('./assets/ORBIMG3.jpg')} style={styles.image} />
              </View>
            ) : (<Image source={require('./assets/adaptive-icon.png')} style={styles.image} />)}
          </View>

          <View style={styles.itemContainer}>
            {userAvatars.includes('ORBIMG4') ? (
              <View style={styles.itemContainer}>
                <Image source={require('./assets/ORBIMG4.jpg')} style={styles.image} />
              </View>
            ) : (<Image source={require('./assets/adaptive-icon.png')} style={styles.image} />)}
          </View>

          <View style={styles.itemContainer}>
            {userAvatars.includes('ORBIMG5') ? (
              <View style={styles.itemContainer}>
                <Image source={require('./assets/ORBIMG5.jpg')} style={styles.image} />
              </View>
            ) : (<Image source={require('./assets/adaptive-icon.png')} style={styles.image} />)}
          </View>

          <View style={styles.itemContainer}>
            {userAvatars.includes('ORBIMG6') ? (
              <View style={styles.itemContainer}>
                <Image source={require('./assets/ORBIMG6.jpg')} style={styles.image} />
              </View>
            ) : (<Image source={require('./assets/adaptive-icon.png')} style={styles.image} />)}
          </View>

          <View style={styles.itemContainer}>
            {userAvatars.includes('ORBIMG7') ? (
              <View style={styles.itemContainer}>
                <Image source={require('./assets/ORBIMG7.jpg')} style={styles.image} />
              </View>
            ) : (<Image source={require('./assets/adaptive-icon.png')} style={styles.image} />)}
          </View>

          <View style={styles.itemContainer}>
            {userAvatars.includes('ORBIMG8') ? (
              <View style={styles.itemContainer}>
                <Image source={require('./assets/ORBIMG8.jpg')} style={styles.image} />
              </View>
            ) : (<Image source={require('./assets/adaptive-icon.png')} style={styles.image} />)}
          </View>
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    paddingTop: 40,
    paddingHorizontal: 20,
  },
  heading: {
    fontSize: 40,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#FFF', // White text color for dark mode
    textAlign: 'center',
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
  emptyText: {
    fontSize: 18,
    color: '#FFF', // White text color for empty message
    textAlign: 'center',
    marginTop: 40,
  },
  gridContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 20,
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  itemContainer: {
    alignItems: 'center',
    marginBottom: 20,
    width: '48%',
  },
  emptyItemContainer: {
    width: '48%',
  },
  image: {
    width: 100,
    height: 100,
    resizeMode: 'contain',
  },
});

export default OwnedAvatarScreen;