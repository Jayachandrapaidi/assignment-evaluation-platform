function SubmissionTable({ submissions = [], onDeleteFeedback }) {
  return (
    <div className="bg-slate-800 p-6 rounded-2xl shadow-lg">
      <h2 className="text-xl font-semibold mb-4">
        Student Submissions
      </h2>

      {submissions.length === 0 ? (
        <p className="text-slate-400">
          No submissions available
        </p>
      ) : (
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-slate-700 text-slate-300">
              <th className="py-2">Student ID</th>
              <th className="py-2">Assignment</th>
              <th className="py-2">Score</th>
              <th className="py-2">Feedback</th>
              <th className="py-2">Action</th>
            </tr>
          </thead>

          <tbody>
            {submissions.map((s) => (
              <tr
                key={s.id}
                className="border-b border-slate-700"
              >
                <td className="py-2">{s.student_id}</td>
                <td className="py-2">{s.assignment_id}</td>
                <td className="py-2">
                  {s.score ?? "Not graded"}
                </td>
                <td className="py-2">
                  {s.feedback ?? "No feedback"}
                </td>
                <td className="py-2">
                  {s.feedback && (
                    <button
                      onClick={() => onDeleteFeedback(s.id)}
                      className="bg-red-500 hover:bg-red-600 px-3 py-1 rounded-lg text-sm"
                    >
                      Delete Feedback
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default SubmissionTable;
