# React Quiz App

React App that demonstrates a quiz game using the api available at http://jservice.io.

## Features

- Each round the user is presented with a question selected at random using the method http://jservice.io/api/random.
- Only unique questions are asked in a single game.
- The text of the question field and the category.title field displayed to the user.
- Contains a text box and a submit button for the user to answer the question.
- The answer evaluation is not case sensitive.
- When a question is displayed a timer is started. The user has 30 seconds to answer, otherwise the game is over.
- If the user gets an answer correct their score is incremented by the number of points for the current round and a new question is fetched and displayed.
- If the user gets an answer wrong then the correct answer, a "Game Over" message and a Restart button displayed to the user.
- If the user clicks the Restart button then their points are reset to zero and the round is re-set to 1.
- The number of points rewarded doubles each round. The points rewarded for the first round is 1, the second round is 2, the third round is 4, the fourth round is 8 and so on.
- The maximum number of rounds a user can complete is 30. After answering the 30th question a "You Won!" message and a Restart button is displayed to the user. The restart button behaves in the same way as the Restart button displayed when the game is over.
- At all times the user's current score, the points for the current round, the time remaining and the user's high score are displayed, along with the current question. The time remaining is updated once per second.
