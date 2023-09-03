import {View, Text, FlatList, StyleSheet} from 'react-native';
import React, {useState, useEffect} from 'react';
import Icon from 'react-native-vector-icons/FontAwesome6';
import firestore from '@react-native-firebase/firestore';

export default function DataPendaftar() {
  const [isLoading, setIsLoading] = useState(true);
  const [jumlahPendaftarKP, setJumlahPendaftarKP] = useState(0);
  const [jumlahPendaftarSempro, setJumlahPendaftarSempro] = useState(0);
  const [jumlahPendaftarKompre, setJumlahPendaftarKompre] = useState(0);
  const [jumlahPendaftarSkripsi, setJumlahPendaftarSkripsi] = useState(0);

  const fetchKerjaPraktek = () => {
    const jadwalSidangRef = firestore().collection('jadwalSidang');
    const sidangRef = firestore().collection('sidang');

    const unsubscribeKP = jadwalSidangRef
      .where('status', '==', 'Aktif')
      .onSnapshot(querySnapshot => {
        const kerjaPraktekUIDs = querySnapshot.docs
          .filter(doc => doc.data().jenisSidang.includes('Kerja Praktek'))
          .map(doc => doc.id);

        sidangRef
          .where('jenisSidang', '==', 'Kerja Praktek')
          .onSnapshot(queryKerjaPraktek => {
            const periodePendaftaran = queryKerjaPraktek.docs
              .filter(doc =>
                kerjaPraktekUIDs.includes(doc.data().jadwalSidang_uid),
              )
              .map(doc => doc.data().periodePendaftaran);

            setJumlahPendaftarKP(periodePendaftaran.length);
            setIsLoading(false);
          });
      });

    return unsubscribeKP; // Mengembalikan fungsi untuk berhenti berlangganan
  };

  const fetchSempro = () => {
    const jadwalSidangRef = firestore().collection('jadwalSidang');
    const sidangRef = firestore().collection('sidang');

    const unsubscribeSempro = jadwalSidangRef
      .where('status', '==', 'Aktif')
      .onSnapshot(querySnapshot => {
        const semproUIDs = querySnapshot.docs
          .filter(doc => doc.data().jenisSidang.includes('Seminar Proposal'))
          .map(doc => doc.id);

        sidangRef
          .where('jenisSidang', '==', 'Seminar Proposal')
          .onSnapshot(querySempro => {
            const periodePendaftaran = querySempro.docs
              .filter(doc => semproUIDs.includes(doc.data().jadwalSidang_uid))
              .map(doc => doc.data().periodePendaftaran);

            setJumlahPendaftarSempro(periodePendaftaran.length);
            setIsLoading(false);
          });
      });

    return unsubscribeSempro; // Mengembalikan fungsi untuk berhenti berlangganan
  };

  const fetchKompre = () => {
    const jadwalSidangRef = firestore().collection('jadwalSidang');
    const sidangRef = firestore().collection('sidang');

    const unsubscribeKompre = jadwalSidangRef
      .where('status', '==', 'Aktif')
      .onSnapshot(querySnapshot => {
        const kompreUIDs = querySnapshot.docs
          .filter(doc => doc.data().jenisSidang.includes('Komprehensif'))
          .map(doc => doc.id);

        sidangRef
          .where('jenisSidang', '==', 'Komprehensif')
          .onSnapshot(queryKompre => {
            const periodePendaftaran = queryKompre.docs
              .filter(doc => kompreUIDs.includes(doc.data().jadwalSidang_uid))
              .map(doc => doc.data().periodePendaftaran);

            setJumlahPendaftarKompre(periodePendaftaran.length);
            setIsLoading(false);
          });
      });

    return unsubscribeKompre; // Mengembalikan fungsi untuk berhenti berlangganan
  };

  const fetchSkripsi = () => {
    const jadwalSidangRef = firestore().collection('jadwalSidang');
    const sidangRef = firestore().collection('sidang');

    const unsubscribeSkripsi = jadwalSidangRef
      .where('status', '==', 'Aktif')
      .onSnapshot(querySnapshot => {
        const skripsiUIDs = querySnapshot.docs
          .filter(doc => doc.data().jenisSidang.includes('Skripsi'))
          .map(doc => doc.id);

        sidangRef
          .where('jenisSidang', '==', 'Skripsi')
          .onSnapshot(querySkripsi => {
            const periodePendaftaran = querySkripsi.docs
              .filter(doc => skripsiUIDs.includes(doc.data().jadwalSidang_uid))
              .map(doc => doc.data().periodePendaftaran);

            setJumlahPendaftarSkripsi(periodePendaftaran.length);
            setIsLoading(false);
          });
      });

    return unsubscribeSkripsi; // Mengembalikan fungsi untuk berhenti berlangganan
  };

  useEffect(() => {
    const unsubscribeKP = fetchKerjaPraktek();
    const unsubscribeSempro = fetchSempro();
    const unsubscribeKompre = fetchKompre();
    const unsubscribeSkripsi = fetchSkripsi();
    return () => {
      unsubscribeKP();
      unsubscribeSempro();
      unsubscribeKompre();
      unsubscribeSkripsi();
    };
  }, []);

  const data = [
    {
      title: 'Pendaftar Sidang KP',
      number: isLoading ? 'Loading...' : jumlahPendaftarKP.toString(),
      iconName: 'briefcase',
    },
    {
      title: 'Pendaftar Sempro',
      number: isLoading ? 'Loading...' : jumlahPendaftarSempro.toString(),
      iconName: 'copy',
    },
    {
      title: 'Pendaftar Sidang Komprehensif',
      number: isLoading ? 'Loading...' : jumlahPendaftarKompre.toString(),
      iconName: 'desktop',
    },
    {
      title: 'Pendaftar Sidang Akhir',
      number: isLoading ? 'Loading...' : jumlahPendaftarSkripsi.toString(),
      iconName: 'user-graduate',
    },
  ];

  const renderItem = ({item}) => (
    <View style={styles.boxContainer}>
      <View style={{alignItems: 'flex-start'}}>
        <Icon name={item.iconName} size={48} color="#A0BFE0" />
      </View>
      <View style={{alignItems: 'flex-end'}}>
        <Text style={styles.textTitle}>{item.title}</Text>
        <Text style={styles.textNumber}>{item.number}</Text>
      </View>
    </View>
  );

  return (
    <FlatList
      horizontal
      data={data}
      renderItem={renderItem}
      keyExtractor={(item, index) => index.toString()}
      showsHorizontalScrollIndicator={false}
    />
  );
}

const styles = StyleSheet.create({
  boxContainer: {
    marginLeft: 16,
    padding: 16,
    backgroundColor: 'white',
    width: 300,
    height: 150,
    borderRadius: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: 'black',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 7,
    elevation: 10,
  },
  textTitle: {fontSize: 24, color: '#4A55A2', fontWeight: 'bold'},
  textNumber: {fontSize: 36, color: '#4A55A2', fontWeight: 'bold'},
});
