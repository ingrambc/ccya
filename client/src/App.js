import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Home from "./pages/Home";
import Teams from "./pages/Teams";
import Register from "./pages/Register";
import LoginPage from "./pages/Login";
import Signup from "./pages/Signup"
import Members from "./pages/Members";
import Navbar from "./components/Nav/Nav";
import Calendar from "./components/Calendar";
import Contact from "./pages/Contact";
import './App.css';
import UserContext from "./utils/UserContext";
import API from "./utils/API"
import { dateFnsLocalizer } from 'react-big-calendar';

const App = () => {
  const [userData, setUserData] = useState({
    firstname: '',
    lastname: '',
    email: '',
    username: '',
    password: '',
  });
  const [childData, setChildData] = useState({
    name: "",
    childDoB: "",
    address: "",
  })
  const [loggedIn, setLoggedin] = useState(false);
  const [user, setUser] = useState(null);
  const [failureMessage, setFailureMessage] = useState(null);

  useEffect(() => {
    console.log(user);
  isLoggedIn();
  // eslint-disable-next-line
  }, [user, setUser]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setUserData({ ...userData, [name]: value });
  };

  const handleChildInputChange = (event) => {
    const { name, value } = event.target;
    setChildData({ ...childData, [name]: value });
  };

  const handleLogin = (event) => {
    event.preventDefault();
    const data = {
      username: userData.username,
      password: userData.password,
    };
    if (userData.username && userData.password) {
      API.login(data)
        .then((user) => {
          if (user.data.loggedIn) {
            console.log("handleLog user", user);
            setLoggedin(true);
            setUser(user.data.user);
            console.log('log in successful');
            window.location.href = '/members';
          } else {
            console.log('Something went wrong :(');
            alert('Login failed, Please try again.');
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  const handleSignup = (event) => {
    event.preventDefault();
    try {
      const data = {
        firstname: userData.firstname,
        lastname: userData.lastname,
        email: userData.email,
        username: userData.username,
        password: userData.password,
      };

      if (userData.username && userData.password) {
        API.signup(data)
          .then((user) => {
            if (user.data === 'email is already in use') {
              alert('Email already in use.');
            }
            if (user.data.loggedIn) {
              if (user.data.loggedIn) {
                setLoggedin(true);
                setUser(user.data.user);
                console.log('log in successful');
                window.location.href = '/members';
              } else {
                console.log('something went wrong :(');
                console.log(user.data);
                setFailureMessage(user.data);
              }
            }
          })
          .catch((error) => {
            console.log(error);
          });
      }
    } catch (error) {
      console.log('App -> error', error);
    }
  };

  const handleAddChild = (event) => {
    event.preventDefault();
    try {
      const data = {
        childName: childData.childName,
        address: childData.address,
        childDoB: childData.childDoB,
      };

      console.log("handle data", data);
    
      if (childData.childName) {
        API.addChild(data)
          .then((user) => {
            if (loggedIn) {
              if (loggedIn) {
                setLoggedin(true);
                setUser(user.data.user);
                console.log(user.data.user);
                window.location.href = '/members';
              } else {
                console.log('something went wrong :(');
                console.log(user.data);
                setFailureMessage(user.data);
              }
            }
          })
          .catch((error) => {
            console.log(error);
          });
      }
    } catch (error) {
      console.log('App -> error', error);
    }

  }

  const handleRemoveChild = (event) => {
    console.log("entered handleRemoveChild");
  }

  const isLoggedIn = () => {
    if (!loggedIn) {
      API.isLoggedIn().then((user) => {
        if (user.data.loggedIn) {
          setLoggedin(true);
          setUser(user.data.user);
        } else {
          console.log(user.data.message);
        }
      });
    }
  };

  const logout = () => {
    if (loggedIn) {
      API.logout().then(() => {
        console.log('logged out successfully');
        setLoggedin(false);
        setUser(null);
      });
    }
  };

  const contextValue = {
    userData,
    loggedIn,
    user,
    failureMessage,
    childData,
    handleInputChange,
    handleLogin,
    handleSignup,
    handleAddChild,
    handleRemoveChild,
    handleChildInputChange,
    logout,
  };

    return (
      <UserContext.Provider value={contextValue}>
      <Router>
          <Navbar />
            <Switch>
              <Route path="/calendar" component={Calendar} />
              <Route path="/members" component={Members} />
              <Route path="/register" component={Register} />
              <Route path="/login" render={() => <LoginPage />}/>
              <Route path="/signup" render={() => <Signup />}/>
              <Route path="/teams" component={Teams} />
              <Route path="/contact" component={Contact} />
              <Route path="/" component={Home} />
            </Switch>
      </Router>
      </UserContext.Provider>
    );
}

export default App;