import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, Alert, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { getFirestore, collection, addDoc, doc, getDoc, onSnapshot, query, where, getDocs, updateDoc } from 'firebase/firestore';
import { auth, db } from './firebase';

const ShopScreen = () => {
  const navigation = useNavigation();
  const [coinBalance, setCoinBalance] = useState(0);
  const [userAvatars, setUserAvatars] = useState([]);
  const user = auth.currentUser;

  useEffect(() => {
    if (user) {
      fetchCoinBalance(user.uid);

      // Set up a real-time listener for the user document
      const userCollectionRef = collection(db, 'users');
      const userQuery = query(userCollectionRef, where('userId', '==', user.uid));
      const unsubscribe = onSnapshot(userQuery, (querySnapshot) => {
        querySnapshot.forEach((doc) => {
          const userData = doc.data();
          setCoinBalance(userData.coins);
          setUserAvatars(userData.avatars);
        });
      });

      // Clean up the listener when the component unmounts
      return () => unsubscribe();
    }
  }, [user]);

  const fetchCoinBalance = async (userId) => {
    const userDocRef = doc(db, 'users', userId);
    const userDocSnap = await getDoc(userDocRef);
    if (userDocSnap.exists()) {
      const userData = userDocSnap.data();
      setCoinBalance(userData.coins);
      setUserAvatars(userData.avatars);
    }
  };

  const handleBuy = async (itemNumber, cost, avatar) => {

    const updateCoinBalance = async (earnedCoins) => {
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
            const currentCoins = userData.coins || 0;
            const newBalance = currentCoins + earnedCoins;
            console.log(userDocRef);
            await updateDoc(userDocRef, { coins: newBalance });
            console.log(newBalance);
            console.log('Coin balance updated successfully.');
          }
        }
      } catch (error) {
        console.error('Error updating coin balance:', error);
      }
    };

    const updateAvatars = async (ava) => {
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
            const currentAvatars = userData.avatars || [];
            const newAvatar = [...currentAvatars, avatar];
            console.log(userDocRef);
            await updateDoc(userDocRef, { avatars:newAvatar });
          }
        }
      } catch (error) {
        console.error('Error updating avatars:', error);
      }
    };


    // Check if the user already has the avatar
    if (userAvatars.includes(avatar)) {
      Alert.alert('Error', 'You already have this avatar!');
      return;
    }

    // Check if the user has enough coins to make the purchase
    if (coinBalance < cost) {
      Alert.alert('Error', 'Insufficient coins!');
      return;
    }

    try {
      // Update the user's coin balance
      updateCoinBalance(cost*-1);

      // Update the user's avatars array
      updateAvatars(avatar);

      // Display a success message
      Alert.alert('Success', 'Avatar purchased successfully!');
    } catch (error) {
      // Handle the error
      Alert.alert('Error', 'An error occurred. Please try again later.');
      console.error('Purchase failed:', error);
    }
  };



  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Text style={styles.backButtonText}>Back</Text>
      </TouchableOpacity>
      <View style={styles.headerContainer}>
        <Image source={require('./assets/ORBIMG12.png')} style={styles.icon} />
        <Text style={styles.heading}>Shop</Text>
        <Text style={styles.subText}>Time to splurge!</Text>
        <Text style={styles.coinBalance}>Coins Available: {coinBalance}</Text>
      </View>
      <ScrollView contentContainerStyle={styles.gridContainer}>
        <View style={styles.row}>
          <View style={styles.itemContainer}>
            <Image source={require('./assets/ORBIMG1.jpg')} style={styles.image} />
            {userAvatars.includes('ORBIMG1') ? (
              <TouchableOpacity style={styles.ownedButton}>
                <Text style={styles.ownedButtonText}>Owned</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={styles.buyButton}
                onPress={() => handleBuy(1, 100, 'ORBIMG1')}
              >
                <Text style={styles.buyButtonText}>100 coins</Text>
              </TouchableOpacity>
            )}
          </View>
          <View style={styles.itemContainer}>
            <Image source={require('./assets/ORBIMG2.jpg')} style={styles.image} />
            {userAvatars.includes('ORBIMG2') ? (
              <TouchableOpacity style={styles.ownedButton}>
                <Text style={styles.ownedButtonText}>Owned</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={styles.buyButton}
                onPress={() => handleBuy(2, 200, 'ORBIMG2')}
              >
                <Text style={styles.buyButtonText}>200 coins</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
        <View style={styles.row}>
          <View style={styles.itemContainer}>
            <Image source={require('./assets/ORBIMG3.jpg')} style={styles.image} />
            {userAvatars.includes('ORBIMG3') ? (
              <TouchableOpacity style={styles.ownedButton}>
                <Text style={styles.ownedButtonText}>Owned</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={styles.buyButton}
                onPress={() => handleBuy(3, 300, 'ORBIMG3')}
              >
                <Text style={styles.buyButtonText}>300 coins</Text>
              </TouchableOpacity>
            )}
          </View>
          <View style={styles.itemContainer}>
            <Image source={require('./assets/ORBIMG4.jpg')} style={styles.image} />
            {userAvatars.includes('ORBIMG4') ? (
              <TouchableOpacity style={styles.ownedButton}>
                <Text style={styles.ownedButtonText}>Owned</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={styles.buyButton}
                onPress={() => handleBuy(4, 400, 'ORBIMG4')}
              >
                <Text style={styles.buyButtonText}>400 coins</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
        <View style={styles.row}>
          <View style={styles.itemContainer}>
            <Image source={require('./assets/ORBIMG5.jpg')} style={styles.image} />
            {userAvatars.includes('ORBIMG5') ? (
              <TouchableOpacity style={styles.ownedButton}>
                <Text style={styles.ownedButtonText}>Owned</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={styles.buyButton}
                onPress={() => handleBuy(5, 500, 'ORBIMG5')}
              >
                <Text style={styles.buyButtonText}>500 coins</Text>
              </TouchableOpacity>
            )}
          </View>
          <View style={styles.itemContainer}>
            <Image source={require('./assets/ORBIMG6.jpg')} style={styles.image} />
            {userAvatars.includes('ORBIMG6') ? (
              <TouchableOpacity style={styles.ownedButton}>
                <Text style={styles.ownedButtonText}>Owned</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={styles.buyButton}
                onPress={() => handleBuy(6, 600, 'ORBIMG6')}
              >
                <Text style={styles.buyButtonText}>600 coins</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
        <View style={styles.row}>
          <View style={styles.itemContainer}>
            <Image source={require('./assets/ORBIMG7.jpg')} style={styles.image} />
            {userAvatars.includes('ORBIMG7') ? (
              <TouchableOpacity style={styles.ownedButton}>
                <Text style={styles.ownedButtonText}>Owned</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={styles.buyButton}
                onPress={() => handleBuy(7, 700, 'ORBIMG7')}
              >
                <Text style={styles.buyButtonText}>700 coins</Text>
              </TouchableOpacity>
            )}
          </View>
          <View style={styles.itemContainer}>
            <Image source={require('./assets/ORBIMG8.jpg')} style={styles.image} />
            {userAvatars.includes('ORBIMG8') ? (
              <TouchableOpacity style={styles.ownedButton}>
                <Text style={styles.ownedButtonText}>Owned</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={styles.buyButton}
                onPress={() => handleBuy(8, 800, 'ORBIMG8')}
              >
                <Text style={styles.buyButtonText}>800 coins</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    alignItems: 'center',
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
  icon: {
    width: 130, // Adjust the width and height as needed
    height: 130,
    resizeMode: 'contain',
    marginTop: 10
  },
  headerContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 60,
    marginBottom: 24,
  },
  heading: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: -15
  },
  subText: {
    fontSize: 18,
    color: '#BBB', // Light gray color for subtext in dark mode
    marginTop: 20,
  },
  coinBalance: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'lightgrey',
    marginTop: 7,
  },
  gridContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 20,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  itemContainer: {
    alignItems: 'center',
    width: '48%',
  },
  image: {
    width: 100,
    height: 100,
    resizeMode: 'contain',
  },
  buyButton: {
    marginTop: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#006400',
    borderRadius: 8,
    width: '62%',
  },
  buyButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFF',
    textAlign: 'center',
  },
  ownedButton: {
    marginTop: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#888',
    borderRadius: 8,
    width: '62%',
  },
  ownedButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FFF',
    textAlign: 'center',
  },
});

export default ShopScreen;