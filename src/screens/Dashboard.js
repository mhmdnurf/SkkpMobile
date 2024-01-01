import React from 'react';
import {ScrollView, StyleSheet} from 'react-native';
import InformasiPengajuan from '../components/InformasiPengajuan';
import Navbar from '../components/Navbar';
import DashboardHeader from '../components/DashboardHeader';
import useUserInfo from '../hooks/useUserInfo';
import InformasiSidang from '../components/InformasiSidang';
import BottomSpace from '../components/BottomSpace';

const Dashboard = () => {
  const username = useUserInfo();
  return (
    <ScrollView>
      <DashboardHeader username={username} />
      <Navbar />
      <InformasiPengajuan />
      <InformasiSidang />
      <BottomSpace marginBottom={40} />
    </ScrollView>
  );
};

export default Dashboard;

const styles = StyleSheet.create({});
