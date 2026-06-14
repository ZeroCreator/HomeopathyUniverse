import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { HomePage } from './pages/HomePage';
import { ElementPage } from './pages/ElementPage';

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/cell/:period/:column" element={<ElementPage />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
