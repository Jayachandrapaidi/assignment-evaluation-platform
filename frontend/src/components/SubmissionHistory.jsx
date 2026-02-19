import { useState } from "react";

function SubmissionHistory({ submissions = [] }) {
  const [selectedFeedback, setSelectedFeedback] = useState(null);

  return (
    <div className="bg-slate-800 p-6 rounded-2xl mt-8 shadow-lg">
      <h2 className="text-xl font-semibold mb-4 text-white">
        Submission History
      </h2>

      {submissions.length === 0 ? (
        <p className="text-slate-400">No submissions available</p>
      ) : (
        <>
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-600 text-slate-300">
                <th className="py-2">Assignment ID</th>
                <th className="py-2">Status</th>
                <th className="py-2">Plagiarism</th>
                <th className="py-2">Score</th>
                <th className="py-2">Action</th>
              </tr>
            </thead>

            <tbody>
              {submissions.map((s) => (
                <tr
                  key={s.id}
                  className="border-b border-slate-700 hover:bg-slate-700/40 transition"
                >
                  <td className="py-2">{s.assignment_id}</td>

                  {/* Submission Status */}
                  <td className="py-2">
                    {s.score ? (
                      <span className="bg-emerald-500/20 text-emerald-400 px-3 py-1 rounded-full text-sm">
                        Evaluated
                      </span>
                    ) : (
                      <span className="bg-amber-500/20 text-amber-400 px-3 py-1 rounded-full text-sm">
                        Pending
                      </span>
                    )}
                  </td>

                  <td className="py-2 text-amber-400">
                    {s.plagiarism_risk ?? "N/A"}
                  </td>

                  <td className="py-2 text-sky-400 font-medium">
                    {s.score ?? "Not graded"}
                  </td>

                  {/* View Feedback Button */}
                  <td className="py-2">
                    <button
                      onClick={() =>
                        setSelectedFeedback(s.feedback || "No feedback available")
                      }
                      className="bg-sky-600 hover:bg-sky-700 px-3 py-1 rounded-lg text-sm"
                    >
                      View Feedback
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Feedback Section */}
          {selectedFeedback && (
            <div className="mt-6 bg-slate-700 p-4 rounded-xl">
              <h3 className="font-semibold text-white mb-2">
                Feedback
              </h3>
              <p className="text-slate-300">
                {selectedFeedback}
              </p>

              <button
                onClick={() => setSelectedFeedback(null)}
                className="mt-3 text-sm text-red-400 hover:text-red-500"
              >
                Close
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default SubmissionHistory;
