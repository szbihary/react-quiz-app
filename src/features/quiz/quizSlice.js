import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchRandomQuestion } from "../../api";
import { MAX_ROUND } from "../../config";

const sanitizeString = (string) => string.replace(/<\/?[^>]+(>|$)/g, "");

export const fetchQuestion = createAsyncThunk(
  "quiz/fetchQuestion",
  async () => {
    const questions = await fetchRandomQuestion();
    return questions[0]; // return array with one question by default
  }
);

const initialState = {
  round: 1,
  quizItem: null,
  askedQuestionIds: [],
  gameStatus: "initial", // 'initial', 'started', 'win', 'lose'
  fetchStatus: "loading",
};

export const quizSlice = createSlice({
  name: "quiz",
  initialState,
  reducers: {
    evaluateAnswer(state, action) {
      const userAnswer = action.payload;
      if (state.quizItem.answer.toLowerCase() === userAnswer.toLowerCase()) {
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
        category,
      };
    },
    [fetchQuestion.rejected]: (state, action) => {
      state.fetchStatus = "error";
      state.error = action.error.message;
    },
  },
});

export const { evaluateAnswer, restart } = quizSlice.actions;

export default quizSlice.reducer;

// selectors
export const selectQuizItem = (state) => state.quiz.quizItem;
export const selectRound = (state) => state.quiz.round;
export const selectError = (state) => state.quiz.error;
