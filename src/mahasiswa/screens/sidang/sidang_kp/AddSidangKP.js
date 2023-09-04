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
import {Picker} from '@react-native-picker/picker';
import {
  ALERT_TYPE,
  AlertNotificationRoot,
  Dialog,
} from 'react-native-alert-notification';

const AddSidangKP = ({navigation}) => {
  const [judul, setJudul] = useState('');
  const [filePersetujuanKP, setFilePersetujuanKP] = useState(null);
  const [persetujuanPath, setPersetujuanPath] = useState('');
  const [filePenilaianPerusahaan, setFilePenilaianPerusahaan] = useState(null);
  const [penilaianPerusahaanPath, setPenilaianPerusahaanPath] = useState('');
  const [filePendaftaranKp, setFilePendaftaranKp] = useState(null);
  const [pendaftaranKpPath, setPendaftaranKpPath] = useState('');
  const [formBimbinganKP, setFormBimbinganKP] = useState(null);
  const [formBimbinganPath, setFormBimbinganPath] = useState('');
  const [sertifikatSeminar, setSertifikatSeminar] = useState(null);
  const [sertifikatSeminarPath, setSertifikatSeminarPath] = useState('');
  const [sertifikatPSPT, setSertifikatPSPT] = useState(null);
  const [sertifikatPSPTPath, setSertifikatPSPTPath] = useState('');
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
      .where('jenisPengajuan', '==', 'Kerja Praktek')
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
      .where('jenisSidang', 'array-contains', 'Kerja Praktek')
      .onSnapshot(querySnapshot => {
        const data = [];
        querySnapshot.forEach(doc => {
          data.push({id: doc.id, ...doc.data()});
          setJadwalSidang(data);
        });
      });

    if (
      judul !== '' &&
      persetujuanPath !== '' &&
      penilaianPerusahaanPath !== '' &&
      pendaftaranKpPath !== '' &&
      formBimbinganPath !== '' &&
      sertifikatSeminarPath !== '' &&
      sertifikatPSPTPath !== ''
    ) {
      setIsSubmitDisabled(false);
    } else {
      setIsSubmitDisabled(true);
    }
    return () => {
      unsubscribe();
      unsubscribeJadwal();
    };
  }, [
    judul,
    persetujuanPath,
    penilaianPerusahaanPath,
    pendaftaranKpPath,
    formBimbinganPath,
    sertifikatSeminarPath,
    sertifikatPSPTPath,
    user.uid,
  ]);

  const pickerPersetujuanKP = async () => {
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
      setPersetujuanPath(selectedFileName);
      setFilePersetujuanKP({uri: selectedFile, name: result[0]});
      console.log('Nama Berkas:', selectedFileName);
    } catch (error) {
      if (DocumentPicker.isCancel(error)) {
        console.log('Pengguna membatalkan pemilihan dokumen');
      } else {
        console.log('Error memilih dokumen:', error.message);
      }
    }
  };

  const pickerNilaiPerusahaan = async () => {
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
      setPenilaianPerusahaanPath(selectedFileName);
      setFilePenilaianPerusahaan({uri: selectedFile, name: result[0]});
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

  const pickerBimbinganKP = async () => {
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
      setFormBimbinganPath(selectedFileName);
      setFormBimbinganKP({uri: selectedFile, name: result[0]});
      console.log('Nama Berkas:', selectedFileName);
    } catch (error) {
      if (DocumentPicker.isCancel(error)) {
        console.log('Pengguna membatalkan pemilihan dokumen');
      } else {
        console.log('Error memilih dokumen:', error.message);
      }
    }
  };

  const pickerSertifikatSeminar = async () => {
    try {
      const result = await DocumentPicker.pick({
        type: [
          DocumentPicker.types.images,
          DocumentPicker.types.pdf,
          DocumentPicker.types.docx,
        ],
      });
      const selectedFile = result[0].uri;
      const selectedFileName = result[0].name;
      setSertifikatSeminarPath(selectedFileName);
      setSertifikatSeminar({uri: selectedFile, name: result[0]});
      console.log('Nama Berkas:', selectedFileName);
    } catch (error) {
      if (DocumentPicker.isCancel(error)) {
        console.log('Pengguna membatalkan pemilihan dokumen');
      } else {
        console.log('Error memilih dokumen:', error.message);
      }
    }
  };

  const pickerSertifikatPSPT = async () => {
    try {
      const result = await DocumentPicker.pick({
        type: [
          DocumentPicker.types.images,
          DocumentPicker.types.pdf,
          DocumentPicker.types.docx,
        ],
      });
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

  const imagePickerPersetujuanKP = async () => {
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
        setPersetujuanPath(selectedFileName);
        setFilePersetujuanKP({uri: selectedFile, name: selectedFileName});
        console.log('Selected Image URI:', selectedFile);
      }
    } catch (error) {
      console.error('ImagePicker Error:', error);
    }
  };

  const imagePickerNilaiPerusahaan = async () => {
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
        setPenilaianPerusahaanPath(selectedFileName);
        setFilePenilaianPerusahaan({uri: selectedFile, name: selectedFileName});
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

  const imagePickerBimbinganKP = async () => {
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
        setFormBimbinganPath(selectedFileName);
        setFormBimbinganKP({uri: selectedFile, name: selectedFileName});
        console.log('Selected Image URI:', selectedFile);
      }
    } catch (error) {
      console.error('ImagePicker Error:', error);
    }
  };

  const imagePickerSertifikatSeminar = async () => {
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
        setSertifikatSeminarPath(selectedFileName);
        setSertifikatSeminar({uri: selectedFile, name: selectedFileName});
        console.log('Selected Image URI:', selectedFile);
      }
    } catch (error) {
      console.error('ImagePicker Error:', error);
    }
  };

  const imagePickerSertifikatPSPT = async () => {
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
        setSertifikatPSPTPath(selectedFileName);
        setSertifikatPSPT({uri: selectedFile, name: selectedFileName});
        console.log('Selected Image URI:', selectedFile);
      }
    } catch (error) {
      console.error('ImagePicker Error:', error);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    setJudul('');
    setFilePersetujuanKP(null);
    setPersetujuanPath('');
    setFilePenilaianPerusahaan(null);
    setPenilaianPerusahaanPath('');
    setFilePendaftaranKp(null);
    setPendaftaranKpPath('');
    setFormBimbinganKP(null);
    setFormBimbinganPath('');
    setSertifikatSeminar(null);
    setSertifikatSeminarPath('');
    setSertifikatPSPT(null);
    setSertifikatPSPTPath('');
    setRefreshing(false);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    if (
      filePersetujuanKP &&
      filePenilaianPerusahaan &&
      filePendaftaranKp &&
      formBimbinganKP &&
      sertifikatSeminar &&
      sertifikatPSPT
    ) {
      const persetujuanKPFileName = `persyaratan/sidangKP/formPersetujuanKP/${user.uid}`;
      const penilaianPerusahaanFileName = `persyaratan/sidangKP/penilaianPerusahaan/${user.uid}`;
      const pendaftaranKpFileName = `persyaratan/sidangKP/formPendaftaranKP/${user.uid}`;
      const bimbinganKPFileName = `persyaratan/sidangKP/formBimbinganKP/${user.uid}`;
      const sertifikatSeminarFileName = `persyaratan/sidangKP/sertifikatSeminar/${user.uid}`;
      const sertifikatPSPTFileName = `persyaratan/sidangKP/sertifikatPSPT/${user.uid}`;
      const persetujuanKPReference = storage().ref(persetujuanKPFileName);
      const penilaianPerusahaanReference = storage().ref(
        penilaianPerusahaanFileName,
      );
      const pendaftaranKpReference = storage().ref(pendaftaranKpFileName);
      const bimbinganKPReference = storage().ref(bimbinganKPFileName);
      const sertifikatSeminarReference = storage().ref(
        sertifikatSeminarFileName,
      );
      const sertifikatPSPTReference = storage().ref(sertifikatPSPTFileName);
      try {
        // Proses Form Persetujuan KP
        const persetujuanKPFilePath = `${RNFS.DocumentDirectoryPath}/${filePersetujuanKP.name}`;
        await RNFS.copyFile(filePersetujuanKP.uri, persetujuanKPFilePath);
        const persetujuanKpBlob = await RNFS.readFile(
          persetujuanKPFilePath,
          'base64',
        );
        await persetujuanKPReference.putString(persetujuanKpBlob, 'base64');
        const persetujuanKP = await persetujuanKPReference.getDownloadURL();

        // Proses Form Penilaian Perusahaan
        const penilaianPerusahaanFilePath = `${RNFS.DocumentDirectoryPath}/${filePenilaianPerusahaan.name}`;
        await RNFS.copyFile(
          filePenilaianPerusahaan.uri,
          penilaianPerusahaanFilePath,
        );
        const penilaianPerusahaanBlob = await RNFS.readFile(
          penilaianPerusahaanFilePath,
          'base64',
        );
        await penilaianPerusahaanReference.putString(
          penilaianPerusahaanBlob,
          'base64',
        );
        const penilaianPerusahaan =
          await penilaianPerusahaanReference.getDownloadURL();

        // Proses Form Pendaftaran KP
        const pendaftaranKpFilePath = `${RNFS.DocumentDirectoryPath}/${filePendaftaranKp.name}`;
        await RNFS.copyFile(filePendaftaranKp.uri, pendaftaranKpFilePath);
        const pendaftaranKpBlob = await RNFS.readFile(
          pendaftaranKpFilePath,
          'base64',
        );
        await pendaftaranKpReference.putString(pendaftaranKpBlob, 'base64');
        const formPendaftaranKP = await pendaftaranKpReference.getDownloadURL();

        // Proses Form Bimbingan KP
        const bimbinganKPFilePath = `${RNFS.DocumentDirectoryPath}/${formBimbinganKP.name}`;
        await RNFS.copyFile(formBimbinganKP.uri, bimbinganKPFilePath);
        const bimbinganKPBlob = await RNFS.readFile(
          bimbinganKPFilePath,
          'base64',
        );
        await bimbinganKPReference.putString(bimbinganKPBlob, 'base64');
        const bimbinganKP = await bimbinganKPReference.getDownloadURL();

        // Proses Sertifikat Seminar
        const sertifikatSeminarFilePath = `${RNFS.DocumentDirectoryPath}/${sertifikatSeminar.name}`;
        await RNFS.copyFile(sertifikatSeminar.uri, sertifikatSeminarFilePath);
        const sertifikatSeminarBlob = await RNFS.readFile(
          sertifikatSeminarFilePath,
          'base64',
        );
        await sertifikatSeminarReference.putString(
          sertifikatSeminarBlob,
          'base64',
        );
        const fileSertifikatSeminar =
          await sertifikatSeminarReference.getDownloadURL();

        // Proses Sertifikat PSPT
        const sertifikatPSPTFilePath = `${RNFS.DocumentDirectoryPath}/${sertifikatPSPT.name}`;
        await RNFS.copyFile(sertifikatPSPT.uri, sertifikatPSPTFilePath);
        const sertifikatPSPTBlob = await RNFS.readFile(
          sertifikatPSPTFilePath,
          'base64',
        );
        await sertifikatPSPTReference.putString(sertifikatPSPTBlob, 'base64');
        const fileSertifikatPSPT =
          await sertifikatPSPTReference.getDownloadURL();

        // Push to Firestore
        const jadwalId = jadwalSidang[0].id;
        const berkasPersyaratan = {
          persetujuanKP: persetujuanKP,
          penilaianPerusahaan: penilaianPerusahaan,
          formPendaftaranKP: formPendaftaranKP,
          bimbinganKP: bimbinganKP,
          fileSertifikatSeminar: fileSertifikatSeminar,
          fileSertifikatPSPT,
        };
        await firestore().collection('sidang').add({
          pengajuan_uid: judul,
          berkasPersyaratan,
          createdAt: new Date(),
          user_uid: user.uid,
          status: 'Belum Diverifikasi',
          catatan: '-',
          jenisSidang: 'Kerja Praktek',
          jadwalSidang_uid: jadwalId,
        });
        Dialog.show({
          type: ALERT_TYPE.SUCCESS,
          title: 'Berhasil',
          textBody: 'Pendaftaran Sidang Kerja Praktek berhasil dilakukan',
          button: 'Tutup',
          onPressButton: () => {
            navigation.goBack();
          },
        });
        console.log('Image uploaded successfully');
        console.log('Image URL: ', persetujuanKP);
      } catch (error) {
        console.error('Error uploading image:', error);
      } finally {
        setIsSubmitting(false);
      }
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
            backgroundColor: 'white',
          }}
          keyboardShouldPersistTaps="handled"
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }>
          <View style={styles.container}>
            <Text style={styles.inputTitle}>
              Judul Kerja Praktek<Text style={styles.star}>*</Text>
            </Text>
            <View style={styles.picker}>
              <Picker
                selectedValue={judul}
                onValueChange={(itemValue, itemIndex) => setJudul(itemValue)}>
                <Picker.Item label="Pilih Judul" value={null} />
                {userPengajuanData.map(item => (
                  <Picker.Item
                    key={item.id}
                    label={item.judul}
                    value={item.id}
                  />
                ))}
              </Picker>
            </View>
            <Text style={styles.inputTitle}>
              Form Persetujuan KP<Text style={styles.star}>*</Text>
            </Text>
            <View style={styles.uploadContainer}>
              <TextInput
                style={[styles.fileNameInput, styles.border]}
                placeholder="Belum Upload"
                value={persetujuanPath}
                editable={false}
              />
              <TouchableOpacity
                style={styles.uploadButton}
                onPress={imagePickerPersetujuanKP}>
                <Icon name="camera" size={22} color="white" />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.uploadButton}
                onPress={pickerPersetujuanKP}>
                <Icon name="file-circle-plus" size={22} color="white" />
              </TouchableOpacity>
            </View>
            <Text style={styles.inputTitle}>
              Form Penilaian Perusahaan<Text style={styles.star}>*</Text>
            </Text>
            <View style={styles.uploadContainer}>
              <TextInput
                style={[styles.fileNameInput, styles.border]}
                placeholder="Belum Upload"
                value={penilaianPerusahaanPath}
                editable={false}
              />
              <TouchableOpacity
                style={styles.uploadButton}
                onPress={imagePickerNilaiPerusahaan}>
                <Icon name="camera" size={22} color="white" />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.uploadButton}
                onPress={pickerNilaiPerusahaan}>
                <Icon name="file-circle-plus" size={22} color="white" />
              </TouchableOpacity>
            </View>
            <Text style={styles.inputTitle}>
              Form Pendaftaran KP<Text style={styles.star}>*</Text>
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
              Form Bimbingan KP<Text style={styles.star}>*</Text>
            </Text>
            <View style={styles.uploadContainer}>
              <TextInput
                style={[styles.fileNameInput, styles.border]}
                placeholder="Belum Upload"
                value={formBimbinganPath}
                editable={false}
              />
              <TouchableOpacity
                style={styles.uploadButton}
                onPress={imagePickerBimbinganKP}>
                <Icon name="camera" size={22} color="white" />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.uploadButton}
                onPress={pickerBimbinganKP}>
                <Icon name="file-circle-plus" size={22} color="white" />
              </TouchableOpacity>
            </View>
            <Text style={styles.inputTitle}>
              Sertifikat Seminar STTI (2 Sertifikat)
              <Text style={styles.star}>*</Text>
            </Text>
            <View style={styles.uploadContainer}>
              <TextInput
                style={[styles.fileNameInput, styles.border]}
                placeholder="Belum Upload"
                value={sertifikatSeminarPath}
                editable={false}
              />
              <TouchableOpacity
                style={styles.uploadButton}
                onPress={imagePickerSertifikatSeminar}>
                <Icon name="camera" size={22} color="white" />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.uploadButton}
                onPress={pickerSertifikatSeminar}>
                <Icon name="file-circle-plus" size={22} color="white" />
              </TouchableOpacity>
            </View>
            <Text style={styles.inputTitle}>
              Sertifikat PSPT
              <Text style={styles.star}>*</Text>
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
                onPress={pickerSertifikatPSPT}>
                <Icon name="file-circle-plus" size={22} color="white" />
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
        <View style={styles.btnSubmitContainer}>
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
        </View>
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
  btnSubmitContainer: {
    backgroundColor: 'white',
    elevation: 0,
    shadowOpacity: 0,
  },
  star: {color: 'red'},
});

export default AddSidangKP;
