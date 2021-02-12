import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchRandomQuestion } from "../../api";
import { MAX_ROUND } from "../../config";
import { getScoreSum } from "./utils";

const REFETCH_LIMIT = 10;

export const GAME_STATUS = {
  STARTED: "started",
  WIN: "win",
  LOSE: "lose",
};

const sanitizeString = (string) => string.replace(/<\/?[^>]+(>|$)/g, "");

export const fetchQuestion = createAsyncThunk(
  "quiz/fetchQuestion",
  async (_arg, { getState }) => {
    let refetchCount = REFETCH_LIMIT;
    let questions;
    const { askedQuestionIds } = getState().quiz;
    // fetch random questions until a new question is returned
    do {
      refetchCount -= 1;
      questions = await fetchRandomQuestion();
    } while (askedQuestionIds.includes(questions[0].id) && refetchCount > 0);
    return questions[0]; // API returns an array with one question by default
  }
);

export const initialState = {
  round: 1,
  quizItem: null,
  askedQuestionIds: [],
  gameStatus: GAME_STATUS.STARTED,
  topScore: 0,
  isLoading: false,
  error: null,
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
          state.gameStatus = GAME_STATUS.WIN;
        } else {
          state.round += 1;
        }
      } else {
        state.gameStatus = GAME_STATUS.LOSE;
      }
    },
    restart(state) {
      state.round = 1;
      state.gameStatus = GAME_STATUS.STARTED;
      state.askedQuestionIds = [];
      state.error = null;
    },
    timeout(state) {
      state.gameStatus = GAME_STATUS.LOSE;
    },
  },
  extraReducers: {
    [fetchQuestion.pending]: (state) => {
      state.isLoading = true;
    },
    [fetchQuestion.fulfilled]: (state, action) => {
      state.isLoading = false;
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
      state.isLoading = false;
      state.error = `An error occurred during fetching the question: ${action.error.message}`;
    },
  },
});

export const { evaluateAnswer, restart, timeout } = quizSlice.actions;

export default quizSlice.reducer;

// selectors
export const selectQuizItem = (state) => state.quiz.quizItem;
export const selectRound = (state) => state.quiz.round;
export const selectError = (state) => state.quiz.error;
export const selectTopScore = (state) => state.quiz.topScore;
export const selectIsLoading = (state) => state.quiz.isLoading;
export const selectGameStatus = (state) => state.quiz.gameStatus;
export const selectQuestionsCount = (state) =>
  state.quiz.askedQuestionIds.length;
