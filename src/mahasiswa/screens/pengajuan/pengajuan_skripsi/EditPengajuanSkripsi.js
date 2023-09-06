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
  KeyboardAvoidingView,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import storage from '@react-native-firebase/storage';
import DocumentPicker from 'react-native-document-picker';
import RNFS from 'react-native-fs';
import {launchCamera} from 'react-native-image-picker';
import Icon from 'react-native-vector-icons/FontAwesome6';
import {Picker} from '@react-native-picker/picker';
import {
  ALERT_TYPE,
  AlertNotificationRoot,
  Dialog,
} from 'react-native-alert-notification';

const EditPengajuanSkripsi = ({route, navigation}) => {
  const [fileFormTopik, setFormTopik] = useState(null);
  const [formTopikPath, setFormTopikPath] = useState('');
  const [fileFormKrs, setFileFormKrs] = useState(null);
  const [formKrsPath, setFormKrsPath] = useState('');
  const [fileTranskipNilai, setFileTranskipNilai] = useState(null);
  const [transkipPath, setTranskipPath] = useState('');
  const [fileSlipPembayaranSkripsi, setSlipPembayaranSkripsi] = useState(null);
  const [slipPembayaranSkripsiPath, setSlipPembayaranSkripsiPath] =
    useState('');
  const [sertifikatPSPT, setSertifikatPSPT] = useState(null);
  const [sertifikatPSPTPath, setSertifikatPSPTPath] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [jadwalPengajuan, setJadwalPengajuan] = useState([]);
  const [topikPenelitianOptions, setTopikPenelitianOptions] = useState([]);
  const [pilihTopik, setPilihTopik] = useState('');
  const [userJurusan, setUserJurusan] = useState('');
  const [berkasPersyaratan, setBerkasPersyaratan] = useState('');
  const {itemId} = route.params;
  useEffect(() => {
    firestore()
      .collection('pengajuan')
      .doc(itemId)
      .get()
      .then(documentSnapshot => {
        if (documentSnapshot.exists) {
          const data = documentSnapshot.data();
          setPilihTopik(data.topikPenelitian);
          setBerkasPersyaratan(data.berkasPersyaratan);
          setTranskipPath(data.berkasPersyaratan.transkipNilai);
          setFormKrsPath(data.berkasPersyaratan.formKrs);
          setFormTopikPath(data.berkasPersyaratan.formTopik);
          setSlipPembayaranSkripsiPath(
            data.berkasPersyaratan.slipPembayaranSkripsi,
          );
          setSertifikatPSPTPath(data.berkasPersyaratan.fileSertifikatPSPT);
        } else {
          console.log('Pengajuan tidak ditemukan');
        }
      })
      .catch(error => {
        console.error('Error mengambil data pengajuan:', error);
      });

    const unsubscribe = firestore()
      .collection('jadwalPengajuan')
      .where('status', '==', 'Aktif')
      .where('jenisPengajuan', 'array-contains', 'Skripsi')
      .onSnapshot(querySnapshot => {
        const data = [];
        querySnapshot.forEach(doc => {
          data.push({id: doc.id, ...doc.data()});
          setJadwalPengajuan(data);
        });
      });

    const unsubscribeUser = auth().onAuthStateChanged(async user => {
      if (user) {
        // Dapatkan data pengguna dari Firestore berdasarkan UID
        const userDoc = await firestore()
          .collection('users')
          .doc(user.uid)
          .get();
        setUserJurusan(userDoc.data().jurusan); // Ambil informasi jurusan

        // Simpan data pengguna dalam state
      }
    });
    const unsubscribeTopik = firestore()
      .collection('topikPenelitian')
      .where('prodiTopik', 'array-contains', userJurusan)
      .onSnapshot(querySnapshot => {
        const topics = [];
        querySnapshot.forEach(doc => {
          topics.push(doc.data());
        });
        setTopikPenelitianOptions(topics);
      });
    return () => {
      unsubscribe();
      unsubscribeTopik();
      unsubscribeUser();
    };
  }, [itemId, userJurusan]);

  const pickerTranskip = async () => {
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
      setTranskipPath(selectedFileName);
      setFileTranskipNilai({uri: selectedFile, name: result[0]});
      console.log('Nama Berkas:', selectedFileName);
    } catch (error) {
      if (DocumentPicker.isCancel(error)) {
        console.log('Pengguna membatalkan pemilihan dokumen');
      } else {
        console.log('Error memilih dokumen:', error.message);
      }
    }
  };
  const pickerTopik = async () => {
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
      setFormTopikPath(selectedFileName);
      setFormTopik({uri: selectedFile, name: result[0]});
      console.log('Nama Berkas:', selectedFileName);
    } catch (error) {
      if (DocumentPicker.isCancel(error)) {
        console.log('Pengguna membatalkan pemilihan dokumen');
      } else {
        console.log('Error memilih dokumen:', error.message);
      }
    }
  };

  const pickerKrs = async () => {
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
      setFormKrsPath(selectedFileName);
      setFileFormKrs({uri: selectedFile, name: result[0]});
      console.log('Nama Berkas:', selectedFileName);
    } catch (error) {
      if (DocumentPicker.isCancel(error)) {
        console.log('Pengguna membatalkan pemilihan dokumen');
      } else {
        console.log('Error memilih dokumen:', error.message);
      }
    }
  };

  const pickerPembayaran = async () => {
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
      setSlipPembayaranSkripsiPath(selectedFileName);
      setSlipPembayaranSkripsi({uri: selectedFile, name: result[0]});
      console.log('Nama Berkas:', selectedFileName);
    } catch (error) {
      if (DocumentPicker.isCancel(error)) {
        console.log('Pengguna membatalkan pemilihan dokumen');
      } else {
        console.log('Error memilih dokumen:', error.message);
      }
    }
  };

  const pickerSertifikat = async () => {
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
      setSertifikatPSPTPath(selectedFileName);
      setSertifikatPSPT({uri: selectedFile, name: result[0]});
      console.log('Nama Berkas:', selectedFileName);
    } catch (error) {
      if (DocumentPicker.isCancel(error)) {
        console.log('Pengguna membatalkan pemilihan dokumen');
      } else {
        console.log('Error memilih dokumen:', error.message);
      }
    }
  };

  const imagePickerTranskip = async () => {
    const options = {
      mediaType: 'photo',
      quality: 0.5,
      cameraType: 'back',
    };
    try {
      const response = await launchCamera(options);
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else {
        const selectedFile = response.assets[0].uri;
        const selectedFileName = response.assets[0].fileName;
        setTranskipPath(selectedFileName);
        setFileTranskipNilai({uri: selectedFile, name: selectedFileName});
        console.log('Selected Image URI:', selectedFile);
      }
    } catch (error) {
      console.error('ImagePicker Error:', error);
    }
  };

  const imagePickerFormKrs = async () => {
    const options = {
      mediaType: 'photo',
      quality: 0.5,
      cameraType: 'back',
    };
    try {
      const response = await launchCamera(options);
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else {
        const selectedFile = response.assets[0].uri;
        const selectedFileName = response.assets[0].fileName;
        setFormKrsPath(selectedFileName);
        setFileFormKrs({uri: selectedFile, name: selectedFileName});
        console.log('Selected Image URI:', selectedFile);
      }
    } catch (error) {
      console.error('ImagePicker Error:', error);
    }
  };

  const imagePickerSertifikatPSPT = async () => {
    const options = {
      mediaType: 'photo',
      quality: 0.5,
      cameraType: 'back',
    };
    try {
      const response = await launchCamera(options);
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else {
        const selectedFile = response.assets[0].uri;
        const selectedFileName = response.assets[0].fileName;
        setSertifikatPSPTPath(selectedFileName);
        setSertifikatPSPT({uri: selectedFile, name: selectedFileName});
        console.log('Selected Image URI:', selectedFile);
      }
    } catch (error) {
      console.error('ImagePicker Error:', error);
    }
  };

  const imagePickerFormTopik = async () => {
    const options = {
      mediaType: 'photo',
      quality: 0.5,
      cameraType: 'back',
    };
    try {
      const response = await launchCamera(options);
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else {
        const selectedFile = response.assets[0].uri;
        const selectedFileName = response.assets[0].fileName;
        setFormTopikPath(selectedFileName);
        setFormTopik({uri: selectedFile, name: selectedFileName});
        console.log('Selected Image URI:', selectedFile);
      }
    } catch (error) {
      console.error('ImagePicker Error:', error);
    }
  };
  const imagePickerPembayaran = async () => {
    const options = {
      mediaType: 'photo',
      quality: 0.5,
      cameraType: 'back',
    };
    try {
      const response = await launchCamera(options);
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else {
        const selectedFile = response.assets[0].uri;
        const selectedFileName = response.assets[0].fileName;
        setSlipPembayaranSkripsiPath(selectedFileName);
        setSlipPembayaranSkripsi({uri: selectedFile, name: selectedFileName});
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
      const transkipNilaiFileName = `persyaratan/pengajuanSkripsi/transkipNilai/${user.uid}`;
      const formKrsFileName = `persyaratan/pengajuanSkripsi/formKRS/${user.uid}`;
      const formTopikFileName = `persyaratan/pengajuanSkripsi/formTopik/${user.uid}`;
      const pembayaranSkripsiFileName = `persyaratan/pengajuanSkripsi/slipPembayaranSkripsi/${user.uid}`;
      const sertifikatFileName = `persyaratan/pengajuanSkripsi/sertifikatPSPT/${user.uid}`;
      const transkipNilaiReference = storage().ref(transkipNilaiFileName);
      const formKrsReference = storage().ref(formKrsFileName);
      const formTopikReference = storage().ref(formTopikFileName);
      const pembayaranSkripsiReference = storage().ref(
        pembayaranSkripsiFileName,
      );
      const sertifikatReference = storage().ref(sertifikatFileName);

      // Inisialisasi variabel untuk URL dokumen (jika diunggah)
      let transkipNilai = null;
      let formKrs = null;
      let formTopik = null;
      let slipPembayaranSkripsi = null;
      let fileSertifikatPSPT = null;

      // Proses Transkip Nilai
      if (fileTranskipNilai) {
        const transkipNilaiFilePath = `${RNFS.DocumentDirectoryPath}/${fileTranskipNilai.name}`;
        await RNFS.copyFile(fileTranskipNilai.uri, transkipNilaiFilePath);
        const transkipNilaiBlob = await RNFS.readFile(
          transkipNilaiFilePath,
          'base64',
        );
        await transkipNilaiReference.putString(transkipNilaiBlob, 'base64');
        transkipNilai = await transkipNilaiReference.getDownloadURL();
      }

      // Proses Form KRS
      if (fileFormKrs) {
        const formKrsFilePath = `${RNFS.DocumentDirectoryPath}/${fileFormKrs.name}`;
        await RNFS.copyFile(fileFormKrs.uri, formKrsFilePath);
        const formKrsBlob = await RNFS.readFile(formKrsFilePath, 'base64');
        await formKrsReference.putString(formKrsBlob, 'base64');
        formKrs = await formKrsReference.getDownloadURL();
      }

      // Proses Form Pendaftaran KP
      if (fileFormTopik) {
        const formTopikFilePath = `${RNFS.DocumentDirectoryPath}/${fileFormTopik.name}`;
        await RNFS.copyFile(fileFormTopik.uri, formTopikFilePath);
        const topikBlob = await RNFS.readFile(formTopikFilePath, 'base64');
        await formTopikReference.putString(topikBlob, 'base64');
        formTopik = await formTopikReference.getDownloadURL();
      }

      // Proses Slip Pembayaran KP
      if (fileSlipPembayaranSkripsi) {
        const pembayaranSkripsiFilePath = `${RNFS.DocumentDirectoryPath}/${fileSlipPembayaranSkripsi.name}`;
        await RNFS.copyFile(
          fileSlipPembayaranSkripsi.uri,
          pembayaranSkripsiFilePath,
        );
        const pembayaranSkripsiBlob = await RNFS.readFile(
          pembayaranSkripsiFilePath,
          'base64',
        );
        await pembayaranSkripsiReference.putString(
          pembayaranSkripsiBlob,
          'base64',
        );
        slipPembayaranSkripsi =
          await pembayaranSkripsiReference.getDownloadURL();
      }

      // Proses Dokumen Proporsal
      if (sertifikatPSPT) {
        const sertifikatFilePath = `${RNFS.DocumentDirectoryPath}/${sertifikatPSPT.name}`;
        await RNFS.copyFile(sertifikatPSPT.uri, sertifikatFilePath);
        const sertifikatBlob = await RNFS.readFile(
          sertifikatFilePath,
          'base64',
        );
        await sertifikatReference.putString(sertifikatBlob, 'base64');
        fileSertifikatPSPT = await sertifikatReference.getDownloadURL();
      }
      const jadwalId = jadwalPengajuan[0].id;
      // Push to Firestore
      const updateData = {
        topikPenelitian: pilihTopik,
        editedAt: new Date(),
        status: 'Belum Diverifikasi',
        jadwalPengajuan_uid: jadwalId,
        berkasPersyaratan: {
          transkipNilai: berkasPersyaratan.transkipNilai,
          formKrs: berkasPersyaratan.formKrs,
          formTopik: berkasPersyaratan.formTopik,
          slipPembayaranSkripsi: berkasPersyaratan.slipPembayaranSkripsi,
          fileSertifikatPSPT: berkasPersyaratan.fileSertifikatPSPT,
        },
      };

      // Tambahkan URL dokumen jika diunggah
      if (transkipNilai) {
        updateData.berkasPersyaratan.transkipNilai = transkipNilai;
      }
      if (formKrs) {
        updateData.berkasPersyaratan.formKrs = formKrs;
      }
      if (formTopik) {
        updateData.berkasPersyaratan.formTopik = formTopik;
      }
      if (slipPembayaranSkripsi) {
        updateData.berkasPersyaratan.slipPembayaranSkripsi =
          slipPembayaranSkripsi;
      }
      if (fileSertifikatPSPT) {
        updateData.berkasPersyaratan.fileSertifikatPSPT = fileSertifikatPSPT;
      }

      await firestore().collection('pengajuan').doc(itemId).update(updateData);

      Dialog.show({
        type: ALERT_TYPE.SUCCESS,
        title: 'Berhasil',
        textBody: 'Data pengajuan Skripsi berhasil diubah',
        button: 'Tutup',
        onPressButton: () => {
          navigation.navigate('Pengajuan');
        },
      });
    } catch (error) {
      console.error('Error mengubah data pengajuan:', error);
      Alert.alert('Error', 'Terjadi kesalahan saat mengubah data pengajuan');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AlertNotificationRoot>
      <KeyboardAvoidingView
        style={{flex: 1}}
        behavior="height"
        keyboardVerticalOffset={0}>
        <ScrollView
          contentContainerStyle={{
            flex: 1,
            backgroundColor: 'white',
          }}
          keyboardShouldPersistTaps="handled">
          <View style={styles.container}>
            <Text style={styles.inputTitle}>
              Topik Penelitian<Text style={{color: 'red'}}>*</Text>
            </Text>
            <View style={styles.picker}>
              <Picker
                selectedValue={pilihTopik}
                onValueChange={itemValue => setPilihTopik(itemValue)}>
                <Picker.Item label="Pilih Topik Penelitian" value="" />
                {topikPenelitianOptions.map(option => (
                  <Picker.Item
                    key={option.namaTopik}
                    label={option.namaTopik}
                    value={option.namaTopik}
                  />
                ))}
              </Picker>
            </View>

            <Text style={styles.inputTitle}>
              Form Pengajuan Topik<Text style={{color: 'red'}}>*</Text>
            </Text>
            <View style={styles.uploadContainer}>
              <TextInput
                style={[styles.fileNameInput, styles.border]}
                placeholder="Belum Upload"
                value={formTopikPath}
                editable={false}
              />
              <TouchableOpacity
                style={styles.uploadButton}
                onPress={imagePickerFormTopik}>
                <Icon name="camera" size={22} color="white" />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.uploadButton}
                onPress={pickerTopik}>
                <Icon name="file-circle-plus" size={22} color="white" />
              </TouchableOpacity>
            </View>
            <Text style={styles.inputTitle}>
              Form KRS<Text style={{color: 'red'}}>*</Text>
            </Text>
            <View style={styles.uploadContainer}>
              <TextInput
                style={[styles.fileNameInput, styles.border]}
                placeholder="Belum Upload"
                value={formKrsPath}
                editable={false}
              />
              <TouchableOpacity
                style={styles.uploadButton}
                onPress={imagePickerFormKrs}>
                <Icon name="camera" size={22} color="white" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.uploadButton} onPress={pickerKrs}>
                <Icon name="file-circle-plus" size={22} color="white" />
              </TouchableOpacity>
            </View>
            <Text style={styles.inputTitle}>
              Transkip Nilai<Text style={{color: 'red'}}>*</Text>
            </Text>
            <View style={styles.uploadContainer}>
              <TextInput
                style={[styles.fileNameInput, styles.border]}
                placeholder="Belum Upload"
                value={transkipPath}
                editable={false}
              />
              <TouchableOpacity
                style={styles.uploadButton}
                onPress={imagePickerTranskip}>
                <Icon name="camera" size={22} color="white" />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.uploadButton}
                onPress={pickerTranskip}>
                <Icon name="file-circle-plus" size={22} color="white" />
              </TouchableOpacity>
            </View>
            <Text style={styles.inputTitle}>
              Slip Pembayaran Skripsi<Text style={{color: 'red'}}>*</Text>
            </Text>
            <View style={styles.uploadContainer}>
              <TextInput
                style={[styles.fileNameInput, styles.border]}
                placeholder="Belum Upload"
                value={slipPembayaranSkripsiPath}
                editable={false}
              />
              <TouchableOpacity
                style={styles.uploadButton}
                onPress={imagePickerPembayaran}>
                <Icon name="camera" size={22} color="white" />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.uploadButton}
                onPress={pickerPembayaran}>
                <Icon name="file-circle-plus" size={22} color="white" />
              </TouchableOpacity>
            </View>
            <Text style={styles.inputTitle}>
              Sertifikat PSPT<Text style={{color: 'red'}}>*</Text>
            </Text>
            <View style={styles.uploadContainer}>
              <TextInput
                style={[styles.fileNameInput, styles.border]}
                placeholder="Belum Upload"
                value={sertifikatPSPTPath}
                editable={false}
              />
              <TouchableOpacity
                style={styles.uploadButton}
                onPress={imagePickerSertifikatPSPT}>
                <Icon name="camera" size={22} color="white" />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.uploadButton}
                onPress={pickerSertifikat}>
                <Icon name="file-circle-plus" size={22} color="white" />
              </TouchableOpacity>
            </View>
          </View>
          <TouchableOpacity
            style={[styles.floatingButtonSubmit]}
            onPress={handleEdit}
            disabled={isSubmitting}>
            {isSubmitting ? (
              <ActivityIndicator size="small" color="white" />
            ) : (
              <Text style={styles.uploadButtonText}>Submit</Text>
            )}
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
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
});

export default EditPengajuanSkripsi;
