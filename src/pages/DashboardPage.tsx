import React, { FormEvent, useEffect, useState } from "react";
import { useSocketContext } from "..";
import { TQuestion } from "../types/question";
import { v4 as uuid } from "uuid";
import ChangeQuestionEntry from "../components/ChangeQuestionEntry";

const PASSWORD = process.env.REACT_APP_ADMIN_PASSWORD;
const modelQuestions: TQuestion[] = [
  {
    question: "",
    correct_answer_id: 1,
    answers: [],
  },
];

const DashboardPage = () => {
  const socket = useSocketContext()!;

  const [isAuthorized, setIsAuthorized] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");
  const [changeQuestionData, setChangeQuestionData] =
    useState<TQuestion[]>(modelQuestions);
  const [currentChangingSubject, setCurrentChangingSubject] = useState(0);

  useEffect(() => {}, []);

  const authorize = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput === PASSWORD) setIsAuthorized(true);
    else setIsAuthorized(false);
  };

  const changeQuestion = (e: FormEvent) => {
    e.preventDefault();

    socket.emit("update_questions", {
      password: PASSWORD,
      id: currentChangingSubject,
      new_questions: changeQuestionData,
    });
    // setChangeQuestionData("");
  };

  const deleteAddQuestionEntry = (index: number) => {
    const newQuestionEntryData = changeQuestionData.filter(
      (x, i) => i !== index
    );
    setChangeQuestionData(newQuestionEntryData);
  };

  const resetResults = () => {
    socket.emit("reset_marks", { password: passwordInput });
  };

  return (
    <main className="page dashboard_page">
      {isAuthorized ? (
        <section className="dashboard">
          <header>
            <h1>Welcome to the Radiance '24 Contest dashboard </h1>
          </header>

          <form className="change_questions" onSubmit={changeQuestion}>
            <div className="subject_select_container">
              <h3>Choose a subject</h3>
              <select
                value={currentChangingSubject}
                onChange={(e) => {
                  setCurrentChangingSubject(
                    Number(e.target.value) ? Number(e.target.value) : 0
                  );
                  setChangeQuestionData(modelQuestions);
                }}
              >
                <option value="0">Physics</option>
                <option value="1">Mathematics</option>
                <option value="2">Biology</option>
                <option value="3">Chemistry</option>
                <option value="4">ICT</option>
              </select>
            </div>
            <div className="add_question_entry_container">
              {changeQuestionData.map((x, i) => {
                const id = uuid();
                return (
                  <ChangeQuestionEntry
                    data={changeQuestionData}
                    index={i}
                    key={i}
                    deleteEntry={deleteAddQuestionEntry}
                    id={id}
                    setData={setChangeQuestionData}
                  />
                );
              })}
            </div>
            <div className="entry_btn_container">
              <button
                type="button"
                className="btn btn_secondary"
                onClick={() => {
                  const newChangeQuestionData = changeQuestionData.slice();
                  newChangeQuestionData.push(modelQuestions[0]);
                  setChangeQuestionData(newChangeQuestionData);
                }}
              >
                Add New Entry
              </button>
              <button className="btn btn_primary" type="submit">
                Submit & Change
              </button>
            </div>
          </form>
          <footer className="danger_zone">
            <h3>Danger Zone</h3>
            <button
              className="btn btn_red"
              type="button"
              onClick={() => {
                resetResults();
              }}
            >
              Reset Marks
            </button>
          </footer>
        </section>
      ) : (
        <section className="authorized">
          <form onSubmit={authorize}>
            <h1>Enter the security Password</h1>
            <input
              type="password"
              value={passwordInput}
              onChange={(e) => {
                setPasswordInput(e.target.value);
              }}
            />
            <button type="submit" className="btn btn_secondary">
              Submit
            </button>
          </form>
        </section>
      )}
    </main>
  );
};
export default DashboardPage;
