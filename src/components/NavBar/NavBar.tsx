import React from 'react';
import {Link} from 'react-router-dom';

interface NavbarProps {
  onAddTransaction: () => void;
}

const Navbar: React.FC<NavbarProps> = ({onAddTransaction}) => {
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light p-3">
      <Link className="navbar-brand" to="/">
        My Transactions
      </Link>
      <div className="collapse navbar-collapse d-flex justify-content-end">
        <ul className="navbar-nav mr-auto">
          <li className="nav-item me-5">
            <Link className="nav-link border border-2 rounded-pill border-primary ps-3 pe-3" to="/categories">
              Categories
            </Link>
          </li>
        </ul>
        <button className="btn btn-primary ml-auto" onClick={onAddTransaction}>
          Add Transaction
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
