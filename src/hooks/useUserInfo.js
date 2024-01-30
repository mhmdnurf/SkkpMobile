import React from 'react';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

const useUserInfo = () => {
  const [username, setUsername] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(true);

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
              setIsLoading(false); // Set loading to false after fetching data
            } else {
              console.log('No such document!');
              setIsLoading(false); // Set loading to false if document doesn't exist
            }
          },
          error => {
            console.log('Error fetching document:', error);
            setIsLoading(false); // Set loading to false if there's an error
          },
        );

        return () => {
          unsubscribeSnapshot();
        };
      } else {
        setUsername('');
        setIsLoading(false); // Set loading to false if user is not authenticated
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return {username, isLoading}; // Return both username and isLoading
};

export default useUserInfo;
