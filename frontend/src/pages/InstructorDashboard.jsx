import { useState, useEffect } from "react";
import API from "../services/api";
import SubmissionTable from "../components/SubmissionTable";

function InstructorDashboard() {
  const [instructorName] = useState("Dr. Smith");

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [marks, setMarks] = useState("");
  const [difficulty, setDifficulty] = useState("Medium");
  const [deadline, setDeadline] = useState("");

  const [assignments, setAssignments] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(false);

  const instructorId = 1;

  // ==========================
  // Create Question (FIXED)
  // ==========================
  const createAssignment = async () => {
    console.log("Publish clicked");

    if (!title.trim() || !description.trim() || !marks || !deadline) {
      alert("Please fill all required fields");
      return;
    }

    try {
      setLoading(true);

      const payload = {
        title: title.trim(),
        description: description.trim(),
        marks: parseInt(marks),
        difficulty: difficulty || "Medium",
        deadline: deadline, // already yyyy-mm-dd
        created_by: instructorId,
      };

      console.log("Sending data:", payload);

      const response = await API.post("/assignments/", payload);

      console.log("Success:", response.data);

      alert("Question published successfully!");

      // Reset form
      setTitle("");
      setDescription("");
      setMarks("");
      setDifficulty("Medium");
      setDeadline("");

      fetchAssignments();
    } catch (error) {
      console.error("Publish error:", error.response?.data || error.message);
      alert(
        error.response?.data?.detail ||
          "Backend error while publishing."
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================
  // Delete Question
  // ==========================
  const deleteAssignment = async (id) => {
    if (!window.confirm("Delete this question?")) return;

    try {
      await API.delete(`/assignments/${id}`);
      fetchAssignments();
    } catch (error) {
      console.error(error);
      alert("Unable to delete question");
    }
  };

  // ==========================
  // Fetch Data
  // ==========================
  const fetchAssignments = async () => {
    try {
      const res = await API.get("/assignments/");
      setAssignments(res.data);
    } catch (error) {
      console.error("Fetch assignments error:", error);
    }
  };

  const fetchSubmissions = async () => {
    try {
      const res = await API.get("/submissions/");
      setSubmissions(res.data);
    } catch (error) {
      console.error("Fetch submissions error:", error);
    }
  };

  useEffect(() => {
    fetchAssignments();
    fetchSubmissions();
  }, []);

  return (
    <div>
      <div className="mb-10">
        <h1 className="text-3xl font-bold">
          Instructor Dashboard
        </h1>
        <p className="text-slate-400 mt-2">
          Welcome, {instructorName}
        </p>
      </div>

      {/* Create Question */}
      <div className="bg-slate-800 p-8 rounded-2xl mb-10 shadow-lg">
        <h2 className="text-2xl font-semibold mb-6">
          Create Question for Students
        </h2>

        <input
          value={title}
          className="w-full p-4 bg-slate-700 rounded-lg mb-4"
          placeholder="Question Title"
          onChange={(e) => setTitle(e.target.value)}
        />

        <textarea
          value={description}
          className="w-full p-4 bg-slate-700 rounded-lg mb-4"
          placeholder="Full Question Description"
          rows="4"
          onChange={(e) => setDescription(e.target.value)}
        />

        <div className="grid grid-cols-2 gap-4 mb-4">
          <input
            type="number"
            value={marks}
            className="p-4 bg-slate-700 rounded-lg"
            placeholder="Total Marks"
            onChange={(e) => setMarks(e.target.value)}
          />

          <select
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
            className="p-4 bg-slate-700 rounded-lg"
          >
            <option value="Easy">Easy</option>
            <option value="Medium">Medium</option>
            <option value="Hard">Hard</option>
          </select>
        </div>

        <input
          type="date"
          value={deadline}
          className="w-full p-4 bg-slate-700 rounded-lg mb-6"
          onChange={(e) => setDeadline(e.target.value)}
        />

        <button
          onClick={createAssignment}
          disabled={loading}
          className="bg-emerald-500 hover:bg-emerald-600 px-8 py-3 rounded-lg"
        >
          {loading ? "Publishing..." : "Publish Question"}
        </button>
      </div>

      {/* Question List */}
      <div className="bg-slate-800 p-8 rounded-2xl mb-10 shadow-lg">
        <h2 className="text-2xl font-semibold mb-6">
          Published Questions ({assignments.length})
        </h2>

        {assignments.length === 0 ? (
          <p className="text-slate-400">
            No questions published yet.
          </p>
        ) : (
          assignments.map((a) => (
            <div
              key={a.id}
              className="bg-slate-700 p-6 rounded-xl mb-4"
            >
              <h3 className="text-lg font-semibold">
                {a.title}
              </h3>
              <p className="text-slate-300 mt-2">
                {a.description}
              </p>
              <p className="text-sm text-slate-400 mt-3">
                Marks: {a.marks} | Difficulty: {a.difficulty} | Deadline: {a.deadline}
              </p>

              <button
                onClick={() => deleteAssignment(a.id)}
                className="mt-4 bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg"
              >
                Delete
              </button>
            </div>
          ))
        )}
      </div>

      <SubmissionTable submissions={submissions} />
    </div>
  );
}

export default InstructorDashboard;
