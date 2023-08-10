import Options from "./Options";

function Question({ question, dispatch, userAnswer }) {
  return (
    <div>
      <h4>{question.question}</h4>
      <Options
        question={question}
        dispatch={dispatch}
        userAnswer={userAnswer}
      />
    </div>
  );
}

export default Question;
