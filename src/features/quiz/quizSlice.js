import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { client } from "../../api/client";

export const fetchRandomQuestion = createAsyncThunk(
  "quiz/fetchRandomQuestion",
  async () => {
    const questions = await client.get("https://jservice.io/api/random");
    return questions;
  }
);

const testItem = {
  id: 58971,
  answer: "extradition",
  question: "The handing over of a criminal to another country or state",
  value: 600,
  airdate: "2004-06-08T12:00:00.000Z",
  created_at: "2014-02-11T23:22:58.890Z",
  updated_at: "2014-02-11T23:22:58.890Z",
  category_id: 7547,
  game_id: null,
  invalid_count: null,
  category: {
    id: 7547,
    title: '"extra" helpings',
    created_at: "2014-02-11T23:22:58.425Z",
    updated_at: "2014-02-11T23:22:58.425Z",
    clues_count: 5,
  },
};

export const quizSlice = createSlice({
  name: "quiz",
  initialState: {
    quizItems: [testItem],
    round: 1,
  },
  reducers: {},
  extraReducers: {
    [fetchRandomQuestion.pending]: (state, action) => {
      state.status = "loading";
    },
    [fetchRandomQuestion.fulfilled]: (state, action) => {
      state.status = "succeeded";
      const { id, question, answer, category } = action.payload;
      state.quizItems.push({ id, question, answer, category });
    },
    [fetchRandomQuestion.pending]: (state, action) => {
      state.status = "failed";
      state.error = action.error.message;
    },
  },
});

export default quizSlice.reducer;

// selectors
export const selectLastQuizItem = (state) => state.quiz.quizItems[0];
