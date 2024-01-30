import React from 'react';
import {Dimensions, ScrollView, StyleSheet} from 'react-native';
import MenuView from '../components/MenuView';
import MenuButton from '../components/MenuButton';
import Logo from '../assets/skripsi_menu.svg';
import {useNavigation} from '@react-navigation/native';
const MenuSkripsi = () => {
  const navigation = useNavigation();
  return (
    <>
      <ScrollView contentContainerStyle={styles.cardContainer}>
        <MenuView
          mainTitle="Skripsi"
          SvgComponent={Logo}
          secondTitle="Data apa yang ingin anda lihat?"
        />
        <MenuButton
          onPress={() => navigation.navigate('HomePengajuanSkripsi')}
          title="Pengajuan"
        />
        <MenuButton
          onPress={() => navigation.navigate('SidangSkripsi')}
          title="Sidang"
        />
      </ScrollView>
    </>
  );
};

export default MenuSkripsi;

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: 'white',
    height: Dimensions.get('window').height,
  },
});
