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

const AddSempro = ({navigation}) => {
  const [topik, setTopik] = useState('');
  const [judul, setJudul] = useState('');
  const [fileTranskipNilai, setFileTranskipNilai] = useState(null);
  const [transkipPath, setTranskipPath] = useState('');
  const [filePendaftaranSempro, setFilePendaftaranSempro] = useState(null);
  const [pendaftaranSemproPath, setPendaftaranSemproPath] = useState('');
  const [filePersetujuanSempro, setFilePersetujuanSempro] = useState(null);
  const [persetujuanPath, setPersetujuanPath] = useState('');
  const [sertifikatKeahlian, setSertifikatKeahlian] = useState(null);
  const [sertifikatKeahlianPath, setSertifikatKeahlianPath] = useState('');
  const [formMenghadiriSidang, setFormMenghadiriSidang] = useState(null);
  const [menghadiriSidangPath, setMenghadiriSidangPath] = useState('');
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
      .onSnapshot(querySnapshot => {
        const data = [];
        querySnapshot.forEach(doc => {
          data.push({id: doc.id, ...doc.data()});
          setJadwalSidang(data);
        });
      });

    if (
      judul !== '' &&
      topik !== '' &&
      persetujuanPath !== '' &&
      transkipPath !== '' &&
      pendaftaranSemproPath !== '' &&
      sertifikatKeahlianPath !== '' &&
      menghadiriSidangPath !== ''
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
    persetujuanPath,
    transkipPath,
    pendaftaranSemproPath,
    sertifikatKeahlianPath,
    menghadiriSidangPath,
    user.uid,
  ]);

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

  const pickerPendaftaranSempro = async () => {
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
      setPendaftaranSemproPath(selectedFileName);
      setFilePendaftaranSempro({uri: selectedFile, name: result[0]});
      console.log('Nama Berkas:', selectedFileName);
    } catch (error) {
      if (DocumentPicker.isCancel(error)) {
        console.log('Pengguna membatalkan pemilihan dokumen');
      } else {
        console.log('Error memilih dokumen:', error.message);
      }
    }
  };

  const pickerPersetujuanSempro = async () => {
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
      setFilePersetujuanSempro({uri: selectedFile, name: result[0]});
      console.log('Nama Berkas:', selectedFileName);
    } catch (error) {
      if (DocumentPicker.isCancel(error)) {
        console.log('Pengguna membatalkan pemilihan dokumen');
      } else {
        console.log('Error memilih dokumen:', error.message);
      }
    }
  };

  const pickerSertifikatKeahlian = async () => {
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
      setSertifikatKeahlianPath(selectedFileName);
      setSertifikatKeahlian({uri: selectedFile, name: result[0]});
      console.log('Nama Berkas:', selectedFileName);
    } catch (error) {
      if (DocumentPicker.isCancel(error)) {
        console.log('Pengguna membatalkan pemilihan dokumen');
      } else {
        console.log('Error memilih dokumen:', error.message);
      }
    }
  };

  const pickerMenghadiriSidang = async () => {
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
      setMenghadiriSidangPath(selectedFileName);
      setFormMenghadiriSidang({uri: selectedFile, name: result[0]});
      console.log('Nama Berkas:', selectedFileName);
    } catch (error) {
      if (DocumentPicker.isCancel(error)) {
        console.log('Pengguna membatalkan pemilihan dokumen');
      } else {
        console.log('Error memilih dokumen:', error.message);
      }
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
        setPersetujuanPath(selectedFileName);
        setFilePersetujuanSempro({uri: selectedFile, name: selectedFileName});
        console.log('Selected Image URI:', selectedFile);
      }
    } catch (error) {
      console.error('ImagePicker Error:', error);
    }
  };

  const imagePickerPendaftaranSempro = async () => {
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

  const imagePickerPersetujuanSempro = async () => {
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
        setPendaftaranSemproPath(selectedFileName);
        setFilePendaftaranSempro({uri: selectedFile, name: selectedFileName});
        console.log('Selected Image URI:', selectedFile);
      }
    } catch (error) {
      console.error('ImagePicker Error:', error);
    }
  };

  const imagePickerSertifikatKeahlian = async () => {
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
        setSertifikatKeahlianPath(selectedFileName);
        setSertifikatKeahlian({uri: selectedFile, name: selectedFileName});
        console.log('Selected Image URI:', selectedFile);
      }
    } catch (error) {
      console.error('ImagePicker Error:', error);
    }
  };

  const imagePickerMenghadiriSidang = async () => {
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
        setMenghadiriSidangPath(selectedFileName);
        setFormMenghadiriSidang({uri: selectedFile, name: selectedFileName});
        console.log('Selected Image URI:', selectedFile);
      }
    } catch (error) {
      console.error('ImagePicker Error:', error);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    setTopik('');
    setFilePersetujuanSempro(null);
    setPersetujuanPath('');
    setFileTranskipNilai(null);
    setTranskipPath('');
    setFilePendaftaranSempro(null);
    setPendaftaranSemproPath('');
    setSertifikatKeahlian(null);
    setSertifikatKeahlianPath('');
    setFormMenghadiriSidang(null);
    setMenghadiriSidangPath('');
    setRefreshing(false);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    if (
      fileTranskipNilai &&
      filePendaftaranSempro &&
      filePersetujuanSempro &&
      sertifikatKeahlian &&
      formMenghadiriSidang
    ) {
      const transkipNilaiFileName = `persyaratan/sidangSempro/transkipNilai/${user.uid}`;
      const pendaftaranSemproFileName = `persyaratan/sidangSempro/formPendaftaran/${user.uid}`;
      const persetujuanSemproFileName = `persyaratan/sidangSempro/formPersetujuan/${user.uid}`;
      const sertifikatKeahlianFileName = `persyaratan/sidangSempro/sertifikatKeahlian/${user.uid}`;
      const menghadiriSidangFileName = `persyaratan/sidangSempro/formMenghadiriSidang/${user.uid}`;

      const transkipNilaiReference = storage().ref(transkipNilaiFileName);
      const pendaftaranSemproReference = storage().ref(
        pendaftaranSemproFileName,
      );
      const persetujuanSemproReference = storage().ref(
        persetujuanSemproFileName,
      );
      const sertifikatKeahlianReference = storage().ref(
        sertifikatKeahlianFileName,
      );
      const menghadiriSidangReference = storage().ref(menghadiriSidangFileName);
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

        // Proses Form Pendaftaran Seminar Proposal
        const pendaftaranSemproFilePath = `${RNFS.DocumentDirectoryPath}/${filePendaftaranSempro.name}`;
        await RNFS.copyFile(
          filePendaftaranSempro.uri,
          pendaftaranSemproFilePath,
        );
        const pendaftaranSemproBlob = await RNFS.readFile(
          pendaftaranSemproFilePath,
          'base64',
        );
        await pendaftaranSemproReference.putString(
          pendaftaranSemproBlob,
          'base64',
        );
        const pendaftaranSempro =
          await pendaftaranSemproReference.getDownloadURL();

        // Proses Form Persetujuan Sempro
        const persetujuanSemproFilePath = `${RNFS.DocumentDirectoryPath}/${filePersetujuanSempro.name}`;
        await RNFS.copyFile(
          filePersetujuanSempro.uri,
          persetujuanSemproFilePath,
        );
        const persetujuanSemproBlob = await RNFS.readFile(
          persetujuanSemproFilePath,
          'base64',
        );
        await persetujuanSemproReference.putString(
          persetujuanSemproBlob,
          'base64',
        );
        const persetujuanSempro =
          await persetujuanSemproReference.getDownloadURL();

        // Proses Sertifikat Keahlian
        const sertifikatKeahlianFilePath = `${RNFS.DocumentDirectoryPath}/${sertifikatKeahlian.name}`;
        await RNFS.copyFile(sertifikatKeahlian.uri, sertifikatKeahlianFilePath);
        const sertifikatKeahlianBlob = await RNFS.readFile(
          sertifikatKeahlianFilePath,
          'base64',
        );
        await sertifikatKeahlianReference.putString(
          sertifikatKeahlianBlob,
          'base64',
        );
        const fileSertifikatKeahlian =
          await sertifikatKeahlianReference.getDownloadURL();

        // Proses Form Menghadiri Sidang
        const menghadiriSidangFilePath = `${RNFS.DocumentDirectoryPath}/${formMenghadiriSidang.name}`;
        await RNFS.copyFile(formMenghadiriSidang.uri, menghadiriSidangFilePath);
        const menghadiriSidangBlob = await RNFS.readFile(
          menghadiriSidangFilePath,
          'base64',
        );
        await menghadiriSidangReference.putString(
          menghadiriSidangBlob,
          'base64',
        );
        const fileMenghadiriSidang =
          await menghadiriSidangReference.getDownloadURL();

        // Push to Firestore
        const jadwalId = jadwalSidang[0].id;
        const berkasPersyaratan = {
          transkipNilai: transkipNilai,
          pendaftaranSempro: pendaftaranSempro,
          persetujuanSempro: persetujuanSempro,
          fileSertifikatKeahlian: fileSertifikatKeahlian,
          fileMenghadiriSidang: fileMenghadiriSidang,
        };
        await firestore().collection('sidang').add({
          judul: judul,
          pengajuan_uid: topik,
          berkasPersyaratan,
          createdAt: new Date(),
          user_uid: user.uid,
          status: 'Belum Diverifikasi',
          catatan: '-',
          jenisSidang: 'Seminar Proposal',
          jadwalSidang_uid: jadwalId,
        });
        Dialog.show({
          type: ALERT_TYPE.SUCCESS,
          title: 'Berhasil',
          textBody: 'Pendaftaran Seminar Proposal berhasil dilakukan',
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
              Transkip Sementara<Text style={styles.star}>*</Text>
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
              Form Pendaftaran Seminar Proposal
              <Text style={styles.star}>*</Text>
            </Text>
            <View style={styles.uploadContainer}>
              <TextInput
                style={[styles.fileNameInput, styles.border]}
                placeholder="Belum Upload"
                value={pendaftaranSemproPath}
                editable={false}
              />
              <TouchableOpacity
                style={styles.uploadButton}
                onPress={imagePickerPendaftaranSempro}>
                <Icon name="camera" size={22} color="white" />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.uploadButton}
                onPress={pickerPendaftaranSempro}>
                <Icon name="file-circle-plus" size={22} color="white" />
              </TouchableOpacity>
            </View>

            <Text style={styles.inputTitle}>
              Form Persetujuan Seminar Proposal
              <Text style={styles.star}>*</Text>
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
                onPress={imagePickerPersetujuanSempro}>
                <Icon name="camera" size={22} color="white" />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.uploadButton}
                onPress={pickerPersetujuanSempro}>
                <Icon name="file-circle-plus" size={22} color="white" />
              </TouchableOpacity>
            </View>

            <Text style={styles.inputTitle}>
              Sertifikat Keahlian (3 Sertifikat)
              <Text style={styles.star}>*</Text>
            </Text>
            <View style={styles.uploadContainer}>
              <TextInput
                style={[styles.fileNameInput, styles.border]}
                placeholder="Belum Upload"
                value={sertifikatKeahlianPath}
                editable={false}
              />
              <TouchableOpacity
                style={styles.uploadButton}
                onPress={imagePickerSertifikatKeahlian}>
                <Icon name="camera" size={22} color="white" />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.uploadButton}
                onPress={pickerSertifikatKeahlian}>
                <Icon name="file-circle-plus" size={22} color="white" />
              </TouchableOpacity>
            </View>

            <Text style={styles.inputTitle}>
              Form Menghadiri Sidang
              <Text style={styles.star}>*</Text>
            </Text>
            <View style={styles.uploadContainer}>
              <TextInput
                style={[styles.fileNameInput, styles.border]}
                placeholder="Belum Upload"
                value={menghadiriSidangPath}
                editable={false}
              />
              <TouchableOpacity
                style={styles.uploadButton}
                onPress={imagePickerMenghadiriSidang}>
                <Icon name="camera" size={22} color="white" />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.uploadButton}
                onPress={pickerMenghadiriSidang}>
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

export default AddSempro;
