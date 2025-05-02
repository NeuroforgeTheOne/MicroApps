import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const fetchChats = createAsyncThunk('chat/fetchChats', async (_, thunkAPI) => {
  try {
    const token = thunkAPI.getState().auth.token;
    const res = await axios.get(`${API_URL}/chats`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return res.data.chats;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response.data.message || 'Failed to fetch chats');
  }
});

export const fetchMessages = createAsyncThunk('chat/fetchMessages', async (chatId, thunkAPI) => {
  try {
    const token = thunkAPI.getState().auth.token;
    const res = await axios.get(`${API_URL}/messages/${chatId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return { chatId, messages: res.data.messages };
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response.data.message || 'Failed to fetch messages');
  }
});

const chatSlice = createSlice({
  name: 'chat',
  initialState: {
    chats: [],
    messages: {},
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchChats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchChats.fulfilled, (state, action) => {
        state.loading = false;
        state.chats = action.payload;
      })
      .addCase(fetchChats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchMessages.fulfilled, (state, action) => {
        state.messages[action.payload.chatId] = action.payload.messages;
      });
  },
});

export default chatSlice.reducer;
