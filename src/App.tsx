import './App.css';
import Categories from './containers/Categories/Categories';
import {Route, Routes} from 'react-router-dom';
import MainPage from './containers/Transactions/MainPage';

const App = () => {

  return (
    <div>
        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="/categories" element={<Categories />} />
        </Routes>
    </div>
  );
};

export default App;
