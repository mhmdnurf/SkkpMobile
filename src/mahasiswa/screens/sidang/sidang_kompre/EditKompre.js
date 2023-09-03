import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import storage from '@react-native-firebase/storage';
import DocumentPicker from 'react-native-document-picker';
import RNFS from 'react-native-fs';
import {launchCamera} from 'react-native-image-picker';
import Icon from 'react-native-vector-icons/FontAwesome6';
import {
  ALERT_TYPE,
  AlertNotificationRoot,
  Dialog,
} from 'react-native-alert-notification';

const EditKompre = ({route, navigation}) => {
  const [judul, setJudul] = useState('');
  const [filePersetujuanKompre, setFilePersetujuanKompre] = useState(null);
  const [persetujuanKomprePath, setPersetujuanKomprePath] = useState('');
  const [fileSintak, setFileSintak] = useState(null);
  const [sintakPath, setSintakPath] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [jadwalPengajuan, setJadwalPengajuan] = useState([]);
  const [berkasPersyaratan, setBerkasPersyaratan] = useState({});
  const {itemId} = route.params;

  useEffect(() => {
    const unsubscribe = firestore()
      .collection('jadwalSidang')
      .where('status', '==', 'Aktif')
      .onSnapshot(querySnapshot => {
        const data = [];
        querySnapshot.forEach(doc => {
          data.push({id: doc.id, ...doc.data()});
          setJadwalPengajuan(data);
        });
      });

    firestore()
      .collection('sidang')
      .doc(itemId)
      .get()
      .then(documentSnapshot => {
        if (documentSnapshot.exists) {
          const data = documentSnapshot.data();
          setJudul(data.judul);
          setBerkasPersyaratan(data.berkasPersyaratan);
          setPersetujuanKomprePath(data.berkasPersyaratan.persetujuanKompre);
          setSintakPath(data.berkasPersyaratan.sintak);
        } else {
          console.log('Pengajuan tidak ditemukan');
        }
      })
      .catch(error => {
        console.error('Error mengambil data pengajuan:', error);
      });
    return () => {
      unsubscribe();
    };
  }, [itemId]);

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

  const handleEdit = async () => {
    setIsSubmitting(true);
    try {
      const user = auth().currentUser;
      const sintakFileName = `persyaratan/sidangKompre/SINTAK/${user.uid}`;
      const persetujuanKompreFileName = `persyaratan/sidangKompre/formPersetujuanKompre/${user.uid}`;
      const sintakReference = storage().ref(sintakFileName);
      const persetujuanKompreReference = storage().ref(
        persetujuanKompreFileName,
      );

      let sintak = null;
      let persetujuanKompre = null;

      if (fileSintak) {
        const sintakFilePath = `${RNFS.DocumentDirectoryPath}/${fileSintak.name}`;
        await RNFS.copyFile(fileSintak.uri, sintakFilePath);
        const sintakBlob = await RNFS.readFile(sintakFilePath, 'base64');
        await sintakReference.putString(sintakBlob, 'base64');
        sintak = await sintakReference.getDownloadURL();
      }

      if (filePersetujuanKompre) {
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
        persetujuanKompre = await persetujuanKompreReference.getDownloadURL();
      }
      const jadwalId = jadwalPengajuan[0].id;
      const updateData = {
        judul: judul,
        editedAt: new Date(),
        status: 'Belum Diverifikasi',
        jadwalSidang_uid: jadwalId,
        berkasPersyaratan: {
          sintak: berkasPersyaratan.sintak,
          persetujuanKompre: berkasPersyaratan.persetujuanKompre,
        },
      };
      if (sintak) {
        updateData.berkasPersyaratan.sintak = sintak;
      }
      if (persetujuanKompre) {
        updateData.berkasPersyaratan.persetujuanKompre = persetujuanKompre;
      }
      await firestore().collection('sidang').doc(itemId).update(updateData);
      Dialog.show({
        type: ALERT_TYPE.SUCCESS,
        title: 'Berhasil',
        textBody: 'Data sidang Komprehensif berhasil diubah',
        button: 'Tutup',
        onPressButton: () => {
          navigation.navigate('Sidang');
        },
      });
    } catch (error) {
      console.error('Error mengubah data sidang:', error);
      Alert.alert('Error', 'Terjadi kesalahan saat mengubah data sidang');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AlertNotificationRoot>
      <ScrollView
        contentContainerStyle={{
          backgroundColor: 'white',
        }}
        keyboardShouldPersistTaps="handled">
        <View style={styles.container}>
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
        <View style={{backgroundColor: 'white'}}>
          <TouchableOpacity
            style={styles.floatingButtonSubmit}
            onPress={handleEdit}
            disabled={isSubmitting}>
            {isSubmitting ? (
              <ActivityIndicator size="small" color="white" />
            ) : (
              <Text style={styles.uploadButtonText}>Submit</Text>
            )}
          </TouchableOpacity>
        </View>
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
    marginBottom: 325,
  },
  border: {
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

export default EditKompre;
