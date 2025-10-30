import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Home from './pages/Home';

export default function App() {
    return (
        <>
            <Header />
            <Routes>
                <Route path="/loldle-like" element={<Home />} />
            </Routes>
        </>
    );
}
