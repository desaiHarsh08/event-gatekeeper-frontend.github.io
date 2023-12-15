import {
  HashRouter as Router,
  Routes,
  Route
} from "react-router-dom"
import Home from "./components/Home";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";


function App() {
  return (
    <>
      <Router >
        <div className="sm:h-screen sm:overflow-y-hidden">

        
        <Navbar />
        <Routes>
          <Route exact path="/" element={<Home />} />
          {/* <Route exact path="/about" element={<About />} />
          <Route exact path="/settings" element={<Settings />} /> */}
        </Routes>
        <Footer />
      </div>
      </Router>
    </>
  );
}

export default App;
