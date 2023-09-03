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

const EditSempro = ({route, navigation}) => {
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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [jadwalPengajuan, setJadwalPengajuan] = useState([]);
  const [berkasPersyaratan, setBerkasPersyaratan] = useState({});
  const {itemId} = route.params;

  useEffect(() => {
    const unsubscribe = firestore()
      .collection('jadwalSidang')
      .where('status', '==', 'Aktif')
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
          setJudul(data.judul);
          setBerkasPersyaratan(data.berkasPersyaratan);
          setTranskipPath(data.berkasPersyaratan.transkipNilai);
          setPendaftaranSemproPath(data.berkasPersyaratan.pendaftaranSempro);
          setPersetujuanPath(data.berkasPersyaratan.persetujuanSempro);
          setSertifikatKeahlianPath(
            data.berkasPersyaratan.fileSertifikatKeahlian,
          );
          setMenghadiriSidangPath(data.berkasPersyaratan.fileMenghadiriSidang);
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

  const handleEdit = async () => {
    setIsSubmitting(true);
    try {
      const user = auth().currentUser;
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

      let transkipNilai = null;
      let pendaftaranSempro = null;
      let persetujuanSempro = null;
      let fileSertifikatKeahlian = null;
      let fileMenghadiriSidang = null;

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

      if (filePendaftaranSempro) {
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
        pendaftaranSempro = await pendaftaranSemproReference.getDownloadURL();
      }

      if (filePersetujuanSempro) {
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
        persetujuanSempro = await persetujuanSemproReference.getDownloadURL();
      }

      if (fileSertifikatKeahlian) {
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
        fileSertifikatKeahlian =
          await sertifikatKeahlianReference.getDownloadURL();
      }

      if (fileMenghadiriSidang) {
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
        fileMenghadiriSidang = await menghadiriSidangReference.getDownloadURL();
      }
      const jadwalId = jadwalPengajuan[0].id;
      const updateData = {
        judul: judul,
        editedAt: new Date(),
        status: 'Belum Diverifikasi',
        jadwalSidang_uid: jadwalId,
        berkasPersyaratan: {
          transkipNilai: berkasPersyaratan.transkipNilai,
          pendaftaranSempro: berkasPersyaratan.pendaftaranSempro,
          persetujuanSempro: berkasPersyaratan.persetujuanSempro,
          fileSertifikatKeahlian: berkasPersyaratan.fileSertifikatKeahlian,
          fileMenghadiriSidang: berkasPersyaratan.fileMenghadiriSidang,
        },
      };

      if (transkipNilai) {
        updateData.berkasPersyaratan.transkipNilai = transkipNilai;
      }
      if (pendaftaranSempro) {
        updateData.berkasPersyaratan.pendaftaranSempro = pendaftaranSempro;
      }
      if (persetujuanSempro) {
        updateData.berkasPersyaratan.persetujuanSempro = persetujuanSempro;
      }
      if (fileSertifikatKeahlian) {
        updateData.berkasPersyaratan.fileSertifikatKeahlian =
          fileSertifikatKeahlian;
      }
      if (fileMenghadiriSidang) {
        updateData.berkasPersyaratan.fileMenghadiriSidang =
          fileMenghadiriSidang;
      }
      await firestore().collection('sidang').doc(itemId).update(updateData);
      Dialog.show({
        type: ALERT_TYPE.SUCCESS,
        title: 'Berhasil',
        textBody: 'Data Seminar Proposal berhasil diubah',
        button: 'Tutup',
        onPressButton: () => {
          navigation.navigate('Sidang');
        },
      });
    } catch (error) {}
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
          keyboardShouldPersistTaps="handled">
          <View style={styles.container}>
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

export default EditSempro;
