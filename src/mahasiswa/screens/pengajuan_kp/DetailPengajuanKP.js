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
const user = auth().currentUser;
const DetailPengajuanKP = ({route, navigation}) => {
  const {itemId} = route.params;
  const [pengajuanData, setPengajuanData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchPengajuanData = () => {
    firestore()
      .collection('pengajuan')
      .doc(itemId)
      .get()
      .then(documentSnapshot => {
        if (documentSnapshot.exists) {
          setPengajuanData(documentSnapshot.data());
        } else {
          console.log('Pengajuan tidak ditemukan');
        }
        setIsLoading(false);
        setRefreshing(false); // Set refreshing to false when data is fetched
      })
      .catch(error => {
        console.error('Error mengambil data pengajuan:', error);
        setIsLoading(false);
        setRefreshing(false); // Set refreshing to false on error as well
      });
  };
  useEffect(() => {
    fetchPengajuanData();
  }, [itemId]);

  const handleEditButtonPress = () => {
    navigation.navigate('EditPengajuanKP', {itemId});
  };
  const handleDeleteButtonPress = () => {
    const transkipNilaiFileName = `persyaratan/pengajuanKP/transkipNilai/${user.uid}`;
    const formKrsFileName = `persyaratan/pengajuanKP/formKRS/${user.uid}`;
    const pendaftaranKpFileName = `persyaratan/pengajuanKP/formPendaftaranKP/${user.uid}`;
    const pembayaranKpFileName = `persyaratan/pengajuanKP/slipPembayaranKP/${user.uid}`;
    const proporsalFileName = `persyaratan/pengajuanKP/proporsalKP/${user.uid}`;
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
              await storage().ref(formKrsFileName).delete();
              await storage().ref(pendaftaranKpFileName).delete();
              await storage().ref(pembayaranKpFileName).delete();
              await storage().ref(proporsalFileName).delete();

              // Menghapus dokumen dari Firestore
              await firestore().collection('pengajuan').doc(itemId).delete();

              Alert.alert('Sukses', 'Data pengajuan berhasil dihapus');
              navigation.navigate('Pengajuan');
            } catch (error) {
              console.error('Error menghapus data pengajuan:', error);
              Alert.alert(
                'Error',
                'Terjadi kesalahan saat menghapus data pengajuan',
              );
            }
          },
        },
      ],
      {cancelable: true},
    );
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
              {pengajuanData.dosenPembimbing}
            </Text>
            <TouchableOpacity
              style={styles.linkButton}
              onPress={() => handleOpenLink(pengajuanData.transkipNilai)}>
              <Text style={styles.linkButtonText}>Transkip Nilai</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.linkButton}
              onPress={() => handleOpenLink(pengajuanData.formKrs)}>
              <Text style={styles.linkButtonText}>Form KRS</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.linkButton}
              onPress={() => handleOpenLink(pengajuanData.formPendaftaranKP)}>
              <Text style={styles.linkButtonText}>Form Pendaftaran KP</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.linkButton}
              onPress={() => handleOpenLink(pengajuanData.slipPembayaranKP)}>
              <Text style={styles.linkButtonText}>Slip Pembayaran KP</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.linkButton}
              onPress={() => handleOpenLink(pengajuanData.dokumenProporsal)}>
              <Text style={styles.linkButtonText}>Dokumen Proposal</Text>
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

export default DetailPengajuanKP;
