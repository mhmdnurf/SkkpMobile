import {
  View,
  TextInput,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import DocumentPicker from 'react-native-document-picker';
import storage from '@react-native-firebase/storage';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import RNFS from 'react-native-fs';
import moment from 'moment-timezone';

const AddPengajuanKP = ({navigation}) => {
  const [judul, setJudul] = useState('');
  const [fileTranskipNilai, setFileTranskipNilai] = useState(null);
  const [transkipPath, setTranskipPath] = useState('');
  const [fileFormKrs, setFileFormKrs] = useState(null);
  const [formKrsPath, setFormKrsPath] = useState('');
  const [filePendaftaranKp, setFilePendaftaranKp] = useState(null);
  const [pendaftaranKpPath, setPendaftaranKpPath] = useState('');
  const [slipPembayaranKp, setSlipPembayaranKp] = useState(null);
  const [slipPembayaranKpPath, setSlipPembayaranKpPath] = useState('');
  const [fileProporsal, setFileProporsal] = useState(null);
  const [fileProporsalPath, setFileProporsalPath] = useState('');
  const [isSubmitDisabled, setIsSubmitDisabled] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (
      judul !== '' &&
      transkipPath !== '' &&
      formKrsPath !== '' &&
      pendaftaranKpPath !== '' &&
      slipPembayaranKpPath !== '' &&
      fileProporsalPath !== ''
    ) {
      setIsSubmitDisabled(false);
    } else {
      setIsSubmitDisabled(true);
    }
  }, [
    judul,
    transkipPath,
    formKrsPath,
    pendaftaranKpPath,
    slipPembayaranKpPath,
    fileProporsalPath,
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

  const pickerPendaftaranKp = async () => {
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
      setPendaftaranKpPath(selectedFileName);
      setFilePendaftaranKp({uri: selectedFile, name: result[0]});
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
      setSlipPembayaranKpPath(selectedFileName);
      setSlipPembayaranKp({uri: selectedFile, name: result[0]});
      console.log('Nama Berkas:', selectedFileName);
    } catch (error) {
      if (DocumentPicker.isCancel(error)) {
        console.log('Pengguna membatalkan pemilihan dokumen');
      } else {
        console.log('Error memilih dokumen:', error.message);
      }
    }
  };

  const pickerProporsal = async () => {
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
      setFileProporsalPath(selectedFileName);
      setFileProporsal({uri: selectedFile, name: result[0]});
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
      filePendaftaranKp &&
      slipPembayaranKp &&
      fileProporsal
    ) {
      const user = auth().currentUser;

      const transkipNilaiFileName = `persyaratan/pengajuanKP/transkipNilai/${user.uid}`;
      const formKrsFileName = `persyaratan/pengajuanKP/formKRS/${user.uid}`;
      const pendaftaranKpFileName = `persyaratan/pengajuanKP/formPendaftaranKP/${user.uid}`;
      const pembayaranKpFileName = `persyaratan/pengajuanKP/slipPembayaranKP/${user.uid}`;
      const proporsalFileName = `persyaratan/pengajuanKP/proporsalKP/${user.uid}`;
      const transkipNilaiReference = storage().ref(transkipNilaiFileName);
      const formKrsReference = storage().ref(formKrsFileName);
      const pendaftaranKpReference = storage().ref(pendaftaranKpFileName);
      const pembayaranKpReference = storage().ref(pembayaranKpFileName);
      const proporsalReference = storage().ref(proporsalFileName);
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

        // Proses Form Pendaftaran KP
        const pendaftaranKpFilePath = `${RNFS.DocumentDirectoryPath}/${filePendaftaranKp.name}`;
        await RNFS.copyFile(filePendaftaranKp.uri, pendaftaranKpFilePath);
        const pendaftaranKpBlob = await RNFS.readFile(
          pendaftaranKpFilePath,
          'base64',
        );
        await pendaftaranKpReference.putString(pendaftaranKpBlob, 'base64');
        const formPendaftaranKP = await formKrsReference.getDownloadURL();

        // Proses Slip Pembayaran KP
        const pembayaranKpFilePath = `${RNFS.DocumentDirectoryPath}/${slipPembayaranKp.name}`;
        await RNFS.copyFile(slipPembayaranKp.uri, pembayaranKpFilePath);
        const pembayaranKpBlob = await RNFS.readFile(
          pembayaranKpFilePath,
          'base64',
        );
        await pembayaranKpReference.putString(pembayaranKpBlob, 'base64');
        const slipPembayaranKP = await formKrsReference.getDownloadURL();

        // Proses Dokumen Proporsal
        const proporsalFilePath = `${RNFS.DocumentDirectoryPath}/${fileProporsal.name}`;
        await RNFS.copyFile(fileProporsal.uri, proporsalFilePath);
        const proporsalBlob = await RNFS.readFile(proporsalFilePath, 'base64');
        await proporsalReference.putString(proporsalBlob, 'base64');
        const dokumenProporsal = await proporsalReference.getDownloadURL();

        // Push to Firestore
        const createdDate = moment().tz('Asia/Jakarta').toDate();
        await firestore()
          .collection('pengajuan')
          .doc(user.uid)
          .collection('pengajuanKP')
          .add({
            judul,
            transkipNilai,
            formKrs,
            formPendaftaranKP,
            slipPembayaranKP,
            dokumenProporsal,
            createdAt: createdDate,
            status: 'Diproses',
            catatan: '-',
            dosenPembimbing: '-',
          });
        Alert.alert('Sukses', 'Data berhasil diupload!', [
          {text: 'OK', onPress: () => navigation.goBack()},
        ]);
        console.log('Image uploaded successfully');
        console.log('Image URL: ', transkipNilai);
      } catch (error) {
        console.error('Error uploading image:', error);
      } finally {
        setIsSubmitting(false);
      }
    }

    console.log('Form data submitted:', {
      judul,
    });
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
        keyboardShouldPersistTaps="handled">
        <View style={styles.container}>
          <Text style={styles.inputTitle}>Judul Kerja Praktek*</Text>
          <TextInput
            placeholder="Masukkan Judul"
            style={styles.input}
            multiline
            numberOfLines={3}
            value={judul}
            onChangeText={text => setJudul(text)}
          />
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
          <Text style={styles.inputTitle}>Form Pendaftaran KP*</Text>
          <View style={styles.uploadContainer}>
            <TextInput
              style={styles.fileNameInput}
              placeholder="..."
              value={pendaftaranKpPath}
              editable={false}
            />
            <TouchableOpacity
              style={styles.uploadButton}
              onPress={pickerPendaftaranKp}>
              <Text style={styles.uploadButtonText}>Upload File</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.inputTitle}>Slip Pembayaran KP*</Text>
          <View style={styles.uploadContainer}>
            <TextInput
              style={styles.fileNameInput}
              placeholder="..."
              value={slipPembayaranKpPath}
              editable={false}
            />
            <TouchableOpacity
              style={styles.uploadButton}
              onPress={pickerPembayaran}>
              <Text style={styles.uploadButtonText}>Upload File</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.inputTitle}>Dokumen Proporsal*</Text>
          <View style={styles.uploadContainer}>
            <TextInput
              style={styles.fileNameInput}
              placeholder="..."
              value={fileProporsalPath}
              editable={false}
            />
            <TouchableOpacity
              style={styles.uploadButton}
              onPress={pickerProporsal}>
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
    backgroundColor: '#ccc', // You can adjust this color to your preference
    // You can also adjust other styles, like opacity, to make it look disabled
  },
  inputTitle: {
    color: 'black',
    fontWeight: 'bold',
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

export default AddPengajuanKP;
