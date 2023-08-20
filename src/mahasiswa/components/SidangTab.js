import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import React from 'react';
import HomeSidangKP from '../screens/sidang/sidang_kp/HomeSidangKP';
import HomeSempro from '../screens/sidang/sidang_sempro/HomeSempro';
import HomeKompre from '../screens/sidang/sidang_kompre/HomeKompre';
import HomeSkripsi from '../screens/sidang/sidang_skripsi/HomeSidangSkripsi';

const Tab = createMaterialTopTabNavigator();

const SidangTab = () => {
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
      <Tab.Screen name="Kerja Praktek" component={HomeSidangKP} />
      <Tab.Screen name="Seminar Proposal" component={HomeSempro} />
      <Tab.Screen name="Sidang Kompre" component={HomeKompre} />
      <Tab.Screen name="Sidang Skripsi" component={HomeSkripsi} />
    </Tab.Navigator>
  );
};

export default SidangTab;
