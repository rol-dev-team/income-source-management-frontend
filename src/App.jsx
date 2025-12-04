import { useState, createContext, useEffect,useContext } from "react";
import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes";

export const AuthContext = createContext();

const App = () => {
  const [user, setUser] = useState(null);
  // const { setUser } = useContext(AuthContext);
  useEffect(() => {
    const storedUser = localStorage.getItem("info");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);
  return (
    <AuthContext.Provider value={{ user, setUser }}>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthContext.Provider>
  );
};

export default App;
