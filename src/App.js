import './App.css';
import Header from './components/header/header'
import Footer from './components/footer/footer'
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import About from "./components/about/about";
import Shop from "./components/shop/shop";
import Blog from "./components/blog/blog";
import Register from "./components/register/register";
import Cart from "./components/cart/cart";
import ContactPage from "./components/contact/contact";


function App() {
  return (
    <div className="App">

      <Router>
        <Header />
        <Routes>
          <Route path="/" element={<About />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/register" element={<Register />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/contact" element={<ContactPage />} />

        </Routes>
        <Footer />

      </Router>
    </div>
  );
}

export default App;
