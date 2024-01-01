import React from 'react';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
const useUserInfo = () => {
  const [username, setUsername] = React.useState('');
  React.useEffect(() => {
    const unsubscribe = auth().onAuthStateChanged(user => {
      if (user) {
        const userUid = user.uid;
        const userRef = firestore().collection('users').doc(userUid);

        const unsubscribeSnapshot = userRef.onSnapshot(
          doc => {
            if (doc.exists) {
              const userData = doc.data();
              const nama = userData.nama;
              setUsername(nama);
            } else {
              console.log('No such document!');
            }
          },
          error => {
            console.log('Error fetching document:', error);
          },
        );

        return () => {
          unsubscribeSnapshot();
        };
      } else {
        setUsername('');
      }
    });
    return () => {
      unsubscribe();
    };
  }, []);
  return username;
};

export default useUserInfo;
