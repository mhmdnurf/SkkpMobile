import {
  ScrollView,
  Text,
  StyleSheet,
  View,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  RefreshControl,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import DocumentPicker from 'react-native-document-picker';
import {Picker} from '@react-native-picker/picker';
import storage from '@react-native-firebase/storage';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import RNFS from 'react-native-fs';
import {launchCamera} from 'react-native-image-picker';
import Icon from 'react-native-vector-icons/FontAwesome6';

export default function AddPengajuanSkripsi({navigation}) {
  const [topik, setTopik] = useState('');
  const [fileFormTopik, setFormTopik] = useState(null);
  const [formTopikPath, setFormTopikPath] = useState('');
  const [fileFormKrs, setFileFormKrs] = useState(null);
  const [formKrsPath, setFormKrsPath] = useState('');
  const [fileTranskipNilai, setFileTranskipNilai] = useState(null);
  const [transkipPath, setTranskipPath] = useState('');
  const [fileSlipPembayaranSkripsi, setSlipPembayaranSkripsi] = useState(null);
  const [slipPembayaranSkripsiPath, setSlipPembayaranSkripsiPath] =
    useState('');
  const [fileSertifikat, setSertifikat] = useState(null);
  const [sertifikatPath, setSertifikatPath] = useState('');
  const [isSubmitDisabled, setIsSubmitDisabled] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [jadwalPengajuan, setJadwalPengajuan] = useState([]);

  useEffect(() => {
    const unsubscribe = firestore()
      .collection('jadwalPengajuan')
      .where('status', '==', 'Aktif')
      .onSnapshot(querySnapshot => {
        const data = [];
        querySnapshot.forEach(doc => {
          data.push({id: doc.id, ...doc.data()});
          setJadwalPengajuan(data);
        });
      });
    if (
      topik !== '' &&
      transkipPath !== '' &&
      formKrsPath !== '' &&
      formTopikPath !== '' &&
      slipPembayaranSkripsiPath !== '' &&
      sertifikatPath !== ''
    ) {
      setIsSubmitDisabled(false);
    } else {
      setIsSubmitDisabled(true);
    }
    return () => {
      unsubscribe();
    };
  }, [
    topik,
    transkipPath,
    formKrsPath,
    formTopikPath,
    slipPembayaranSkripsiPath,
    sertifikatPath,
  ]);

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
      setSertifikatPath(selectedFileName);
      setSertifikat({uri: selectedFile, name: result[0]});
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
      quality: 0.5, // Kualitas gambar (0 - 1)
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
      quality: 0.5, // Kualitas gambar (0 - 1)
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

  const imagePickerFormTopik = async () => {
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
        setFormTopikPath(selectedFileName);
        setFormTopik({uri: selectedFile, name: selectedFileName});
        console.log('Selected Image URI:', selectedFile);
      }
    } catch (error) {
      console.error('ImagePicker Error:', error);
    }
  };
  const handleSubmit = async () => {
    setIsSubmitting(true);
    if (
      fileTranskipNilai &&
      fileFormKrs &&
      fileFormTopik &&
      fileSlipPembayaranSkripsi &&
      fileSertifikat
    ) {
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
      try {
        // Proses Transkip Nilai
        const transkipNilaiFilePath = `${RNFS.DocumentDirectoryPath}/${fileTranskipNilai.name}`;
        await RNFS.copyFile(fileTranskipNilai.uri, transkipNilaiFilePath);
        const transkipNilaiBlob = await RNFS.readFile(
          transkipNilaiFilePath,
          'base64',
        );
        await transkipNilaiReference.putString(transkipNilaiBlob, 'base64');
        const transkipNilai = await transkipNilaiReference.getDownloadURL();

        // Proses Form KRS
        const formKrsFilePath = `${RNFS.DocumentDirectoryPath}/${fileFormKrs.name}`;
        await RNFS.copyFile(fileFormKrs.uri, formKrsFilePath);
        const formKrsBlob = await RNFS.readFile(formKrsFilePath, 'base64');
        await formKrsReference.putString(formKrsBlob, 'base64');
        const formKrs = await formKrsReference.getDownloadURL();

        // Proses Form Topik
        const formTopikFilePath = `${RNFS.DocumentDirectoryPath}/${fileFormTopik.name}`;
        await RNFS.copyFile(fileFormTopik.uri, formTopikFilePath);
        const topikBlob = await RNFS.readFile(formTopikFilePath, 'base64');
        await formTopikReference.putString(topikBlob, 'base64');
        const formTopik = await formTopikReference.getDownloadURL();

        // Proses Slip Pembayaran Skripsi
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
        const slipPembayaranSkripsi = await formKrsReference.getDownloadURL();

        // Proses Sertifikat PSPT
        const sertifikatFilePath = `${RNFS.DocumentDirectoryPath}/${fileSertifikat.name}`;
        await RNFS.copyFile(fileSertifikat.uri, sertifikatFilePath);
        const proporsalBlob = await RNFS.readFile(sertifikatFilePath, 'base64');
        await sertifikatReference.putString(proporsalBlob, 'base64');
        const sertifikatPSPT = await sertifikatReference.getDownloadURL();

        // Push to Firestore
        const jadwalId = jadwalPengajuan[0].id;
        await firestore().collection('pengajuan').add({
          topik,
          formTopik,
          formKrs,
          transkipNilai,
          slipPembayaranSkripsi,
          sertifikatPSPT,
          createdAt: new Date(),
          uid: user.uid,
          status: 'Belum Diverifikasi',
          catatan: '-',
          dosenPembimbing: '-',
          jenisPengajuan: 'Skripsi',
          periodePendaftaran: jadwalId,
        });
        Alert.alert('Sukses', 'Data berhasil diupload!', [
          {text: 'OK', onPress: () => navigation.goBack()},
        ]);
        console.log('Image uploaded successfully');
      } catch (error) {
        console.error('Error uploading image:', error);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    setTopik('');
    setFileTranskipNilai(null);
    setTranskipPath('');
    setFileFormKrs(null);
    setFormKrsPath('');
    setFormTopik(null);
    setFormTopikPath('');
    setSlipPembayaranSkripsi(null);
    setSlipPembayaranSkripsiPath('');
    setSertifikat(null);
    setSertifikatPath('');
    setRefreshing(false);
  };

  return (
    <KeyboardAvoidingView
      style={{flex: 1}}
      behavior="height"
      keyboardVerticalOffset={0}>
      <ScrollView
        contentContainerStyle={{
          flex: 1,
          backgroundColor: 'white',
        }}
        keyboardShouldPersistTaps="handled"
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }>
        <View style={styles.container}>
          <Text style={styles.inputTitle}>
            Topik Penelitian<Text style={{color: 'red'}}>*</Text>
          </Text>
          <View style={styles.picker}>
            <Picker
              selectedValue={topik}
              onValueChange={(itemValue, itemIndex) => setTopik(itemValue)}>
              <Picker.Item label="Pilih Topik Penelitian" value="" />
              <Picker.Item
                label="Internet of Things"
                value="Internet of Things"
              />
              <Picker.Item
                label="Software Development"
                value="Software Development"
              />
              <Picker.Item label="Software Testing" value="Software Testing" />
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
            <TouchableOpacity style={styles.uploadButton} onPress={pickerTopik}>
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
              onPress={imagePickerFormKrs}>
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
              value={sertifikatPath}
              editable={false}
            />
            <TouchableOpacity
              style={styles.uploadButton}
              onPress={pickerSertifikat}>
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
    </KeyboardAvoidingView>
  );
}

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
    backgroundColor: '#59C1BD',
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
    backgroundColor: '#59C1BD',
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
    backgroundColor: '#59C1BD',
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
