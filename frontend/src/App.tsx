import { Route, Routes } from "react-router-dom";
import "./App.css";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";

function App() {
  return (
    <main>
      <Routes>
        <Route path="/">
          <Route index element={<Home />} />
          <Route path="login" element={<Login />} />
          <Route path="signup" element={<Signup />} />
        </Route>
      </Routes>
    </main>
    // <div>
    //   <nav>
    //     <Link to="/login">Login</Link>
    //     <Link to="/signup">Signup</Link>
    //     <Link to="/home">Home</Link>
    //   </nav>
    //   <Outlet />
    // </div>
  );
}

export default App;
