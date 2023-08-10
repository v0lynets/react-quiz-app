import { useEffect, useReducer } from "react";
import Header from "./Header";
import Main from "./Main";
import StartScreen from "./StartScreen";
import Loader from "./Loader";
import Error from "./Error";
import Question from "./Question";
import Progress from "./Progress";
import FinishedScreen from "./FinishedScreen";
import Footer from "./Footer";
import Timer from "./Timer";
const SEC_PER_QUESTION = 30;
const initialState = {
  questions: [],

  // loading, ready, error, active, finished,
  status: "loading",
  index: 0,
  userAnswer: null,
  userPoints: 0,
  highScore: 0,
  secondsRemaining: null,
};

function reducer(state, action) {
  switch (action.type) {
    case "dataRecieved":
      return { ...state, questions: action.payload, status: "ready" };
    case "errorRecieved":
      return { ...state, questions: [], status: "error" };
    case "start":
      return {
        ...state,
        status: "active",
        secondsRemaining: state.questions.length * SEC_PER_QUESTION,
      };
    case "newAnswer":
      const question = state.questions.at(state.index);

      return {
        ...state,
        userAnswer: action.payload,
        userPoints:
          action.payload === question.correctOption
            ? state.userPoints + question.points
            : state.userPoints,
      };
    case "newQuestion":
      return { ...state, index: state.index + 1, userAnswer: null };
    case "finish":
      return {
        ...state,
        status: "finished",
        highScore:
          state.userPoints > state.highScore
            ? state.userPoints
            : state.highScore,
      };
    case "restart":
      return {
        ...initialState,
        status: "ready",
        highScore: state.highScore,
        questions: state.questions,
      };
    case "tick":
      return {
        ...state,
        secondsRemaining: state.secondsRemaining - 1,
        status: state.secondsRemaining === 0 ? "finished" : state.status,
        highScore:
          state.userPoints > state.highScore
            ? state.userPoints
            : state.highScore,
      };
    default:
      throw new Error("Unknown action");
  }
}

function App() {
  const [
    {
      questions,
      status,
      index,
      userAnswer,
      userPoints,
      highScore,
      secondsRemaining,
    },
    dispatch,
  ] = useReducer(reducer, initialState);

  const numQuestions = questions.length;
  const maxPoints = questions.reduce((prev, next) => prev + next.points, 0);

  useEffect(function () {
    fetch("http://localhost:9000/questions")
      .then((res) => res.json())
      .then((data) => dispatch({ type: "dataRecieved", payload: data }))
      .catch((error) => dispatch({ type: "errorRecieved" }));
  }, []);

  return (
    <div className="app">
      <Header />
      <Main>
        {status === "ready" && (
          <StartScreen numQuestions={numQuestions} dispatch={dispatch} />
        )}
        {status === "loading" && <Loader />}
        {status === "error" && <Error />}
        {status === "active" && (
          <>
            <Progress
              index={index}
              numQuestions={numQuestions}
              userPoints={userPoints}
              maxPoints={maxPoints}
              userAnswer={userAnswer}
            />
            <Question
              question={questions.at(index)}
              dispatch={dispatch}
              userAnswer={userAnswer}
            />
            <Footer>
              <Timer dispatch={dispatch} secondsRemaining={secondsRemaining} />
              {userAnswer !== null ? (
                index < numQuestions - 1 ? (
                  <button
                    className="btn btn-ui"
                    onClick={() => dispatch({ type: "newQuestion" })}
                  >
                    Next
                  </button>
                ) : (
                  <button
                    className="btn btn-ui"
                    onClick={() => dispatch({ type: "finish" })}
                  >
                    Finish
                  </button>
                )
              ) : (
                ""
              )}
            </Footer>
          </>
        )}
        {status === "finished" && (
          <FinishedScreen
            userPoints={userPoints}
            maxPoints={maxPoints}
            highScore={highScore}
            dispatch={dispatch}
          />
        )}
      </Main>
    </div>
  );
}

export default App;
