import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  Pressable,
  Alert,
  View,
  Modal,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import Header from '../../../../components/Header';
import firestore from '@react-native-firebase/firestore';
import {Picker} from '@react-native-picker/picker';
import BottomSpace from '../../../../components/BottomSpace';
import DocumentPicker from 'react-native-document-picker';
import storage from '@react-native-firebase/storage';
import RNFS from 'react-native-fs';
import auth from '@react-native-firebase/auth';
import Loader from '../../../../components/Loader';
import _ from 'lodash';
import WebView from 'react-native-webview';

const EditPengajuanSkripsi = ({route, navigation}) => {
  const [listPersyaratan, setListPersyaratan] = React.useState([]);
  const [selectedPersyaratan, setSelectedPersyaratan] = React.useState('');
  const [uploadedFiles, setUploadedFiles] = React.useState([]);
  const [selectedData, setSelectedData] = React.useState(null);
  const [jadwalPengajuan, setJadwalPengajuan] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const {itemId} = route.params;
  const [initialState, setInitialState] = React.useState({
    topikPenelitian: '',
    berkas: {},
  });
  const [pilihTopik, setPilihTopik] = React.useState('');
  const [topikPenelitianOptions, setTopikPenelitianOptions] = React.useState(
    [],
  );
  const [userJurusan, setUserJurusan] = React.useState('');

  const fetchData = React.useCallback(async () => {
    try {
      setLoading(true);
      const documentSnapshot = await firestore()
        .collection('pengajuan')
        .doc(itemId)
        .get();

      if (documentSnapshot.exists) {
        const data = documentSnapshot.data();
        setPilihTopik(data.topikPenelitian);
        setUploadedFiles(data.berkas);
      } else {
        console.log('No such document!');
      }
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  }, [itemId]);

  const fetchUser = React.useCallback(async () => {
    try {
      const query = firestore().collection('users').doc(auth().currentUser.uid);
      const res = await query.get();
      const user = res.data();
      setUserJurusan(user.prodi);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchJadwalPengajuan = React.useCallback(async () => {
    try {
      firestore()
        .collection('jadwalPengajuan')
        .where('status', '==', 'Aktif')
        .where('jenisPengajuan', 'array-contains', 'Skripsi')
        .get()
        .then(querySnapshot => {
          const data = [];
          querySnapshot.forEach(doc => {
            data.push({id: doc.id, ...doc.data()});
          });
          setJadwalPengajuan(data);
        });
    } catch {
      console.log('error');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchTopikPenelitian = React.useCallback(async () => {
    try {
      setLoading(true);
      const query = firestore()
        .collection('topikPenelitian')
        .where('prodiTopik', 'array-contains', userJurusan)
        .get();
      const res = await query;
      // const data = [];
      // res.forEach(doc => {
      //   data.push({id: doc.id, ...doc.data()});
      // });

      const data = res.docs.map(doc => doc.data().namaTopik).flat();
      console.log(data);
      setTopikPenelitianOptions(data);
    } catch {
      console.log('error');
    } finally {
      setLoading(false);
    }
  }, [userJurusan]);

  const fetchPersyaratan = React.useCallback(async () => {
    try {
      setLoading(true);
      const query = firestore()
        .collection('persyaratan')
        .where('jenisPersyaratan', '==', 'PENGAJUAN SKRIPSI')
        .get();
      const res = await query;
      const data = res.docs.map(doc => doc.data().berkasPersyaratan).flat();
      setListPersyaratan(data);
    } catch {
      console.log('error');
    } finally {
      setLoading(false);
    }
  }, []);

  const uploadFile = async () => {
    if (uploadedFiles[selectedPersyaratan]) {
      Alert.alert('File sudah diupload', 'Silahkan pilih file lain');
    } else {
      try {
        const res = await DocumentPicker.pick({
          type: [
            DocumentPicker.types.images,
            DocumentPicker.types.pdf,
            DocumentPicker.types.docx,
          ],
        });

        const uploadedFileUrl = res[0].uri;
        const fileType = res[0].type;

        // Read the file data
        const fileData = await RNFS.readFile(uploadedFileUrl, 'base64');

        setUploadedFiles({
          ...uploadedFiles,
          [selectedPersyaratan]: {
            data: `data:${fileType};base64,${fileData}`, // Save the file data as base64 string
            type: fileType,
          },
        });
      } catch (err) {
        if (DocumentPicker.isCancel(err)) {
          console.info(err);
        } else {
          throw err;
        }
      }
    }
  };

  const removeAllFiles = async () => {
    Alert.alert(
      'Hapus semua berkas',
      'Apakah Anda yakin ingin menghapus semua berkas?',
      [
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {
          text: 'OK',
          onPress: async () => {
            // Iterate over all files
            for (const fileName in uploadedFiles) {
              // Delete the file from Firebase Storage
              const fileRef = storage().ref(
                `${auth().currentUser.uid}/${fileName}`,
              );
              try {
                // Check if the file exists
                await fileRef.getMetadata();
                // If the file exists, delete it
                await fileRef.delete();
                console.log('File deleted successfully from Firebase Storage');
              } catch (error) {
                if (error.code === 'storage/object-not-found') {
                  // File doesn't exist in Firebase Storage
                  console.log('File does not exist in Firebase Storage');
                } else {
                  console.error(
                    'Error deleting file from Firebase Storage:',
                    error,
                  );
                }
              }

              // Delete the file reference from Firestore
              try {
                const docRef = firestore().collection('pengajuan').doc(itemId);
                // Check if the document exists
                const doc = await docRef.get();
                if (doc.exists) {
                  // If the document exists, update it
                  await docRef.update({
                    [`berkas.${fileName}`]: firestore.FieldValue.delete(),
                  });
                  console.log(
                    'File reference deleted successfully from Firestore',
                  );
                } else {
                  console.log('Document does not exist in Firestore');
                }
              } catch (error) {
                if (error.code === 'firestore/not-found') {
                  // Document doesn't exist in Firestore
                  console.log('Document does not exist in Firestore');
                } else {
                  console.error(
                    'Error deleting file reference from Firestore:',
                    error,
                  );
                }
              }
            }

            // Delete all files from the state
            setUploadedFiles({});
          },
        },
      ],
      {cancelable: false},
    );
  };

  const handleSubmit = async () => {
    setLoading(true);
    if (
      pilihTopik === initialState.topikPenelitian &&
      _.isEqual(uploadedFiles, initialState.berkas)
    ) {
      // No changes were made
      Alert.alert('Submit gagal', 'Tidak ada perubahan yang dilakukan');
      return;
    }
    const user = auth().currentUser;
    const periodePendaftaran = {
      tanggalBuka: jadwalPengajuan[0].periodePendaftaran.tanggalBuka.toDate(),
      tanggalTutup: jadwalPengajuan[0].periodePendaftaran.tanggalTutup.toDate(),
    };
    const dataUpload = {
      topikPenelitian: pilihTopik,
      berkas: uploadedFiles,
      status: 'Belum Diverifikasi',
      periodePengajuan: periodePendaftaran,
      jadwalPengajuan_uid: jadwalPengajuan[0].id,
      mahasiswa_uid: user.uid,
      editedAt: firestore.FieldValue.serverTimestamp(),
    };
    try {
      for (const [key, value] of Object.entries(uploadedFiles)) {
        if (!_.isEqual(value, initialState.berkas[key])) {
          // Only upload file if it has changed
          const fileRef = storage().ref(`${user.uid}/${key}`);
          if (value.data) {
            const base64Data = value.data.split('base64,')[1];
            await fileRef.putString(base64Data, 'base64');
            const url = await fileRef.getDownloadURL();
            dataUpload.berkas[key] = url; // Overwrite changed values
          }
        }
      }
      // Update the existing document
      await firestore().collection('pengajuan').doc(itemId).update(dataUpload);
      Alert.alert('Submit berhasil', 'Silahkan tunggu verifikasi', [
        {
          text: 'OK',
          onPress: () => navigation.navigate('HomePengajuanSkripsi'),
        },
      ]);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchData();
    fetchUser();
    fetchPersyaratan();
    fetchJadwalPengajuan();
    fetchTopikPenelitian();
    setInitialState({
      topikPenelitian: pilihTopik,
      berkas: {...uploadedFiles},
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    fetchPersyaratan,
    fetchData,
    fetchJadwalPengajuan,
    fetchUser,
    fetchTopikPenelitian,
    itemId,
  ]);

  return (
    <>
      <ScrollView style={styles.mainContainer}>
        <Header title="Edit Pengajuan Skripsi" />
        {loading ? (
          <>
            <Loader />
          </>
        ) : (
          <>
            <Text style={styles.inputTitle}>
              Topik Penelitian<Text style={styles.important}>*</Text>
            </Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={pilihTopik}
                onValueChange={itemValue => setPilihTopik(itemValue)}>
                {topikPenelitianOptions.map((item, index) => (
                  <Picker.Item
                    key={index}
                    label={item}
                    value={item}
                    style={styles.optionText}
                  />
                ))}
              </Picker>
            </View>
            <Text style={styles.inputTitle}>
              Upload Berkas Persyaratan<Text style={styles.important}>*</Text>
            </Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={selectedPersyaratan}
                onValueChange={itemValue => setSelectedPersyaratan(itemValue)}>
                {listPersyaratan.map((item, index) => (
                  <Picker.Item
                    style={styles.optionText}
                    key={index}
                    label={item}
                    value={item}
                  />
                ))}
              </Picker>
            </View>
            {Object.keys(uploadedFiles).length === listPersyaratan.length ? (
              <Pressable style={styles.btnResetUpload} onPress={removeAllFiles}>
                <Text style={styles.btnText}>Upload Ulang Berkas</Text>
              </Pressable>
            ) : (
              <Pressable style={styles.btnUpload} onPress={uploadFile}>
                <Text style={styles.btnText}>Upload</Text>
              </Pressable>
            )}
            <Text style={styles.inputTitle}>Berkas yang telah diupload</Text>
            {Object.entries(uploadedFiles).map(([key, value], index) => (
              <View key={index} onPress={() => setSelectedData(value)}>
                <View style={styles.berkasContainer}>
                  <Text style={styles.selectText}>{key}</Text>
                </View>
              </View>
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
            <Pressable onPress={handleSubmit} style={styles.btnSubmit}>
              {!loading ? (
                <Text style={styles.btnText}>Submit</Text>
              ) : (
                <Text style={styles.btnText}>Loading...</Text>
              )}
            </Pressable>
          </>
        )}
        <BottomSpace marginBottom={40} />
      </ScrollView>
    </>
  );
};

export default EditPengajuanSkripsi;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    padding: 20,
    backgroundColor: 'white',
  },
  inputTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6F7789',
    marginBottom: 5,
    marginTop: 10,
  },
  input: {
    fontSize: 16,
    color: 'black',
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 20,
  },
  border: {
    borderWidth: 1,
    borderColor: '#176B87',
  },
  btnUpload: {
    backgroundColor: '#F6D776',
    borderRadius: 15,
    padding: 15,
    marginBottom: 20,
    marginTop: 20,
    elevation: 5,
  },
  btnResetUpload: {
    backgroundColor: '#FF6868',
    borderRadius: 15,
    padding: 15,
    marginBottom: 20,
    marginTop: 20,
    elevation: 5,
  },
  btnSubmit: {
    backgroundColor: '#176B87',
    borderRadius: 15,
    padding: 15,
    marginBottom: 20,
    marginTop: 20,
    elevation: 5,
  },
  btnText: {
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '600',
    color: 'white',
  },
  selectText: {
    fontSize: 16,
    color: 'white',
    fontWeight: '600',
  },
  optionText: {
    fontSize: 16,
    color: '#6F7789',
    fontWeight: '600',
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#176B87',
    borderRadius: 20,
    marginBottom: 10,
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
  iconRemove: {
    marginRight: 10,
    padding: 5,
    borderRadius: 5,
    backgroundColor: 'white',
  },
  important: {
    color: 'red',
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
  loader: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: Dimensions.get('window').height,
  },
});
