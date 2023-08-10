import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import React from 'react';
import PengajuanSkripsi from '../screens/pengajuan_skripsi/HomePengajuanSkripsi';
import AddPengajuanKP from '../screens/pengajuan_kp/AddPengajuanKP';
import HomePengajuanKP from '../screens/pengajuan_kp/HomePengajuanKP';
import HomePengajuanSkripsi from '../screens/pengajuan_skripsi/HomePengajuanSkripsi';
import {AlertNotificationRoot} from 'react-native-alert-notification';
const Tab = createMaterialTopTabNavigator();

const PengajuanTab = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarShowLabel: true,
        tabBarShowIcon: true,
        tabBarItemStyle: {
          flexDirection: 'row',
        },
        tabBarIndicatorStyle: {
          backgroundColor: 'white',
          height: 2,
        },
        tabBarStyle: {
          backgroundColor: '#59C1BD',
        },
        tabBarLabelStyle: {
          color: 'white',
          fontWeight: 'bold',
        },
      }}>
      <Tab.Screen name="Kerja Praktek" component={HomePengajuanKP} />
      <Tab.Screen name="Skripsi" component={HomePengajuanSkripsi} />
    </Tab.Navigator>
  );
};

export default PengajuanTab;
