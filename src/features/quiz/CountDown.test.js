import { CountDown } from "./CountDown";
import { render, screen, act } from "@testing-library/react";

const maxTimeSec = 15;
const onComplete = jest.fn();

describe("CountDown Component", () => {
  beforeEach(() => jest.useFakeTimers());
  afterAll(() => jest.useRealTimers());

  it("should display 'seconds' as remaining time at initialization", () => {
    render(
      <CountDown seconds={maxTimeSec} onComplete={onComplete} suspend={false} />
    );
    expect(screen.getByText(`Time left: ${maxTimeSec}s`)).toBeInTheDocument();
  });

  it("should decrement the remaining time once in a second", () => {
    render(
      <CountDown seconds={maxTimeSec} onComplete={onComplete} suspend={false} />
    );
    act(() => jest.advanceTimersByTime(1000));

    expect(
      screen.getByText(`Time left: ${maxTimeSec - 1}s`)
    ).toBeInTheDocument();
    expect(onComplete).toHaveBeenCalledTimes(0);
  });

  it("should call onComplete callback when the timer reaches 0 sec", () => {
    render(
      <CountDown seconds={maxTimeSec} onComplete={onComplete} suspend={false} />
    );

    act(() => jest.advanceTimersByTime(maxTimeSec * 1000));

    expect(screen.getByText(`Time left: 0s`)).toBeInTheDocument();
    expect(onComplete).toHaveBeenCalledTimes(1);
  });

  it("should stop the timer when suspend prop is true", () => {
    render(
      <CountDown seconds={maxTimeSec} onComplete={onComplete} suspend={true} />
    );

    act(() => jest.advanceTimersByTime(maxTimeSec * 1000));

    expect(screen.getByText(`Time left: ${maxTimeSec}s`)).toBeInTheDocument();
    expect(onComplete).toHaveBeenCalledTimes(0);
  });
});
