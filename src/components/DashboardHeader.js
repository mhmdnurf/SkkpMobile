import React from 'react';
import {ScrollView, StyleSheet, Text, View} from 'react-native';
import Pendaftar from './Pendaftar';
import usePendaftar from '../hooks/usePendaftar';

const DashboardHeader = ({username}) => {
  const pendaftar = usePendaftar();
  return (
    <View style={styles.headerContainer}>
      <Text style={styles.headerText}>Dashboard</Text>
      <Text style={styles.headerName}>Halo, {username}</Text>
      <View style={styles.scrollCardContainer}>
        <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
          <Pendaftar
            title="Pendaftar Seminar Proposal"
            jumlah={pendaftar.jumlahPendaftarSempro}
            imageSource="sempro"
          />
          <Pendaftar
            title="Pendaftar Kerja Praktek"
            jumlah={pendaftar.jumlahPendaftarKP}
            imageSource="kerja_praktek"
          />
          <Pendaftar
            title="Pendaftar Sidang Komprehensif"
            jumlah={pendaftar.jumlahPendaftarKompre}
            imageSource="kompre"
          />
          <Pendaftar
            title="Pendaftar Sidang Skripsi"
            jumlah={pendaftar.jumlahPendaftarSkripsi}
            imageSource="skripsi"
          />
        </ScrollView>
      </View>
    </View>
  );
};

export default DashboardHeader;

const styles = StyleSheet.create({
  headerContainer: {
    backgroundColor: '#176B87',
    minHeight: 420,
  },
  headerText: {
    color: 'white',
    marginLeft: 20,
    marginTop: 40,
    fontWeight: '600',
    fontSize: 24,
  },
  headerName: {
    color: 'white',
    marginLeft: 20,
    fontWeight: '600',
    fontSize: 16,
    marginTop: 10,
  },
  scrollCardContainer: {
    display: 'flex',
    flexDirection: 'row',
  },
});
