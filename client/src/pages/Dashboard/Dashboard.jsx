import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Trash2, Plus } from "lucide-react";
import { notesService } from "../../services/notesService";
import { useAuth } from "../../contexts/AuthContext";

const Dashboard = () => {
  const [notes, setNotes] = useState([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newNote, setNewNote] = useState({ title: "", content: "" });
  const [loading, setLoading] = useState(false);
  const [notesLoading, setNotesLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  useEffect(() => {
    if (user) {
      fetchNotes();
    }
  }, [user]);

  const fetchNotes = async () => {
    setNotesLoading(true);
    setError("");
    try {
      const response = await notesService.getNotes();
      setNotes(response.data || []);
    } catch (error) {
      setError(error.response?.data?.message || "Failed to fetch notes");
      if (error.response?.status === 401) {
        logout();
        navigate("/login");
      }
    }
    setNotesLoading(false);
  };

  const handleCreateNote = async (e) => {
    e.preventDefault();
    if (!newNote.title.trim() || !newNote.content.trim()) {
      setError("Title and content are required");
      return;
    }

    setLoading(true);
    setError("");
    try {
      await notesService.createNote(newNote);
      setNewNote({ title: "", content: "" });
      setShowCreateForm(false);
      fetchNotes();
    } catch (error) {
      setError(error.response?.data?.message || "Failed to create note");
      if (error.response?.status === 401) {
        logout();
        navigate("/login");
      }
    }
    setLoading(false);
  };

  const handleDeleteNote = async (noteId) => {
    if (!window.confirm("Are you sure you want to delete this note?")) return;

    try {
      await notesService.deleteNote(noteId);
      fetchNotes();
    } catch (error) {
      setError(error.response?.data?.message || "Failed to delete note");
      if (error.response?.status === 401) {
        logout();
        navigate("/login");
      }
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  if (!user) {
    navigate("/login");
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <img src="/icon.png" alt="Logo" className="h-8 w-auto mr-3" />
              <h1 className="text-2xl font-semibold text-gray-900">
                Dashboard
              </h1>
            </div>
            <button
              onClick={handleLogout}
              className="text-blue-600 hover:text-blue-800 text-sm font-medium underline"
            >
              Sign out
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Card */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8 text-left">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Welcome, {user.name || user.email.split("@")[0]}!
          </h2>
          <p className="text-gray-600 text-sm">Email: {user.email}</p>
        </div>

        {/* Create Note Button */}
        <div className="mb-6">
          <button
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-md flex items-center justify-center"
          >
            <Plus className="h-5 w-5 mr-2" />
            Create note
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm mb-6">
            {error}
          </div>
        )}

        {/* Create Note Form */}
        {showCreateForm && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h3 className="text-lg font-semibold mb-4 text-left">
              Create New Note
            </h3>
            <form onSubmit={handleCreateNote}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2 text-left">
                  Title *
                </label>
                <input
                  type="text"
                  value={newNote.title}
                  onChange={(e) =>
                    setNewNote({ ...newNote, title: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  maxLength={100}
                  placeholder="Enter note title"
                  required
                />
                <p className="text-xs text-gray-500 mt-1 text-left">
                  {newNote.title.length}/100 characters
                </p>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2 text-left">
                  Content *
                </label>
                <textarea
                  value={newNote.content}
                  onChange={(e) =>
                    setNewNote({ ...newNote, content: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  rows={4}
                  maxLength={10000}
                  placeholder="Enter note content"
                  required
                />
                <p className="text-xs text-gray-500 mt-1 text-left">
                  {newNote.content.length}/10000 characters
                </p>
              </div>

              <div className="flex gap-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md disabled:opacity-50"
                >
                  {loading ? "Creating..." : "Create Note"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateForm(false);
                    setNewNote({ title: "", content: "" });
                  }}
                  className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-md"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Notes Section */}
        <div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-6 text-left">
            Notes
          </h2>

          {notesLoading ? (
            <div className="text-center py-12">
              <p className="text-gray-500">Loading notes...</p>
            </div>
          ) : notes.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">
                No notes yet. Create your first note!
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {notes.map((note) => (
                <div
                  key={note._id}
                  className="bg-white rounded-[10px] border border-gray-200 p-4 relative flex items-center justify-between"
                  style={{ height: "50px" }}
                >
                  <div className="flex-1 min-w-0">
                    <h3 className="text-base font-medium text-gray-900 truncate text-left">
                      {note.title}
                    </h3>
                  </div>

                  <button
                    onClick={() => handleDeleteNote(note._id)}
                    className="text-gray-800 hover:text-red-600 ml-3 flex-shrink-0"
                    title="Delete note"
                  >
                    <Trash2 className="h-6 w-6" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
