import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchRandomQuestion } from "../../api";
import { MAX_ROUND } from "../../config";
import { getScoreSum } from "./utils";

const sanitizeString = (string) => string.replace(/<\/?[^>]+(>|$)/g, "");

export const fetchQuestion = createAsyncThunk(
  "quiz/fetchQuestion",
  async (_arg, { getState }) => {
    let questions;
    const { askedQuestionIds } = getState().quiz;
    // fetch random questions until a new question is returned
    do {
      questions = await fetchRandomQuestion();
    } while (askedQuestionIds.includes(questions[0].id));
    return questions[0]; // API returns an array with one question by default
  }
);

const initialState = {
  round: 1,
  quizItem: null,
  askedQuestionIds: [],
  gameStatus: "started", // 'started', 'win', 'lose'
  fetchStatus: "loading",
  topScore: 0,
};

export const quizSlice = createSlice({
  name: "quiz",
  initialState,
  reducers: {
    evaluateAnswer(state, action) {
      const userAnswer = action.payload;
      if (state.quizItem.answer.toLowerCase() === userAnswer.toLowerCase()) {
        state.topScore = Math.max(state.topScore, getScoreSum(state.round));
        if (state.round === MAX_ROUND) {
          state.gameStatus = "win";
        } else {
          state.round += 1;
        }
      } else {
        state.gameStatus = "lose";
      }
    },
    restart(state) {
      state.round = 1;
      state.gameStatus = "started";
      state.askedQuestionIds = [];
    },
    timerEnded(state) {
      state.gameStatus = "lose";
    },
  },
  extraReducers: {
    [fetchQuestion.pending]: (state) => {
      state.fetchStatus = "loading";
    },
    [fetchQuestion.fulfilled]: (state, action) => {
      state.fetchStatus = "success";
      const { id, question, answer, category } = action.payload;
      state.askedQuestionIds.push(id);
      state.quizItem = {
        id,
        question,
        answer: sanitizeString(answer),
        category: category.title,
      };
    },
    [fetchQuestion.rejected]: (state, action) => {
      state.fetchStatus = "error";
      state.error = action.error.message;
    },
  },
});

export const { evaluateAnswer, restart, timerEnded } = quizSlice.actions;

export default quizSlice.reducer;

// selectors
export const selectQuizItem = (state) => state.quiz.quizItem;
export const selectRound = (state) => state.quiz.round;
export const selectError = (state) => state.quiz.error;
export const selectTopScore = (state) => state.quiz.topScore;
export const selectFetchStatus = (state) => state.quiz.fetchStatus;
export const selectGameStatus = (state) => state.quiz.gameStatus;
export const selectQuestionsCount = (state) =>
  state.quiz.askedQuestionIds.length;
