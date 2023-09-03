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
import {
  ALERT_TYPE,
  AlertNotificationRoot,
  Dialog,
} from 'react-native-alert-notification';

const EditPengajuanKP = ({route, navigation}) => {
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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [berkasPersyaratan, setBerkasPersyaratan] = useState({});
  const [jadwalPengajuan, setJadwalPengajuan] = useState([]);
  const {itemId} = route.params;

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

    firestore()
      .collection('pengajuan')
      .doc(itemId)
      .get()
      .then(documentSnapshot => {
        if (documentSnapshot.exists) {
          const data = documentSnapshot.data();
          setJudul(data.judul);
          setBerkasPersyaratan(data.berkasPersyaratan);
          setTranskipPath(data.berkasPersyaratan.transkipNilai);
          setFormKrsPath(data.berkasPersyaratan.formKrs);
          setPendaftaranKpPath(data.berkasPersyaratan.formPendaftaranKP);
          setSlipPembayaranKpPath(data.berkasPersyaratan.slipPembayaranKP);
          setFileProporsalPath(data.berkasPersyaratan.dokumenProposal);
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

  const imagePickerFormKP = async () => {
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
      quality: 0.5, // Kualitas gambar (0 - 1)
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

  const handleEdit = async () => {
    setIsSubmitting(true);
    try {
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

      // Inisialisasi variabel untuk URL dokumen (jika diunggah)
      let transkipNilai = null;
      let formKrs = null;
      let formPendaftaranKP = null;
      let slipPembayaranKP = null;
      let dokumenProporsal = null;

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
      if (filePendaftaranKp) {
        const pendaftaranKpFilePath = `${RNFS.DocumentDirectoryPath}/${filePendaftaranKp.name}`;
        await RNFS.copyFile(filePendaftaranKp.uri, pendaftaranKpFilePath);
        const pendaftaranKpBlob = await RNFS.readFile(
          pendaftaranKpFilePath,
          'base64',
        );
        await pendaftaranKpReference.putString(pendaftaranKpBlob, 'base64');
        formPendaftaranKP = await pendaftaranKpReference.getDownloadURL();
      }

      // Proses Slip Pembayaran KP
      if (slipPembayaranKp) {
        const pembayaranKpFilePath = `${RNFS.DocumentDirectoryPath}/${slipPembayaranKp.name}`;
        await RNFS.copyFile(slipPembayaranKp.uri, pembayaranKpFilePath);
        const pembayaranKpBlob = await RNFS.readFile(
          pembayaranKpFilePath,
          'base64',
        );
        await pembayaranKpReference.putString(pembayaranKpBlob, 'base64');
        slipPembayaranKP = await pembayaranKpReference.getDownloadURL();
      }

      // Proses Dokumen Proporsal
      if (fileProporsal) {
        const proporsalFilePath = `${RNFS.DocumentDirectoryPath}/${fileProporsal.name}`;
        await RNFS.copyFile(fileProporsal.uri, proporsalFilePath);
        const proporsalBlob = await RNFS.readFile(proporsalFilePath, 'base64');
        await proporsalReference.putString(proporsalBlob, 'base64');
        dokumenProporsal = await proporsalReference.getDownloadURL();
      }
      const jadwalId = jadwalPengajuan[0].id;
      // Push to Firestore
      const updateData = {
        judul: judul,
        editedAt: new Date(),
        status: 'Belum Diverifikasi',
        jadwalPengajuan_uid: jadwalId,
        berkasPersyaratan: {
          transkipNilai: berkasPersyaratan.transkipNilai,
          formKrs: berkasPersyaratan.formKrs,
          formPendaftaranKP: berkasPersyaratan.formPendaftaranKP,
          slipPembayaranKP: berkasPersyaratan.slipPembayaranKP,
          dokumenProposal: berkasPersyaratan.dokumenProposal,
        },
      };

      // Hanya pilih properti yang akan diubah
      if (transkipNilai) {
        updateData.berkasPersyaratan.transkipNilai = transkipNilai;
      }
      if (formKrs) {
        updateData.berkasPersyaratan.formKrs = formKrs;
      }
      if (formPendaftaranKP) {
        updateData.berkasPersyaratan.formPendaftaranKP = formPendaftaranKP;
      }
      if (slipPembayaranKP) {
        updateData.berkasPersyaratan.slipPembayaranKP = slipPembayaranKP;
      }
      if (dokumenProporsal) {
        updateData.berkasPersyaratan.dokumenProposal = dokumenProporsal;
      }

      await firestore().collection('pengajuan').doc(itemId).update(updateData);

      Dialog.show({
        type: ALERT_TYPE.SUCCESS,
        title: 'Berhasil',
        textBody: 'Data pengajuan Kerja Praktek berhasil diubah',
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
            style={styles.floatingButtonSubmit}
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
});

export default EditPengajuanKP;
