import reducer, {
  evaluateAnswer,
  restart,
  timeout,
  selectGameStatus,
  selectRound,
  selectQuestionsCount,
  selectIsLoading,
  selectQuizItem,
  selectError,
  GAME_STATUS,
  fetchQuestion,
} from "./quizSlice";
import randomQuiz from "../../../test/mock/randomQuiz";

const quizItem = {
  id: 58971,
  answer: "extradition",
  question: "The handing over of a criminal to another country or state",
  category: '"extra" helpings',
};

const activeQuizState = {
  round: 2,
  quizItem,
  askedQuestionIds: [],
  gameStatus: "started",
  isLoading: false,
  error: null,
  topScore: 0,
};

const lostQuizState = {
  round: 2,
  quizItem,
  askedQuestionIds: [58971, 58972],
  gameStatus: "lose",
  isLoading: false,
  error: null,
  topScore: 4,
};

describe("Quiz slice", () => {
  describe("Answer validation", () => {
    it("should increment the round state when the answer is correct", () => {
      const nextState = reducer(
        activeQuizState,
        evaluateAnswer(quizItem.answer)
      );

      const rootState = { quiz: nextState };
      expect(selectRound(rootState)).toEqual(activeQuizState.round + 1);
      expect(selectGameStatus(rootState)).toEqual(GAME_STATUS.STARTED);
    });

    it("should not be case sensitive when validating the answer", () => {
      const nextState = reducer(
        activeQuizState,
        evaluateAnswer(quizItem.answer.toUpperCase())
      );

      const rootState = { quiz: nextState };
      expect(selectRound(rootState)).toEqual(activeQuizState.round + 1);
    });

    it("should set gameStatus to 'win' if the 30th answer is correct", () => {
      const baseState = { ...activeQuizState, round: 30 };
      const nextState = reducer(baseState, evaluateAnswer(quizItem.answer));

      const rootState = { quiz: nextState };
      expect(selectGameStatus(rootState)).toEqual(GAME_STATUS.WIN);
    });

    it("should set gameStatus to 'lose' if an answer is incorrect", () => {
      const nextState = reducer(
        activeQuizState,
        evaluateAnswer("incorrect_answer")
      );

      const rootState = { quiz: nextState };
      expect(selectGameStatus(rootState)).toEqual(GAME_STATUS.LOSE);
    });
  });

  describe("Restart", () => {
    it("should reset gameState when restart is dispatched", () => {
      const nextState = reducer(lostQuizState, restart());

      const rootState = { quiz: nextState };
      expect(selectRound(rootState)).toEqual(1);
      expect(selectGameStatus(rootState)).toEqual(GAME_STATUS.STARTED);
      expect(selectQuestionsCount(rootState)).toEqual(0);
    });
  });

  describe("Timeout", () => {
    it("should set gameStatus to 'lose' when timeout is dispatched", () => {
      const nextState = reducer(activeQuizState, timeout());

      const rootState = { quiz: nextState };
      expect(selectGameStatus(rootState)).toEqual(GAME_STATUS.LOSE);
    });
  });

  describe("Async thunk", () => {
    it("should properly set loading and quizItem state when a fetchQuestion is pending", () => {
      const nextState = reducer(activeQuizState, fetchQuestion.pending());

      const rootState = { quiz: nextState };
      expect(selectIsLoading(rootState)).toEqual(true);
      expect(selectError(rootState)).toEqual(null);
    });

    it("should properly set loading and error state when fetchQuestion fulfilled", () => {
      const baseState = { ...activeQuizState, isLoading: true };
      const payload = randomQuiz;
      const nextState = reducer(baseState, fetchQuestion.fulfilled(payload));

      const rootState = { quiz: nextState };
      expect(selectIsLoading(rootState)).toEqual(false);
      expect(selectError(rootState)).toEqual(null);
      expect(selectQuizItem(rootState)).toEqual(quizItem);
    });

    it("should properly set loading and error state when fetchQuestion is rejected", () => {
      const baseState = { ...activeQuizState, isLoading: true };
      const error = { message: "Failed to fetch" };
      const nextState = reducer(baseState, fetchQuestion.rejected(error));

      const rootState = { quiz: nextState };
      expect(selectIsLoading(rootState)).toEqual(false);
      expect(selectError(rootState)).toContain(error.message);
    });
  });
});
