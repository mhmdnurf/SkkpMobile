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

const AddSidangSkripsi = ({navigation}) => {
  const [topik, setTopik] = useState('');
  const [judul, setJudul] = useState('');
  const [fileIjazah, setFileIjazah] = useState(null);
  const [ijazahPath, setIjazahPath] = useState('');
  const [fileTranskipNilai, setFileTranskipNilai] = useState(null);
  const [transkipPath, setTranskipPath] = useState('');
  const [filePendaftaranSidang, setFilePendaftaranSidang] = useState(null);
  const [pendaftaranSidangPath, setPendaftaranSidangPath] = useState('');
  const [filePersetujuanSidang, setFilePersetujuanSidang] = useState(null);
  const [persetujuanPath, setPersetujuanPath] = useState('');
  const [buktiLunas, setBuktiLunas] = useState(null);
  const [buktiLunasPath, setBuktiLunasPath] = useState('');
  const [fileLembarRevisi, setFileLembarRevisi] = useState(null);
  const [lembarRevisiPath, setLembarRevisiPath] = useState('');
  const [scanKTP, setScanKTP] = useState(null);
  const [scanKTPPath, setScanKTPPath] = useState('');
  const [scanKK, setScanKK] = useState(null);
  const [scanKKPath, setScanKKPath] = useState('');
  const [fileBimbinganSkripsi, setFileBimbinganSkripsi] = useState(null);
  const [bimbinganSkripsiPath, setBimbinganSkripsiPath] = useState('');
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
      .where('jenisSidang', 'array-contains', 'Skripsi')
      .onSnapshot(querySnapshot => {
        const data = [];
        querySnapshot.forEach(doc => {
          data.push({id: doc.id, ...doc.data()});
          setJadwalSidang(data);
        });
      });

    if (
      topik !== '' &&
      judul !== '' &&
      ijazahPath !== '' &&
      transkipPath !== '' &&
      pendaftaranSidangPath !== '' &&
      persetujuanPath !== '' &&
      buktiLunasPath !== '' &&
      lembarRevisiPath !== '' &&
      scanKTPPath !== '' &&
      scanKKPath !== '' &&
      bimbinganSkripsiPath !== ''
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
    topik,
    judul,
    ijazahPath,
    transkipPath,
    pendaftaranSidangPath,
    persetujuanPath,
    buktiLunasPath,
    lembarRevisiPath,
    scanKTPPath,
    scanKKPath,
    bimbinganSkripsiPath,
    user.uid,
  ]);

  const pickerIjazah = async () => {
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
      setIjazahPath(selectedFileName);
      setFileIjazah({uri: selectedFile, name: result[0]});
      console.log('Nama Berkas:', selectedFileName);
    } catch (error) {
      if (DocumentPicker.isCancel(error)) {
        console.log('Pengguna membatalkan pemilihan dokumen');
      } else {
        console.log('Error memilih dokumen:', error.message);
      }
    }
  };

  const pickerTranskipNilai = async () => {
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

  const pickerPendaftaranSidang = async () => {
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
      setPendaftaranSidangPath(selectedFileName);
      setFilePendaftaranSidang({uri: selectedFile, name: result[0]});
      console.log('Nama Berkas:', selectedFileName);
    } catch (error) {
      if (DocumentPicker.isCancel(error)) {
        console.log('Pengguna membatalkan pemilihan dokumen');
      } else {
        console.log('Error memilih dokumen:', error.message);
      }
    }
  };

  const pickerPersetujuanSidang = async () => {
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
      setFilePersetujuanSidang({uri: selectedFile, name: result[0]});
      console.log('Nama Berkas:', selectedFileName);
    } catch (error) {
      if (DocumentPicker.isCancel(error)) {
        console.log('Pengguna membatalkan pemilihan dokumen');
      } else {
        console.log('Error memilih dokumen:', error.message);
      }
    }
  };

  const pickerBuktiLunas = async () => {
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
      setBuktiLunasPath(selectedFileName);
      setBuktiLunas({uri: selectedFile, name: result[0]});
      console.log('Nama Berkas:', selectedFileName);
    } catch (error) {
      if (DocumentPicker.isCancel(error)) {
        console.log('Pengguna membatalkan pemilihan dokumen');
      } else {
        console.log('Error memilih dokumen:', error.message);
      }
    }
  };

  const pickerLembarRevisi = async () => {
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
      setLembarRevisiPath(selectedFileName);
      setFileLembarRevisi({uri: selectedFile, name: result[0]});
      console.log('Nama Berkas:', selectedFileName);
    } catch (error) {
      if (DocumentPicker.isCancel(error)) {
        console.log('Pengguna membatalkan pemilihan dokumen');
      } else {
        console.log('Error memilih dokumen:', error.message);
      }
    }
  };

  const pickerKTP = async () => {
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
      setScanKTPPath(selectedFileName);
      setScanKTP({uri: selectedFile, name: result[0]});
      console.log('Nama Berkas:', selectedFileName);
    } catch (error) {
      if (DocumentPicker.isCancel(error)) {
        console.log('Pengguna membatalkan pemilihan dokumen');
      } else {
        console.log('Error memilih dokumen:', error.message);
      }
    }
  };

  const pickerKK = async () => {
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
      setScanKKPath(selectedFileName);
      setScanKK({uri: selectedFile, name: result[0]});
      console.log('Nama Berkas:', selectedFileName);
    } catch (error) {
      if (DocumentPicker.isCancel(error)) {
        console.log('Pengguna membatalkan pemilihan dokumen');
      } else {
        console.log('Error memilih dokumen:', error.message);
      }
    }
  };

  const pickerBimbingan = async () => {
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
      setBimbinganSkripsiPath(selectedFileName);
      setFileBimbinganSkripsi({uri: selectedFile, name: result[0]});
      console.log('Nama Berkas:', selectedFileName);
    } catch (error) {
      if (DocumentPicker.isCancel(error)) {
        console.log('Pengguna membatalkan pemilihan dokumen');
      } else {
        console.log('Error memilih dokumen:', error.message);
      }
    }
  };

  const imagePickerIjazah = async () => {
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
        setIjazahPath(selectedFileName);
        setFileIjazah({uri: selectedFile, name: selectedFileName});
        console.log('Selected Image URI:', selectedFile);
      }
    } catch (error) {
      console.error('ImagePicker Error:', error);
    }
  };

  const imagePickerTranskipNilai = async () => {
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

  const imagePickerPendaftaranSkripsi = async () => {
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
        setPendaftaranSidangPath(selectedFileName);
        setFilePendaftaranSidang({uri: selectedFile, name: selectedFileName});
        console.log('Selected Image URI:', selectedFile);
      }
    } catch (error) {
      console.error('ImagePicker Error:', error);
    }
  };

  const imagePickerPersetujuanSkripsi = async () => {
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
        setFilePersetujuanSidang({uri: selectedFile, name: selectedFileName});
        console.log('Selected Image URI:', selectedFile);
      }
    } catch (error) {
      console.error('ImagePicker Error:', error);
    }
  };

  const imagePickerLunas = async () => {
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
        setBuktiLunasPath(selectedFileName);
        setBuktiLunas({uri: selectedFile, name: selectedFileName});
        console.log('Selected Image URI:', selectedFile);
      }
    } catch (error) {
      console.error('ImagePicker Error:', error);
    }
  };

  const imagePickerRevisi = async () => {
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
        setLembarRevisiPath(selectedFileName);
        setFileLembarRevisi({uri: selectedFile, name: selectedFileName});
        console.log('Selected Image URI:', selectedFile);
      }
    } catch (error) {
      console.error('ImagePicker Error:', error);
    }
  };

  const imagePickerKTP = async () => {
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
        setScanKTPPath(selectedFileName);
        setScanKTP({uri: selectedFile, name: selectedFileName});
        console.log('Selected Image URI:', selectedFile);
      }
    } catch (error) {
      console.error('ImagePicker Error:', error);
    }
  };

  const imagePickerKK = async () => {
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
        setScanKKPath(selectedFileName);
        setScanKK({uri: selectedFile, name: selectedFileName});
        console.log('Selected Image URI:', selectedFile);
      }
    } catch (error) {
      console.error('ImagePicker Error:', error);
    }
  };

  const imagePickerBimbingan = async () => {
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
        setBimbinganSkripsiPath(selectedFileName);
        setFileBimbinganSkripsi({uri: selectedFile, name: selectedFileName});
        console.log('Selected Image URI:', selectedFile);
      }
    } catch (error) {
      console.error('ImagePicker Error:', error);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    setTopik('');
    setJudul('');
    setFileTranskipNilai(null);
    setTranskipPath('');
    setFilePendaftaranSidang(null);
    setPendaftaranSidangPath('');
    setFilePersetujuanSidang(null);
    setPersetujuanPath('');
    setRefreshing(false);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    if (
      fileIjazah &&
      fileTranskipNilai &&
      filePendaftaranSidang &&
      filePersetujuanSidang &&
      buktiLunas &&
      fileLembarRevisi &&
      scanKTP &&
      scanKK &&
      fileBimbinganSkripsi
    ) {
      const ijazahFileName = `persyaratan/sidangSkripsi/ijazah/${user.uid}`;
      const transkipNilaiFileName = `persyaratan/sidangSkripsi/transkipNilai/${user.uid}`;
      const pendaftaranSkripsiFileName = `persyaratan/sidangSkripsi/formPendaftaran/${user.uid}`;
      const persetujuanSkripsiFileName = `persyaratan/sidangSkripsi/formPersetujuan/${user.uid}`;
      const buktiLunasFileName = `persyaratan/sidangSkripsi/buktiLunas/${user.uid}`;
      const lembarRevisiFileName = `persyaratan/sidangSkripsi/lembarRevisi/${user.uid}`;
      const ktpFileName = `persyaratan/sidangSkripsi/ktp/${user.uid}`;
      const kkFileName = `persyaratan/sidangSkripsi/kk/${user.uid}`;
      const bimbinganSkripsiFileName = `persyaratan/sidangSkripsi/formBimbingan/${user.uid}`;

      const ijazahReference = storage().ref(ijazahFileName);
      const transkipNilaiReference = storage().ref(transkipNilaiFileName);
      const pendaftaranSkripsiReference = storage().ref(
        pendaftaranSkripsiFileName,
      );
      const persetujuanSkripsiReference = storage().ref(
        persetujuanSkripsiFileName,
      );
      const buktiLunasReference = storage().ref(buktiLunasFileName);
      const lembarRevisiReference = storage().ref(lembarRevisiFileName);
      const ktpReference = storage().ref(ktpFileName);
      const kkReference = storage().ref(kkFileName);
      const bimbinganSkripsiReference = storage().ref(bimbinganSkripsiFileName);
      try {
        // Proses Sertifikat Keahlian
        const ijazahFilePath = `${RNFS.DocumentDirectoryPath}/${fileIjazah.name}`;
        await RNFS.copyFile(fileIjazah.uri, ijazahFilePath);
        const ijazahBlob = await RNFS.readFile(ijazahFilePath, 'base64');
        await ijazahReference.putString(ijazahBlob, 'base64');
        const ijazah = await ijazahReference.getDownloadURL();

        // Proses Transkip Nilai
        const transkipNilaiFilePath = `${RNFS.DocumentDirectoryPath}/${fileTranskipNilai.name}`;
        await RNFS.copyFile(fileTranskipNilai.uri, transkipNilaiFilePath);
        const transkipNilaiBlob = await RNFS.readFile(
          transkipNilaiFilePath,
          'base64',
        );
        await transkipNilaiReference.putString(transkipNilaiBlob, 'base64');
        const transkipNilai = await transkipNilaiReference.getDownloadURL();

        // Proses Form Pendaftaran Seminar Proposal
        const pendaftaranSkripsiFilePath = `${RNFS.DocumentDirectoryPath}/${filePendaftaranSidang.name}`;
        await RNFS.copyFile(
          filePendaftaranSidang.uri,
          pendaftaranSkripsiFilePath,
        );
        const pendaftaranSkripsiBlob = await RNFS.readFile(
          pendaftaranSkripsiFilePath,
          'base64',
        );
        await pendaftaranSkripsiReference.putString(
          pendaftaranSkripsiBlob,
          'base64',
        );
        const pendaftaranSkripsi =
          await pendaftaranSkripsiReference.getDownloadURL();

        // Proses Form Persetujuan Sempro
        const persetujuanSkripsiFilePath = `${RNFS.DocumentDirectoryPath}/${filePersetujuanSidang.name}`;
        await RNFS.copyFile(
          filePersetujuanSidang.uri,
          persetujuanSkripsiFilePath,
        );
        const persetujuanSkripsiBlob = await RNFS.readFile(
          persetujuanSkripsiFilePath,
          'base64',
        );
        await persetujuanSkripsiReference.putString(
          persetujuanSkripsiBlob,
          'base64',
        );
        const persetujuanSkripsi =
          await persetujuanSkripsiReference.getDownloadURL();

        // Proses Form Menghadiri Sidang
        const buktiLunasFilePath = `${RNFS.DocumentDirectoryPath}/${buktiLunas.name}`;
        await RNFS.copyFile(buktiLunas.uri, buktiLunasFilePath);
        const buktiLunasBlob = await RNFS.readFile(
          buktiLunasFilePath,
          'base64',
        );
        await buktiLunasReference.putString(buktiLunasBlob, 'base64');
        const fileBuktiLunas = await buktiLunasReference.getDownloadURL();

        // Proses Lembar Revisi
        const lembarRevisiFilePath = `${RNFS.DocumentDirectoryPath}/${fileLembarRevisi.name}`;
        await RNFS.copyFile(fileLembarRevisi.uri, lembarRevisiFilePath);
        const lembarRevisiBlob = await RNFS.readFile(
          lembarRevisiFilePath,
          'base64',
        );
        await lembarRevisiReference.putString(lembarRevisiBlob, 'base64');
        const lembarRevisi = await lembarRevisiReference.getDownloadURL();

        // Proses KTP
        const ktpFilePath = `${RNFS.DocumentDirectoryPath}/${scanKTP.name}`;
        await RNFS.copyFile(scanKTP.uri, ktpFilePath);
        const ktpBlob = await RNFS.readFile(ktpFilePath, 'base64');
        await ktpReference.putString(ktpBlob, 'base64');
        const ktp = await ktpReference.getDownloadURL();

        // Proses KK
        const kkFilePath = `${RNFS.DocumentDirectoryPath}/${scanKK.name}`;
        await RNFS.copyFile(scanKK.uri, kkFilePath);
        const kkBlob = await RNFS.readFile(kkFilePath, 'base64');
        await kkReference.putString(kkBlob, 'base64');
        const kk = await kkReference.getDownloadURL();

        // Proses KK
        const bimbinganSkripsiFilePath = `${RNFS.DocumentDirectoryPath}/${fileBimbinganSkripsi.name}`;
        await RNFS.copyFile(fileBimbinganSkripsi.uri, bimbinganSkripsiFilePath);
        const bimbinganSkripsiBlob = await RNFS.readFile(
          bimbinganSkripsiFilePath,
          'base64',
        );
        await bimbinganSkripsiReference.putString(
          bimbinganSkripsiBlob,
          'base64',
        );
        const bimbinganSkripsi =
          await bimbinganSkripsiReference.getDownloadURL();

        // Push to Firestore
        const jadwalId = jadwalSidang[0].id;
        const berkasPersyaratan = {
          ijazah: ijazah,
          transkipNilai: transkipNilai,
          pendaftaranSkripsi: pendaftaranSkripsi,
          persetujuanSkripsi: persetujuanSkripsi,
          fileBuktiLunas: fileBuktiLunas,
          lembarRevisi: lembarRevisi,
          ktp: ktp,
          kk: kk,
          bimbinganSkripsi: bimbinganSkripsi,
        };
        await firestore().collection('sidang').add({
          pengajuan_uid: topik,
          judul: judul,
          berkasPersyaratan,
          createdAt: new Date(),
          user_uid: user.uid,
          status: 'Belum Diverifikasi',
          catatan: '-',
          jenisSidang: 'Skripsi',
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
        console.log('Image URL: ', transkipNilai);
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
              Ijazah SMA/SMK<Text style={styles.star}>*</Text>
            </Text>
            <View style={styles.uploadContainer}>
              <TextInput
                style={[styles.fileNameInput, styles.border]}
                placeholder="Belum Upload"
                value={ijazahPath}
                editable={false}
              />
              <TouchableOpacity
                style={styles.uploadButton}
                onPress={imagePickerIjazah}>
                <Icon name="camera" size={22} color="white" />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.uploadButton}
                onPress={pickerIjazah}>
                <Icon name="file-circle-plus" size={22} color="white" />
              </TouchableOpacity>
            </View>
            <Text style={styles.inputTitle}>
              Transkip Nilai<Text style={styles.star}>*</Text>
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
                onPress={imagePickerTranskipNilai}>
                <Icon name="camera" size={22} color="white" />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.uploadButton}
                onPress={pickerTranskipNilai}>
                <Icon name="file-circle-plus" size={22} color="white" />
              </TouchableOpacity>
            </View>

            <Text style={styles.inputTitle}>
              Form Pendaftaran Sidang<Text style={styles.star}>*</Text>
            </Text>
            <View style={styles.uploadContainer}>
              <TextInput
                style={[styles.fileNameInput, styles.border]}
                placeholder="Belum Upload"
                value={pendaftaranSidangPath}
                editable={false}
              />
              <TouchableOpacity
                style={styles.uploadButton}
                onPress={imagePickerPendaftaranSkripsi}>
                <Icon name="camera" size={22} color="white" />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.uploadButton}
                onPress={pickerPendaftaranSidang}>
                <Icon name="file-circle-plus" size={22} color="white" />
              </TouchableOpacity>
            </View>

            <Text style={styles.inputTitle}>
              Form Persetujuan<Text style={styles.star}>*</Text>
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
                onPress={imagePickerPersetujuanSkripsi}>
                <Icon name="camera" size={22} color="white" />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.uploadButton}
                onPress={pickerPersetujuanSidang}>
                <Icon name="file-circle-plus" size={22} color="white" />
              </TouchableOpacity>
            </View>

            <Text style={styles.inputTitle}>
              Bukti Lunas Sidang
              <Text style={styles.star}>*</Text>
            </Text>
            <View style={styles.uploadContainer}>
              <TextInput
                style={[styles.fileNameInput, styles.border]}
                placeholder="Belum Upload"
                value={buktiLunasPath}
                editable={false}
              />
              <TouchableOpacity
                style={styles.uploadButton}
                onPress={imagePickerLunas}>
                <Icon name="camera" size={22} color="white" />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.uploadButton}
                onPress={pickerBuktiLunas}>
                <Icon name="file-circle-plus" size={22} color="white" />
              </TouchableOpacity>
            </View>
            <Text style={styles.inputTitle}>
              Lembar Revisi
              <Text style={styles.star}>*</Text>
            </Text>
            <View style={styles.uploadContainer}>
              <TextInput
                style={[styles.fileNameInput, styles.border]}
                placeholder="Belum Upload"
                value={lembarRevisiPath}
                editable={false}
              />
              <TouchableOpacity
                style={styles.uploadButton}
                onPress={imagePickerRevisi}>
                <Icon name="camera" size={22} color="white" />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.uploadButton}
                onPress={pickerLembarRevisi}>
                <Icon name="file-circle-plus" size={22} color="white" />
              </TouchableOpacity>
            </View>
            <Text style={styles.inputTitle}>
              Scan KTP Berwarna
              <Text style={styles.star}>*</Text>
            </Text>
            <View style={styles.uploadContainer}>
              <TextInput
                style={[styles.fileNameInput, styles.border]}
                placeholder="Belum Upload"
                value={scanKTPPath}
                editable={false}
              />
              <TouchableOpacity
                style={styles.uploadButton}
                onPress={imagePickerKTP}>
                <Icon name="camera" size={22} color="white" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.uploadButton} onPress={pickerKTP}>
                <Icon name="file-circle-plus" size={22} color="white" />
              </TouchableOpacity>
            </View>
            <Text style={styles.inputTitle}>
              Scan KK Berwarna
              <Text style={styles.star}>*</Text>
            </Text>
            <View style={styles.uploadContainer}>
              <TextInput
                style={[styles.fileNameInput, styles.border]}
                placeholder="Belum Upload"
                value={scanKKPath}
                editable={false}
              />
              <TouchableOpacity
                style={styles.uploadButton}
                onPress={imagePickerKK}>
                <Icon name="camera" size={22} color="white" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.uploadButton} onPress={pickerKK}>
                <Icon name="file-circle-plus" size={22} color="white" />
              </TouchableOpacity>
            </View>
            <Text style={styles.inputTitle}>
              Form Bimbingan Skripsi
              <Text style={styles.star}>*</Text>
            </Text>
            <View style={styles.uploadContainer}>
              <TextInput
                style={[styles.fileNameInput, styles.border]}
                placeholder="Belum Upload"
                value={bimbinganSkripsiPath}
                editable={false}
              />
              <TouchableOpacity
                style={styles.uploadButton}
                onPress={imagePickerBimbingan}>
                <Icon name="camera" size={22} color="white" />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.uploadButton}
                onPress={pickerBimbingan}>
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
  btnSubmitContainer: {
    backgroundColor: 'white',
    elevation: 0,
    shadowOpacity: 0,
  },
  star: {color: 'red'},
});

export default AddSidangSkripsi;
