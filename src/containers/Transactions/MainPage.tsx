import React, {useEffect, useState} from 'react';
import {useAppDispatch, useAppSelector} from '../../app/hooks';
import {deleteTransaction, fetchTransactions, selectTransactions} from '../../store/transactionsSlice';
import {fetchCategories, selectCategories} from '../../store/categoriesSlice';
import TransactionModal from '../../components/Transactions/TransactionModal';
import dayjs from 'dayjs';

const MainPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const transactions = useAppSelector(selectTransactions);
  const categories = useAppSelector(selectCategories);
  const [showModal, setShowModal] = useState(false);
  const [editingTransaction, setEditingTransaction] = React.useState<{
    id: string;
    type: string;
    category: string;
    amount: number;
    createdAt: string;
  } | null>(null);

  useEffect(() => {
    dispatch(fetchTransactions());
    dispatch(fetchCategories());
  }, [dispatch]);


  const totalAmount = transactions.reduce((acc, transaction) => {
    const category = categories.find(cat => cat.id === transaction.category);
    const amount = parseFloat(transaction.amount);
    if (category) {
      return acc + (category.type === 'income' ? amount : -amount);
    } else {
      return acc;
    }
  }, 0);


  const handleEdit = (transaction: typeof editingTransaction) => {
    setEditingTransaction(transaction);
    setShowModal(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this transaction?')) {
      dispatch(deleteTransaction(id));
    }
  };

  const sortedTransactions = [...transactions].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <a className="navbar-brand" href="#">
          My transactions
        </a>
        <button className="btn btn-primary ml-auto" onClick={() => setShowModal(true)}>
          Add Transaction
        </button>
      </nav>

      <div className="container mt-4">
        <div className="row mb-3">
          <div className="col">
            <h2>Total: {totalAmount} KGS</h2>
          </div>
        </div>

        <div className="row">
          <div className="col">
            <ul className="list-group">
              {sortedTransactions.map(transaction => {
                const category = categories.find(cat => cat.id === transaction.category);
                const sign = category?.type === 'income' ? '+' : '-';
                return (
                  <li key={transaction.id}
                      className="list-group-item d-flex justify-content-between align-items-center">
                    <div className="d-flex align-items-center justify-content-between gap-5">
                      <div>Date: {dayjs(transaction.createdAt).format('DD.MM.YYYY HH:mm:ss')}</div>
                      <div>Category: {category?.name}</div>
                    </div>
                    <div className="d-flex align-items-center justify-content-between">
                      <div
                        className={`${category?.type === 'income' ? 'text-success' : 'text-danger'} me-5`}> {sign}{transaction.amount} KGS
                      </div>
                      <button className="btn btn-primary me-3" onClick={() => handleEdit(transaction)}>
                        Edit
                      </button>
                      <button className="btn btn-danger me-3" onClick={() => handleDelete(transaction.id)}>
                        Delete
                      </button>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>

        {showModal && (
          <TransactionModal
            currentTransaction={editingTransaction || undefined}
            onClose={() => {
              setEditingTransaction(null);
              setShowModal(false);
            }}
          />
        )}
      </div>
    </>
  );
};

export default MainPage;