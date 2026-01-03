import { Route, Routes } from "react-router";
import ProjectLayout from "./ui/ProjectLayout";
import MainPage from "./pages/MainPage";

const App = () => {
  return (
    <Routes>
      <Route element={<ProjectLayout />}>
        <Route index element={<MainPage />} />
        <Route path="contact" element={<Contact />} />
      </Route>
    </Routes>
  );
};
export default App;
