import {View, TextInput, Text, StyleSheet} from 'react-native';
import React, {useState, useEffect} from 'react';
import {ScrollView, TouchableOpacity} from 'react-native-gesture-handler';
import DocumentPicker from 'react-native-document-picker';
import storage from '@react-native-firebase/storage';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import RNFS from 'react-native-fs';

const PengajuanKP = () => {
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
    if (
      fileTranskipNilai &&
      fileFormKrs &&
      filePendaftaranKp &&
      slipPembayaranKp &&
      fileProporsal
    ) {
      const user = auth().currentUser;

      const transkipNilaiFileName = `persyaratan/pengajuanKP/transkipNilai/${
        user.uid
      }/${Date.now()}`;
      const formKrsFileName = `persyaratan/pengajuanKP/formKRS/${
        user.uid
      }/${Date.now()}`;
      const pendaftaranKpFileName = `persyaratan/pengajuanKP/formPendaftaranKP/${
        user.uid
      }/${Date.now()}`;
      const pembayaranKpFileName = `persyaratan/pengajuanKP/slipPembayaranKP/${
        user.uid
      }/${Date.now()}`;
      const proporsalFileName = `persyaratan/pengajuanKP/proporsalKP/${
        user.uid
      }/${Date.now()}`;
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
        await pembayaranKpReference.putString(proporsalBlob, 'base64');
        const dokumenProporsal = await proporsalReference.getDownloadURL();
        // Push to Firestore
        const createdDate = new Date();
        await firestore().collection('pengajuan').add({
          judul,
          transkipNilai,
          formKrs,
          formPendaftaranKP,
          slipPembayaranKP,
          dokumenProporsal,
          jenisProporsal: 'KP',
          createdBy: user.uid,
          createdAt: createdDate,
        });

        console.log('Image uploaded successfully');
        console.log('Image URL: ', transkipNilai);
      } catch (error) {
        console.error('Error uploading image:', error);
      }
    }

    console.log('Form data submitted:', {
      judul,
    });
  };
  return (
    <ScrollView>
      <View style={styles.container}>
        <Text>Judul Kerja Praktek</Text>
        <TextInput
          style={styles.input}
          multiline
          numberOfLines={3}
          value={judul}
          onChangeText={text => setJudul(text)}
        />
        <Text>Transkip Nilai</Text>
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
        <Text>Form KRS</Text>
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
        <Text>Form Pendaftaran KP</Text>
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
        <Text>Slip Pembayaran KP</Text>
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
        <Text>Dokumen Proporsal</Text>
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
          styles.uploadButton,
          isSubmitDisabled && styles.disabledUploadButton,
        ]}
        onPress={handleSubmit}
        disabled={isSubmitDisabled}>
        <Text style={styles.uploadButtonText}>Submit</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
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
    backgroundColor: '#1D2D50',
    padding: 15,
    marginLeft: 5,
    borderRadius: 5,
  },
  uploadButtonText: {
    color: 'white',
    textAlign: 'center',
  },
  disabledUploadButton: {
    backgroundColor: '#ccc', // You can adjust this color to your preference
    // You can also adjust other styles, like opacity, to make it look disabled
  },
});

export default PengajuanKP;
