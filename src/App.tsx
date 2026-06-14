import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { HomePage } from './pages/HomePage';
import { ElementPage } from './pages/ElementPage';
import { RowPage } from './pages/RowPage';
import { ColumnPage } from './pages/ColumnPage';

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/cell/:period/:column" element={<ElementPage />} />
          <Route path="/row/:period" element={<RowPage />} />
          <Route path="/column/:id" element={<ColumnPage />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
