import React from 'react';
import {Dimensions, ScrollView, StyleSheet} from 'react-native';
import MenuView from '../components/MenuView';
import MenuButton from '../components/MenuButton';
import Logo from '../assets/kerja_praktek_menu.svg';
import {useNavigation} from '@react-navigation/native';
const MenuKP = () => {
  const navigation = useNavigation();
  return (
    <>
      <ScrollView contentContainerStyle={styles.cardContainer}>
        <MenuView
          mainTitle="Kerja Praktek"
          SvgComponent={Logo}
          secondTitle="Data apa yang ingin anda lihat?"
        />
        <MenuButton
          onPress={() => navigation.navigate('HomePengajuanKP')}
          title="Pengajuan"
        />
        <MenuButton
          onPress={() => navigation.navigate('EditPengajuanKPs')}
          title="Sidang"
        />
      </ScrollView>
    </>
  );
};

export default MenuKP;

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: 'white',
    height: Dimensions.get('window').height,
  },
});
