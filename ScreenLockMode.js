import React, { useState, useEffect, useRef } from 'react';
import { AppState, View, Text, StyleSheet, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { auth, db } from './firebase';
import { collection, query, where, getDocs, getDoc, doc, updateDoc } from 'firebase/firestore';

const ScreenLockScreen = () => {
  const [time, setTime] = useState('');
  const [countdown, setCountdown] = useState(0);
  const [coinBalance, setCoinBalance] = useState(0);
  const [earnedCoins, setEarnedCoins] = useState(0);
  const [isQuitting, setIsQuitting] = useState(false);
  const [isAppInBackground, setIsAppInBackground] = useState(false);
  const navigation = useNavigation();
  const appState = useRef(AppState.currentState);

  useEffect(() => {
    let timer;

    if (countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prevCountdown) => prevCountdown - 1);
      }, 1000);
    } else if (countdown === 0 && earnedCoins > 0 && !isQuitting) {
      updateCoinBalance(earnedCoins);
      updateTimeBalance(earnedCoins);
      Alert.alert('Timer Completed', `You earned ${earnedCoins} coins!`);
    }

    return () => {
      clearInterval(timer);
    };
  }, [countdown]);

  useEffect(() => {
    // Subscribe to AppState changes when the component mounts
    const handleAppStateChange = (nextAppState) => {
      appState.current = nextAppState;
      if (nextAppState === 'background') {
        // App is in the background
        setIsAppInBackground(true);
      } else {
        // App is in the foreground or inactive
        setIsAppInBackground(false);
      }
    };

    AppState.addEventListener('change', handleAppStateChange);
    return () => {
      AppState.removeEventListener('change', handleAppStateChange);
    };
  }, []);

  useEffect(() => {
    if (!isAppInBackground) {
      // If the app is not in the background, check if the countdown is active and show the alert
      if (countdown > 0) {
        Alert.alert('You have attempted to exit the app!', 'We are disappointed in you. You will not earn any coins from that session.',
         [{ text: 'Sorry, I will reflect upon my life', style: 'destructive', onPress: handleQuitConfirmed },]);
      }
    }
  }, [isAppInBackground]);


  const handleStartCountdown = () => {
    const parsedTime = parseInt(time);
    if (isNaN(parsedTime) || parsedTime <= 0) {
      Alert.alert('Invalid Time', 'Please enter a valid time in minutes.');
      return;
    }

    setTime('');
    setCountdown(parsedTime * 60);
    setEarnedCoins(parsedTime); // Set the earned coins to the parsedTime (1 coin per minute)
    setIsQuitting(false); // Reset the quitting flag
  };

  const handleQuitCountdown = () => {
    Alert.alert(
      'Quit Screen Lock Mode',
      'Are you sure you want to quit the Screen Lock Mode?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Quit', style: 'destructive', onPress: handleQuitConfirmed },
      ]
    );
  };

  const handleQuitConfirmed = () => {
    setIsQuitting(true);
    setCountdown(0);
  };
  
  const handleBackButton = () => {
    navigation.goBack();
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

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
          const currentTotalCoins = userData.totalcoinsever || 0;
          const newBalance = currentCoins + earnedCoins;
          const newCurrentTotal = currentTotalCoins + earnedCoins;
          console.log(userDocRef);
          await updateDoc(userDocRef, { coins: newBalance });
          await updateDoc(userDocRef, { totalcoinsever: newCurrentTotal });
          console.log(newBalance);
          console.log('Coin balance updated successfully.');
        }
      }
    } catch (error) {
      console.error('Error updating coin balance:', error);
    }
  };

  const updateTimeBalance = async (earnedCoins) => {
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
          const mostTime = userData.mosttimeever || 0;
          if ((mostTime) < earnedCoins) {
            console.log(userDocRef);
            await updateDoc(userDocRef, { mosttimeever: earnedCoins });
            
          }
        }
      }
    } catch (error) {
      console.error('Error updating coin balance:', error);
    }
  };

  return (
    <View style={styles.container}>
      {countdown === 0 && (
        <TouchableOpacity style={styles.backButton} onPress={handleBackButton}>
          <Text style={styles.backButtonText}>Back</Text>
        </TouchableOpacity>
      )}
      <Text style={styles.heading}>Lock you phone!</Text>
      <Text style={styles.subText}>Please enter the amount of time (in mins) to lock your phone for:</Text>
      <View style={styles.timerContainer}>
        {countdown > 0 ? (
          <Text style={styles.timer}>{formatTime(countdown)}</Text>
        ) : (
          <TextInput
            style={styles.input}
            value={time}
            onChangeText={setTime}
            keyboardType="numeric"
            textAlign="center"
            fontSize={48}
          />
        )}
      </View>
      {countdown > 0 ? (
        <TouchableOpacity style={styles.buttonGreen} onPress={handleQuitCountdown}>
          <Text style={styles.buttonText}>Quit</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity style={styles.buttonGreen} onPress={handleStartCountdown}>
          <Text style={styles.buttonText}>Start</Text>
        </TouchableOpacity>
      )}
      {countdown > 0 && (
        <View style={styles.coinBalanceContainer}>
          <Text style={styles.coinBalanceText}>Coins to be earned: {earnedCoins}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    justifyContent: 'center',
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
  heading: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#FFF',
  },
  subText: {
    fontSize: 16,
    marginLeft: 16,
    marginRight: 16,
    marginBottom: 32,
    color: '#FFF',
    textAlign: 'center',
  },
  timerContainer: {
    marginBottom: 32,
  },
  timer: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#FFF',
  },
  input: {
    width: 200,
    height: 80,
    backgroundColor: '#121212',
    color: '#FFF',
    fontSize: 48,
    fontWeight: 'bold',
    borderWidth: 0,
    borderBottomWidth: 2,
    borderBottomColor: '#FFF',
    textAlign: 'center',
    paddingBottom: 8,
    marginBottom: 32,
  },
  buttonGreen: {
    marginTop: 10,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#006400', // Duller green color for buttons
    borderRadius: 8,
    width: '20%', // Set a fixed width for the buttons
    justifyContent: 'center', // Center the text inside the button
    alignItems: 'center', // Center the text inside the button
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFF', // White text color for buttons in dark mode
  },
  coinBalanceContainer: {
    marginTop: 16,
  },
  coinBalanceText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
});

export default ScreenLockScreen;