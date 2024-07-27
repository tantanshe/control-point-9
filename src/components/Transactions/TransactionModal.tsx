import React, {useEffect, useState} from 'react';
import {useAppDispatch, useAppSelector} from '../../app/hooks';
import {
  addTransaction,
  editTransaction,
  fetchTransactions,
  selectIsTransactionsLoading
} from '../../store/transactionsSlice';
import {fetchCategories, selectCategories, selectIsCategoriesLoading} from '../../store/categoriesSlice';
import {AppDispatch} from '../../app/store';

interface TransactionModalProps {
  currentTransaction?: {
    id: string;
    type: 'income' | 'expense';
    category: string;
    amount: number;
    createdAt: string;
  };
  onClose: () => void;
}

const TransactionModal: React.FC<TransactionModalProps> = ({currentTransaction, onClose}) => {
  const [transaction, setTransaction] = useState({
    category: currentTransaction?.category || '',
    amount: currentTransaction?.amount || 0,
    type: currentTransaction?.type || 'income',
  });

  const dispatch: AppDispatch = useAppDispatch();
  const categories = useAppSelector(selectCategories);
  const isTransactionsLoading = useAppSelector(selectIsTransactionsLoading);
  const isCategoriesLoading = useAppSelector(selectIsCategoriesLoading);

  useEffect(() => {
    dispatch(fetchTransactions());
    dispatch(fetchCategories());
  }, [dispatch, categories.length]);

  useEffect(() => {
    if (currentTransaction) {
      setTransaction({
        category: currentTransaction.category,
        amount: currentTransaction.amount,
        type: currentTransaction.type,
      });
    }
  }, [currentTransaction]);

  const onFieldChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const {name, value} = event.target;
    setTransaction(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newTransaction = currentTransaction?.id
      ? {...transaction, createdAt: currentTransaction.createdAt}
      : {...transaction, createdAt: new Date().toISOString()};
    if (currentTransaction?.id) {
      dispatch(editTransaction({id: currentTransaction.id, updatedTransaction: newTransaction}));
    } else {
      dispatch(addTransaction(newTransaction));
    }
    onClose();
    dispatch(fetchTransactions());
  };

  const filteredCategories = categories.filter(
    category => category.type === transaction.type
  );

  return (
    <>
      <div className="modal-backdrop fade show"></div>
      <div className="modal show" style={{display: 'block'}}>
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header d-flex justify-content-between">
              <h5 className="modal-title">
                {currentTransaction ? 'Edit Transaction' : 'Add Transaction'}
              </h5>
              <button type="button" className="close" onClick={onClose}>
                <span>✖</span>
              </button>
            </div>
            <div className="modal-body">
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label htmlFor="transactionType">Type</label>
                  <select
                    className="form-control"
                    id="transactionType"
                    name="type"
                    value={transaction.type}
                    onChange={onFieldChange}
                    required
                  >
                    <option value="income">Income</option>
                    <option value="expense">Expense</option>
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="transactionCategory">Category</label>
                  <select
                    className="form-control"
                    id="transactionCategory"
                    name="category"
                    value={transaction.category}
                    onChange={onFieldChange}
                    required
                  >
                    <option value="">Select a category</option>
                    {filteredCategories.map(category => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="transactionAmount">Amount</label>
                  <input
                    type="number"
                    className="form-control"
                    id="transactionAmount"
                    name="amount"
                    value={transaction.amount}
                    onChange={onFieldChange}
                    required
                  />
                </div>
                <div className="modal-footer">
                  <button type="submit" className="btn btn-primary"
                          disabled={isTransactionsLoading || isCategoriesLoading}>
                    Save
                  </button>
                  <button type="button" className="btn btn-secondary" onClick={onClose}>
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default TransactionModal;
