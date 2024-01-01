import React from 'react';
import firestore from '@react-native-firebase/firestore';

const usePendaftar = () => {
  const [jumlahPendaftarKP, setJumlahPendaftarKP] = React.useState(0);
  const [jumlahPendaftarSempro, setJumlahPendaftarSempro] = React.useState(0);
  const [jumlahPendaftarKompre, setJumlahPendaftarKompre] = React.useState(0);
  const [jumlahPendaftarSkripsi, setJumlahPendaftarSkripsi] = React.useState(0);

  React.useEffect(() => {
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
                .filter(doc =>
                  skripsiUIDs.includes(doc.data().jadwalSidang_uid),
                )
                .map(doc => doc.data().periodePendaftaran);

              setJumlahPendaftarSkripsi(periodePendaftaran.length);
            });
        });

      return unsubscribeSkripsi; // Mengembalikan fungsi untuk berhenti berlangganan
    };
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
  });
  return {
    jumlahPendaftarKP,
    jumlahPendaftarSempro,
    jumlahPendaftarKompre,
    jumlahPendaftarSkripsi,
  };
};

export default usePendaftar;
