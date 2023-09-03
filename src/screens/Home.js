import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import DataPendaftar from '../components/DataPendaftar';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import Icon from 'react-native-vector-icons/FontAwesome6';

export default function Home({navigation}) {
  const [userName, setUserName] = useState('');
  const [tanggalBukaKP, setTanggalBukaKP] = useState(null);
  const [tanggalTutupKP, setTanggalTutupKP] = useState(null);
  const [tanggalBukaSempro, setTanggalBukaSempro] = useState(null);
  const [tanggalTutupSempro, setTanggalTutupSempro] = useState(null);
  const [tanggalBukaKompre, setTanggalBukaKompre] = useState(null);
  const [tanggalTutupKompre, setTanggalTutupKompre] = useState(null);
  const [tanggalBukaSkripsi, setTanggalBukaSkripsi] = useState(null);
  const [tanggalTutupSkripsi, setTanggalTutupSkripsi] = useState(null);
  const [tanggalSidangKP, setTanggalSidangKP] = useState(null);
  const [tanggalSidangSempro, setTanggalSidangSempro] = useState(null);
  const [tanggalSidangKompre, setTanggalSidangKompre] = useState(null);
  const [tanggalSidangSkripsi, setTanggalSidangSkripsi] = useState(null);

  useEffect(() => {
    const unsubscribe = auth().onAuthStateChanged(user => {
      if (user) {
        const userUid = user.uid;
        const userRef = firestore().collection('users').doc(userUid);

        const unsubscribeSnapshot = userRef.onSnapshot(
          doc => {
            if (doc.exists) {
              const userData = doc.data();
              const nama = userData.nama;
              setUserName(nama);
            } else {
              console.log('No such document!');
            }
          },
          error => {
            console.log('Error fetching document:', error);
          },
        );

        return () => {
          unsubscribeSnapshot();
        };
      } else {
        setUserName('');
      }
    });

    const jadwalSidangRef = firestore().collection('jadwalSidang');

    const unsubscribeSidang = jadwalSidangRef
      .where('status', '==', 'Aktif')
      .onSnapshot(querySnapshot => {
        if (!querySnapshot.empty) {
          querySnapshot.forEach(doc => {
            const jadwalData = doc.data();
            const jenisSidang = jadwalData.jenisSidang;
            if (jenisSidang.includes('Kerja Praktek')) {
              const periodePendaftaran = jadwalData.periodePendaftaran;
              setTanggalBukaKP(periodePendaftaran.tanggalBuka.toDate());
              setTanggalTutupKP(periodePendaftaran.tanggalTutup.toDate());
              setTanggalSidangKP(jadwalData.tanggalSidang.toDate());
            }
            if (jenisSidang.includes('Seminar Proposal')) {
              const periodePendaftaran = jadwalData.periodePendaftaran;
              setTanggalBukaSempro(periodePendaftaran.tanggalBuka.toDate());
              setTanggalTutupSempro(periodePendaftaran.tanggalTutup.toDate());
              setTanggalSidangSempro(jadwalData.tanggalSidang.toDate());
            }
            if (jenisSidang.includes('Komprehensif')) {
              const periodePendaftaran = jadwalData.periodePendaftaran;
              setTanggalBukaKompre(periodePendaftaran.tanggalBuka.toDate());
              setTanggalTutupKompre(periodePendaftaran.tanggalTutup.toDate());
              setTanggalSidangKompre(jadwalData.tanggalSidang.toDate());
            }
            if (jenisSidang.includes('Skripsi')) {
              const periodePendaftaran = jadwalData.periodePendaftaran;
              setTanggalBukaSkripsi(periodePendaftaran.tanggalBuka.toDate());
              setTanggalTutupSkripsi(periodePendaftaran.tanggalTutup.toDate());
              setTanggalSidangSkripsi(jadwalData.tanggalSidang.toDate());
            }
          });
        } else {
          setTanggalBukaKP(null);
          setTanggalTutupKP(null);
        }
      });

    console.log(tanggalBukaKP);

    return () => {
      unsubscribe();
      unsubscribeSidang();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handlePengajuan = () => {
    navigation.navigate('Pengajuan');
  };

  const handleSidang = () => {
    navigation.navigate('Sidang');
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.pendaftarContainer}>
        <View>
          <Text style={styles.userTitle}>Welcome Back,</Text>
          <Text style={styles.userName}>{userName}</Text>
        </View>
        <DataPendaftar />
      </View>
      <View style={styles.menuContainer}>
        <TouchableOpacity style={styles.buttonMenu} onPress={handlePengajuan}>
          <Icon
            name="file-circle-plus"
            size={30}
            color="#7895CB"
            style={styles.iconMenu}
          />
          <Text style={styles.iconText}>Pengajuan</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.buttonMenu} onPress={handleSidang}>
          <Icon
            name="calendar"
            size={30}
            color="#7895CB"
            style={styles.iconMenu}
          />
          <Text style={styles.iconText}>Sidang</Text>
        </TouchableOpacity>
      </View>
      <View
        style={{
          backgroundColor: '#4A55A2',
          marginTop: 20,
        }}>
        <View style={styles.titleContainer}>
          <Icon name="bell" size={36} color="white" />
          <Text style={styles.pengumumanTitle}>Pengumuman</Text>
        </View>
        <View style={styles.boxContainer}>
          <View style={{flex: 1, flexDirection: 'row'}}>
            <Icon name="info" size={16} color="#4A55A2" />
            <Text style={styles.judulPengumuman}>
              INFORMASI SEMINAR PROPORSAL !
            </Text>
          </View>
          {tanggalBukaSempro && tanggalTutupSempro ? (
            <>
              <Text style={styles.textPengumuman}>
                Diberitahukan kepada mahasiswa/i Seminar Proposal akan diadakan
                pada tanggal :{' '}
                <Text style={styles.judulPengumuman}>
                  {new Intl.DateTimeFormat('id-ID', {
                    weekday: 'long',
                    day: '2-digit',
                    month: 'long',
                    year: 'numeric',
                  }).format(tanggalSidangSempro)}
                </Text>
              </Text>
              <Text style={styles.textPengumuman}>
                Pendaftaran dibuka Tanggal :{' '}
                <Text style={styles.judulPengumuman}>
                  {' '}
                  {new Intl.DateTimeFormat('id-ID', {
                    weekday: 'long',
                    day: '2-digit',
                    month: 'long',
                    year: 'numeric',
                  }).format(tanggalBukaSempro)}
                </Text>
              </Text>
              <Text style={styles.textPengumuman}>
                Pendaftaran ditutup Tanggal :{' '}
                <Text style={styles.judulPengumuman}>
                  {' '}
                  {new Intl.DateTimeFormat('id-ID', {
                    weekday: 'long',
                    day: '2-digit',
                    month: 'long',
                    year: 'numeric',
                  }).format(tanggalTutupSempro)}
                </Text>
              </Text>
            </>
          ) : (
            <Text style={styles.closeTitle}>Pendaftaran sedang ditutup</Text>
          )}
        </View>
        <View style={styles.boxContainer}>
          <View style={{flex: 1, flexDirection: 'row'}}>
            <Icon name="info" size={16} color="#4A55A2" />
            <Text style={styles.judulPengumuman}>
              INFORMASI SIDANG AKHIR SKRIPSI !
            </Text>
          </View>
          {tanggalBukaSkripsi && tanggalTutupSkripsi ? (
            <>
              <Text style={styles.textPengumuman}>
                Diberitahukan kepada mahasiswa/i Sidang Skripsi akan diadakan
                pada tanggal :{' '}
                <Text style={styles.judulPengumuman}>
                  {' '}
                  {new Intl.DateTimeFormat('id-ID', {
                    weekday: 'long',
                    day: '2-digit',
                    month: 'long',
                    year: 'numeric',
                  }).format(tanggalSidangSkripsi)}
                </Text>
              </Text>
              <Text style={styles.textPengumuman}>
                Pendaftaran dibuka Tanggal :{' '}
                <Text style={styles.judulPengumuman}>
                  {' '}
                  {new Intl.DateTimeFormat('id-ID', {
                    weekday: 'long',
                    day: '2-digit',
                    month: 'long',
                    year: 'numeric',
                  }).format(tanggalBukaSkripsi)}
                </Text>
              </Text>
              <Text style={styles.textPengumuman}>
                Pendaftaran ditutup Tanggal :{' '}
                <Text style={styles.judulPengumuman}>
                  {' '}
                  {new Intl.DateTimeFormat('id-ID', {
                    weekday: 'long',
                    day: '2-digit',
                    month: 'long',
                    year: 'numeric',
                  }).format(tanggalTutupSkripsi)}
                </Text>
              </Text>
            </>
          ) : (
            <Text style={styles.closeTitle}>Pendaftaran sedang ditutup</Text>
          )}
        </View>
        <View style={styles.boxContainer}>
          <View style={{flex: 1, flexDirection: 'row'}}>
            <Icon name="info" size={16} color="#4A55A2" />
            <Text style={styles.judulPengumuman}>
              INFORMASI SIDANG KERJA PRAKTEK !
            </Text>
          </View>
          {tanggalBukaKP && tanggalTutupKP ? (
            <>
              <Text style={styles.textPengumuman}>
                Diberitahukan kepada mahasiswa/i Sidang Kerja Praktek akan
                diadakan pada tanggal :{' '}
                <Text style={styles.judulPengumuman}>
                  {' '}
                  {new Intl.DateTimeFormat('id-ID', {
                    weekday: 'long',
                    day: '2-digit',
                    month: 'long',
                    year: 'numeric',
                  }).format(tanggalSidangKP)}
                </Text>
              </Text>
              <Text style={styles.textPengumuman}>
                Pendaftaran dibuka Tanggal :{' '}
                <Text style={styles.judulPengumuman}>
                  {' '}
                  {new Intl.DateTimeFormat('id-ID', {
                    weekday: 'long',
                    day: '2-digit',
                    month: 'long',
                    year: 'numeric',
                  }).format(tanggalBukaKP)}
                </Text>
              </Text>
              <Text style={styles.textPengumuman}>
                Pendaftaran ditutup Tanggal :{' '}
                <Text style={styles.judulPengumuman}>
                  {' '}
                  {new Intl.DateTimeFormat('id-ID', {
                    weekday: 'long',
                    day: '2-digit',
                    month: 'long',
                    year: 'numeric',
                  }).format(tanggalTutupKP)}
                </Text>
              </Text>
            </>
          ) : (
            <Text style={styles.closeTitle}>Pendaftaran sedang ditutup</Text>
          )}
        </View>
        <View style={styles.lastBoxContainer}>
          <View style={{flex: 1, flexDirection: 'row'}}>
            <Icon name="info" size={16} color="#4A55A2" />
            <Text style={styles.judulPengumuman}>
              INFORMASI SIDANG KOMPREHENSIF !
            </Text>
          </View>
          {tanggalBukaKompre && tanggalTutupKompre ? (
            <>
              <Text style={styles.textPengumuman}>
                Diberitahukan kepada mahasiswa/i Sidang Komprehensif akan
                diadakan pada tanggal :{' '}
                <Text style={styles.judulPengumuman}>
                  {' '}
                  {new Intl.DateTimeFormat('id-ID', {
                    weekday: 'long',
                    day: '2-digit',
                    month: 'long',
                    year: 'numeric',
                  }).format(tanggalSidangKompre)}
                </Text>
              </Text>
              <Text style={styles.textPengumuman}>
                Pendaftaran dibuka Tanggal :{' '}
                <Text style={styles.judulPengumuman}>
                  {' '}
                  {new Intl.DateTimeFormat('id-ID', {
                    weekday: 'long',
                    day: '2-digit',
                    month: 'long',
                    year: 'numeric',
                  }).format(tanggalBukaKompre)}
                </Text>
              </Text>
              <Text style={styles.textPengumuman}>
                Pendaftaran ditutup Tanggal :{' '}
                <Text style={styles.judulPengumuman}>
                  {' '}
                  {new Intl.DateTimeFormat('id-ID', {
                    weekday: 'long',
                    day: '2-digit',
                    month: 'long',
                    year: 'numeric',
                  }).format(tanggalTutupKompre)}
                </Text>
              </Text>
            </>
          ) : (
            <Text style={styles.closeTitle}>Pendaftaran sedang ditutup</Text>
          )}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {backgroundColor: 'white'},
  menuContainer: {
    marginTop: -30,
    marginHorizontal: 20,
    padding: 10,
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'white',
    justifyContent: 'space-around',
    shadowColor: 'black',
    shadowOffset: {width: 0, height: 10},
    shadowOpacity: 0.2,
    shadowRadius: 7,
    elevation: 10,
    borderRadius: 10,
  },
  buttonMenu: {
    backgroundColor: 'white',
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  iconMenu: {alignSelf: 'center', marginBottom: 5},
  pendaftarContainer: {
    backgroundColor: '#4A55A2',
    paddingBottom: 50,
  },
  dashboardTitle: {
    padding: 16,
    marginTop: 16,
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  userTitle: {
    paddingTop: 30,
    paddingBottom: 10,
    paddingHorizontal: 16,
    color: 'white',
    fontSize: 18,
  },
  userName: {
    paddingBottom: 16,
    paddingHorizontal: 16,
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  iconText: {color: '#0D4C92', fontWeight: 'bold'},
  boxContainer: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 10,
    marginHorizontal: 16,
    marginTop: 16,
    shadowColor: 'black',
    shadowOffset: {width: 0, height: 10},
    shadowOpacity: 0.2,
    shadowRadius: 7,
    elevation: 5,
  },
  lastBoxContainer: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 10,
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 16,
    shadowColor: 'black',
    shadowOffset: {width: 0, height: 10},
    shadowOpacity: 0.2,
    shadowRadius: 7,
    elevation: 5,
  },
  titleContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 30,
    paddingBottom: 15,
    flexDirection: 'row',
  },
  pengumumanTitle: {
    fontSize: 36,
    fontWeight: 'bold',
    color: 'white',
    marginLeft: 8,
  },
  textPengumuman: {
    fontSize: 16,
    color: '#0D4C92',
    fontWeight: '400',
  },
  judulPengumuman: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0D4C92',
    marginLeft: 4,
  },
  closeTitle: {
    color: 'red',
    fontSize: 16,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    paddingLeft: 10,
  },
});
