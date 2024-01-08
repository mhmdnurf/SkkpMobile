import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TextInput,
  Pressable,
} from 'react-native';
import Header from '../../../../components/Header';
import InputField from '../../../../components/InputField';
import firestore from '@react-native-firebase/firestore';

const Detail = ({route, navigation}) => {
  const {itemId} = route.params;
  const [pengajuanData, setPengajuanData] = React.useState([]);
  const [jadwalPengajuanData, setJadwalPengajuanData] = React.useState([]);
  const [statusPengajuan, setStatusPengajuan] = React.useState('');

  const getUserInfo = async uid => {
    const userDocSnapshot = await firestore()
      .collection('users')
      .doc(uid)
      .get();
    return userDocSnapshot.exists ? userDocSnapshot.data() : null;
  };

  const getPengajuanData = async id => {
    const documentSnapshot = await firestore()
      .collection('pengajuan')
      .doc(id)
      .get();
    return documentSnapshot.exists ? documentSnapshot.data() : null;
  };

  const getJadwalPengajuanData = async () => {
    const querySnapshot = await firestore()
      .collection('jadwalPengajuan')
      .where('status', '==', 'Aktif')
      .get();
    return querySnapshot.docs.map(doc => doc.data());
  };

  const fetchPengajuanData = async () => {
    try {
      const data = await getPengajuanData(itemId);
      if (data) {
        const dosenPembimbingInfo = await getUserInfo(data.pembimbing_uid);
        setPengajuanData({
          id: itemId,
          ...data,
          dosenPembimbingInfo: dosenPembimbingInfo,
        });
        setStatusPengajuan(data.status);
      } else {
        console.log('Pengajuan tidak ditemukan');
      }
    } catch (error) {
      console.error('Error mengambil data pengajuan:', error);
    }
  };

  React.useEffect(() => {
    fetchPengajuanData();
    const fetchJadwalPengajuanData = async () => {
      const data = await getJadwalPengajuanData();
      setJadwalPengajuanData(
        data.filter(jadwalData =>
          jadwalData.jenisPengajuan.includes('Kerja Praktek'),
        ),
      );
    };
    fetchJadwalPengajuanData();
  }, []);
  return (
    <>
      <ScrollView style={styles.container}>
        <Header title="Detail Pengajuan KP" />
        <View>
          <InputField
            label={'Tanggal Pendaftaran'}
            value={
              pengajuanData.createdAt
                ? new Intl.DateTimeFormat('id-ID', {
                    day: '2-digit',
                    month: 'long',
                    year: 'numeric',
                  }).format(pengajuanData.createdAt.toDate())
                : '-'
            }
            editable={false}
          />
          <InputField
            label={'Status'}
            value={pengajuanData.status}
            editable={false}
          />
          <InputField
            label={'Catatan'}
            value={pengajuanData.catatan}
            editable={false}
          />
          <InputField
            label={'Dosen Pembimbing'}
            value={
              pengajuanData.dosenPembimbingInfo
                ? `${pengajuanData.dosenPembimbingInfo.nama} (${pengajuanData.dosenPembimbingInfo.nidn})`
                : '-'
            }
            editable={false}
          />
        </View>
        {/* Berkas */}
        <View style={styles.berkasContainer}>
          <Text style={styles.berkasTitle}>Berkas Persyaratan</Text>
          <View style={styles.btnMainContainer}>
            <Pressable style={styles.btnContainer}>
              <Text style={styles.btnText}>Transkip Nilai</Text>
            </Pressable>
            <Pressable style={styles.btnContainer}>
              <Text style={styles.btnText}>Form KRS</Text>
            </Pressable>
            <Pressable style={styles.btnContainer}>
              <Text style={styles.btnText}>Form Pendaftaran KP</Text>
            </Pressable>
            <Pressable style={styles.btnContainer}>
              <Text style={styles.btnText}>Slip Pembayaran KP</Text>
            </Pressable>
            <Pressable style={styles.btnContainer}>
              <Text style={styles.btnText}>Dokumen Proposal</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </>
  );
};

export default Detail;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  berkasContainer: {
    marginHorizontal: 20,
    marginTop: 10,
    borderRadius: 10,
  },
  berkasTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6F7789',
    textDecorationLine: 'underline',
  },
  btnMainContainer: {
    marginTop: 10,
  },
  btnContainer: {
    padding: 15,
    borderRadius: 5,
    backgroundColor: '#176B87',
    marginBottom: 10,
  },
  pressableContainer: {
    marginTop: 10,
  },
  btnText: {
    color: 'white',
  },
});
