import { useEffect, useState } from 'react';
import './App.css';
import { Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import Loading from './components/Loading.jsx';
import Home from './components/Home.jsx';
import Signup from './components/Signup.jsx';
import Login from './components/Login.jsx';
import About from './components/About.jsx';
import Contact from './components/Contact.jsx';
import Authors from './components/Authors.jsx';
import Books from './components/Books.jsx';
import Users from './components/Users.jsx';
import Bookstores from './components/Bookstores.jsx';

function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 3000); 
  }, []);

  return (
    <>
 
      <Navbar />
      {loading ? (
        <Loading />
      ) : (
        <Routes>
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/home" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/author" element={<Authors />} />
          <Route path="/books" element={<Books />} />
          <Route path="/users" element={<Users />} />
          <Route path="/bookstores" element={<Bookstores />} />
        </Routes>
      )}

    </>
  );
}

export default App;
