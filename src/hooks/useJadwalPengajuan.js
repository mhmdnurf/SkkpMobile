import React from 'react';
import firestore from '@react-native-firebase/firestore';
const useJadwalPengajuan = () => {
  const [tanggalBukaKP, setTanggalBukaKP] = React.useState(null);
  const [tanggalTutupKP, setTanggalTutupKP] = React.useState(null);
  const [tanggalBukaSkripsi, setTanggalBukaSkripsi] = React.useState(null);
  const [tanggalTutupSkripsi, setTanggalTutupSkripsi] = React.useState(null);

  const fetchJadwalPengajuan = () => {
    const jadwalSidangRef = firestore().collection('jadwalPengajuan');
    const unsubscribePengajuan = jadwalSidangRef
      .where('status', '==', 'Aktif')
      .onSnapshot(querySnapshot => {
        if (!querySnapshot.empty) {
          querySnapshot.forEach(doc => {
            const jadwalData = doc.data();
            const jenisPengajuan = jadwalData.jenisPengajuan;
            if (jenisPengajuan.includes('Kerja Praktek')) {
              const periodePendaftaran = jadwalData.periodePendaftaran;
              setTanggalBukaKP(periodePendaftaran.tanggalBuka.toDate());
              setTanggalTutupKP(periodePendaftaran.tanggalTutup.toDate());
            }
            if (jenisPengajuan.includes('Skripsi')) {
              const periodePendaftaran = jadwalData.periodePendaftaran;
              setTanggalBukaSkripsi(periodePendaftaran.tanggalBuka.toDate());
              setTanggalTutupSkripsi(periodePendaftaran.tanggalTutup.toDate());
            }
          });
        } else {
          setTanggalBukaKP(null);
          setTanggalTutupKP(null);
          setTanggalBukaSkripsi(null);
          setTanggalTutupSkripsi(null);
        }
      });

    return unsubscribePengajuan;
  };

  React.useEffect(() => {
    const unsubscribePengajuan = fetchJadwalPengajuan();
    return () => {
      unsubscribePengajuan();
    };
  }, []);
  const dates = {
    tanggalBukaKP,
    tanggalTutupKP,
    tanggalBukaSkripsi,
    tanggalTutupSkripsi,
  };
  return dates;
};

export default useJadwalPengajuan;
