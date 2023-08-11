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
} from 'react-native';
import React, {useState, useEffect} from 'react';
import DocumentPicker from 'react-native-document-picker';
import {Picker} from '@react-native-picker/picker';
import storage from '@react-native-firebase/storage';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import RNFS from 'react-native-fs';
import moment from 'moment-timezone';

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

  useEffect(() => {
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
        const createdDate = moment().tz('Asia/Jakarta').toDate();
        await firestore()
          .collection('pengajuan')
          .doc(user.uid)
          .collection('pengajuanSkripsi')
          .add({
            topik,
            formTopik,
            formKrs,
            transkipNilai,
            slipPembayaranSkripsi,
            sertifikatPSPT,
            createdAt: createdDate,
            status: 'Diproses',
            catatan: '-',
            dosenPembimbing: '-',
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

  return (
    <KeyboardAvoidingView
      style={{flex: 1}}
      behavior="height"
      keyboardVerticalOffset={0}>
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled">
        <View style={styles.container}>
          <Text style={styles.inputTitle}>Pilih Topik Penelitian*</Text>
          <View style={styles.picker}>
            <Picker
              selectedValue={topik}
              onValueChange={(itemValue, itemIndex) => setTopik(itemValue)}>
              <Picker.Item label="Pilih Jurusan" value="" />
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
          <Text style={styles.inputTitle}>Form Pengajuan Topik*</Text>
          <View style={styles.uploadContainer}>
            <TextInput
              style={styles.fileNameInput}
              placeholder="..."
              value={formTopikPath}
              editable={false}
            />
            <TouchableOpacity style={styles.uploadButton} onPress={pickerTopik}>
              <Text style={styles.uploadButtonText}>Upload File</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.inputTitle}>Form KRS*</Text>
          <View style={styles.uploadContainer}>
            <TextInput
              style={styles.fileNameInput}
              placeholder="..."
              value={formKrsPath}
              editable={false}
            />
            <TouchableOpacity style={styles.uploadButton} onPress={pickerKrs}>
              <Text style={styles.uploadButtonText}>Upload File</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.inputTitle}>Transkip Nilai*</Text>
          <View style={styles.uploadContainer}>
            <TextInput
              style={styles.fileNameInput}
              placeholder="..."
              value={transkipPath}
              editable={false}
            />
            <TouchableOpacity
              style={styles.uploadButton}
              onPress={pickerTranskip}>
              <Text style={styles.uploadButtonText}>Upload File</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.inputTitle}>Slip Pembayaran KP*</Text>
          <View style={styles.uploadContainer}>
            <TextInput
              style={styles.fileNameInput}
              placeholder="..."
              value={slipPembayaranSkripsiPath}
              editable={false}
            />
            <TouchableOpacity
              style={styles.uploadButton}
              onPress={pickerPembayaran}>
              <Text style={styles.uploadButtonText}>Upload File</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.inputTitle}>Sertifikat PSPT*</Text>
          <View style={styles.uploadContainer}>
            <TextInput
              style={styles.fileNameInput}
              placeholder="..."
              value={sertifikatPath}
              editable={false}
            />
            <TouchableOpacity
              style={styles.uploadButton}
              onPress={pickerSertifikat}>
              <Text style={styles.uploadButtonText}>Upload File</Text>
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
  scrollContainer: {
    flex: 1,
    backgroundColor: 'white',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
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
  },
  picker: {
    width: '100%',
    marginBottom: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ccc',
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
});
