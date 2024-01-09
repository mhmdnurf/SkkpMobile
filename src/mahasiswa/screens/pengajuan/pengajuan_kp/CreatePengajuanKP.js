import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  Pressable,
  Alert,
  View,
  Image,
  Modal,
  Dimensions,
  Platform,
} from 'react-native';
import Header from '../../../../components/Header';
import firestore from '@react-native-firebase/firestore';
import {Picker} from '@react-native-picker/picker';
import BottomSpace from '../../../../components/BottomSpace';
import Icon from 'react-native-vector-icons/FontAwesome';
import DocumentPicker from 'react-native-document-picker';
import storage from '@react-native-firebase/storage';
import RNFS from 'react-native-fs';

const CreatePengajuanKP = () => {
  const [judul, setJudul] = React.useState('');
  const [listPersyaratan, setListPersyaratan] = React.useState([]);
  const [selectedPersyaratan, setSelectedPersyaratan] = React.useState('');
  const [uploadedFiles, setUploadedFiles] = React.useState([]);
  const [selectedImage, setSelectedImage] = React.useState(null);

  React.useEffect(() => {
    fetchPersyaratan();
    console.log(uploadedFiles);
  }, [fetchPersyaratan, uploadedFiles]);

  const fetchPersyaratan = React.useCallback(async () => {
    try {
      const query = firestore()
        .collection('persyaratan')
        .where('jenisPersyaratan', '==', 'Pengajuan Kerja Praktek')
        .get();
      const res = await query;
      const data = res.docs.map(doc => doc.data().berkasPersyaratan).flat();
      setListPersyaratan(data);
      // console.log(data);
    } catch {
      console.log('error');
    }
  }, []);

  const uploadFile = async () => {
    if (uploadedFiles[selectedPersyaratan]) {
      Alert.alert('File already uploaded');
    } else {
      try {
        const res = await DocumentPicker.pick({
          type: [DocumentPicker.types.allFiles],
        });
        const uploadedFileUrl = res[0].uri;

        // Read the file data
        const fileData = await RNFS.readFile(uploadedFileUrl, 'base64');

        setUploadedFiles({
          ...uploadedFiles,
          [selectedPersyaratan]: `data:image/jpeg;base64,${fileData}`, // Save the file data as base64 string
        });
      } catch (err) {
        if (DocumentPicker.isCancel(err)) {
          // Pengguna membatalkan pemilihan file
        } else {
          throw err;
        }
      }
    }
  };

  const removeFile = fileName => {
    setUploadedFiles(prevFiles => {
      const newFiles = {...prevFiles};
      delete newFiles[fileName];
      return newFiles;
    });
  };

  const handleSubmit = async () => {
    const dataUpload = {
      judul,
      berkas: {},
    };

    for (const [key, value] of Object.entries(uploadedFiles)) {
      // Create a reference to the file
      const fileRef = storage().ref(`${key}_${Date.now()}`);

      // Upload the file
      await fileRef.putString(value, 'data_url');

      // Get the URL of the uploaded file
      const url = await fileRef.getDownloadURL();

      // Add the URL to the data
      dataUpload.berkas[key] = url;
    }

    // Save the data to Firestore
    await firestore().collection('pengajuan').add(dataUpload);

    console.log(dataUpload);
  };

  return (
    <>
      <ScrollView style={styles.mainContainer}>
        <Header title="Buat Pengajuan KP" />
        <Text style={styles.inputTitle}>
          Judul Kerja Praktek<Text style={styles.important}>*</Text>
        </Text>
        <TextInput
          placeholder="Sistem Informasi..."
          placeholderTextColor={'#6F7789'}
          style={[styles.input, styles.border]}
          multiline
          numberOfLines={3}
          value={judul}
          onChangeText={text => setJudul(text)}
        />
        <Text style={styles.inputTitle}>
          Upload Berkas Persyaratan<Text style={styles.important}>*</Text>
        </Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={selectedPersyaratan}
            onValueChange={(itemValue, itemIndex) =>
              setSelectedPersyaratan(itemValue)
            }>
            {listPersyaratan.map((item, index) => (
              <Picker.Item
                style={styles.optionText}
                key={index}
                label={item}
                value={item}
              />
            ))}
          </Picker>
        </View>
        <Pressable style={styles.btnUpload} onPress={uploadFile}>
          <Text style={styles.btnText}>Upload</Text>
        </Pressable>
        <Text style={styles.inputTitle}>Berkas yang telah diupload</Text>
        {Object.entries(uploadedFiles).map(([key, value], index) => (
          <Pressable key={index} onPress={() => setSelectedImage(value)}>
            <View style={styles.berkasContainer}>
              <Text style={styles.selectText}>{key}</Text>
              <Pressable
                onPress={event => {
                  event.stopPropagation();
                  removeFile(key);
                }}>
                <Icon
                  name="times"
                  style={styles.iconRemove}
                  size={25}
                  color="#EF4040"
                />
              </Pressable>
            </View>
          </Pressable>
        ))}

        <Modal
          animationType="slide"
          transparent={true}
          visible={selectedImage !== null}
          onRequestClose={() => {
            setSelectedImage(null);
          }}>
          <View
            style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <Pressable onPress={() => setSelectedImage(null)}>
              <Icon
                name="times"
                style={styles.iconRemove}
                size={25}
                color="#EF4040"
              />
            </Pressable>
            <Image
              source={{uri: selectedImage}}
              style={{
                width: Dimensions.get('window').width,
                height: Dimensions.get('window').height,
              }}
            />
          </View>
        </Modal>
        <Pressable onPress={handleSubmit} style={styles.btnSubmit}>
          <Text style={styles.btnText}>Submit</Text>
        </Pressable>
        <BottomSpace marginBottom={40} />
      </ScrollView>
    </>
  );
};

export default CreatePengajuanKP;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    padding: 20,
    backgroundColor: 'white',
  },
  inputTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6F7789',
    marginBottom: 5,
    marginTop: 10,
  },
  input: {
    fontSize: 16,
    color: 'black',
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 5,
  },
  border: {
    borderWidth: 1,
    borderColor: '#176B87',
  },
  btnUpload: {
    backgroundColor: '#176B87',
    borderRadius: 10,
    padding: 13,
    marginBottom: 20,
    marginTop: 20,
    elevation: 5,
  },
  btnSubmit: {
    backgroundColor: '#176B87',
    borderRadius: 10,
    padding: 13,
    marginBottom: 20,
    marginTop: 20,
    elevation: 5,
  },
  btnText: {
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
  selectText: {
    fontSize: 16,
    color: 'white',
    fontWeight: '600',
  },
  optionText: {
    fontSize: 16,
    color: '#6F7789',
    fontWeight: '600',
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#176B87',
    borderRadius: 5,
    marginBottom: 10,
  },
  berkasContainer: {
    paddingHorizontal: 10,
    paddingVertical: 15,
    backgroundColor: '#86B6F6',
    borderRadius: 5,
    marginBottom: 10,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  iconRemove: {
    marginRight: 10,
    padding: 5,
    borderRadius: 5,
    backgroundColor: 'white',
  },
  important: {
    color: 'red',
  },
});
