import React, { useEffect, useState } from "react";
import { question_order } from "../data/questions";
import { ISubmittedResult } from "../App";
import { useSocketContext } from "..";
import { schools } from "../data/schools";

const HomePage = () => {
  const [submittedResults, setSubmittedResults] = useState<ISubmittedResult[]>(
    []
  );
  const [sortedMarks, setSortedMarks] = useState<
    { school_id: number; school_name: string; total_marks: number }[]
  >([]);

  const socket = useSocketContext()!;

  const handleResultsDispatched = (data: ISubmittedResult[]) => {
    setSubmittedResults(data);
  };

  const handleResultsSubmitted = (data: ISubmittedResult) => {
    setSubmittedResults((submittedResults) => {
      const newSubmittedResults = submittedResults.slice();

      newSubmittedResults.push(data);

      return newSubmittedResults;
    });
    calculateThePlace();
  };

  const calculateTotalMarks = () => {
    const totalResults: number[] = [0, 0, 0, 0, 0, 0, 0];
    submittedResults.forEach((r) => {
      if (totalResults[r.school_id]) {
        totalResults[r.school_id] += r.marks;
      } else totalResults[r.school_id] = r.marks;
    });
    console.log(totalResults);

    return totalResults;
  };
  const calculateThePlace = () => {
    const totalMarks = calculateTotalMarks();
    const beforeSortedData = totalMarks.map((item, i) => {
      return {
        school_name: schools[i],
        total_marks: item,
        school_id: i,
      };
    });
    const afterSortedData = beforeSortedData.sort(
      (a, b) => b.total_marks - a.total_marks
    );
    setSortedMarks(afterSortedData);
  };

  useEffect(() => {
    calculateThePlace();
  }, [submittedResults]);

  useEffect(() => {
    socket.emit("get_results");
  }, []);

  useEffect(() => {
    console.log("effect triggered");

    socket.on("results_dispatched", handleResultsDispatched);
    socket.on("results_submitted", handleResultsSubmitted);

    return () => {
      socket.off("results_dispatched", handleResultsDispatched);
      socket.off("results_submitted", handleResultsSubmitted);
    };
  }, [socket]);

  return (
    <main className="page home_page">
      <h1>Live Results Update</h1>
      <section className="results_section">
        <section className="finalized_results">
          {sortedMarks.map(({ school_id, school_name, total_marks }, i) => {
            return (
              <div className="sorted_marks_container" key={school_id}>
                <p>{`${i + 1}${
                  i + 1 === 1
                    ? "st"
                    : i + 1 === 2
                    ? "nd"
                    : i + 1 === 3
                    ? "rd"
                    : "th"
                }`}</p>
                <div>
                  <h3>{school_name}</h3>
                  <p>
                    Total Marks: <span>{total_marks}</span>
                  </p>
                </div>
              </div>
            );
          })}
        </section>
        <section className="submitted_results_container">
          {submittedResults.map((r, i) => {
            return (
              <div className="submitted_result" key={i}>
                <div>
                  <h3>{schools[r.school_id]}</h3>
                  <h4>{question_order[r.subject_id]}</h4>
                </div>
                <p>{r.marks}</p>
              </div>
            );
          })}
        </section>
      </section>
    </main>
  );
};

export default HomePage;
