import React from 'react';
import firestore from '@react-native-firebase/firestore';

const useJadwalSidang = () => {
  const [tanggalBukaKP, setTanggalBukaKP] = React.useState(null);
  const [tanggalTutupKP, setTanggalTutupKP] = React.useState(null);
  const [tanggalBukaSempro, setTanggalBukaSempro] = React.useState(null);
  const [tanggalTutupSempro, setTanggalTutupSempro] = React.useState(null);
  const [tanggalBukaKompre, setTanggalBukaKompre] = React.useState(null);
  const [tanggalTutupKompre, setTanggalTutupKompre] = React.useState(null);
  const [tanggalBukaSkripsi, setTanggalBukaSkripsi] = React.useState(null);
  const [tanggalTutupSkripsi, setTanggalTutupSkripsi] = React.useState(null);
  const [tanggalSidangKP, setTanggalSidangKP] = React.useState(null);
  const [tanggalSidangSempro, setTanggalSidangSempro] = React.useState(null);
  const [tanggalSidangKompre, setTanggalSidangKompre] = React.useState(null);
  const [tanggalSidangSkripsi, setTanggalSidangSkripsi] = React.useState(null);

  const fetchJadwalSidang = () => {
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
          setTanggalSidangKP(null);
          setTanggalBukaSempro(null);
          setTanggalTutupSempro(null);
          setTanggalTutupSempro(null);
          setTanggalSidangSempro(null);
          setTanggalBukaKompre(null);
          setTanggalTutupKompre(null);
          setTanggalSidangKompre(null);
          setTanggalBukaSkripsi(null);
          setTanggalTutupSkripsi(null);
          setTanggalSidangSkripsi(null);
        }
      });

    return unsubscribeSidang;
  };

  React.useEffect(() => {
    const unsubscribeSidang = fetchJadwalSidang();
    return () => unsubscribeSidang();
  }, []);
  const dates = {
    tanggalBukaKP,
    tanggalTutupKP,
    tanggalBukaSempro,
    tanggalTutupSempro,
    tanggalBukaKompre,
    tanggalTutupKompre,
    tanggalBukaSkripsi,
    tanggalTutupSkripsi,
    tanggalSidangKP,
    tanggalSidangSempro,
    tanggalSidangKompre,
    tanggalSidangSkripsi,
  };

  return dates;
};

export default useJadwalSidang;
