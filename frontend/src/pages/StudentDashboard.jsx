import { useState, useEffect } from "react";
import API from "../services/api";
import SubmissionHistory from "../components/SubmissionHistory";

function StudentDashboard() {
  const [studentName, setStudentName] = useState("");
  const [rollNumber, setRollNumber] = useState("");
  const [detailsSaved, setDetailsSaved] = useState(false);

  const [questions, setQuestions] = useState([]); // ✅ FIX ADDED
  const [selectedQuestion, setSelectedQuestion] = useState("");
  const [content, setContent] = useState("");
  const [file, setFile] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(false);

  const studentId = 1;

  // ==========================
  // Save Student Details
  // ==========================
  const saveStudentDetails = () => {
    if (!studentName.trim() || !rollNumber.trim()) {
      alert("Please enter Name and Roll Number");
      return;
    }
    setDetailsSaved(true);
  };

  // ==========================
  // Fetch Questions
  // ==========================
  const fetchQuestions = async () => {
    try {
      const res = await API.get("/assignments/");
      setQuestions(res.data);
    } catch (error) {
      console.error("Failed to fetch questions:", error);
    }
  };

  // ==========================
  // Fetch Submissions
  // ==========================
  const fetchSubmissions = async () => {
    try {
      const res = await API.get(
        `/submissions/student/${studentId}`
      );
      setSubmissions(res.data);
    } catch (error) {
      console.error("Failed to fetch submissions:", error);
    }
  };

  // ==========================
  // Submit Text
  // ==========================
  const submitTextAssignment = async () => {
    console.log("Submit clicked");

    if (!detailsSaved) {
      alert("Enter your details first.");
      return;
    }

    if (!selectedQuestion) {
      alert("Please select a question.");
      return;
    }

    if (!content.trim()) {
      alert("Write your answer.");
      return;
    }

    try {
      setLoading(true);

      const response = await API.post("/submissions/", {
        student_id: studentId,
        assignment_id: Number(selectedQuestion), // ✅ FIX
        content: content,
      });

      console.log("Response:", response.data);

      alert("Answer submitted successfully!");
      setContent("");
      fetchSubmissions();
    } catch (error) {
      console.error("Submission error:", error.response?.data || error.message);
      alert("Submission failed. Check console.");
    } finally {
      setLoading(false);
    }
  };

  // ==========================
  // Submit PDF
  // ==========================
  const submitPDF = async () => {
    if (!detailsSaved) {
      alert("Enter your details first.");
      return;
    }

    if (!selectedQuestion || !file) {
      alert("Select question and choose PDF.");
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("file", file);
      formData.append("student_id", studentId);
      formData.append("assignment_id", Number(selectedQuestion)); // ✅ FIX

      await API.post("/submissions/upload", formData);

      alert("PDF uploaded successfully!");
      setFile(null);
      fetchSubmissions();
    } catch (error) {
      console.error("Upload error:", error.response?.data || error.message);
      alert("Upload failed.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestions();
    fetchSubmissions();
  }, []);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">
        Student Dashboard
      </h1>

      {/* Student Details */}
      <div className="bg-slate-800 p-6 rounded-xl mb-8 shadow-lg">
        {!detailsSaved ? (
          <>
            <input
              type="text"
              placeholder="Enter Your Name"
              value={studentName}
              onChange={(e) => setStudentName(e.target.value)}
              className="w-full p-4 bg-slate-700 rounded-lg mb-4"
            />
            <input
              type="text"
              placeholder="Enter Roll Number"
              value={rollNumber}
              onChange={(e) => setRollNumber(e.target.value)}
              className="w-full p-4 bg-slate-700 rounded-lg mb-4"
            />
            <button
              onClick={saveStudentDetails}
              className="bg-green-500 px-6 py-2 rounded-lg"
            >
              Save Details
            </button>
          </>
        ) : (
          <div>
            <p><strong>Name:</strong> {studentName}</p>
            <p><strong>Roll No:</strong> {rollNumber}</p>
          </div>
        )}
      </div>

      {/* Question Select */}
      <div className="bg-slate-800 p-6 rounded-xl mb-8 shadow-lg">
        <select
          value={selectedQuestion}
          onChange={(e) => setSelectedQuestion(e.target.value)}
          className="w-full p-4 bg-slate-700 rounded-lg"
        >
          <option value="">-- Choose Question --</option>
          {questions.map((q) => (
            <option key={q.id} value={q.id}>
              {q.title}
            </option>
          ))}
        </select>
      </div>

      {/* Submit Text */}
      <div className="bg-slate-800 p-6 rounded-xl mb-8 shadow-lg">
        <textarea
          rows="6"
          value={content}
          className="w-full p-4 bg-slate-700 rounded-lg mb-4"
          placeholder="Write your answer..."
          onChange={(e) => setContent(e.target.value)}
        />
        <button
          onClick={submitTextAssignment}
          disabled={loading}
          className="bg-sky-500 px-6 py-2 rounded-lg"
        >
          {loading ? "Submitting..." : "Submit Answer"}
        </button>
      </div>

      {/* Submit PDF */}
      <div className="bg-slate-800 p-6 rounded-xl mb-8 shadow-lg">
        <input
          type="file"
          accept=".pdf"
          onChange={(e) => setFile(e.target.files[0])}
        />
        <button
          onClick={submitPDF}
          disabled={loading}
          className="bg-purple-600 px-6 py-2 rounded-lg mt-4"
        >
          {loading ? "Uploading..." : "Upload PDF"}
        </button>
      </div>

      <SubmissionHistory submissions={submissions} />
    </div>
  );
}

export default StudentDashboard;
