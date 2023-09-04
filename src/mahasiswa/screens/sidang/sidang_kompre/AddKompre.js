import {
  View,
  TextInput,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import DocumentPicker from 'react-native-document-picker';
import storage from '@react-native-firebase/storage';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import RNFS from 'react-native-fs';
import {launchCamera} from 'react-native-image-picker';
import Icon from 'react-native-vector-icons/FontAwesome6';
import {Picker} from '@react-native-picker/picker';
import {
  ALERT_TYPE,
  AlertNotificationRoot,
  Dialog,
} from 'react-native-alert-notification';

const AddKompre = ({navigation}) => {
  const [topik, setTopik] = useState('');
  const [judul, setJudul] = useState('');
  const [filePersetujuanKompre, setFilePersetujuanKompre] = useState(null);
  const [persetujuanKomprePath, setPersetujuanKomprePath] = useState('');
  const [fileSintak, setFileSintak] = useState(null);
  const [sintakPath, setSintakPath] = useState('');
  const [isSubmitDisabled, setIsSubmitDisabled] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [jadwalSidang, setJadwalSidang] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [userPengajuanData, setUserPengajuanData] = useState([]);

  const user = auth().currentUser;
  useEffect(() => {
    const unsubscribe = firestore()
      .collection('pengajuan')
      .where('user_uid', '==', user.uid)
      .where('jenisPengajuan', '==', 'Skripsi')
      .onSnapshot(querySnapshot => {
        const data = [];
        querySnapshot.forEach(doc => {
          data.push({id: doc.id, ...doc.data()});
        });
        setUserPengajuanData(data);
      });
    const unsubscribeJadwal = firestore()
      .collection('jadwalSidang')
      .where('status', '==', 'Aktif')
      .where('jenisSidang', 'array-contains', 'Komprehensif')
      .onSnapshot(querySnapshot => {
        const data = [];
        querySnapshot.forEach(doc => {
          data.push({id: doc.id, ...doc.data()});
        });
        setJadwalSidang(data);
      });

    if (
      judul !== '' &&
      topik !== '' &&
      persetujuanKomprePath !== '' &&
      sintakPath !== ''
    ) {
      setIsSubmitDisabled(false);
    } else {
      setIsSubmitDisabled(true);
    }
    return () => {
      unsubscribe();
      unsubscribeJadwal();
    };
  }, [topik, judul, persetujuanKomprePath, sintakPath, user.uid]);

  const pickerPersetujuanKompre = async () => {
    try {
      const result = await DocumentPicker.pick({
        type: [
          DocumentPicker.types.images,
          DocumentPicker.types.pdf,
          DocumentPicker.types.docx,
        ],
      });
      console.log(result);
      const selectedFile = result[0].uri;
      const selectedFileName = result[0].name;
      setPersetujuanKomprePath(selectedFileName);
      setFilePersetujuanKompre({uri: selectedFile, name: result[0]});
      console.log('Nama Berkas:', selectedFileName);
    } catch (error) {
      if (DocumentPicker.isCancel(error)) {
        console.log('Pengguna membatalkan pemilihan dokumen');
      } else {
        console.log('Error memilih dokumen:', error.message);
      }
    }
  };

  const pickerSintak = async () => {
    try {
      const result = await DocumentPicker.pick({
        type: [
          DocumentPicker.types.images,
          DocumentPicker.types.pdf,
          DocumentPicker.types.docx,
        ],
      });
      console.log(result);
      const selectedFile = result[0].uri;
      const selectedFileName = result[0].name;
      setSintakPath(selectedFileName);
      setFileSintak({uri: selectedFile, name: result[0]});
      console.log('Nama Berkas:', selectedFileName);
    } catch (error) {
      if (DocumentPicker.isCancel(error)) {
        console.log('Pengguna membatalkan pemilihan dokumen');
      } else {
        console.log('Error memilih dokumen:', error.message);
      }
    }
  };

  const imagePickerPersetujuanKompre = async () => {
    const options = {
      mediaType: 'photo',
      quality: 0.5, // Kualitas gambar (0 - 1)
    };
    try {
      const response = await launchCamera(options);
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else {
        const selectedFile = response.assets[0].uri;
        const selectedFileName = response.assets[0].fileName;
        setPersetujuanKomprePath(selectedFileName);
        setFilePersetujuanKompre({uri: selectedFile, name: selectedFileName});
        console.log('Selected Image URI:', selectedFile);
      }
    } catch (error) {
      console.error('ImagePicker Error:', error);
    }
  };

  const imagePickerSintak = async () => {
    const options = {
      mediaType: 'photo',
      quality: 0.5, // Kualitas gambar (0 - 1)
    };
    try {
      const response = await launchCamera(options);
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else {
        const selectedFile = response.assets[0].uri;
        const selectedFileName = response.assets[0].fileName;
        setSintakPath(selectedFileName);
        setFileSintak({uri: selectedFile, name: selectedFileName});
        console.log('Selected Image URI:', selectedFile);
      }
    } catch (error) {
      console.error('ImagePicker Error:', error);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    setTopik('');
    setFileSintak(null);
    setSintakPath('');
    setFilePersetujuanKompre(null);
    setPersetujuanKomprePath('');
    setRefreshing(false);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    if (fileSintak && filePersetujuanKompre) {
      const sintakFileName = `persyaratan/sidangKompre/SINTAK/${user.uid}`;
      const persetujuanKompreFileName = `persyaratan/sidangKompre/formPersetujuanKompre/${user.uid}`;

      const sintakReference = storage().ref(sintakFileName);
      const persetujuanKompreReference = storage().ref(
        persetujuanKompreFileName,
      );
      try {
        // Proses Transkip Nilai
        const sintakFilePath = `${RNFS.DocumentDirectoryPath}/${fileSintak.name}`;
        await RNFS.copyFile(fileSintak.uri, sintakFilePath);
        const sintakBlob = await RNFS.readFile(sintakFilePath, 'base64');
        await sintakReference.putString(sintakBlob, 'base64');
        const sintak = await sintakReference.getDownloadURL();

        // Proses Form Pendaftaran Seminar Proposal
        const persetujuanKompreFilePath = `${RNFS.DocumentDirectoryPath}/${filePersetujuanKompre.name}`;
        await RNFS.copyFile(
          filePersetujuanKompre.uri,
          persetujuanKompreFilePath,
        );
        const persetujuanKompreBlob = await RNFS.readFile(
          persetujuanKompreFilePath,
          'base64',
        );
        await persetujuanKompreReference.putString(
          persetujuanKompreBlob,
          'base64',
        );
        const persetujuanKompre =
          await persetujuanKompreReference.getDownloadURL();

        // Push to Firestore
        const jadwalId = jadwalSidang[0].id;
        const berkasPersyaratan = {
          sintak: sintak,
          persetujuanKompre: persetujuanKompre,
        };
        await firestore().collection('sidang').add({
          judul: judul,
          pengajuan_uid: topik,
          berkasPersyaratan,
          createdAt: new Date(),
          user_uid: user.uid,
          status: 'Belum Diverifikasi',
          catatan: '-',
          jenisSidang: 'Komprehensif',
          jadwalSidang_uid: jadwalId,
        });
        Dialog.show({
          type: ALERT_TYPE.SUCCESS,
          title: 'Berhasil',
          textBody: 'Pendaftaran sidang berhasil dilakukan',
          button: 'Tutup',
          onPressButton: () => {
            navigation.goBack();
            Dialog.hide();
          },
        });
        console.log('Image uploaded successfully');
      } catch (error) {
        console.error('Error uploading image:', error);
      } finally {
        setIsSubmitting(false);
      }
    }
  };
  return (
    <AlertNotificationRoot>
      <ScrollView
        contentContainerStyle={{
          backgroundColor: 'white',
        }}
        keyboardShouldPersistTaps="handled"
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }>
        <View style={styles.container}>
          <Text style={styles.inputTitle}>
            Topik Penelitian<Text style={styles.star}>*</Text>
          </Text>
          <View style={styles.picker}>
            <Picker
              selectedValue={topik}
              onValueChange={(itemValue, itemIndex) => setTopik(itemValue)}>
              <Picker.Item label="Pilih Topik" value={null} />
              {userPengajuanData.map(item => (
                <Picker.Item
                  key={item.id}
                  label={item.topikPenelitian}
                  value={item.id}
                />
              ))}
            </Picker>
          </View>
          <Text style={styles.inputTitle}>
            Judul<Text style={styles.star}>*</Text>
          </Text>
          <View style={styles.uploadContainer}>
            <TextInput
              placeholder="Masukkan Judul"
              style={[styles.input, styles.border]}
              multiline
              numberOfLines={3}
              value={judul}
              onChangeText={text => setJudul(text)}
            />
          </View>
          <Text style={styles.inputTitle}>
            Form Persetujuan Kompre<Text style={styles.star}>*</Text>
          </Text>
          <View style={styles.uploadContainer}>
            <TextInput
              style={[styles.fileNameInput, styles.border]}
              placeholder="Belum Upload"
              value={persetujuanKomprePath}
              editable={false}
            />
            <TouchableOpacity
              style={styles.uploadButton}
              onPress={imagePickerPersetujuanKompre}>
              <Icon name="camera" size={22} color="white" />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.uploadButton}
              onPress={pickerPersetujuanKompre}>
              <Icon name="file-circle-plus" size={22} color="white" />
            </TouchableOpacity>
          </View>
          <Text style={styles.inputTitle}>
            Transkip Aktivitas Kemahasiswaan<Text style={styles.star}>*</Text>
          </Text>
          <View style={styles.uploadContainer}>
            <TextInput
              style={[styles.fileNameInput, styles.border]}
              placeholder="Belum Upload"
              value={sintakPath}
              editable={false}
            />
            <TouchableOpacity
              style={styles.uploadButton}
              onPress={imagePickerSintak}>
              <Icon name="camera" size={22} color="white" />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.uploadButton}
              onPress={pickerSintak}>
              <Icon name="file-circle-plus" size={22} color="white" />
            </TouchableOpacity>
          </View>
        </View>
        <TouchableOpacity
          style={[
            styles.floatingButtonSubmit,
            isSubmitDisabled && styles.disabledUploadButton,
          ]}
          onPress={handleSubmit}
          disabled={isSubmitDisabled || isSubmitting}>
          {isSubmitting ? (
            <ActivityIndicator size="small" color="white" />
          ) : (
            <Text style={styles.uploadButtonText}>Submit</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </AlertNotificationRoot>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    borderRadius: 5,
    backgroundColor: 'white',
  },
  input: {
    width: '100%',
    marginBottom: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
  },
  uploadContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  fileNameInput: {
    flex: 1,
    width: '100%',
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
  },
  uploadButton: {
    backgroundColor: '#7895CB',
    padding: 15,
    marginLeft: 5,
    borderRadius: 5,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  buttonAction: {
    backgroundColor: '#7895CB',
    padding: 15,
    marginLeft: 5,
    borderRadius: 5,
    flex: 2,
  },
  buttonActionCancel: {
    backgroundColor: '#C70039',
    padding: 15,
    marginLeft: 5,
    borderRadius: 5,
    flex: 2,
  },
  cancelButtonText: {
    color: 'white',
    textAlign: 'center',
  },
  uploadButtonText: {
    color: 'white',
    textAlign: 'center',
  },
  disabledUploadButton: {
    backgroundColor: '#ccc',
  },
  inputTitle: {
    color: 'black',
    fontWeight: 'bold',
    marginBottom: 15,
  },
  floatingButtonSubmit: {
    padding: 15,
    backgroundColor: '#7895CB',
    borderRadius: 10,
    shadowColor: '#000',
    marginVertical: 30,
    marginHorizontal: 20,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    marginBottom: 400,
  },
  border: {
    borderWidth: 4,
    borderColor: '#F5F5F5',
  },
  picker: {
    width: '100%',
    marginBottom: 15,
    borderRadius: 5,
    borderWidth: 4,
    borderColor: '#F5F5F5',
  },
  btnSubmitContainer: {
    backgroundColor: 'white',
    elevation: 0,
    shadowOpacity: 0,
  },
  star: {color: 'red'},
});

export default AddKompre;
