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
import {
  ALERT_TYPE,
  AlertNotificationRoot,
  Dialog,
} from 'react-native-alert-notification';

const DetailSempro = ({route, navigation}) => {
  const {itemId} = route.params;
  const [pengajuanData, setPengajuanData] = useState([]);
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
  const getPengajuanInfo = async uid => {
    try {
      const userDocSnapshot = await firestore()
        .collection('pengajuan')
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
        const pengajuanInfo = await getPengajuanInfo(data.pengajuan_uid);
        const dosenPembimbingInfo = await getUserInfo(
          pengajuanInfo.pembimbing_uid,
        );

        setPengajuanData({
          id: documentSnapshot.id,
          ...data,
          dosenPembimbingInfo: dosenPembimbingInfo,
          pengajuanInfo: pengajuanInfo,
        });
        console.log(pengajuanData);
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
          if (jadwalData.jenisSidang.includes('Seminar Proposal')) {
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
        item.status === 'Aktif' &&
        item.jenisSidang.includes('Seminar Proposal'),
    );
    if (!activeJadwal) {
      Dialog.show({
        type: ALERT_TYPE.WARNING,
        title: 'Peringatan',
        textBody: 'Sidang Seminar Proposal belum dibuka saat ini.',
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
      navigation.navigate('EditSempro', {itemId});
    }
  };
  const handleDeleteButtonPress = () => {
    const user = auth().currentUser;
    if (statusPendaftaran === 'Sah') {
      Dialog.show({
        type: ALERT_TYPE.WARNING,
        title: 'Peringatan',
        textBody: 'Pendaftaran anda telah disahkan',
        button: 'Tutup',
      });
    } else {
      const transkipNilaiFileName = `persyaratan/sidangSempro/transkipNilai/${user.uid}`;
      const pendaftaranSemproFileName = `persyaratan/sidangSempro/formPendaftaran/${user.uid}`;
      const persetujuanSemproFileName = `persyaratan/sidangSempro/formPersetujuan/${user.uid}`;
      const sertifikatKeahlianFileName = `persyaratan/sidangSempro/sertifikatKeahlian/${user.uid}`;
      const menghadiriSidangFileName = `persyaratan/sidangSempro/formMenghadiriSidang/${user.uid}`;
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
                await storage().ref(transkipNilaiFileName).delete();
                await storage().ref(pendaftaranSemproFileName).delete();
                await storage().ref(persetujuanSemproFileName).delete();
                await storage().ref(sertifikatKeahlianFileName).delete();
                await storage().ref(menghadiriSidangFileName).delete();

                // Menghapus dokumen dari Firestore
                await firestore().collection('sidang').doc(itemId).delete();

                Dialog.show({
                  type: ALERT_TYPE.SUCCESS,
                  title: 'Berhasil',
                  textBody: 'Pendaftaran Seminar Proposal berhasil dihapus',
                  button: 'Tutup',
                  onPressButton: () => {
                    navigation.navigate('Sidang');
                  },
                });
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
    <AlertNotificationRoot>
      <ScrollView
        contentContainerStyle={styles.container}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }>
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
                {pengajuanData.dosenPembimbingInfo
                  ? `${pengajuanData.dosenPembimbingInfo.nama} (${pengajuanData.dosenPembimbingInfo.nidn})`
                  : '-'}
              </Text>
              <TouchableOpacity
                style={styles.linkButton}
                onPress={() =>
                  handleOpenLink(pengajuanData.berkasPersyaratan.transkipNilai)
                }>
                <Text style={styles.linkButtonText}>Transkip Sementara</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.linkButton}
                onPress={() =>
                  handleOpenLink(
                    pengajuanData.berkasPersyaratan.pendaftaranSempro,
                  )
                }>
                <Text style={styles.linkButtonText}>
                  Form Pendaftaran Sempro
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.linkButton}
                onPress={() =>
                  handleOpenLink(
                    pengajuanData.berkasPersyaratan.persetujuanSempro,
                  )
                }>
                <Text style={styles.linkButtonText}>
                  Form Persetujuan Sempro
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.linkButton}
                onPress={() =>
                  handleOpenLink(
                    pengajuanData.berkasPersyaratan.fileSertifikatKeahlian,
                  )
                }>
                <Text style={styles.linkButtonText}>Sertifikat Keahlian</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.linkButton}
                onPress={() =>
                  handleOpenLink(
                    pengajuanData.berkasPersyaratan.fileMenghadiriSidang,
                  )
                }>
                <Text style={styles.linkButtonText}>
                  Form Menghadiri Sidang
                </Text>
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
    </AlertNotificationRoot>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingTop: 10,
    backgroundColor: 'white',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
    backgroundColor: 'white',
    padding: 20,
  },
  detailContainer: {
    marginTop: 20,
    paddingHorizontal: 20,
    marginHorizontal: 10,
    backgroundColor: 'white',
    padding: 30,
    borderRadius: 15,
    borderColor: '#C5DFF8',
    borderWidth: 4,
  },
  detailText: {
    fontSize: 16,
    marginBottom: 8,
    color: 'black',
    textTransform: 'uppercase',
  },
  detailTitleText: {
    fontSize: 16,
    marginBottom: 8,
    color: 'black',
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  editButton: {
    marginTop: 20,
    backgroundColor: '#4A55A2',
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
    backgroundColor: '#FF6969',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  deleteButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  linkButton: {
    marginTop: 10,
    backgroundColor: '#7895CB',
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

export default DetailSempro;
