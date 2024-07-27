import React, {useEffect, useState} from 'react';
import {useAppDispatch, useAppSelector} from '../../app/hooks';
import {addCategory, editCategory, fetchCategories, selectIsCategoriesLoading} from '../../store/categoriesSlice';
import {AppDispatch} from '../../app/store';

interface CategoryModalProps {
  currentCategory?: {
    id: string;
    type: 'income' | 'expense';
    name: string;
  };
  onClose: () => void;
}

const CategoryModal: React.FC<CategoryModalProps> = ({currentCategory, onClose}) => {
  const [category, setCategory] = useState({
    name: currentCategory?.name || '',
    type: currentCategory?.type || 'income',
  });

  const dispatch: AppDispatch = useAppDispatch();
  const isLoading = useAppSelector(selectIsCategoriesLoading);

  useEffect(() => {
    if (currentCategory) {
      setCategory({
        name: currentCategory.name,
        type: currentCategory.type,
      });
    }
  }, [currentCategory]);

  const onFieldChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const {name, value} = event.target;
    setCategory(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentCategory?.id) {
      dispatch(editCategory({id: currentCategory.id, updatedCategory: category}));
    } else {
      dispatch(addCategory(category));
    }
    onClose();
    dispatch(fetchCategories());
  };

  return (
    <>
      <div className="modal-backdrop fade show"></div>
      <div className="modal show" style={{display: 'block'}}>
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header d-flex justify-content-between">
              <h5 className="modal-title">{currentCategory ? 'Edit Category' : 'Add Category'}</h5>
              <button type="button" className="close" onClick={onClose}>
                <span>✖</span>
              </button>
            </div>
            <div className="modal-body">
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label htmlFor="categoryName">Name</label>
                  <input
                    type="text"
                    className="form-control"
                    id="categoryName"
                    name="name"
                    value={category.name}
                    onChange={onFieldChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="categoryType">Type</label>
                  <select
                    className="form-control"
                    id="categoryType"
                    name="type"
                    value={category.type}
                    onChange={onFieldChange}
                  >
                    <option value="income">Income</option>
                    <option value="expense">Expense</option>
                  </select>
                </div>
                <div className="modal-footer">
                  <button type="submit" className="btn btn-primary" disabled={isLoading}>
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

export default CategoryModal;