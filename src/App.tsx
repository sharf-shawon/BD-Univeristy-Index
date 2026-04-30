/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import UniversityList from "./pages/UniversityList";
import UniversityDetail from "./pages/UniversityDetail";
import About from "./pages/About";
import ApiDocs from "./pages/ApiDocs";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/universities" element={<UniversityList />} />
        <Route path="/about" element={<About />} />
        <Route path="/api-docs" element={<ApiDocs />} />
        <Route path="/universities/:slug" element={<UniversityDetail />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

