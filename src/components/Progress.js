function Progress({ index, numQuestions, userPoints, maxPoints, userAnswer }) {
  return (
    <header className="progress">
      <progress
        max={numQuestions}
        value={index + Number(userAnswer !== null)}
      />
      <p>
        Question
        <strong> {index + 1}</strong> / {numQuestions}
      </p>
      <p>
        <strong> {userPoints}</strong> / {maxPoints}
      </p>
    </header>
  );
}

export default Progress;
