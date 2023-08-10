function FinishedScreen({ userPoints, maxPoints, highScore, dispatch }) {
  const percentage = (userPoints / maxPoints) * 100;
  let emoji;

  if (percentage >= 90) emoji = "🥇";
  if (percentage >= 74 && percentage < 90) emoji = "🥈";
  if (percentage >= 60 && percentage < 74) emoji = "🥉";
  if (percentage < 60) emoji = "🤦🏽‍♂️";
  return (
    <>
      <p className="result">
        <span>{emoji}</span>
        You scored {userPoints} out of <strong>{maxPoints}</strong> points(
        {Math.ceil(percentage)}
        %)
      </p>
      <p className="highscore">(Highscore: {highScore} points)</p>
      <button
        className="btn btn-ui"
        onClick={() => dispatch({ type: "restart" })}
      >
        Restart Quiz
      </button>
    </>
  );
}

export default FinishedScreen;
