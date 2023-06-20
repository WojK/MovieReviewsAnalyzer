import { Route, Routes } from "react-router-dom";
import Navbar from "./Navbar";
import ModelsPage from "./pages/ModelsPage";
import CsvPage from "./pages/CsvPage";
import HomePage from "./pages/HomePage";

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/models" element={<ModelsPage />} />
        <Route path="/csv" element={<CsvPage />} />
      </Routes>
    </>
  );
}

export default App;
