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
import {ALERT_TYPE, Dialog} from 'react-native-alert-notification';

const EditSidangKP = ({route, navigation}) => {
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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [jadwalPengajuan, setJadwalPengajuan] = useState([]);
  const [berkasPersyaratan, setBerkasPersyaratan] = useState({});
  const {itemId} = route.params;

  useEffect(() => {
    const unsubscribe = firestore()
      .collection('jadwalSidang')
      .where('status', '==', 'Aktif')
      .where('jenisSidang', 'array-contains', 'Kerja Praktek')
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
          setBerkasPersyaratan(data.berkasPersyaratan);
          setPersetujuanPath(data.berkasPersyaratan.persetujuanKP);
          setPenilaianPerusahaanPath(
            data.berkasPersyaratan.penilaianPerusahaan,
          );
          setPendaftaranKpPath(data.berkasPersyaratan.formPendaftaranKP);
          setFormBimbinganPath(data.berkasPersyaratan.bimbinganKP);
          setSertifikatSeminarPath(
            data.berkasPersyaratan.fileSertifikatSeminar,
          );
          setSertifikatPSPTPath(data.berkasPersyaratan.fileSertifikatPSPT);
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

  const handleEdit = async () => {
    setIsSubmitting(true);
    try {
      const user = auth().currentUser;
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

      // Inisialisasi variabel untuk URL dokumen (jika diunggah)
      let persetujuanKP = null;
      let penilaianPerusahaan = null;
      let formPendaftaranKP = null;
      let bimbinganKP = null;
      let fileSertifikatSeminar = null;
      let fileSertifikatPSPT = null;

      // Proses Transkip Nilai
      if (filePersetujuanKP) {
        const persetujuanKPFilePath = `${RNFS.DocumentDirectoryPath}/${filePersetujuanKP.name}`;
        await RNFS.copyFile(filePersetujuanKP.uri, persetujuanKPFilePath);
        const persetujuanKpBlob = await RNFS.readFile(
          persetujuanKPFilePath,
          'base64',
        );
        await persetujuanKPReference.putString(persetujuanKpBlob, 'base64');
        persetujuanKP = await persetujuanKPReference.getDownloadURL();
      }

      // Proses Form KRS
      if (filePenilaianPerusahaan) {
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
        penilaianPerusahaan =
          await penilaianPerusahaanReference.getDownloadURL();
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
      if (formBimbinganKP) {
        const bimbinganKPFilePath = `${RNFS.DocumentDirectoryPath}/${formBimbinganKP.name}`;
        await RNFS.copyFile(formBimbinganKP.uri, bimbinganKPFilePath);
        const bimbinganKPBlob = await RNFS.readFile(
          bimbinganKPFilePath,
          'base64',
        );
        await bimbinganKPReference.putString(bimbinganKPBlob, 'base64');
        bimbinganKP = await bimbinganKPReference.getDownloadURL();
      }

      // Proses Dokumen Proporsal
      if (sertifikatSeminar) {
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
        fileSertifikatSeminar =
          await sertifikatSeminarReference.getDownloadURL();
      }

      // Sertifikat PSPT
      if (sertifikatPSPT) {
        const sertifikatPSPTFilePath = `${RNFS.DocumentDirectoryPath}/${sertifikatPSPT.name}`;
        await RNFS.copyFile(sertifikatPSPT.uri, sertifikatPSPTFilePath);
        const sertifikatPSPTBlob = await RNFS.readFile(
          sertifikatPSPTFilePath,
          'base64',
        );
        await sertifikatPSPTReference.putString(sertifikatPSPTBlob, 'base64');
        fileSertifikatPSPT = await sertifikatPSPTReference.getDownloadURL();
      }
      const jadwalId = jadwalPengajuan[0].id;
      // Push to Firestore
      const updateData = {
        editedAt: new Date(),
        status: 'Belum Diverifikasi',
        jadwalSidang_uid: jadwalId,
        berkasPersyaratan: {
          persetujuanKP: berkasPersyaratan.persetujuanKP,
          penilaianPerusahaan: berkasPersyaratan.penilaianPerusahaan,
          formPendaftaranKP: berkasPersyaratan.formPendaftaranKP,
          bimbinganKP: berkasPersyaratan.bimbinganKP,
          fileSertifikatSeminar: berkasPersyaratan.fileSertifikatSeminar,
          fileSertifikatPSPT: berkasPersyaratan.fileSertifikatPSPT,
        },
      };

      // Tambahkan URL dokumen jika diunggah
      if (persetujuanKP) {
        updateData.berkasPersyaratan.persetujuanKP = persetujuanKP;
      }
      if (penilaianPerusahaan) {
        updateData.berkasPersyaratan.penilaianPerusahaan = penilaianPerusahaan;
      }
      if (formPendaftaranKP) {
        updateData.berkasPersyaratan.formPendaftaranKP = formPendaftaranKP;
      }
      if (bimbinganKP) {
        updateData.berkasPersyaratan.bimbinganKP = bimbinganKP;
      }
      if (fileSertifikatSeminar) {
        updateData.berkasPersyaratan.fileSertifikatSeminar =
          fileSertifikatSeminar;
      }
      if (fileSertifikatPSPT) {
        updateData.berkasPersyaratan.fileSertifikatPSPT = fileSertifikatPSPT;
      }

      await firestore().collection('sidang').doc(itemId).update(updateData);

      Dialog.show({
        type: ALERT_TYPE.SUCCESS,
        title: 'Berhasil',
        textBody: 'Data sidang Kerja Praktek berhasil diubah',
        button: 'Tutup',
        onPressButton: () => {
          navigation.navigate('Sidang');
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
    <KeyboardAvoidingView
      style={{flex: 1}}
      behavior="height"
      keyboardVerticalOffset={0}>
      <ScrollView
        contentContainerStyle={{
          backgroundColor: 'white',
        }}
        keyboardShouldPersistTaps="handled">
        <View style={styles.container}>
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

export default EditSidangKP;
