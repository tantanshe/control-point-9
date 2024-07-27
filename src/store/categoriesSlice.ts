import axiosApi from '../axiosApi';
import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {RootState} from '../app/store';

interface Category {
  id?: string;
  type: 'income' | 'expense';
  name: string;
}

interface CategoryState {
  categories: Category[];
  isLoading: boolean;
  error: boolean;
}

const initialState: CategoryState = {
  categories: [],
  isLoading: false,
  error: false,
};

export const fetchCategories = createAsyncThunk<Category[], {
  state: RootState
}>('categories/fetchCategories', async () => {
  const {data: categories} = await axiosApi.get('/categories.json');
  if (!categories) return [];
  return Object.keys(categories).map(id => ({
    id,
    ...categories[id]
  }));
});

export const addCategory = createAsyncThunk<Category, Category, {
  state: RootState
}>('categories/addCategory', async (newCategory: Category) => {
  const {data: category} = await axiosApi.post('/categories.json', newCategory);
  return {id: category.name, ...newCategory};
});

export const editCategory = createAsyncThunk<Category, {
  id: string,
  updatedCategory: Category
}, { state: RootState }>('categories/editCategory',
  async ({id, updatedCategory}) => {
    const {data: category} = await axiosApi.put<Category>(`/categories/${id}.json`, updatedCategory);
    return {id, ...category};
  });

export const deleteCategory = createAsyncThunk<string, string, {
  state: RootState
}>('categories/deleteCategory', async (id: string) => {
  await axiosApi.delete(`/categories/${id}.json`);
  return id;
});

const categoriesSlice = createSlice({
  name: 'categories',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchCategories.pending, (state) => {
        state.isLoading = true;
        state.error = false;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.categories = action.payload;
        state.isLoading = false;
      })
      .addCase(fetchCategories.rejected, (state) => {
        state.isLoading = false;
        state.error = true;
      });


    builder
      .addCase(addCategory.pending, (state) => {
        state.isLoading = true;
        state.error = false;
      })
      .addCase(addCategory.fulfilled, (state, action) => {
        state.categories.push(action.payload);
      })
      .addCase(addCategory.rejected, (state) => {
        state.isLoading = false;
        state.error = true;
      });

    builder
      .addCase(editCategory.pending, (state) => {
        state.isLoading = true;
        state.error = false;
      })
      .addCase(editCategory.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.categories.findIndex(category => category.id === action.payload.id);
        if (index !== -1) {
          state.categories[index] = action.payload;
        }
      })
      .addCase(editCategory.rejected, (state) => {
        state.isLoading = false;
        state.error = true;
      });

    builder
      .addCase(deleteCategory.pending, (state) => {
        state.isLoading = true;
        state.error = false;
      })
      .addCase(deleteCategory.fulfilled, (state, {payload: id}) => {
        state.categories = state.categories.filter(categories => categories.id !== id);
        state.isLoading = false;
      })
      .addCase(deleteCategory.rejected, (state) => {
        state.isLoading = false;
        state.error = true;
      });
  },
});

export const selectCategories = (state: RootState) => state.categories.categories;
export const selectIsCategoriesLoading = (state: RootState) => state.categories.isLoading;
export const selectError = (state: RootState) => state.categories.error;

export const categoriesReducer = categoriesSlice.reducer;