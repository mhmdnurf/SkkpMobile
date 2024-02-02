import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  Pressable,
  Alert,
  View,
  Image,
  Modal,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import Header from '../../../../components/Header';
import firestore from '@react-native-firebase/firestore';
import {Picker} from '@react-native-picker/picker';
import BottomSpace from '../../../../components/BottomSpace';
import Icon from 'react-native-vector-icons/FontAwesome';
import DocumentPicker from 'react-native-document-picker';
import storage from '@react-native-firebase/storage';
import RNFS from 'react-native-fs';
import auth from '@react-native-firebase/auth';

const CreatePengajuanSkripsi = ({navigation}) => {
  const [judul, setJudul] = React.useState('');
  const [listPersyaratan, setListPersyaratan] = React.useState([]);
  const [selectedPersyaratan, setSelectedPersyaratan] = React.useState('');
  const [uploadedFiles, setUploadedFiles] = React.useState([]);
  const [selectedData, setSelectedData] = React.useState(null);
  const [jadwalPengajuan, setJadwalPengajuan] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [pilihTopik, setPilihTopik] = React.useState('');
  const [topikPenelitianOptions, setTopikPenelitianOptions] = React.useState(
    [],
  );
  const [userJurusan, setUserJurusan] = React.useState('');
  const [userData, setUserData] = React.useState([]);

  const fetchJadwalPengajuan = React.useCallback(async () => {
    setLoading(true);
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

  const fetchPersyaratan = React.useCallback(async () => {
    try {
      const query = firestore()
        .collection('persyaratan')
        .where('jenisPersyaratan', '==', 'PENGAJUAN SKRIPSI')
        .get();
      const res = await query;
      const data = res.docs.map(doc => doc.data().berkasPersyaratan).flat();
      setListPersyaratan(data);
    } catch {
      console.log('error');
    }
  }, []);

  const fetchUser = React.useCallback(async () => {
    const query = firestore().collection('users').doc(auth().currentUser.uid);
    const res = await query.get();
    const user = res.data();
    setUserJurusan(user.prodi);
    setUserData(user);
  }, []);

  const fetchTopikPenelitian = React.useCallback(async () => {
    try {
      const query = firestore()
        .collection('topikPenelitian')
        .where('prodiTopik', 'array-contains', userJurusan)
        .get();
      const res = await query;
      const data = [];
      res.forEach(doc => {
        data.push({id: doc.id, ...doc.data()});
      });
      setTopikPenelitianOptions(data);
    } catch {
      console.log('error');
    }
  }, [userJurusan]);

  const uploadFile = async () => {
    if (uploadedFiles[selectedPersyaratan]) {
      Alert.alert('File sudah diupload', 'Silahkan pilih file lain');
    } else {
      try {
        const res = await DocumentPicker.pick({
          type: [DocumentPicker.types.images, DocumentPicker.types.pdf],
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

  const removeFile = fileName => {
    setUploadedFiles(prevFiles => {
      const newFiles = {...prevFiles};
      delete newFiles[fileName];
      return newFiles;
    });
  };

  const handleSubmit = async () => {
    setLoading(true);
    const user = auth().currentUser;
    const periodePendaftaran = {
      tanggalBuka: jadwalPengajuan[0].periodePendaftaran.tanggalBuka.toDate(),
      tanggalTutup: jadwalPengajuan[0].periodePendaftaran.tanggalTutup.toDate(),
    };
    const dataUpload = {
      topikPenelitian: pilihTopik.toUpperCase(),
      berkas: {},
      status: 'Belum Diverifikasi',
      jenisPengajuan: 'Skripsi',
      periodePengajuan: periodePendaftaran,
      jadwalPengajuan_uid: jadwalPengajuan[0].id,
      mahasiswa_uid: user.uid,
      nama: userData.nama,
      nim: userData.nim,
      prodi: userData.prodi,
      email: userData.email,
      nomorHP: userData.nomorHP,
      createdAt: firestore.FieldValue.serverTimestamp(),
    };

    const requiredFiles = listPersyaratan; // replace with your actual required file keys
    const requiredJudul = judul !== '';

    // Check if all required files are uploaded
    const allFilesUploaded = requiredFiles.every(file =>
      Object.keys(uploadedFiles).includes(file),
    );

    console.log('Required files:', requiredFiles);
    console.log('Uploaded files:', Object.keys(uploadedFiles));
    console.log('All files uploaded:', allFilesUploaded);

    if (!allFilesUploaded && !requiredJudul) {
      Alert.alert(
        'Gagal submit',
        'Silahkan upload semua berkas terlebih dahulu',
      );
      setLoading(false);
      return;
    }

    try {
      for (const [key, value] of Object.entries(uploadedFiles)) {
        const fileRef = storage().ref(`${user.uid}/${key}`);
        const base64Data = value.data.split('base64,')[1];
        await fileRef.putString(base64Data, 'base64');
        const url = await fileRef.getDownloadURL();
        dataUpload.berkas[key] = url;
      }
      await firestore().collection('pengajuan').add(dataUpload);
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
      setUploadedFiles({});
      setJudul('');
    }
  };

  React.useEffect(() => {
    fetchPersyaratan();
    fetchJadwalPengajuan();
    fetchUser();
    fetchTopikPenelitian();
  }, [fetchPersyaratan, fetchUser, fetchTopikPenelitian, fetchJadwalPengajuan]);

  return (
    <>
      <ScrollView style={styles.mainContainer}>
        <Header title="Buat Pengajuan Skripsi" />
        <Text style={styles.inputTitle}>
          Topik Penelitian<Text style={styles.important}>*</Text>
        </Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={pilihTopik}
            onValueChange={itemValue => setPilihTopik(itemValue)}>
            <Picker.Item label="Pilih Topik Penelitian" value="" />
            {topikPenelitianOptions.map(option => (
              <Picker.Item
                style={styles.optionText}
                key={option.namaTopik}
                label={option.namaTopik}
                value={option.namaTopik}
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
            onValueChange={(itemValue, itemIndex) =>
              setSelectedPersyaratan(itemValue)
            }>
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
        <Pressable style={styles.btnUpload} onPress={uploadFile}>
          <Text style={styles.btnText}>Upload</Text>
        </Pressable>
        <Text style={styles.inputTitle}>Berkas yang telah diupload</Text>
        {Object.entries(uploadedFiles).map(([key, value], index) => (
          <Pressable key={index} onPress={() => setSelectedData(value)}>
            <View style={styles.berkasContainer}>
              <Text style={styles.selectText}>{key}</Text>
              <Pressable
                onPress={event => {
                  event.stopPropagation();
                  removeFile(key);
                }}>
                <Icon
                  name="times"
                  style={styles.iconRemove}
                  size={25}
                  color="#EF4040"
                />
              </Pressable>
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
            <Pressable onPress={() => setSelectedData(null)}>
              <Icon
                name="times"
                style={styles.iconRemove}
                size={25}
                color="#EF4040"
              />
            </Pressable>
            {selectedData && (
              <Image
                source={{uri: selectedData.data}}
                style={styles.modalImage}
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
        <Modal
          transparent={true}
          animationType="none"
          visible={loading}
          onRequestClose={() => {}}>
          <View style={styles.modalBackground}>
            <View style={styles.activityIndicatorWrapper}>
              <ActivityIndicator animating={loading} />
            </View>
          </View>
        </Modal>
        <BottomSpace marginBottom={40} />
      </ScrollView>
    </>
  );
};

export default CreatePengajuanSkripsi;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    padding: 20,
    backgroundColor: 'white',
  },
  inputTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#176B87',
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
    borderWidth: 3,
    borderColor: '#EFECEC',
  },
  btnUpload: {
    backgroundColor: '#F6D776',
    borderRadius: 15,
    paddingHorizontal: 10,
    paddingVertical: 15,
    marginBottom: 20,
    marginTop: 20,
    elevation: 5,
  },
  btnSubmit: {
    backgroundColor: '#176B87',
    borderRadius: 15,
    paddingHorizontal: 10,
    paddingVertical: 15,
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
    borderWidth: 3,
    borderColor: '#EFECEC',
    borderRadius: 20,
    marginBottom: 10,
  },
  berkasContainer: {
    paddingHorizontal: 10,
    paddingVertical: 15,
    backgroundColor: '#86B6F6',
    borderRadius: 15,
    marginBottom: 10,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 5,
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
  modalBackground: {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'space-around',
    backgroundColor: '#00000040',
  },
  activityIndicatorWrapper: {
    backgroundColor: '#FFFFFF',
    height: 100,
    width: 100,
    borderRadius: 10,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
});
