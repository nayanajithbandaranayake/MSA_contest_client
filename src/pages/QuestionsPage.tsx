import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { TQuestion } from "../types/question";
import { question_order } from "../data/questions";
import Question from "../components/Question";
import { useSocketContext } from "..";

import { v4 as uuid } from "uuid";

const QuestionsPage = () => {
  const navigate = useNavigate();
  const socket = useSocketContext()!;
  const { search } = useLocation();

  const query = React.useMemo(() => new URLSearchParams(search), [search]);

  const data = {
    subject_id: Number(query.get("subject_id")),
    school_id: Number(query.get("school_id")),
  };

  const [showResult, setShowResult] = useState(false);
  const [finalResult, setFinalResult] = useState(0);
  const [questions, setQuestions] = useState<TQuestion[]>([
    {
      id: uuid(),
      question: "",
      correct_answer_id: 1,
      answers: [],
    },
  ]);
  const [answers, setAnswers] = useState<number[]>([]);

  const redirectToQuestions = (school_id: number, subject_id: number) => {
    navigate(`/questions?school_id=${school_id}&subject_id=${subject_id}`, {
      replace: true,
    });
  };

  const redirectTo404 = () => {
    return navigate("/404", {
      replace: true,
    });
  };

  useEffect(() => {
    const school_id = Number(sessionStorage.getItem("school_id"));
    const subject_id = Number(sessionStorage.getItem("subject_id"));

    // if (school_id && subject_id) {
    //   redirectToQuestions(school_id, subject_id);
    // } else if (
    //   school_id < 0 ||
    //   school_id > 7 ||
    //   subject_id < 0 ||
    //   subject_id > 4
    // )
    //   redirectTo404();

    socket.emit("fetch_questions", data.subject_id);

    sessionStorage.setItem("school_id", JSON.stringify(data.school_id!));
    sessionStorage.setItem("subject_id", JSON.stringify(data.subject_id!));
  }, []);

  useEffect(() => {
    socket.on("questions_dispatched", (data) => {
      setQuestions(data);
    });
    return () => {
      socket.off("questions_dispatched");
    };
  }, []);

  const setFinalAnswer = (q_id: string, ans: number) => {
    const newAnswers = answers.slice();
    const q_index = questions.findIndex((x) => x.id === q_id);
    newAnswers[q_index] = ans;
    setAnswers(newAnswers);
  };

  const evaluateResult = () => {
    let nonMultipliedResult = 0;
    answers.forEach((ans, i) => {
      const currentQuestion = questions[i];
      if (currentQuestion?.correct_answer_id === ans) {
        nonMultipliedResult++;
      }
    });
    return nonMultipliedResult * (100 / questions.length);
  };

  const handleSubmit = () => {
    const results = evaluateResult();

    setFinalResult(results);
    setShowResult(true);
    console.log(results);

    socket.emit("submit_result", { ...data, marks: results });
    sessionStorage.setItem("results", JSON.stringify(results));
  };

  return (
    <main className="page question_page">
      <h1 className="subject_title">{question_order[data.subject_id]}</h1>
      {showResult && (
        <section className="results">
          <h1>
            Result: <span style={{ color: "red" }}>{finalResult}%</span>
          </h1>
        </section>
      )}
      <section className="question_container">
        {questions!.map((question, i) => {
          return (
            <Question
              index={i}
              key={question.id}
              data={{ ...question }}
              showResult={showResult}
              setFinalAnswer={setFinalAnswer}
            />
          );
        })}
      </section>
      <button
        className="btn btn_primary"
        onClick={handleSubmit}
        disabled={showResult}
      >
        Submit
      </button>
    </main>
  );
};

export default QuestionsPage;
