import React, { useEffect, useState } from 'react';
import app from './firebase';
import { View, Text, TextInput, Button, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import Icon from 'react-native-vector-icons/Ionicons';
import { AntDesign } from '@expo/vector-icons';
import ScreenLockScreen from './ScreenLockMode';
import ProfileScreen from './ProfileScreen';
import ShopScreen from './ShopScreen';
import TimeTrackerScreen from './TimeTrackerScreen';
import LeaderboardScreen from './LeaderboardScreen';
import FFScreen from './FFScreen';
import SettingsScreen from './SettingsScreen';
import ChangeUsernameScreen from './ChangeUsernameScreen';
import ChangePasswordScreen from './ChangePasswordScreen';
import { getFirestore, collection, addDoc, doc, getDoc, onSnapshot, query, where } from 'firebase/firestore';

const Stack = createStackNavigator();
const auth = getAuth(app);
const db = getFirestore(app);

const createNewUserDocument = (userId, username) => {
  const userRef = collection(db, 'users');
  addDoc(userRef, {
    userId: userId,
    username: username,
    coins: 0, // Initial coin balance
  });
};

const LoginScreen = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    signInWithEmailAndPassword(auth, username, password)
      .then((userCredential) => {
        // Login successful
        const user = userCredential.user;
        console.log('User logged in:', user);
        navigation.navigate('Home');
      })
      .catch((error) => {
        // Handle login error
        console.log('Login failed:', error);
      });
  };

  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <Image source={require('./assets/FF-Icon.png')} style={styles.icon} />
      </View>
      <View style={styles.loginContainer}>
        <Text style={styles.heading}>Login</Text>
        <View style={styles.formContainer}>
          <TextInput
            style={styles.input}
            placeholder="Username"
            value={username}
            onChangeText={(text) => setUsername(text)}
            placeholderTextColor="#FFF"
          />
          <TextInput
            style={styles.input}
            placeholder="Password"
            secureTextEntry
            value={password}
            onChangeText={(text) => setPassword(text)}
            placeholderTextColor="#FFF"
          />
          <Button title="Login" onPress={handleLogin} />
          <Button
            title="Register"
            onPress={() => navigation.navigate('Register')}
          />
        </View>
      </View>
    </View>
  );
};

const RegisterScreen = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = () => {
    createUserWithEmailAndPassword(auth, username, password)
      .then((userCredential) => {
        // User registration successful
        const user = userCredential.user;
        console.log('User registered:', user);
        createNewUserDocument(user.uid, username); // Create user document in Firestore
        navigation.goBack();
      })
      .catch((error) => {
        // Handle registration error
        console.log('Registration failed:', error);
      });
  };

  return (
    <View style={styles.container}>
      <View style={styles.loginContainer}>
        <Text style={styles.heading}>Register</Text>
        <View style={styles.formContainer}>
          <TextInput
            style={styles.input}
            placeholder="Username"
            value={username}
            onChangeText={(text) => setUsername(text)}
            placeholderTextColor="#FFF"
          />
          <TextInput
            style={styles.input}
            placeholder="Password"
            secureTextEntry
            value={password}
            onChangeText={(text) => setPassword(text)}
            placeholderTextColor="#FFF"
          />
          <Button title="Register" onPress={handleRegister} />
          <Button title="Back" onPress={() => navigation.goBack()} />
        </View>
      </View>
    </View>
  );
};

const HomeScreen = ({ navigation }) => {
  const [coinBalance, setCoinBalance] = useState(0);
  const[username, setUsername] = useState('');
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
          setUsername(userData.username);
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
    }
  };

  const handleNavigation = (screenName) => {
    navigation.navigate(screenName);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Welcome, {username}.</Text>
      <Text style={styles.text}>Coin Balance: {coinBalance}</Text>
      <View style={styles.iconContainer}>
        {/* Existing icons */}
        <TouchableOpacity onPress={() => handleNavigation('ScreenLock')} style={styles.iconButton}>
          <View style={styles.iconWrapper}>
            <Icon name="ios-lock-closed" size={50} color="green" />
          </View>
          <Text style={styles.iconText}>Screen Lock</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => handleNavigation('Profile')} style={styles.iconButton}>
          <View style={styles.iconWrapper}>
            <Icon name="ios-person" size={50} color="green" />
          </View>
          <Text style={styles.iconText}>Profile</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => handleNavigation('Settings')} style={styles.iconButton}>
          <View style={styles.iconWrapper}>
            <Icon name="ios-settings" size={50} color="green" />
          </View>
          <Text style={styles.iconText}>Settings</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => handleNavigation('Leaderboard')} style={styles.iconButton}>
          <View style={styles.iconWrapper}>
            <Icon name="ios-podium" size={50} color="green" />
          </View>
          <Text style={styles.iconText}>Leaderboard</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => handleNavigation('Shop')} style={styles.iconButton}>
          <View style={styles.iconWrapper}>
            <Icon name="ios-cart" size={50} color="green" />
          </View>
          <Text style={styles.iconText}>Shop</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => handleNavigation('TimeTracker')} style={styles.iconButton}>
          <View style={styles.iconWrapper}>
            <AntDesign name="clockcircle" size={50} color="green" />
          </View>
          <Text style={styles.iconText}>Time Tracker</Text>
        </TouchableOpacity>

        {/* New icon */}
        <TouchableOpacity onPress={() => handleNavigation('FocusFriends')} style={styles.iconButton}>
          <View style={styles.iconWrapper}>
            <Icon name="people" size={50} color="green" />
          </View>
          <Text style={styles.iconText}>Focus Friends</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="ScreenLock" component={ScreenLockScreen} /> 
        <Stack.Screen name="Profile" component={ProfileScreen} /> 
        <Stack.Screen name="Leaderboard" component={LeaderboardScreen} /> 
        <Stack.Screen name="Shop" component={ShopScreen} /> 
        <Stack.Screen name="TimeTracker" component={TimeTrackerScreen} /> 
        <Stack.Screen name="FocusFriends" component={FFScreen} />
        <Stack.Screen name="Settings" component={SettingsScreen} />
        <Stack.Screen name="ChangeUsername" component={ChangeUsernameScreen} />
        <Stack.Screen name="ChangePassword" component={ChangePasswordScreen} />
        {/* Add more screens here */}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    width: 250,
    height: 250,
    resizeMode: 'contain',
  },
  iconContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  iconButton: {
    alignItems: 'center',
    margin: 16,
  },
  iconWrapper: {
    borderWidth: 2,
    borderColor: 'green',
    borderRadius: 50,
    padding: 10,
  },
  iconText: {
    marginTop: 8,
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
    color: 'grey',
  },
  loginContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '80%',
    backgroundColor: '#000',
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#FFF',
  },
  heading: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#FFF',
  },
  formContainer: {
    width: '100%',
    marginTop: 16,
    backgroundColor: '#000',
    padding: 16,
    borderRadius: 8,
  },
  input: {
    height: 40,
    borderColor: '#FFF',
    borderWidth: 1,
    marginBottom: 16,
    paddingHorizontal: 8,
    borderRadius: 4,
    color: '#FFF',
  },
  text: {
    color: '#FFF',
  },
});

export default App;