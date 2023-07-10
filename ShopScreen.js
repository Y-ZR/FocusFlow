import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const ShopScreen = () => {
  const navigation = useNavigation();

  const handleBuy = (itemNumber) => {
    // Handle buy functionality based on itemNumber
    console.log(`Buy item ${itemNumber}`);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Text style={styles.backButtonText}>Back</Text>
      </TouchableOpacity>
      <View style={styles.headerContainer}>
        <Text style={styles.heading}>SHOP</Text>
      </View>
      <View style={styles.gridContainer}>
        <View style={styles.row}>
          <View style={styles.itemContainer}>
            <Image source={require('./assets/ORBIMG1.jpg')} style={styles.image} />
            <TouchableOpacity style={styles.buyButton} onPress={() => handleBuy(1)}>
              <Text style={styles.buyButtonText}>BUY: 100 coins</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.itemContainer}>
            <Image source={require('./assets/ORBIMG2.jpg')} style={styles.image} />
            <TouchableOpacity style={styles.buyButton} onPress={() => handleBuy(2)}>
              <Text style={styles.buyButtonText}>BUY: 200 coins</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.row}>
          <View style={styles.itemContainer}>
            <Image source={require('./assets/ORBIMG3.jpg')} style={styles.image} />
            <TouchableOpacity style={styles.buyButton} onPress={() => handleBuy(3)}>
              <Text style={styles.buyButtonText}>BUY: 300 coins</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.itemContainer}>
            <Image source={require('./assets/ORBIMG4.jpg')} style={styles.image} />
            <TouchableOpacity style={styles.buyButton} onPress={() => handleBuy(4)}>
              <Text style={styles.buyButtonText}>BUY: 400 coins</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.row}>
          <View style={styles.itemContainer}>
            <Image source={require('./assets/ORBIMG5.jpg')} style={styles.image} />
            <TouchableOpacity style={styles.buyButton} onPress={() => handleBuy(5)}>
              <Text style={styles.buyButtonText}>BUY: 500 coins</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.itemContainer}>
            <Image source={require('./assets/ORBIMG6.jpg')} style={styles.image} />
            <TouchableOpacity style={styles.buyButton} onPress={() => handleBuy(6)}>
              <Text style={styles.buyButtonText}>BUY: 600 coins</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.row}>
          <View style={styles.itemContainer}>
            <Image source={require('./assets/ORBIMG7.jpg')} style={styles.image} />
            <TouchableOpacity style={styles.buyButton} onPress={() => handleBuy(7)}>
              <Text style={styles.buyButtonText}>BUY: 700 coins</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.itemContainer}>
            <Image source={require('./assets/ORBIMG8.jpg')} style={styles.image} />
            <TouchableOpacity style={styles.buyButton} onPress={() => handleBuy(8)}>
              <Text style={styles.buyButtonText}>BUY: 800 coins</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    alignItems: 'center',
  },
  backButton: {
    position: 'absolute',
    top: 16,
    left: 16,
    zIndex: 1,
  },
  backButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFF',
  },
  headerContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 24,
  },
  heading: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFF',
  },
  gridContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  itemContainer: {
    alignItems: 'center',
    marginHorizontal: 10,
    marginBottom: 20,
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
    backgroundColor: '#00FF00',
    borderRadius: 8,
  },
  buyButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#000',
  },
});

export default ShopScreen;