import { Route, Routes } from "react-router-dom";
import Home from "./Home";

const App = function () {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
    </Routes>
  );
};

export default App;
