import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, Alert, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { getFirestore, collection, addDoc, doc, getDoc, onSnapshot, query, where, getDocs, updateDoc, querySnapshot } from 'firebase/firestore';
import { auth, db } from './firebase';

const OwnedAvatarScreen = () => {
  const navigation = useNavigation();
  const [userAvatars, setUserAvatars] = useState([]);
  const [equippedAvatar, setEquippedAvatar] = useState("");
  const user = auth.currentUser;

  useEffect(() => {
    if (user) {
      // Set up a real-time listener for the user document
      const userCollectionRef = collection(db, 'users');
      const userQuery = query(userCollectionRef, where('userId', '==', user.uid));
      const unsubscribe = onSnapshot(userQuery, (querySnapshot) => {
        querySnapshot.forEach((doc) => {
          const userData = doc.data();
          setUserAvatars(userData.avatars);
          setEquippedAvatar(userData.profilePic);
        });
      });

      // Clean up the listener when the component unmounts
      return () => unsubscribe();
    }
  }, [user]);

  // Function to handle the "Equip" button press
  const handleEquipAvatar = async (avatar) => {
    try {
      // Update the profilePic field in the user document with the selected avatar
      const userId = auth.currentUser?.uid;
      const userCollectionRef = collection(db, 'users');
      const userQuery = await getDocs(query(userCollectionRef, where('userId', '==', userId)));
      if (!userQuery.empty) {
        const documentSnapshot = userQuery.docs[0];
        const userDocRef = doc(db, 'users', documentSnapshot.id);
        await updateDoc(userDocRef, { profilePic: avatar });
      }
      
      // Show a success message
      Alert.alert('Avatar Equipped', 'Your profile picture has been updated.');

    } catch (error) {
      console.log('Error updating profile picture:', error);
      Alert.alert('Error', 'Failed to update your profile picture. Please try again.');
    }
  };

  const handleUnequipAvatar = async () => {
    try {
      // Update the profilePic field in the user document with the selected avatar
      const userId = auth.currentUser?.uid;
      const userCollectionRef = collection(db, 'users');
      const userQuery = await getDocs(query(userCollectionRef, where('userId', '==', userId)));
      if (!userQuery.empty) {
        const documentSnapshot = userQuery.docs[0];
        const userDocRef = doc(db, 'users', documentSnapshot.id);
        await updateDoc(userDocRef, { profilePic: "" });
      }
      
      // Show a success message
      Alert.alert('Avatar Unequipped', 'Your profile picture has been updated.');

    } catch (error) {
      console.log('Error updating profile picture:', error);
      Alert.alert('Error', 'Failed to update your profile picture. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Text style={styles.backButtonText}>Back</Text>
      </TouchableOpacity>
      <View style={styles.headerContainer}>
        <Text style={styles.heading}>Unlocked Avatars</Text>
      </View>
      <ScrollView contentContainerStyle={styles.gridContainer}>
        <View style={styles.row}>
          <View style={styles.itemContainer}>
            {userAvatars.includes('ORBIMG1') ? (
              <Image source={require('./assets/ORBIMG1.jpg')} style={styles.image} />
            ) : (
              <Image source={require('./assets/adaptive-icon.png')} style={styles.image} />
            )}
            {userAvatars.includes('ORBIMG1') ? (
              equippedAvatar === 'ORBIMG1' ? (
                // If the avatar is equipped, show the "Equipped" button
                <TouchableOpacity 
                  style={styles.ownedButton}
                  onPress={() => handleUnequipAvatar()}
                >
                  <Text style={styles.ownedButtonText} >Unequip</Text>
                </TouchableOpacity>
              ) : (
                // If the avatar is not equipped, show the "Equip" button with onPress event
                <TouchableOpacity
                  style={styles.buyButton}
                  onPress={() => handleEquipAvatar('ORBIMG1')} // Pass the avatar key to handleEquipAvatar
                >
                  <Text style={styles.ownedButtonText}>Equip</Text>
                </TouchableOpacity>
              )
            ) : (
              <TouchableOpacity
                style={styles.ownedButton}
              >
                <Text style={styles.buyButtonText}>Locked</Text>
              </TouchableOpacity>
            )}
          </View>

          <View style={styles.itemContainer}>
            {userAvatars.includes('ORBIMG2') ? (
              <Image source={require('./assets/ORBIMG2.jpg')} style={styles.image} />
            ) : (
              <Image source={require('./assets/adaptive-icon.png')} style={styles.image} />
            )}
            {userAvatars.includes('ORBIMG2') ? (
              equippedAvatar === 'ORBIMG2' ? (
                // If the avatar is equipped, show the "Equipped" button
                <TouchableOpacity 
                  style={styles.ownedButton}
                  onPress={() => handleUnequipAvatar()}
                >
                  <Text style={styles.ownedButtonText} >Unequip</Text>
                </TouchableOpacity>
              ) : (
                // If the avatar is not equipped, show the "Equip" button with onPress event
                <TouchableOpacity
                  style={styles.buyButton}
                  onPress={() => handleEquipAvatar('ORBIMG2')} // Pass the avatar key to handleEquipAvatar
                >
                  <Text style={styles.ownedButtonText}>Equip</Text>
                </TouchableOpacity>
              )
            ) : (
              <TouchableOpacity
                style={styles.ownedButton}
              >
                <Text style={styles.buyButtonText}>Locked</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        <View style={styles.row}>
          <View style={styles.itemContainer}>
            {userAvatars.includes('ORBIMG3') ? (
              <Image source={require('./assets/ORBIMG3.jpg')} style={styles.image} />
            ) : (
              <Image source={require('./assets/adaptive-icon.png')} style={styles.image} />
            )}
            {userAvatars.includes('ORBIMG3') ? (
              equippedAvatar === 'ORBIMG3' ? (
                // If the avatar is equipped, show the "Equipped" button
                <TouchableOpacity 
                  style={styles.ownedButton}
                  onPress={() => handleUnequipAvatar()}
                >
                  <Text style={styles.ownedButtonText} >Unequip</Text>
                </TouchableOpacity>
              ) : (
                // If the avatar is not equipped, show the "Equip" button with onPress event
                <TouchableOpacity
                  style={styles.buyButton}
                  onPress={() => handleEquipAvatar('ORBIMG3')} // Pass the avatar key to handleEquipAvatar
                >
                  <Text style={styles.ownedButtonText}>Equip</Text>
                </TouchableOpacity>
              )
            ) : (
              <TouchableOpacity
                style={styles.ownedButton}
              >
                <Text style={styles.buyButtonText}>Locked</Text>
              </TouchableOpacity>
            )}
          </View>

          <View style={styles.itemContainer}>
            {userAvatars.includes('ORBIMG4') ? (
              <Image source={require('./assets/ORBIMG4.jpg')} style={styles.image} />
            ) : (
              <Image source={require('./assets/adaptive-icon.png')} style={styles.image} />
            )}
            {userAvatars.includes('ORBIMG4') ? (
              equippedAvatar === 'ORBIMG4' ? (
                // If the avatar is equipped, show the "Equipped" button
                <TouchableOpacity 
                  style={styles.ownedButton}
                  onPress={() => handleUnequipAvatar()}
                >
                  <Text style={styles.ownedButtonText} >Unequip</Text>
                </TouchableOpacity>
              ) : (
                // If the avatar is not equipped, show the "Equip" button with onPress event
                <TouchableOpacity
                  style={styles.buyButton}
                  onPress={() => handleEquipAvatar('ORBIMG4')} // Pass the avatar key to handleEquipAvatar
                >
                  <Text style={styles.ownedButtonText}>Equip</Text>
                </TouchableOpacity>
              )
            ) : (
              <TouchableOpacity
                style={styles.ownedButton}
              >
                <Text style={styles.buyButtonText}>Locked</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        <View style={styles.row}>
          <View style={styles.itemContainer}>
            {userAvatars.includes('ORBIMG5') ? (
              <Image source={require('./assets/ORBIMG5.jpg')} style={styles.image} />
            ) : (
              <Image source={require('./assets/adaptive-icon.png')} style={styles.image} />
            )}
            {userAvatars.includes('ORBIMG5') ? (
              equippedAvatar === 'ORBIMG5' ? (
                // If the avatar is equipped, show the "Equipped" button
                <TouchableOpacity 
                  style={styles.ownedButton}
                  onPress={() => handleUnequipAvatar()}
                >
                  <Text style={styles.ownedButtonText} >Unequip</Text>
                </TouchableOpacity>
              ) : (
                // If the avatar is not equipped, show the "Equip" button with onPress event
                <TouchableOpacity
                  style={styles.buyButton}
                  onPress={() => handleEquipAvatar('ORBIMG5')} // Pass the avatar key to handleEquipAvatar
                >
                  <Text style={styles.ownedButtonText}>Equip</Text>
                </TouchableOpacity>
              )
            ) : (
              <TouchableOpacity
                style={styles.ownedButton}
              >
                <Text style={styles.buyButtonText}>Locked</Text>
              </TouchableOpacity>
            )}
          </View>

          <View style={styles.itemContainer}>
            {userAvatars.includes('ORBIMG6') ? (
              <Image source={require('./assets/ORBIMG6.jpg')} style={styles.image} />
            ) : (
              <Image source={require('./assets/adaptive-icon.png')} style={styles.image} />
            )}
            {userAvatars.includes('ORBIMG6') ? (
              equippedAvatar === 'ORBIMG6' ? (
                // If the avatar is equipped, show the "Equipped" button
                <TouchableOpacity 
                  style={styles.ownedButton}
                  onPress={() => handleUnequipAvatar()}
                >
                  <Text style={styles.ownedButtonText} >Unequip</Text>
                </TouchableOpacity>
              ) : (
                // If the avatar is not equipped, show the "Equip" button with onPress event
                <TouchableOpacity
                  style={styles.buyButton}
                  onPress={() => handleEquipAvatar('ORBIMG6')} // Pass the avatar key to handleEquipAvatar
                >
                  <Text style={styles.ownedButtonText}>Equip</Text>
                </TouchableOpacity>
              )
            ) : (
              <TouchableOpacity
                style={styles.ownedButton}
              >
                <Text style={styles.buyButtonText}>Locked</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        <View style={styles.row}>
          <View style={styles.itemContainer}>
            {userAvatars.includes('ORBIMG7') ? (
              <Image source={require('./assets/ORBIMG7.jpg')} style={styles.image} />
            ) : (
              <Image source={require('./assets/adaptive-icon.png')} style={styles.image} />
            )}
            {userAvatars.includes('ORBIMG7') ? (
              equippedAvatar === 'ORBIMG7' ? (
                // If the avatar is equipped, show the "Equipped" button
                <TouchableOpacity 
                  style={styles.ownedButton}
                  onPress={() => handleUnequipAvatar()}
                >
                  <Text style={styles.ownedButtonText} >Unequip</Text>
                </TouchableOpacity>
              ) : (
                // If the avatar is not equipped, show the "Equip" button with onPress event
                <TouchableOpacity
                  style={styles.buyButton}
                  onPress={() => handleEquipAvatar('ORBIMG7')} // Pass the avatar key to handleEquipAvatar
                >
                  <Text style={styles.ownedButtonText}>Equip</Text>
                </TouchableOpacity>
              )
            ) : (
              <TouchableOpacity
                style={styles.ownedButton}
              >
                <Text style={styles.buyButtonText}>Locked</Text>
              </TouchableOpacity>
            )}
          </View>

          <View style={styles.itemContainer}>
            {userAvatars.includes('ORBIMG8') ? (
              <Image source={require('./assets/ORBIMG8.jpg')} style={styles.image} />
            ) : (
              <Image source={require('./assets/adaptive-icon.png')} style={styles.image} />
            )}
            {userAvatars.includes('ORBIMG8') ? (
              equippedAvatar === 'ORBIMG8' ? (
                // If the avatar is equipped, show the "Equipped" button
                <TouchableOpacity 
                  style={styles.ownedButton}
                  onPress={() => handleUnequipAvatar()}
                >
                  <Text style={styles.ownedButtonText} >Unequip</Text>
                </TouchableOpacity>
              ) : (
                // If the avatar is not equipped, show the "Equip" button with onPress event
                <TouchableOpacity
                  style={styles.buyButton}
                  onPress={() => handleEquipAvatar('ORBIMG8')} // Pass the avatar key to handleEquipAvatar
                >
                  <Text style={styles.ownedButtonText}>Equip</Text>
                </TouchableOpacity>
              )
            ) : (
              <TouchableOpacity
                style={styles.ownedButton}
              >
                <Text style={styles.buyButtonText}>Locked</Text>
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
  headerContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 60,
    marginBottom: 24,
  },
  heading: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFF',
  },
  coinBalance: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFF',
    marginTop: 16,
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
    width: '57%',
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
    width: '58%',
  },
  ownedButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FFF',
    textAlign: 'center',
  },
});

export default OwnedAvatarScreen;