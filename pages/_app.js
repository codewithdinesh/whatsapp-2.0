import '../styles/globals.css'
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../firebase"
import Login from './login';
import Loading from '../components/Loading';
import { collection, addDoc, doc, setDoc, serverTimestamp } from "firebase/firestore";
import { useEffect } from 'react';
import { async } from '@firebase/util';

function MyApp({ Component, pageProps }) {

  const [user, loading] = useAuthState(auth);

  const saveInfo = async () => {

    if (user) {

      try {

        const userObj = {
          email: user.email,
          lastSeen: serverTimestamp(),
          photoURL: user.photoURL
        }

        // console.log("user",user)

        const userRef = doc(db, "users", user.uid);

        await setDoc(userRef, userObj, { merge: true });


      } catch (e) {
        console.error("Error");
      }
    }


  }

  useEffect(() => {
    saveInfo()

    return () => {
      console.log('');
    }
  }, [user]);


  if (loading) return <Loading />

  // if user is not logged in
  if (!user) return <Login />


  return <Component {...pageProps} />
}

export default MyApp
