import logo from './logo.svg';
import './App.css';
import firebase from "firebase/app";
import "firebase/auth";
import firebaseConfig from './firebaseConfig';
import { useState } from 'react';


firebase.initializeApp(firebaseConfig);

function App() {

  const googleProvider = new firebase.auth.GoogleAuthProvider();
  const fbProvider = new firebase.auth.FacebookAuthProvider();
  const [newUser, setNewUser] = useState(false);// Toggle User login or Create new User, 
  //SignIn State....
  const [user, setUser] = useState({
    isSignIn: false,
    name: '',
    email: '',
    password: '',
    photo: '',
    error: '',
    created: false
  });

  //SignIn Handler function..
  const handleSignIn = () => {
    firebase.auth()
      .signInWithPopup(googleProvider)
      .then(result => {
        const { displayName, email, photoURL } = result.user;
        const signedInUser = {
          isSignIn: true,
          name: displayName,
          email: email,
          photo: photoURL
        }
        setUser(signedInUser);
      })
      .catch((error) => {
        // Handle Errors here.
        console.log(error.code, error.message);
      });
  }


  const handleFbLogin = () => {
    firebase
      .auth()
      .signInWithPopup(fbProvider)
      .then((result) => {
        var credential = result.credential;

        // The signed-in user info.
        var user = result.user;

        // This gives you a Facebook Access Token. You can use it to access the Facebook API.
        var accessToken = credential.accessToken;
        // ...        
        console.log('facebook sign in:',user);
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


  //SignOut handle function...
  const handleSignOut = () => {
    firebase.auth().signOut()
      .then(result => {
        const signOutUser = {
          isSignIn: false,
          name: '',
          email: '',
          photo: ''
        }
        setUser(signOutUser);
      })
      .catch((error) => {
        // An error happened.
      });
  }

  const handleBlur = (event) => {
    // Input Validity check variable isFieldValid..
    let isFieldValid = true;
    if (event.target.name === 'email') {
      isFieldValid = /\S+@\S+\.\S+/.test(event.target.value);
    }
    if (event.target.name === 'password') {
      isFieldValid = /^[a-zA-Z0-9!@#$%^&*]{4,16}$/.test(event.target.value);
    }
    if (isFieldValid) {
      const newUserInfo = { ...user };
      newUserInfo[event.target.name] = event.target.value;
      setUser(newUserInfo);
    }
  }


  const handleSubmit = (event) => {
    if (newUser && user.email && user.password) {
      firebase.auth().createUserWithEmailAndPassword(user.email, user.password)
        .then(result => {
          // Signed in 
          const user = result.user;
          const newUserInfo = { ...user };
          newUserInfo.error = '';
          newUserInfo.created = true;
          setUser(newUserInfo);
          updateUserProfile(user.name);

        })
        .catch(error => {
          //Handle Error...
          const newUserInfo = { ...user };
          newUserInfo.error = error.message;
          newUserInfo.created = false;
          setUser(newUserInfo);
          // ..
        });
    }
    if (!newUser && user.email && user.password) {
      firebase.auth().signInWithEmailAndPassword(user.email, user.password)
        .then(res => {
          // Signed in
          var user = res.user;
          const newUserInfo = { ...user };
          newUserInfo.error = '';
          newUserInfo.created = true;
          setUser(newUserInfo);
          console.log('Updated user info', user);
        })
        .catch((error) => {
          const newUserInfo = { ...user };
          newUserInfo.error = error.message;
          newUserInfo.created = false;
          setUser(newUserInfo);
        });
    }
    event.preventDefault();
  }
  const updateUserProfile = name => {
    const user = firebase.auth().currentUser;

    user.updateProfile({
      displayName: name,
    })
      .then(() => {
        // Update successful.
        console.log('User Name Updated Successfully...');
      })
      .catch(error => {
        // An error happened.
        console.log(error);
      });
  }



  return (
    <div className="App">

      {user.isSignIn ? <button onClick={handleSignOut}>Sign Out</button> : <button onClick={handleSignIn}>Sign In</button>}
      <br />
      <button onClick={handleFbLogin}>Log In with FaceBook</button>
      {
        user.isSignIn &&
        <div>
          <h4>UserName : {user.name}</h4>
          <h4>User email: {user.email}</h4>
          <img src={user.photo} alt="" />
        </div>
      }
      <br /><hr />
      <h1>Our Own Authentication... system form</h1>
      <input type="checkbox" onChange={() => setNewUser(!newUser)} name="newUser" id="" />
      <label style={{ color: 'darkblue', fontSize: '18px' }} htmlFor="newUser">Create New User </label>

      <form onSubmit={handleSubmit}>
        {
          newUser && <input type="text" onBlur={handleBlur} name='name' required placeholder='name ' />
        } <br /><br />
        <input type="text" onBlur={handleBlur} name='email' required placeholder='Email ' /><br />
        <input type="password" onBlur={handleBlur} name='password' required placeholder='Password' /><br />
        <input type="submit" value={newUser ? 'Create Account' : 'Log In'} />
      </form>
      <p style={{ color: 'red' }}>{user.error}</p>
      {user.created && <p style={{ color: 'green' }}>New User {newUser ? 'Created' : 'Logged In'} Successfully</p>
      }
    </div>
  );
}

export default App;
