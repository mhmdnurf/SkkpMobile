/* eslint-disable react-native/no-inline-styles */
import {View, Text, StyleSheet} from 'react-native';
import React from 'react';
import Icon from 'react-native-vector-icons/FontAwesome5';
export default function Pengumuman() {
  return (
    <View>
      <View style={styles.titleContainer}>
        <Icon name="bell" size={36} color="#0D4C92" />
        <Text style={styles.pengumumanTitle}>Pengumuman</Text>
      </View>
      <View style={styles.boxContainer}>
        <View style={{flex: 1, flexDirection: 'row'}}>
          <Icon name="info" size={16} color="#59C1BD" />
          <Text style={styles.judulPengumuman}>
            INFORMASI SEMINAR PROPORSAL !
          </Text>
        </View>
        <Text style={styles.textPengumuman}>
          Diberitahukan kepada mahasiswa/i Seminar Proporsal akan diadakan pada
          tanggal : Jumat,23-06-2023
        </Text>
        <Text style={styles.textPengumuman}>
          Pendaftaran dibuka Tanggal : Selasa,13-06-2023
        </Text>
        <Text style={styles.textPengumuman}>
          Pendaftaran ditutup Tanggal : Senin,19-06-2023
        </Text>
      </View>
      <View style={styles.boxContainer}>
        <View style={{flex: 1, flexDirection: 'row'}}>
          <Icon name="info" size={16} color="#59C1BD" />
          <Text style={styles.judulPengumuman}>
            INFORMASI SIDANG AKHIR SKRIPSI !
          </Text>
        </View>
        <Text style={styles.textPengumuman}>
          Diberitahukan kepada mahasiswa/i Seminar Proporsal akan diadakan pada
          tanggal : Jumat,23-06-2023
        </Text>
        <Text style={styles.textPengumuman}>
          Pendaftaran dibuka Tanggal : Selasa,13-06-2023
        </Text>
        <Text style={styles.textPengumuman}>
          Pendaftaran ditutup Tanggal : Senin,19-06-2023
        </Text>
      </View>
      <View style={styles.boxContainer}>
        <View style={{flex: 1, flexDirection: 'row'}}>
          <Icon name="info" size={16} color="#59C1BD" />
          <Text style={styles.judulPengumuman}>
            INFORMASI SIDANG KERJA PRAKTEK !
          </Text>
        </View>
        <Text style={styles.textPengumuman}>
          Diberitahukan kepada mahasiswa/i Seminar Proporsal akan diadakan pada
          tanggal : Jumat,23-06-2023
        </Text>
        <Text style={styles.textPengumuman}>
          Pendaftaran dibuka Tanggal : Selasa,13-06-2023
        </Text>
        <Text style={styles.textPengumuman}>
          Pendaftaran ditutup Tanggal : Senin,19-06-2023
        </Text>
      </View>
      <View style={styles.lastBoxContainer}>
        <View style={{flex: 1, flexDirection: 'row'}}>
          <Icon name="info" size={16} color="#59C1BD" />
          <Text style={styles.judulPengumuman}>
            INFORMASI SIDANG KOMPREHENSIF !
          </Text>
        </View>
        <Text style={styles.textPengumuman}>
          Diberitahukan kepada mahasiswa/i Seminar Proporsal akan diadakan pada
          tanggal : <Text style={styles.judulPengumuman}>Jumat,23-06-2023</Text>
        </Text>
        <Text style={styles.textPengumuman}>
          Pendaftaran dibuka Tanggal : Selasa,13-06-2023
        </Text>
        <Text style={styles.textPengumuman}>
          Pendaftaran ditutup Tanggal : Senin,19-06-2023
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  boxContainer: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 10,
    marginHorizontal: 16,
    marginTop: 16,
    shadowColor: 'black',
    shadowOffset: {width: 0, height: 10},
    shadowOpacity: 0.2,
    shadowRadius: 7,
    elevation: 5,
  },
  lastBoxContainer: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 10,
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 16,
    shadowColor: 'black',
    shadowOffset: {width: 0, height: 10},
    shadowOpacity: 0.2,
    shadowRadius: 7,
    elevation: 5,
  },
  titleContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 30,
    paddingBottom: 15,
    flexDirection: 'row',
  },
  pengumumanTitle: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#0D4C92',
    marginLeft: 8,
  },
  textPengumuman: {
    fontSize: 16,
    color: '#0D4C92',
    fontWeight: '400',
  },
  judulPengumuman: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0D4C92',
    marginLeft: 4,
  },
});
