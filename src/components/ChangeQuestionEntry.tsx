import React, { useState } from "react";
import { TQuestion } from "../types/question";

const ChangeQuestionEntry: React.FC<{
  id: string;
  setData: React.Dispatch<React.SetStateAction<TQuestion[]>>;
  deleteEntry: (index: number) => void;
  data: TQuestion[];
  index: number;
}> = ({ setData, id, deleteEntry, index, data }) => {
  const [question, setQuestion] = useState("");
  const [isAdded, setIsAdded] = useState(false);
  const [answers, setAnswers] = useState<string[]>([]);
  const [correctAnswer, setCorrectAnswer] = useState(1);

  return (
    <article className="change_question_entry">
      <h3 className="q_number">{index + 1}</h3>
      <p>Question</p>
      <input
        type="text"
        placeholder="Question"
        className="question_input"
        value={question}
        onChange={(e) => {
          setQuestion(e.target.value);
        }}
      />
      <div className="answers_entry_container">
        <p>Answers</p>
        <input
          type="text"
          placeholder="Answer 1"
          className="answer_input"
          value={answers[0]}
          onChange={(e) => {
            const newAnswers = answers.slice();
            newAnswers[0] = e.target.value;
            setAnswers(newAnswers);
          }}
        />
        <input
          type="text"
          placeholder="Answer 2"
          className="answer_input"
          value={answers[1]}
          onChange={(e) => {
            const newAnswers = answers.slice();
            newAnswers[1] = e.target.value;
            setAnswers(newAnswers);
          }}
        />
        <input
          type="text"
          placeholder="Answer 3"
          value={answers[2]}
          className="answer_input"
          onChange={(e) => {
            const newAnswers = answers.slice();
            newAnswers[2] = e.target.value;
            setAnswers(newAnswers);
          }}
        />
        <input
          type="text"
          placeholder="Answer 4"
          value={answers[3]}
          className="answer_input"
          onChange={(e) => {
            const newAnswers = answers.slice();
            newAnswers[3] = e.target.value;
            setAnswers(newAnswers);
          }}
        />
      </div>
      <footer>
        <div>
          <p>Correct Question Number</p>
          <input
            type="number"
            placeholder="Correct answer number"
            className="number_input"
            value={correctAnswer}
            onChange={(e) => {
              setCorrectAnswer(Number(e.target.value));
            }}
          />
        </div>
        <div className="btn_container">
          {!isAdded && (
            <button
              type="button"
              className="btn btn_green"
              onClick={() => {
                setData(() => {
                  const dataInstance = data.slice();
                  dataInstance[index] = {
                    answers,
                    correct_answer_id: correctAnswer - 1,
                    question,
                    id,
                  };
                  console.log(dataInstance);
                  return dataInstance;
                });
                setIsAdded(true);
              }}
            >
              Add +
            </button>
          )}
          <button
            type="button"
            className="btn btn_red"
            onClick={() => {
              deleteEntry(index);
            }}
          >
            Remove Entry
          </button>
        </div>
      </footer>
    </article>
  );
};

export default ChangeQuestionEntry;
