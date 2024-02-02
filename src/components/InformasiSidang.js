import React from 'react';
import useJadwalSidang from '../hooks/useJadwalSidang';
import CardSidang from './CardSidang';
import {StyleSheet, Text} from 'react-native';

const InformasiSidang = () => {
  const dates = useJadwalSidang();

  const formatDateOrShowClosed = date => {
    return date
      ? new Intl.DateTimeFormat('id-ID', {
          weekday: 'long',
          day: '2-digit',
          month: 'long',
          year: 'numeric',
        }).format(date)
      : '-';
  };
  return (
    <>
      <Text style={styles.sidangTitle}>Informasi Sidang</Text>
      <CardSidang
        title={'Informasi Sidang Kerja Praktek'}
        tanggalSidang={formatDateOrShowClosed(dates?.tanggalSidangKP)}
        tanggalBuka={formatDateOrShowClosed(dates?.tanggalBukaKP)}
        tanggalTutup={formatDateOrShowClosed(dates?.tanggalTutupKP)}
      />
      <CardSidang
        title={'Informasi Seminar Proposal'}
        tanggalSidang={formatDateOrShowClosed(dates?.tanggalSidangSempro)}
        tanggalBuka={formatDateOrShowClosed(dates?.tanggalBukaSempro)}
        tanggalTutup={formatDateOrShowClosed(dates?.tanggalTutupSempro)}
      />
      <CardSidang
        title={'Informasi Sidang Komprehensif'}
        tanggalSidang={formatDateOrShowClosed(dates?.tanggalSidangKompre)}
        tanggalBuka={formatDateOrShowClosed(dates?.tanggalBukaKompre)}
        tanggalTutup={formatDateOrShowClosed(dates?.tanggalTutupKompre)}
      />
      <CardSidang
        title={'Informasi Sidang Akhir Skripsi'}
        tanggalSidang={formatDateOrShowClosed(dates?.tanggalSidangSkripsi)}
        tanggalBuka={formatDateOrShowClosed(dates?.tanggalBukaSkripsi)}
        tanggalTutup={formatDateOrShowClosed(dates?.tanggalTutupSkripsi)}
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
  closeSidang: {
    color: 'red',
    fontWeight: '600',
  },
});
