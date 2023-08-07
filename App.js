import React from 'react';
import {StatusBar} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import Splash from './src/screens/Splash';
import Login from './src/screens/Login';
import Register from './src/screens/Register';
import Home from './src/screens/Home';
import PengajuanTab from './src/mahasiswa/components/PengajuanTab';
import SidangTab from './src/mahasiswa/components/SidangTab';
import NotifikasiTab from './src/components/NotifikasiTab';
import Menu from './src/screens/Menu';
import Icon from 'react-native-vector-icons/FontAwesome';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const MainTabs = () => {
  return (
    <>
      <StatusBar backgroundColor="#99A98F" barStyle="light-content" />
      <Tab.Navigator
        initialRouteName="Home"
        screenOptions={{
          tabBarActiveTintColor: '#0A4D68',
          tabBarInactiveTintColor: 'gray',
          tabBarLabelStyle: {
            fontSize: 12,
          },
          tabBarStyle: {
            display: 'flex',
          },
        }}>
        <Tab.Screen
          name="Home"
          component={Home}
          options={{
            tabBarIcon: ({color, size}) => (
              <Icon name="home" color={color} size={size} />
            ),
          }}
        />
        <Tab.Screen
          name="Pengajuan"
          component={PengajuanTab}
          options={{
            tabBarIcon: ({color, size}) => (
              <Icon name="hand-paper-o" color={color} size={size} />
            ),
          }}
        />
        <Tab.Screen
          name="Sidang"
          component={SidangTab}
          options={{
            tabBarIcon: ({color, size}) => (
              <Icon name="calendar-check-o" color={color} size={size} />
            ),
          }}
        />
        <Tab.Screen
          name="Notifikasi"
          component={NotifikasiTab}
          options={{
            tabBarIcon: ({color, size}) => (
              <Icon name="bell-o" color={color} size={size} />
            ),
          }}
        />
        <Tab.Screen
          name="Menu dan Akun"
          component={Menu}
          options={{
            tabBarIcon: ({color, size}) => (
              <Icon name="th-list" color={color} size={size} />
            ),
          }}
        />
      </Tab.Navigator>
    </>
  );
};

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Splash"
        screenOptions={{
          tabBarActiveTintColor: '#30A2FF',
          headerShown: false,
          tabBarStyle: {
            backgroundColor: 'white',
          },
        }}>
        <Stack.Screen name="Splash" component={Splash} />
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Register" component={Register} />
        <Stack.Screen
          name="Homepage"
          component={MainTabs}
          options={{headerShown: false}}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
