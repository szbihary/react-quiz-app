import { rest } from "msw";
import { setupServer } from "msw/node";
import {
  render,
  screen,
  waitForElementToBeRemoved,
  fireEvent,
} from "@testing-library/react";
import { Provider } from "react-redux";
import store from "../../../app/store";
import { QuizGame } from "./QuizGame";
import {
  QUIZ_API_RANDOM,
  MAX_ROUND,
  AVAILABLE_TIME_SEC,
} from "../../../config";
import randomQuiz from "../../../../test/mock/randomQuiz.json";

let quizId = 0;

// quizId should be unique, otherwise Quiz App fetches a new question in a single game
const server = setupServer(
  rest.get(QUIZ_API_RANDOM, (req, res, ctx) => {
    quizId += 1;
    return res(ctx.json([{ ...randomQuiz, id: quizId }]));
  })
);

const renderQuiz = () => {
  render(
    <Provider store={store}>
      <QuizGame />
    </Provider>
  );
};

describe("QuizGame", () => {
  beforeAll(() => server.listen());
  afterEach(() => server.resetHandlers());
  afterAll(() => server.close());

  test("renders quiz form with input and Submit button", () => {
    renderQuiz();

    expect(screen.getByText("Category")).toBeInTheDocument();
    expect(screen.getByText("Question")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Type your answer")).toBeInTheDocument();
    expect(screen.getByText("Submit")).toBeInTheDocument();
  });

  test("'Round', 'top score', 'current points', 'Time left' are initialized correctly", () => {
    renderQuiz();

    expect(screen.getByText(`Round: 1/${MAX_ROUND}`)).toBeInTheDocument();
    expect(
      screen.getByText("Points for the current round: 1")
    ).toBeInTheDocument();
    expect(screen.getByText("User score: 0")).toBeInTheDocument();
    expect(screen.getByText("Top score: 0")).toBeInTheDocument();
    expect(
      screen.getByText(`Time left: ${AVAILABLE_TIME_SEC}s`)
    ).toBeInTheDocument();
  });

  test("loads and displays quiz category and question", async () => {
    const expectedQuestion = randomQuiz.question;
    const expectedCategory = randomQuiz.category.title;
    renderQuiz();

    await screen.findByTestId("loader");
    await waitForElementToBeRemoved(() => screen.queryByTestId("loader"));

    expect(screen.getByText(expectedQuestion)).toBeInTheDocument();
    expect(screen.getByText(expectedCategory)).toBeInTheDocument();
  });

  test("by typing the correct answer and clicking the Submit button, a new question is being fetched, the round and score values are changed properly", async () => {
    renderQuiz();
    const input = screen.getByPlaceholderText("Type your answer");

    fireEvent.change(input, { target: { value: randomQuiz.answer } });
    fireEvent.click(screen.getByText("Submit"));

    await waitForElementToBeRemoved(() => screen.queryByTestId("loader"));

    expect(screen.getByText(`Round: 2/${MAX_ROUND}`)).toBeInTheDocument();
    expect(
      screen.getByText(`Points for the current round: 2`)
    ).toBeInTheDocument();
    expect(screen.getByText("User score: 1")).toBeInTheDocument();
    expect(screen.getByText("Top score: 1")).toBeInTheDocument();
    expect(screen.getByRole("button")).toHaveTextContent("Submit");
    expect(screen.getByText(randomQuiz.question)).toBeInTheDocument();
  });

  test("by correctly answering then next quiz, the points doubles in the next round", async () => {
    renderQuiz();
    const input = screen.getByPlaceholderText("Type your answer");

    fireEvent.change(input, { target: { value: randomQuiz.answer } });
    fireEvent.click(screen.getByText("Submit"));

    await waitForElementToBeRemoved(() => screen.queryByTestId("loader"));

    expect(screen.getByText(`Round: 3/${MAX_ROUND}`)).toBeInTheDocument();
    expect(
      screen.getByText(`Points for the current round: 4`)
    ).toBeInTheDocument();
    expect(screen.getByText("User score: 3")).toBeInTheDocument();
    expect(screen.getByText("Top score: 3")).toBeInTheDocument();
    expect(screen.getByRole("button")).toHaveTextContent("Submit");
    expect(screen.getByText(randomQuiz.question)).toBeInTheDocument();
  });

  test("by typing an incorrect answer and clicking the Submit button, the quiz shows 'Game Over' message, the correct answer and a Restart button", async () => {
    const incorrectAnswer = "incorrect";
    renderQuiz();
    const input = screen.getByPlaceholderText("Type your answer");

    fireEvent.change(input, { target: { value: incorrectAnswer } });
    fireEvent.click(screen.getByText("Submit"));

    await screen.findByRole("alert");

    const expectedAlertMessage = `The correct answer: ${randomQuiz.answer}`;

    expect(screen.getByRole("alert")).toHaveTextContent(expectedAlertMessage);
    expect(screen.getByText("Quiz - Game Over")).toBeInTheDocument();
    expect(screen.getByRole("button")).toHaveTextContent("Restart");
  });

  test("by pressing hte Restart button, the round, user score and points are reset, while the top score preserved", async () => {
    renderQuiz();

    fireEvent.click(screen.getByText("Restart"));
    await waitForElementToBeRemoved(() => screen.queryByTestId("loader"));

    expect(screen.getByText(`Round: 1/${MAX_ROUND}`)).toBeInTheDocument();
    expect(
      screen.getByText("Points for the current round: 1")
    ).toBeInTheDocument();
    expect(screen.getByText("User score: 0")).toBeInTheDocument();
    expect(screen.getByText("Top score: 3")).toBeInTheDocument();
    expect(screen.getByText(randomQuiz.question)).toBeInTheDocument();
  });
});
