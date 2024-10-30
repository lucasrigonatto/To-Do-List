import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./Home"; // Supondo que você tenha um componente Home
import ToDoList from "./ToDoList";
import NotFound from "./NotFound"; // Crie um componente NotFound para a página 404 (opcional)

function App() {
  return (
    <Router basename="/To-Do-List">
      {" "}
      {/* basename é o nome do seu repositório */}
      <Routes>
        <Route path="/" element={<ToDoList />} />
        <Route path="*" element={<NotFound />} /> {/* Rota para 404 */}
      </Routes>
    </Router>
  );
}

export default App;
