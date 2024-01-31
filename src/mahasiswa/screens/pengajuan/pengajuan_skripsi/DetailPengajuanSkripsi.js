import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  Pressable,
  Modal,
  Dimensions,
  ActivityIndicator,
  Alert,
} from 'react-native';
import Header from '../../../../components/Header';
import InputField from '../../../../components/InputField';
import firestore from '@react-native-firebase/firestore';
import {WebView} from 'react-native-webview';
import Loader from '../../../../components/Loader';
import BottomSpace from '../../../../components/BottomSpace';

const DetailPengajuanSkripsi = ({route, navigation}) => {
  const {itemId} = route.params;
  const [pengajuanData, setPengajuanData] = React.useState([]);
  const [jadwalPengajuanData, setJadwalPengajuanData] = React.useState([]);
  const [statusPengajuan, setStatusPengajuan] = React.useState('');
  const [selectedData, setSelectedData] = React.useState(null);
  const [berkas, setBerkas] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  const getUserInfo = async uid => {
    const userDocSnapshot = await firestore()
      .collection('users')
      .doc(uid)
      .get();
    return userDocSnapshot.exists ? userDocSnapshot.data() : null;
  };

  const getPengajuanData = async id => {
    const documentSnapshot = await firestore()
      .collection('pengajuan')
      .doc(id)
      .get();
    return documentSnapshot.exists ? documentSnapshot.data() : null;
  };

  const getJadwalPengajuanData = async () => {
    const querySnapshot = await firestore()
      .collection('jadwalPengajuan')
      .where('status', '==', 'Aktif')
      .get();
    return querySnapshot.docs.map(doc => doc.data());
  };

  const fetchPengajuanData = React.useCallback(async () => {
    try {
      const data = await getPengajuanData(itemId);
      if (data) {
        const dosenPembimbingInfo = await getUserInfo(data.pembimbing_uid);
        setPengajuanData({
          id: itemId,
          ...data,
          dosenPembimbingInfo: dosenPembimbingInfo,
        });
        setStatusPengajuan(data.status);
        setBerkas(data.berkas);
      } else {
        console.log('Pengajuan tidak ditemukan');
      }
    } catch (error) {
      console.error('Error mengambil data pengajuan:', error);
    } finally {
      setLoading(false);
    }
  }, [itemId]);

  const handleNavigateEdit = () => {
    navigation.navigate('EditPengajuanSkripsi', {
      itemId: itemId,
    });
  };

  const handleDelete = async () => {
    if (statusPengajuan === 'Sah') {
      Alert.alert('Hapus ditolak', 'Pengajuan sudah disahkan');
    } else {
      Alert.alert('Hapus pengajuan', 'Apakah anda yakin?', [
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {
          text: 'Hapus',
          onPress: async () => {
            try {
              // Delete the document
              await firestore().collection('pengajuan').doc(itemId).delete();

              Alert.alert('Delete successful', 'Data berhasil dihapus', [
                {
                  text: 'OK',
                  onPress: () => navigation.navigate('HomePengajuanKP'),
                },
              ]);
            } catch (err) {
              console.error('Error deleting document:', err);
            }
          },
        },
      ]);
    }
  };

  React.useEffect(() => {
    fetchPengajuanData();
    const fetchJadwalPengajuanData = async () => {
      const data = await getJadwalPengajuanData();
      setJadwalPengajuanData(
        data.filter(jadwalData =>
          jadwalData.jenisPengajuan.includes('Skripsi'),
        ),
      );
    };
    fetchJadwalPengajuanData();
  }, [fetchPengajuanData]);

  return (
    <>
      <ScrollView style={styles.container}>
        <Header title="Detail Pengajuan Skripsi" />
        {loading ? (
          <>
            <Loader />
          </>
        ) : (
          <>
            <View>
              <InputField
                label={'Tanggal Pendaftaran'}
                value={
                  pengajuanData.createdAt
                    ? new Intl.DateTimeFormat('id-ID', {
                        day: '2-digit',
                        month: 'long',
                        year: 'numeric',
                      }).format(pengajuanData.createdAt.toDate())
                    : '-'
                }
                editable={false}
              />
              <InputField
                label={'Status'}
                value={pengajuanData.status}
                editable={false}
              />
              <InputField
                label={'Catatan'}
                value={pengajuanData.catatan ? pengajuanData.catatan : '-'}
                editable={false}
              />
              <InputField
                label={'Dosen Pembimbing'}
                value={
                  pengajuanData.dosenPembimbingInfo
                    ? `${pengajuanData.dosenPembimbingInfo.nama} (${pengajuanData.dosenPembimbingInfo.nidn})`
                    : '-'
                }
                editable={false}
              />
            </View>
            {/* Berkas */}
            <View>
              <Text style={styles.inputTitle}>Berkas Persyaratan</Text>
              {Object.entries(berkas).map(([key, value], index) => (
                <Pressable
                  key={index}
                  onPress={() => {
                    setSelectedData(value);
                  }}>
                  <View style={styles.berkasContainer}>
                    <Text style={styles.selectText}>{key}</Text>
                  </View>
                </Pressable>
              ))}
              <Modal
                animationType="slide"
                transparent={true}
                visible={selectedData !== null}
                onRequestClose={() => {
                  setSelectedData(null);
                }}>
                <View style={styles.modalContainer}>
                  {selectedData && (
                    <WebView
                      source={{uri: selectedData}}
                      startInLoadingState={true}
                      style={styles.modalImage}
                      renderLoading={() => (
                        <ActivityIndicator
                          style={styles.loader}
                          size="large"
                          color="#176B87"
                        />
                      )}
                    />
                  )}
                </View>
              </Modal>
            </View>
            <View style={styles.btnMainContainer}>
              <Pressable
                style={styles.btnEditContainer}
                onPress={handleNavigateEdit}>
                <Text style={styles.btnText}>Edit Pengajuan</Text>
              </Pressable>
              <Pressable
                style={styles.btnDeleteContainer}
                onPress={handleDelete}>
                <Text style={styles.btnText}>Hapus Pengajuan</Text>
              </Pressable>
            </View>
          </>
        )}
        <BottomSpace marginBottom={40} />
      </ScrollView>
    </>
  );
};

export default DetailPengajuanSkripsi;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: 'white',
  },
  berkasContainer: {
    paddingHorizontal: 10,
    paddingVertical: 20,
    backgroundColor: '#86B6F6',
    borderRadius: 15,
    marginBottom: 10,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  berkasTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6F7789',
    textDecorationLine: 'underline',
  },
  selectText: {
    fontSize: 16,
    color: 'white',
    fontWeight: '600',
  },
  btnMainContainer: {
    marginTop: 10,
  },
  btnEditContainer: {
    padding: 20,
    borderRadius: 10,
    backgroundColor: '#176B87',
    marginBottom: 10,
    elevation: 5,
  },
  btnDeleteContainer: {
    padding: 20,
    borderRadius: 10,
    backgroundColor: '#FF6868',
    elevation: 5,
  },
  pressableContainer: {
    marginTop: 10,
  },
  btnText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '600',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black',
  },
  modalImage: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
    resizeMode: 'contain',
  },
  inputTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6F7789',
    marginBottom: 5,
    marginTop: 10,
  },
  loader: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: Dimensions.get('window').height,
  },
});
