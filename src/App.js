import { Provider } from 'react-redux';
import './App.css';
import TableNews from './components/TableNews';
import ItemDetails from './components/ItemDetails';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { store } from './redux/store';

function App() {
  return (
    <Provider store={store}>
      <Router>
        <Routes>
          <Route path="/" element={<TableNews />} />
        </Routes>
      </Router>
    </Provider>
  );
}

export default App;
