import { Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { useSetRecoilState, useRecoilValue, useRecoilState } from 'recoil';
import './App.css';

// Atoms
import { authState, userState, themeState } from './store/atoms';

// Components
// import ProtectedRoutes from './components/ProtectedRoutes';  // Temporarily commented
// import PublicRoute from './components/PublicRoute';          // Temporarily commented
import Navbar from './components/Navbar';
// import Footer from './components/Footer';

// Pages
// import Dashboard from './pages/Dashboard';
// import Gallery from './pages/Gallery';
import Generate from './pages/Generate';
// import Profile from './pages/Profile';
// import Settings from './pages/Settings';
// import Pricing from './pages/Pricing';
// import About from './pages/About';
import SignIn from './pages/SignIn';
// import SignUp from './pages/SignUp';
import Home from './pages/Home';
// import NotFound from './pages/NotFound';

function App() {
  const location = useLocation();
  const theme = useRecoilValue(themeState);
  const [auth, setAuth] = useRecoilState(authState);
  const setUser = useSetRecoilState(userState);

  const noHeaderPages = ['/signin', '/signup'];
  const noFooterPages = ['/signin', '/signup'];
  
  const shouldHideHeader = noHeaderPages.includes(location.pathname);
  const shouldHideFooter = noFooterPages.includes(location.pathname);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');
    
    if (token && userId) {
      setAuth({
        isAuthenticated: true,
        token,
        userId
      });

      fetch(`${import.meta.env.VITE_API_URL}/api/users/me`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      .then(res => res.json())
      .then(data => {
        if (!data.error) {
          setUser(data.data);
        }
      })
      .catch(console.error);
    }
  }, [setAuth, setUser]);

  return (
    <div className={theme}>
      <div className="min-h-screen bg-background">
        <div className="flex flex-col min-h-screen">
          {!shouldHideHeader && <Navbar />}
          <main className="flex-grow">
            <Routes>
              {/* Regular routes without protection */}
              <Route path="/" element={<Home />} />
              <Route path="/signin" element={<SignIn />} />
              {/* <Route path="/signup" element={<SignUp />} />
              <Route path="/about" element={<About />} />
              <Route path="/pricing" element={<Pricing />} /> */}
              
              {/* Temporarily removed protection */}
              {/* <Route path="/dashboard" element={<Dashboard />} /> */}
              <Route path="/generate" element={<Generate />} />
              {/* <Route path="/gallery" element={<Gallery />} /> */}
              {/* <Route path="/profile" element={<Profile />} /> */}
              {/* <Route path="/settings" element={<Settings />} /> */}
              
              {/* <Route path="*" element={<NotFound />} /> */}
            </Routes>
          </main>
          {/* {!shouldHideFooter && <Footer />} */}
        </div>
      </div>
    </div>
  );
}

export default App;
