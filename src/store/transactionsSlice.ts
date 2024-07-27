import axiosApi from '../axiosApi';
import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {RootState} from '../app/store';

interface Transaction {
  id: string;
  category: string;
  amount: number;
  createdAt: string;
}

interface TransactionsState {
  transactions: Transaction[];
  isLoading: boolean;
  error: boolean;
}

const initialState: TransactionsState = {
  transactions: [],
  isLoading: false,
  error: false,
};

export const fetchTransactions = createAsyncThunk<Transaction[], {
  state: RootState
}>('transactions/fetchTransactions', async () => {
  const {data: transactions} = await axiosApi.get('/transactions.json');
  if (!transactions) return [];
  return Object.keys(transactions).map(id => ({
    id,
    ...transactions[id]
  }));
});

export const addTransaction = createAsyncThunk<Transaction, Transaction, {
  state: RootState
}>('transactions/addTransaction', async (newTransaction: Transaction) => {
  const {data: transaction} = await axiosApi.post('/transactions.json', newTransaction);
  return {id: transaction.name, ...newTransaction};
});

export const editTransaction = createAsyncThunk<Transaction, {
  id: string,
  updatedTransaction: Transaction
}, { state: RootState }>('transactions/editTransaction',
  async ({id, updatedTransaction}) => {
    const {data: transaction} = await axiosApi.put<Transaction>(`/transactions/${id}.json`, updatedTransaction);
    return {id, ...transaction};
  });

export const deleteTransaction = createAsyncThunk<string, string, {
  state: RootState
}>('transactions/deleteTransaction', async (id: string) => {
  await axiosApi.delete(`/transactions/${id}.json`);
  return id;
});

const transactionsSlice = createSlice({
  name: 'transactions',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchTransactions.pending, (state) => {
        state.isLoading = true;
        state.error = false;
      })
      .addCase(fetchTransactions.fulfilled, (state, action) => {
        state.transactions = action.payload;
        state.isLoading = false;
      })
      .addCase(fetchTransactions.rejected, (state) => {
        state.isLoading = false;
        state.error = true;
      });


    builder
      .addCase(addTransaction.pending, (state) => {
        state.isLoading = true;
        state.error = false;
      })
      .addCase(addTransaction.fulfilled, (state, action) => {
        state.transactions.push(action.payload);
      })
      .addCase(addTransaction.rejected, (state) => {
        state.isLoading = false;
        state.error = true;
      });

    builder
      .addCase(editTransaction.pending, (state) => {
        state.isLoading = true;
        state.error = false;
      })
      .addCase(editTransaction.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.transactions.findIndex(transaction => transaction.id === action.payload.id);
        if (index !== -1) {
          state.transactions[index] = action.payload;
        }
      })
      .addCase(editTransaction.rejected, (state) => {
        state.isLoading = false;
        state.error = true;
      });

    builder
      .addCase(deleteTransaction.pending, (state) => {
        state.isLoading = true;
        state.error = false;
      })
      .addCase(deleteTransaction.fulfilled, (state, {payload: id}) => {
        state.transactions = state.transactions.filter(transactions => transactions.id !== id);
        state.isLoading = false;
      })
      .addCase(deleteTransaction.rejected, (state) => {
        state.isLoading = false;
        state.error = true;
      });
  },
});

export const selectTransactions = (state: RootState) => state.transactions.transactions;
export const selectIsTransactionsLoading = (state: RootState) => state.transactions.isLoading;
export const selectError = (state: RootState) => state.transactions.error;

export const transactionsReducer = transactionsSlice.reducer;