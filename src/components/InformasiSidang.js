import React from 'react';
import useJadwalSidang from '../hooks/useJadwalSidang';
import CardSidang from './CardSidang';
import {StyleSheet, Text} from 'react-native';

const InformasiSidang = () => {
  const dates = useJadwalSidang();
  return (
    <>
      <Text style={styles.sidangTitle}>Informasi Sidang</Text>
      <CardSidang
        title={'Informasi Sidang Kerja Praktek'}
        tanggalSidang={new Intl.DateTimeFormat('id-ID', {
          weekday: 'long',
          day: '2-digit',
          month: 'long',
          year: 'numeric',
        }).format(dates?.tanggalSidangKP)}
        tanggalBuka={new Intl.DateTimeFormat('id-ID', {
          weekday: 'long',
          day: '2-digit',
          month: 'long',
          year: 'numeric',
        }).format(dates?.tanggalBukaKP)}
        tanggalTutup={new Intl.DateTimeFormat('id-ID', {
          weekday: 'long',
          day: '2-digit',
          month: 'long',
          year: 'numeric',
        }).format(dates?.tanggalTutupKP)}
      />
      <CardSidang
        title={'Informasi Seminar Proposal'}
        tanggalSidang={new Intl.DateTimeFormat('id-ID', {
          weekday: 'long',
          day: '2-digit',
          month: 'long',
          year: 'numeric',
        }).format(dates?.tanggalSidangKP)}
        tanggalBuka={new Intl.DateTimeFormat('id-ID', {
          weekday: 'long',
          day: '2-digit',
          month: 'long',
          year: 'numeric',
        }).format(dates?.tanggalBukaKP)}
        tanggalTutup={new Intl.DateTimeFormat('id-ID', {
          weekday: 'long',
          day: '2-digit',
          month: 'long',
          year: 'numeric',
        }).format(dates?.tanggalTutupKP)}
      />
      <CardSidang
        title={'Informasi Sidang Komprehensif'}
        tanggalSidang={new Intl.DateTimeFormat('id-ID', {
          weekday: 'long',
          day: '2-digit',
          month: 'long',
          year: 'numeric',
        }).format(dates?.tanggalSidangKP)}
        tanggalBuka={new Intl.DateTimeFormat('id-ID', {
          weekday: 'long',
          day: '2-digit',
          month: 'long',
          year: 'numeric',
        }).format(dates?.tanggalBukaKP)}
        tanggalTutup={new Intl.DateTimeFormat('id-ID', {
          weekday: 'long',
          day: '2-digit',
          month: 'long',
          year: 'numeric',
        }).format(dates?.tanggalTutupKP)}
      />
      <CardSidang
        title={'Informasi Sidang Akhir Skripsi'}
        tanggalSidang={new Intl.DateTimeFormat('id-ID', {
          weekday: 'long',
          day: '2-digit',
          month: 'long',
          year: 'numeric',
        }).format(dates?.tanggalSidangKP)}
        tanggalBuka={new Intl.DateTimeFormat('id-ID', {
          weekday: 'long',
          day: '2-digit',
          month: 'long',
          year: 'numeric',
        }).format(dates?.tanggalBukaKP)}
        tanggalTutup={new Intl.DateTimeFormat('id-ID', {
          weekday: 'long',
          day: '2-digit',
          month: 'long',
          year: 'numeric',
        }).format(dates?.tanggalTutupKP)}
      />
    </>
  );
};

export default InformasiSidang;

const styles = StyleSheet.create({
  sidangTitle: {
    color: 'black',
    fontWeight: 'bold',
    marginHorizontal: 20,
    marginTop: 20,
  },
});
