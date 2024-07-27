import './App.css';
import Categories from './containers/Categories/Categories';
import {Route, Routes} from 'react-router-dom';
import MainPage from './containers/Transactions/MainPage';
import Navbar from './components/NavBar/NavBar';
import TransactionModal from './components/Transactions/TransactionModal';
import {useState} from 'react';

const App = () => {
  const [showModal, setShowModal] = useState(false);

  const handleAddTransaction = () => {
    setShowModal(true);
  };

  return (
    <div>
      <Navbar onAddTransaction={handleAddTransaction}/>
      <Routes>
        <Route path="/" element={<MainPage/>}/>
        <Route path="/categories" element={<Categories/>}/>
      </Routes>
      {showModal && (
        <TransactionModal
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
};

export default App;
