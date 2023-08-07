import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import React from 'react';
import PengajuanKP from '../screens/PengajuanKP';
import PengajuanSkripsi from '../screens/PengajuanSkripsi';

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
      }}>
      <Tab.Screen name="Kerja Praktek" component={PengajuanKP} />
      <Tab.Screen name="Skripsi" component={PengajuanSkripsi} />
    </Tab.Navigator>
  );
};

export default PengajuanTab;
