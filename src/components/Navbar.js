import {useNavigation} from '@react-navigation/native';
import React from 'react';
import {Pressable, StyleSheet, Text, ToastAndroid, View} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome6';
const Navbar = () => {
  const navigation = useNavigation();

  const handleNavigateMenuKP = () => {
    navigation.navigate('MenuKP');
  };

  const handleNavigateSempro = () => {
    ToastAndroid.show('Coming Soon', ToastAndroid.SHORT);
  };
  const handleNavigateKompre = () => {
    ToastAndroid.show('Coming Soon', ToastAndroid.SHORT);
  };

  const handleNavigateMenuSkripsi = () => {
    navigation.navigate('MenuSkripsi');
  };
  return (
    <View style={styles.nav}>
      <View style={styles.navContainer}>
        <Pressable onPress={handleNavigateMenuKP} style={styles.iconContainer}>
          <Icon name="toolbox" size={30} color="#FF7676" />
        </Pressable>
        <Text style={styles.navText}>KP</Text>
      </View>
      <View style={styles.navContainer}>
        <Pressable style={styles.iconContainer} onPress={handleNavigateSempro}>
          <Icon name="file-signature" size={30} color="#EEC759" />
        </Pressable>
        <Text style={styles.navText}>Sempro</Text>
      </View>
      <View style={styles.navContainer}>
        <Pressable style={styles.iconContainer} onPress={handleNavigateKompre}>
          <Icon name="laptop-code" size={30} color="#2E4374" />
        </Pressable>
        <Text style={styles.navText}>Kompre</Text>
      </View>
      <View style={styles.navContainer}>
        <Pressable onPress={handleNavigateMenuSkripsi}>
          <View style={styles.iconContainer}>
            <Icon name="user-graduate" size={30} color="#4A55A2" />
          </View>
          <Text style={styles.navText}>Skripsi</Text>
        </Pressable>
      </View>
    </View>
  );
};

export default Navbar;

const styles = StyleSheet.create({
  nav: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    minHeight: 100,
    marginTop: -75,
    display: 'flex',
    flexDirection: 'row',
    elevation: 5,
  },
  navContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    flex: 1,
    marginHorizontal: 5,
  },
  navText: {
    fontSize: 12,
    fontWeight: 'bold',
    marginTop: 10,
    color: 'grey',
    textAlign: 'center',
  },
  iconContainer: {
    backgroundColor: '#EEF5FF',
    borderRadius: 10,
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,
  },
});
