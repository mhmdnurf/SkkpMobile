import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  RefreshControl,
  ScrollView,
  Linking,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import auth from '@react-native-firebase/auth';
import {ALERT_TYPE, Dialog} from 'react-native-alert-notification';

const user = auth().currentUser;
const DetailSidangKP = ({route, navigation}) => {
  const {itemId} = route.params;
  const [pengajuanData, setPengajuanData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [jadwalPengajuanData, setJadwalPengajuanData] = useState([]);
  const [statusPendaftaran, setStatusPendaftaran] = useState('');

  const getUserInfo = async uid => {
    try {
      const userDocSnapshot = await firestore()
        .collection('users')
        .doc(uid)
        .get();

      if (userDocSnapshot.exists) {
        return userDocSnapshot.data();
      }
      return null;
    } catch (error) {
      console.error('Error fetching user info:', error);
      return null;
    }
  };

  const fetchPengajuanData = async () => {
    try {
      const documentSnapshot = await firestore()
        .collection('sidang')
        .doc(itemId)
        .get();

      if (documentSnapshot.exists) {
        const data = documentSnapshot.data();

        // Mendapatkan nama dosen
        if (data.dosenPembimbing) {
          const dosenInfo = await getUserInfo(data.dosenPembimbing);
          if (dosenInfo) {
            data.namaDosen = dosenInfo.nama;
          }
        }

        setPengajuanData(data);
        setStatusPendaftaran(data.status);
      } else {
        console.log('Pendaftaran tidak ditemukan');
      }
      setIsLoading(false);
      setRefreshing(false);
    } catch (error) {
      console.error('Error mengambil data pendaftaran:', error);
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchPengajuanData();
    const unsubscribeJadwal = firestore()
      .collection('jadwalSidang')
      .where('status', '==', 'Aktif')
      .onSnapshot(querySnapshot => {
        const data = [];
        querySnapshot.forEach(doc => {
          const jadwalData = doc.data();
          if (jadwalData.jenisSidang.includes('Kerja Praktek')) {
            data.push(jadwalData);
          }
        });
        setJadwalPengajuanData(data);
      });
    return () => {
      unsubscribeJadwal();
    };
  }, [itemId]);

  const handleEditButtonPress = () => {
    const activeJadwal = jadwalPengajuanData.find(
      item =>
        item.status === 'Aktif' && item.jenisSidang.includes('Kerja Praktek'),
    );
    if (!activeJadwal) {
      Dialog.show({
        type: ALERT_TYPE.WARNING,
        title: 'Peringatan',
        textBody: 'Sidang Kerja Praktek belum dibuka saat ini.',
        button: 'Tutup',
      });
    } else if (!activeJadwal && statusPendaftaran === 'Ditolak') {
      Dialog.show({
        type: ALERT_TYPE.WARNING,
        title: 'Peringatan',
        textBody: 'Sidang Kerja Praktek belum dibuka saat ini.',
        button: 'Tutup',
      });
    } else if (statusPendaftaran === 'Sah') {
      Dialog.show({
        type: ALERT_TYPE.WARNING,
        title: 'Peringatan',
        textBody: 'Pendaftaran anda telah disahkan',
        button: 'Tutup',
      });
    } else {
      navigation.navigate('EditSidangKP', {itemId});
    }
  };
  const handleDeleteButtonPress = () => {
    if (statusPendaftaran === 'Sah') {
      Dialog.show({
        type: ALERT_TYPE.WARNING,
        title: 'Peringatan',
        textBody: 'Pendaftaran anda telah disahkan',
        button: 'Tutup',
      });
    } else {
      const persetujuanKPFileName = `persyaratan/sidangKP/formPersetujuanKP/${user.uid}`;
      const penilaianPerusahaanFileName = `persyaratan/sidangKP/penilaianPerusahaan/${user.uid}`;
      const pendaftaranKpFileName = `persyaratan/sidangKP/formPendaftaranKP/${user.uid}`;
      const bimbinganKPFileName = `persyaratan/sidangKP/formBimbinganKP/${user.uid}`;
      const sertifikatSeminarFileName = `persyaratan/sidangKP/sertifikatSeminar/${user.uid}`;
      const sertifikatPSPTFileName = `persyaratan/sidangKP/sertifikatPSPT/${user.uid}`;
      Alert.alert(
        'Konfirmasi Hapus',
        'Apakah Anda yakin ingin menghapus data pengajuan?',
        [
          {
            text: 'Batal',
            style: 'cancel',
          },
          {
            text: 'Hapus',
            style: 'destructive',
            onPress: async () => {
              try {
                // Menghapus file dari Firebase Storage
                await storage().ref(persetujuanKPFileName).delete();
                await storage().ref(penilaianPerusahaanFileName).delete();
                await storage().ref(pendaftaranKpFileName).delete();
                await storage().ref(bimbinganKPFileName).delete();
                await storage().ref(sertifikatSeminarFileName).delete();
                await storage().ref(sertifikatPSPTFileName).delete();

                // Menghapus dokumen dari Firestore
                await firestore().collection('sidang').doc(itemId).delete();

                Alert.alert('Sukses', 'Data sidang berhasil dihapus');
                navigation.navigate('Sidang');
              } catch (error) {
                console.error('Error menghapus data sidang:', error);
                Alert.alert(
                  'Error',
                  'Terjadi kesalahan saat menghapus data sidang',
                );
              }
            },
          },
        ],
        {cancelable: true},
      );
    }
  };

  const handleOpenLink = link => {
    const supported = Linking.canOpenURL(link);
    if (supported) {
      Linking.openURL(link);
    } else {
      Alert.alert('Error', 'Tidak dapat membuka tautan.');
      console.log(link);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchPengajuanData();
  };

  if (isLoading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }
  return (
    <ScrollView
      contentContainerStyle={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
      }>
      <Text style={styles.title}>{pengajuanData.judul}</Text>
      {pengajuanData ? (
        <>
          <View style={styles.detailContainer}>
            <Text style={styles.detailTitleText}>Tanggal Daftar</Text>
            <Text style={styles.detailText}>
              {pengajuanData.createdAt.toDate().toLocaleDateString()}
            </Text>
            <Text style={styles.detailTitleText}>Status</Text>
            <Text style={styles.detailText}>{pengajuanData.status}</Text>
            <Text style={styles.detailTitleText}>Catatan</Text>
            <Text style={styles.detailText}>{pengajuanData.catatan}</Text>
            <Text style={styles.detailTitleText}>Dosen Pembimbing</Text>
            <Text style={styles.detailText}>
              {pengajuanData.namaDosen
                ? pengajuanData.namaDosen
                : pengajuanData.dosenPembimbing}
            </Text>
            <TouchableOpacity
              style={styles.linkButton}
              onPress={() => handleOpenLink(pengajuanData.persetujuanKP)}>
              <Text style={styles.linkButtonText}>Form Persetujuan KP</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.linkButton}
              onPress={() => handleOpenLink(pengajuanData.penilaianPerusahaan)}>
              <Text style={styles.linkButtonText}>
                Form Penilaian Perusahaan
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.linkButton}
              onPress={() => handleOpenLink(pengajuanData.formPendaftaranKP)}>
              <Text style={styles.linkButtonText}>Form Pendaftaran KP</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.linkButton}
              onPress={() => handleOpenLink(pengajuanData.bimbinganKP)}>
              <Text style={styles.linkButtonText}>Form Bimbingan KP</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.linkButton}
              onPress={() =>
                handleOpenLink(pengajuanData.fileSertifikatSeminar)
              }>
              <Text style={styles.linkButtonText}>Sertifikat Seminar STTI</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.linkButton}
              onPress={() => handleOpenLink(pengajuanData.fileSertifikatPSPT)}>
              <Text style={styles.linkButtonText}>Sertifikat PSPT</Text>
            </TouchableOpacity>
            <View
              style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-around',
              }}>
              <TouchableOpacity
                style={styles.editButton}
                onPress={handleEditButtonPress}>
                <Text style={styles.editButtonText}>Edit Pengajuan</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={handleDeleteButtonPress}>
                <Text style={styles.deleteButtonText}>Hapus Pengajuan</Text>
              </TouchableOpacity>
            </View>
          </View>
        </>
      ) : (
        <Text>Data pengajuan tidak ditemukan.</Text>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: 'white',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 20,
    shadowColor: 'black',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 7,
    elevation: 5,
  },
  detailContainer: {
    marginTop: 20,
    paddingHorizontal: 20,
    backgroundColor: 'white',
    padding: 30,
    borderRadius: 20,
    shadowColor: 'black',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 7,
    elevation: 5,
  },
  detailText: {
    fontSize: 16,
    marginBottom: 8,
    color: 'black',
  },
  detailTitleText: {
    fontSize: 16,
    marginBottom: 8,
    color: 'black',
    fontWeight: 'bold',
  },
  editButton: {
    marginTop: 20,
    backgroundColor: '#59C1BD',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  editButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  deleteButton: {
    marginTop: 20,
    backgroundColor: '#C70039',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  deleteButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  separator: {
    height: 1,
    backgroundColor: '#CCCCCC',
    marginVertical: 20,
  },
  linkButton: {
    marginTop: 10,
    backgroundColor: '#59C1BD',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  linkButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default DetailSidangKP;
