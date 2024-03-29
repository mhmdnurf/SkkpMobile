import {
  View,
  TextInput,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
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
import {
  ALERT_TYPE,
  AlertNotificationRoot,
  Dialog,
} from 'react-native-alert-notification';

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
  const [jadwalPengajuan, setJadwalPengajuan] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    const unsubscribe = firestore()
      .collection('jadwalPengajuan')
      .where('status', '==', 'Aktif')
      .where('jenisPengajuan', 'array-contains', 'Kerja Praktek')
      .onSnapshot(querySnapshot => {
        const data = [];
        querySnapshot.forEach(doc => {
          data.push({id: doc.id, ...doc.data()});
          setJadwalPengajuan(data);
        });
      });

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
    return () => {
      unsubscribe();
    };
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
        type: [DocumentPicker.types.docx],
      });
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

  const imagePickerFormKP = async () => {
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
        setPendaftaranKpPath(selectedFileName);
        setFilePendaftaranKp({uri: selectedFile, name: selectedFileName});
        console.log('Selected Image URI:', selectedFile);
      }
    } catch (error) {
      console.error('ImagePicker Error:', error);
    }
  };

  const imagePickerSlip = async () => {
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
        setSlipPembayaranKpPath(selectedFileName);
        setSlipPembayaranKp({uri: selectedFile, name: selectedFileName});
        console.log('Selected Image URI:', selectedFile);
      }
    } catch (error) {
      console.error('ImagePicker Error:', error);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    setJudul('');
    setFileTranskipNilai(null);
    setTranskipPath('');
    setFileFormKrs(null);
    setFormKrsPath('');
    setFilePendaftaranKp(null);
    setPendaftaranKpPath('');
    setSlipPembayaranKp(null);
    setSlipPembayaranKpPath('');
    setFileProporsal(null);
    setFileProporsalPath('');
    setRefreshing(false);
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
        const formPendaftaranKP = await pendaftaranKpReference.getDownloadURL();

        // Proses Slip Pembayaran KP
        const pembayaranKpFilePath = `${RNFS.DocumentDirectoryPath}/${slipPembayaranKp.name}`;
        await RNFS.copyFile(slipPembayaranKp.uri, pembayaranKpFilePath);
        const pembayaranKpBlob = await RNFS.readFile(
          pembayaranKpFilePath,
          'base64',
        );
        await pembayaranKpReference.putString(pembayaranKpBlob, 'base64');
        const slipPembayaranKP = await pembayaranKpReference.getDownloadURL();

        // Proses Dokumen Proporsal
        const proporsalFilePath = `${RNFS.DocumentDirectoryPath}/${fileProporsal.name}`;
        await RNFS.copyFile(fileProporsal.uri, proporsalFilePath);
        const proporsalBlob = await RNFS.readFile(proporsalFilePath, 'base64');
        await proporsalReference.putString(proporsalBlob, 'base64');
        const dokumenProposal = await proporsalReference.getDownloadURL();

        const berkasPersyaratan = {
          transkipNilai: transkipNilai,
          formKrs: formKrs,
          formPendaftaranKP: formPendaftaranKP,
          slipPembayaranKP: slipPembayaranKP,
          dokumenProposal: dokumenProposal,
        };

        // Push to Firestore
        const jadwalId = jadwalPengajuan[0].id;
        await firestore().collection('pengajuan').add({
          judul,
          berkasPersyaratan,
          createdAt: new Date(),
          user_uid: user.uid,
          status: 'Belum Diverifikasi',
          catatan: '-',
          pembimbing_uid: '-',
          jenisPengajuan: 'Kerja Praktek',
          jadwalPengajuan_uid: jadwalId,
        });
        Dialog.show({
          type: ALERT_TYPE.SUCCESS,
          title: 'Berhasil',
          textBody: 'Pengajuan Kerja Praktek berhasil dilakukan',
          button: 'Tutup',
          onPressButton: () => {
            navigation.goBack();
          },
        });
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
          keyboardShouldPersistTaps="handled"
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }>
          <View style={styles.container}>
            <Text style={styles.inputTitle}>
              Judul Kerja Praktek<Text style={{color: 'red'}}>*</Text>
            </Text>
            <TextInput
              placeholder="Masukkan Judul"
              style={[styles.input, styles.border]}
              multiline
              numberOfLines={3}
              value={judul}
              onChangeText={text => setJudul(text)}
            />
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
              Form Pendaftaran KP<Text style={{color: 'red'}}>*</Text>
            </Text>
            <View style={styles.uploadContainer}>
              <TextInput
                style={[styles.fileNameInput, styles.border]}
                placeholder="Belum Upload"
                value={pendaftaranKpPath}
                editable={false}
              />
              <TouchableOpacity
                style={styles.uploadButton}
                onPress={imagePickerFormKP}>
                <Icon name="camera" size={22} color="white" />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.uploadButton}
                onPress={pickerPendaftaranKp}>
                <Icon name="file-circle-plus" size={22} color="white" />
              </TouchableOpacity>
            </View>
            <Text style={styles.inputTitle}>
              Slip Pembayaran KP<Text style={{color: 'red'}}>*</Text>
            </Text>
            <View style={styles.uploadContainer}>
              <TextInput
                style={[styles.fileNameInput, styles.border]}
                placeholder="Belum Upload"
                value={slipPembayaranKpPath}
                editable={false}
              />
              <TouchableOpacity
                style={styles.uploadButton}
                onPress={imagePickerSlip}>
                <Icon name="camera" size={22} color="white" />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.uploadButton}
                onPress={pickerPembayaran}>
                <Icon name="file-circle-plus" size={22} color="white" />
              </TouchableOpacity>
            </View>
            <Text style={styles.inputTitle}>
              Dokumen Proporsal<Text style={{color: 'red'}}>*</Text>
            </Text>
            <View style={styles.uploadContainer}>
              <TextInput
                style={[styles.fileNameInput, styles.border]}
                placeholder="Belum Upload"
                value={fileProporsalPath}
                editable={false}
              />
              <TouchableOpacity
                style={styles.uploadButton}
                onPress={pickerProporsal}>
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

export default AddPengajuanKP;
