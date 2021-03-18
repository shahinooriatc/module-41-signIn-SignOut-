import logo from './logo.svg';
import './App.css';
import firebase from "firebase/app";
import "firebase/auth";
import firebaseConfig from './firebaseConfig';
import { useState } from 'react';


firebase.initializeApp(firebaseConfig);

function App() {

  const provider = new firebase.auth.GoogleAuthProvider();
  const [user, setUser] = useState({
    isSignIn: false,
    name: '',
    mail: '',
    photo: ''
  });

  const handleSignIn = () => {
    // console.log('handle working by click');
    firebase.auth()
      .signInWithPopup(provider)
      .then(result => {
        const userData = result.user;
        const { displayName, email, photoURL } = userData;
        const signedInUser = {
          isSignIn: true,
          name: displayName,
          mail: email,
          photo: photoURL
        }
        setUser(signedInUser);
      })
      .catch((error) => {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        // The email of the user's account used.
        var email = error.email;
        // The firebase.auth.AuthCredential type that was used.
        var credential = error.credential;
        // ...
      });
  }


  const handleSignOut = () => {
    firebase.auth().signOut()
      .then(result => {
        const signOutUser = {
          isSignIn:false,
          name:'',
          mail:'',
          photo:''
        }
        setUser(signOutUser);
        console.log('Successfully SIgned Out...');
        
        // Sign-out successful.
      }).catch((error) => {
        // An error happened.
      });
  }


  return (
    <div className="App">

      {user.isSignIn ? <button onClick={handleSignOut}>Sign Out</button> : <button onClick={handleSignIn}>Sign In</button>}
      {
        user.isSignIn &&
        <div>
          <h4>userName : {user.name}</h4>
          <h4>user email: {user.mail}</h4>
          <img src={user.photo} alt="" />
        </div>
      }
    </div>
  );
}

export default App;
