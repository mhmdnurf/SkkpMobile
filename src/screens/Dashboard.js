import React, {useState, useEffect, useCallback} from 'react';
import {
  ScrollView,
  StyleSheet,
  View,
  ActivityIndicator,
  BackHandler,
  ToastAndroid,
  RefreshControl,
} from 'react-native';
import InformasiPengajuan from '../components/InformasiPengajuan';
import Navbar from '../components/Navbar';
import DashboardHeader from '../components/DashboardHeader';
import useUserInfo from '../hooks/useUserInfo';
import InformasiSidang from '../components/InformasiSidang';
import BottomSpace from '../components/BottomSpace';

const Dashboard = ({navigation}) => {
  const {username, isLoading} = useUserInfo();
  const [exitApp, setExitApp] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const handleBackButton = useCallback(() => {
    if (exitApp) {
      BackHandler.exitApp();
    } else if (!navigation.canGoBack()) {
      setExitApp(true);
      ToastAndroid.show('Press back again to exit the app', ToastAndroid.SHORT);
      setTimeout(() => {
        setExitApp(false);
      }, 2000);
    } else {
      navigation.goBack();
    }
    return true;
  }, [exitApp, navigation]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setRefreshing(false);
  }, []);

  useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', handleBackButton);

    return () => {
      BackHandler.removeEventListener('hardwareBackPress', handleBackButton);
    };
  }, [handleBackButton]);

  return (
    <View style={styles.container}>
      {isLoading ? (
        <ActivityIndicator size="large" color="#176B87" />
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={['#176B87']}
            />
          }>
          <DashboardHeader username={username} />
          <Navbar />
          <InformasiPengajuan />
          <InformasiSidang />
          <BottomSpace marginBottom={40} />
        </ScrollView>
      )}
    </View>
  );
};

export default Dashboard;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'whitesmoke',
    justifyContent: 'center',
  },
});
