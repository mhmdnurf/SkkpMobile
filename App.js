import React, {useEffect} from 'react';
import {StatusBar} from 'react-native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import Splash from './src/screens/Splash';
import Login from './src/screens/Login';
import Register from './src/screens/Register';
import PengajuanTab from './src/mahasiswa/components/PengajuanTab';
import SidangTab from './src/mahasiswa/components/SidangTab';
import Menu from './src/screens/Menu';
import Icon from 'react-native-vector-icons/FontAwesome6';
import DetailPengajuanSkripsi from './src/mahasiswa/screens/pengajuan/pengajuan_skripsi/DetailPengajuanSkripsi';
import EditPengajuanSkripsi from './src/mahasiswa/screens/pengajuan/pengajuan_skripsi/EditPengajuanSkripsi';
import AddSidangKP from './src/mahasiswa/screens/sidang/sidang_kp/AddSidangKP';
import DetailSidangKP from './src/mahasiswa/screens/sidang/sidang_kp/DetailSidangKP';
import messaging from '@react-native-firebase/messaging';
import EditSidangKP from './src/mahasiswa/screens/sidang/sidang_kp/EditSidangKP';
import AddSempro from './src/mahasiswa/screens/sidang/sidang_sempro/AddSempro';
import DetailSempro from './src/mahasiswa/screens/sidang/sidang_sempro/DetailSempro';
import EditSempro from './src/mahasiswa/screens/sidang/sidang_sempro/EditSempro';
import DetailKompre from './src/mahasiswa/screens/sidang/sidang_kompre/DetailKompre';
import EditKompre from './src/mahasiswa/screens/sidang/sidang_kompre/EditKompre';
import DetailSidangSkripsi from './src/mahasiswa/screens/sidang/sidang_skripsi/DetailSidangSkripsi';
import EditSidangSkripsi from './src/mahasiswa/screens/sidang/sidang_skripsi/EditSidangSkripsi';
import AddKompre from './src/mahasiswa/screens/sidang/sidang_kompre/AddKompre';
import AddSidangSkripsi from './src/mahasiswa/screens/sidang/sidang_skripsi/AddSidangSkripsi';
import Dashboard from './src/screens/Dashboard';
import MenuKP from './src/screens/MenuKP';
import HomePengajuanKP from './src/mahasiswa/screens/pengajuan/pengajuan_kp/HomePengajuanKP';
import DetailPengajuanKP from './src/mahasiswa/screens/pengajuan/pengajuan_kp/DetailPengajuanKP';
import CreatePengajuanKP from './src/mahasiswa/screens/pengajuan/pengajuan_kp/CreatePengajuanKP';
import EditPengajuanKP from './src/mahasiswa/screens/pengajuan/pengajuan_kp/EditPengajuanKP';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import MenuSkripsi from './src/screens/MenuSkripsi';
import HomePengajuanSkripsi from './src/mahasiswa/screens/pengajuan/pengajuan_skripsi/HomePengajuanSkripsi';
import CreatePengajuanSkripsi from './src/mahasiswa/screens/pengajuan/pengajuan_skripsi/CreatePengajuanSkripsi';
import HomeSidangKP from './src/mahasiswa/screens/sidang/sidang_kp/HomeSidangKP';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const MainTabs = ({navigation}) => {
  useEffect(() => {
    messaging()
      .getToken()
      .then(async token => {
        console.log(token);

        const user = auth().currentUser;
        if (user) {
          const userDocRef = firestore().collection('users').doc(user.uid);
          await userDocRef.update({registrationToken: token});
          console.log('Registration token updated in Firestore');
        } else {
          console.log('No user is currently logged in');
        }
      })
      .catch(error => {
        console.log('Error getting device token:', error);
      });

    messaging().setBackgroundMessageHandler(async remoteMessage => {
      console.log('Message handled in the background!', remoteMessage);
      navigation.navigate('Pengajuan');
    });
  }, [navigation]);

  return (
    <>
      <StatusBar backgroundColor="#176B87" barStyle="light-content" />
      <Tab.Navigator
        initialRouteName="Home"
        screenOptions={{
          tabBarActiveTintColor: '#176B87',
          tabBarInactiveTintColor: 'gray',
          tabBarLabelStyle: {
            fontSize: 14,
          },
          tabBarStyle: {
            height: 60,
          },
        }}>
        <Tab.Screen
          name="Home"
          component={Dashboard}
          options={{
            tabBarIcon: ({color, size}) => (
              <Icon name="house-chimney" color={color} size={size} />
            ),
            headerShown: false,
          }}
        />
        <Tab.Screen
          name="Menu"
          component={Menu}
          options={{
            tabBarIcon: ({color, size}) => (
              <Icon name="list" color={color} size={size} />
            ),
            headerStyle: {
              backgroundColor: '#C5DFF8',
            },
            headerShown: false,
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
          tabBarActiveTintColor: '#7895CB',
          headerShown: false,
          tabBarStyle: {
            backgroundColor: 'white',
          },
        }}>
        <Stack.Screen name="Splash" component={Splash} />
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Register" component={Register} />
        <Stack.Screen name="Dashboard" component={Dashboard} />
        {/* Sidang Sempro */}
        <Stack.Screen
          name="AddSempro"
          component={AddSempro}
          options={{
            headerShown: true,
            title: 'Daftar Sidang Sempro',
            headerStyle: {
              backgroundColor: '#7895CB',
            },
            headerTintColor: 'white',
          }}
        />
        <Stack.Screen
          name="DetailSempro"
          component={DetailSempro}
          options={{
            headerShown: true,
            title: 'Detail Sidang Sempro',
            headerStyle: {
              backgroundColor: '#7895CB',
            },
            headerTintColor: 'white',
          }}
        />
        <Stack.Screen
          name="EditSempro"
          component={EditSempro}
          options={{
            headerShown: true,
            title: 'Edit Sidang Sempro',
            headerStyle: {
              backgroundColor: '#7895CB',
            },
            headerTintColor: 'white',
          }}
        />
        {/* Sidang Kompre */}
        <Stack.Screen
          name="AddKompre"
          component={AddKompre}
          options={{
            headerShown: true,
            title: 'Daftar Sidang Komprehensif',
            headerStyle: {
              backgroundColor: '#7895CB',
            },
            headerTintColor: 'white',
          }}
        />
        <Stack.Screen
          name="DetailKompre"
          component={DetailKompre}
          options={{
            headerShown: true,
            title: 'Detail Sidang Komprehensif',
            headerStyle: {
              backgroundColor: '#7895CB',
            },
            headerTintColor: 'white',
          }}
        />
        <Stack.Screen
          name="EditKompre"
          component={EditKompre}
          options={{
            headerShown: true,
            title: 'Edit Sidang Komprehensif',
            headerStyle: {
              backgroundColor: '#7895CB',
            },
            headerTintColor: 'white',
          }}
        />

        {/* Sidang Skripsi */}
        <Stack.Screen
          name="AddSidangSkripsi"
          component={AddSidangSkripsi}
          options={{
            headerShown: true,
            title: 'Daftar Sidang Skripsi',
            headerStyle: {
              backgroundColor: '#7895CB',
            },
            headerTintColor: 'white',
          }}
        />
        <Stack.Screen
          name="DetailSidangSkripsi"
          component={DetailSidangSkripsi}
          options={{
            headerShown: true,
            title: 'Detail Sidang Skripsi',
            headerStyle: {
              backgroundColor: '#7895CB',
            },
            headerTintColor: 'white',
          }}
        />
        <Stack.Screen
          name="EditSidangSkripsi"
          component={EditSidangSkripsi}
          options={{
            headerShown: true,
            title: 'Edit Sidang Skripsi',
            headerStyle: {
              backgroundColor: '#7895CB',
            },
            headerTintColor: 'white',
          }}
        />
        {/* KP Screen Start*/}
        <Stack.Screen
          name="MenuKP"
          component={MenuKP}
          options={{
            headerShown: true,
            title: '',
          }}
        />
        <Stack.Screen
          name="HomePengajuanKP"
          component={HomePengajuanKP}
          options={{
            headerShown: true,
            title: '',
            headerStyle: {
              backgroundColor: '#176B87',
            },
            headerTintColor: 'white',
          }}
        />
        <Stack.Screen
          name="CreatePengajuanKP"
          component={CreatePengajuanKP}
          options={{
            headerShown: true,
            title: 'Buat Pengajuan KP',
            headerStyle: {
              backgroundColor: 'white',
            },
            headerTintColor: '#176B87',
            headerTitle: '',
          }}
        />
        <Stack.Screen
          name="DetailPengajuanKP"
          component={DetailPengajuanKP}
          options={{
            headerShown: true,
            title: '',
            headerStyle: {
              backgroundColor: 'white',
            },
            headerTintColor: '#176B87',
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
          name="HomeSidangKP"
          component={HomeSidangKP}
          options={{
            headerShown: true,
            title: '',
            headerStyle: {
              backgroundColor: '#176B87',
            },
            headerTintColor: 'white',
          }}
        />
        <Stack.Screen
          name="AddSidangKP"
          component={AddSidangKP}
          options={{
            headerShown: true,
            title: 'Daftar Sidang KP',
            headerStyle: {
              backgroundColor: '#7895CB',
            },
            headerTintColor: 'white',
          }}
        />
        <Stack.Screen
          name="DetailSidangKP"
          component={DetailSidangKP}
          options={{
            headerShown: true,
            title: 'Detail Sidang KP',
            headerStyle: {
              backgroundColor: '#7895CB',
            },
            headerTintColor: 'white',
          }}
        />
        <Stack.Screen
          name="EditSidangKP"
          component={EditSidangKP}
          options={{
            headerShown: true,
            title: 'Edit Sidang KP',
            headerStyle: {
              backgroundColor: '#7895CB',
            },
            headerTintColor: 'white',
          }}
        />
        {/* KP Screen End */}
        <Stack.Screen
          name="MenuSkripsi"
          component={MenuSkripsi}
          options={{
            headerShown: true,
            title: '',
          }}
        />
        <Stack.Screen
          name="HomePengajuanSkripsi"
          component={HomePengajuanSkripsi}
          options={{
            headerShown: true,
            title: '',
            headerStyle: {
              backgroundColor: '#176B87',
            },
            headerTintColor: 'white',
          }}
        />
        <Stack.Screen
          name="CreatePengajuanSkripsi"
          component={CreatePengajuanSkripsi}
          options={{
            headerShown: true,
            title: '',
            headerStyle: {
              backgroundColor: '#176B87',
            },
            headerTintColor: 'white',
          }}
        />
        <Stack.Screen
          name="DetailPengajuanSkripsi"
          component={DetailPengajuanSkripsi}
          options={{
            headerShown: true,
            title: 'Detail Pengajuan Skripsi',
            headerStyle: {
              backgroundColor: '#7895CB',
            },
            headerTintColor: 'white',
          }}
        />
        <Stack.Screen
          name="EditPengajuanSkripsi"
          component={EditPengajuanSkripsi}
          options={{
            headerShown: true,
            title: 'Edit Pengajuan Skripsi',
            headerStyle: {
              backgroundColor: '#7895CB',
            },
            headerTintColor: 'white',
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
