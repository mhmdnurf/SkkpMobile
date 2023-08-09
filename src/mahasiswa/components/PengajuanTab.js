import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import React from 'react';
import PengajuanSkripsi from '../screens/pengajuan_skripsi/HomePengajuanSkripsi';
import AddPengajuanKP from '../screens/pengajuan_kp/AddPengajuanKP';
import HomePengajuanKP from '../screens/pengajuan_kp/HomePengajuanKP';

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
          backgroundColor: '#59C1BD',
          height: 2,
        },
      }}>
      <Tab.Screen name="Kerja Praktek" component={HomePengajuanKP} />
      <Tab.Screen name="Skripsi" component={PengajuanSkripsi} />
    </Tab.Navigator>
  );
};

export default PengajuanTab;
