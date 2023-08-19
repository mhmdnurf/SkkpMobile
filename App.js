import React, {useEffect} from 'react';
import {StatusBar} from 'react-native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
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
import Icon from 'react-native-vector-icons/FontAwesome6';
import AddPengajuanKP from './src/mahasiswa/screens/pengajuan_kp/AddPengajuanKP';
import DetailPengajuanKP from './src/mahasiswa/screens/pengajuan_kp/DetailPengajuanKP';
import EditPengajuanKP from './src/mahasiswa/screens/pengajuan_kp/EditPengajuanKP';
import AddPengajuanSkripsi from './src/mahasiswa/screens/pengajuan_skripsi/AddPengajuanSkripsi';
import DetailPengajuanSkripsi from './src/mahasiswa/screens/pengajuan_skripsi/DetailPengajuanSkripsi';
import EditPengajuanSkripsi from './src/mahasiswa/screens/pengajuan_skripsi/EditPengajuanSkripsi';
import messaging from '@react-native-firebase/messaging';
const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const MainTabs = ({navigation}) => {
  useEffect(() => {
    messaging()
      .getToken()
      .then(token => {
        console.log(token);
      })
      .catch(error => {
        console.log('Error getting device token:', error);
      });

    messaging().setBackgroundMessageHandler(async remoteMessage => {
      console.log('Message handled in the background!', remoteMessage);
      navigation.navigate('Pengajuan');
      // Tambahkan logika di sini untuk menampilkan notifikasi atau melakukan tindakan sesuai kebutuhan Anda.
    });
  });

  return (
    <>
      <StatusBar backgroundColor="#99A98F" barStyle="light-content" />
      <Tab.Navigator
        initialRouteName="Home"
        screenOptions={{
          tabBarActiveTintColor: '#59C1BD',
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
              <Icon name="house-chimney" color={color} size={size} />
            ),
            headerShown: false,
          }}
        />

        <Tab.Screen
          name="Notifikasi"
          component={NotifikasiTab}
          options={{
            tabBarIcon: ({color, size}) => (
              <Icon name="envelope" color={color} size={size} />
            ),
          }}
        />
        <Tab.Screen
          name="Menu"
          component={Menu}
          options={{
            tabBarIcon: ({color, size}) => (
              <Icon name="list" color={color} size={size} />
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
        <Stack.Screen
          name="Pengajuan"
          component={PengajuanTab}
          options={{
            tabBarIcon: ({color, size}) => (
              <Icon name="hand-paper-o" color={color} size={size} />
            ),
            title: 'Pengajuan Proposal',
            headerStyle: {
              backgroundColor: '#59C1BD',
            },
            headerTintColor: 'white',
            headerShown: 'true',
          }}
        />
        <Stack.Screen
          name="Sidang"
          component={SidangTab}
          options={{
            tabBarIcon: ({color, size}) => (
              <Icon name="calendar-check-o" color={color} size={size} />
            ),
            title: 'Pendaftaran Sidang',
            headerStyle: {
              backgroundColor: '#59C1BD',
            },
            headerTintColor: 'white',
            headerShown: 'true',
          }}
        />
        <Stack.Screen
          name="AddPengajuanKP"
          component={AddPengajuanKP}
          options={{
            headerShown: true,
            title: 'Buat Pengajuan KP',
            headerStyle: {
              backgroundColor: '#59C1BD',
            },
            headerTintColor: 'white',
          }}
        />
        <Stack.Screen
          name="DetailPengajuanKP"
          component={DetailPengajuanKP}
          options={{
            headerShown: true,
            title: 'Detail Pengajuan Kerja Praktek',
            headerStyle: {
              backgroundColor: '#59C1BD',
            },
            headerTintColor: 'white',
          }}
        />
        <Stack.Screen
          name="EditPengajuanKP"
          component={EditPengajuanKP}
          options={{
            headerShown: true,
            title: 'Edit Pengajuan KP',
          }}
        />
        <Stack.Screen
          name="AddPengajuanSkripsi"
          component={AddPengajuanSkripsi}
          options={{
            headerShown: true,
            title: 'Buat Pengajuan Skripsi',
            headerStyle: {
              backgroundColor: '#59C1BD',
            },
            headerTintColor: 'white',
          }}
        />
        <Stack.Screen
          name="DetailPengajuanSkripsi"
          component={DetailPengajuanSkripsi}
          options={{headerShown: true, title: 'Detail Pengajuan Skripsi'}}
        />
        <Stack.Screen
          name="EditPengajuanSkripsi"
          component={EditPengajuanSkripsi}
          options={{headerShown: true, title: 'Edit Pengajuan Skripsi'}}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
