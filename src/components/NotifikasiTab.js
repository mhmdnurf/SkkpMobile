import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import React from 'react';
import About from '../screens/About';
import Info from '../screens/Info';
import Splash from '../screens/Splash';

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
      <Tab.Screen name="Pengajuan" component={About} />
      <Tab.Screen name="Sidang" component={Splash} />
    </Tab.Navigator>
  );
};

export default PengajuanTab;
