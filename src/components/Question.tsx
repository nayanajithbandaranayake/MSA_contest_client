import React, { useEffect, useState } from "react";
import { TQuestion } from "../types/question";

const Question: React.FC<{
  data: TQuestion;
  index: number;
  showResult: boolean;
  setFinalAnswer: (q_id: string, ans_id: number) => void;
}> = ({ data, showResult, setFinalAnswer, index }) => {
  const [answers, setAnswers] = useState<
    { text: string; checked: boolean; correctAnswer: boolean }[]
  >([{ text: "", checked: false, correctAnswer: false }]);

  useEffect(() => {
    setAnswers(() => {
      const newAnswers = data.answers.slice().map((ans, i) => {
        return {
          text: ans,
          checked: false,
          correctAnswer: i === data.correct_answer_id,
        };
      });
      return newAnswers;
    });
  }, [data.answers]);

  const updateTheAnswer = (i: number) => {
    setAnswers((currentAnswers) => {
      let newAnswers = currentAnswers.slice();
      const currentAnswerIndex = newAnswers.findIndex((x) => x.checked);
      if (currentAnswerIndex !== -1) {
        newAnswers[currentAnswerIndex].checked = false;
      }
      newAnswers[i].checked = true;
      return newAnswers;
    });
    setFinalAnswer(data.id!, i);
  };
  return (
    <article className="single_question">
      <h3>{`${index + 1}. ${data.question}`}</h3>
      <div className="answer_container">
        {answers.map(({ checked, text, correctAnswer }, i) => {
          return (
            <div
              className={
                showResult
                  ? correctAnswer
                    ? "single_answer correct"
                    : checked
                    ? "single_answer checked"
                    : "single_answer"
                  : checked
                  ? "single_answer checked"
                  : "single_answer"
              }
              key={i}
              onClick={() => {
                if (showResult) return;
                updateTheAnswer(i);
              }}
            >
              <p>{`${i + 1}. ${text}`}</p>
            </div>
          );
        })}
      </div>
    </article>
  );
};

export default Question;
