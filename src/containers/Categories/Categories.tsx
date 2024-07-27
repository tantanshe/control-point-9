import React, {useEffect, useState} from 'react';
import {AppDispatch} from '../store';
import CategoryModal from '../../components/Categories/CategoryModal';
import {useAppDispatch, useAppSelector} from '../../app/hooks';
import {
  fetchCategories,
  deleteCategory,
  Category,
  selectIsCategoriesLoading,
  selectCategories, selectError
} from '../../store/categoriesSlice';
import Spinner from '../../components/Spinner/Spinner';

const CategoryPage: React.FC = () => {
  const dispatch: AppDispatch = useAppDispatch();
  const categories = useAppSelector(selectCategories);
  const isLoading = useAppSelector(selectIsCategoriesLoading);
  const error = useAppSelector(selectError);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [showModal, setShowModal] = useState<boolean>(false);

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  const handleAdd = () => {
    setSelectedCategory(null);
    setShowModal(true);
  };

  const handleEdit = (category: Category) => {
    setSelectedCategory(category);
    setShowModal(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      dispatch(deleteCategory(id));
    }
  };

  const handleClose = () => {
    setSelectedCategory(null);
    setShowModal(false);
  };

  return (
    <>
      {isLoading && (<Spinner/>)}
      {error && (<p>Error loading categories!</p>)}

      <div className="container mt-4">
        <div className="d-flex justify-content-between align-items-center"><h1>Categories</h1>
          <button className="btn btn-primary mb-3" onClick={handleAdd}>
            Add Category
          </button>
        </div>
        {categories.length === 0 ? (
          <div className="text-center">
            No categories available. Please add a new category.
          </div>
        ) : (
          <ul className="list-group">
            {categories.map(category => (
              <li key={category.id} className="list-group-item d-flex justify-content-between align-items-center">
                <span>{category.name}</span>
                <div>
                <span className={`text-capitalize ${category.type === 'income' ? 'text-success' : 'text-danger'} me-3`}>
                  {category.type}
                </span>
                  <button className="btn btn-primary me-3" onClick={() => handleEdit(category)}>
                    Edit
                  </button>
                  <button className="btn btn-danger me-3" onClick={() => handleDelete(category.id!)}>
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}

        {showModal && (
          <CategoryModal currentCategory={selectedCategory} onClose={handleClose}/>
        )}
      </div>
    </>
  );
};

export default CategoryPage;