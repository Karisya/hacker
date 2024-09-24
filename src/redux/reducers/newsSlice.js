import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchNews = createAsyncThunk('news/fetchNews', 
    async () => {
  const response = await axios.get('https://hacker-news.firebaseio.com/v0/newstories.json');
  const news = await Promise.all(response.data.slice(0, 100).map(async (id) => {
    const story = await axios.get(`https://hacker-news.firebaseio.com/v0/item/${id}.json`);
    return story.data;
  }));
  return news;
});

const newsSlice = createSlice({
  name: 'news',
  initialState: {
    items: [],
    status: 'idle',
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchNews.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchNews.fulfilled, (state, action) => {
        state.items = action.payload.sort((a, b) => b.time - a.time);
        state.status = 'succeeded';
      })
      .addCase(fetchNews.rejected, (state) => {
        state.status = 'failed';
      });
  },
});

export default newsSlice.reducer;
