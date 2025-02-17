import { useState, useEffect } from "react";
import { fetchQueries, updateQuery, addQueryNote } from "../api";

// Define types for Query and Note
interface Note {
  text: string;
  createdAt: string;
}

interface Query {
  _id: string;
  name: string;
  email: string;
  message: string;
  status: string;
  notes: Note[];
}

const CQM = () => {
  const [queries, setQueries] = useState<Query[]>([]);
  const [selectedQuery, setSelectedQuery] = useState<Query | null>(null);
  const [note, setNote] = useState<string>("");

  useEffect(() => {
    const loadQueries = async () => {
      const data = await fetchQueries();
      setQueries(data);
    };
    loadQueries();
  }, []);

  const handleStatusChange = async (queryId: string, newStatus: string) => {
    const updatedQuery = await updateQuery(queryId, { status: newStatus });
    setQueries(queries.map(query => query._id === queryId ? updatedQuery : query));
  };

  const handleAddNote = async (queryId: string, note: string) => {
    const updatedQuery = await addQueryNote(queryId, { text: note, createdAt: new Date().toISOString() });
    setQueries(queries.map(query => query._id === queryId ? updatedQuery : query));
    setNote("");
  };

  return (
    <div>
      <h2>Client Query Management</h2>
      <div>
        <h3>All Queries</h3>
        <ul>
          {queries.map(query => (
            <li key={query._id}>
              {query.name} - {query.status}
              <button onClick={() => setSelectedQuery(query)}>View</button>
            </li>
          ))}
        </ul>
      </div>
      {selectedQuery && (
        <div>
          <h3>Query Details</h3>
          <p>{selectedQuery.name}</p>
          <p>{selectedQuery.email}</p>
          <p>{selectedQuery.message}</p>
          <div>
            <h4>Actions</h4>
            <button onClick={() => handleStatusChange(selectedQuery._id, "Talked with Client")}>Talked with Client</button>
            <button onClick={() => handleStatusChange(selectedQuery._id, "Client Applied for Booking")}>Client Applied for Booking</button>
            <button onClick={() => handleStatusChange(selectedQuery._id, "Resolved")}>Resolved</button>
            
            <div>
              <h4>Notes</h4>
              <ul>
                {selectedQuery.notes.map((note, index) => (
                  <li key={index}>{note.text} - {new Date(note.createdAt).toLocaleString()}</li>
                ))}
              </ul>
              <input
                type="text"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Add a note"
              />
              <button onClick={() => handleAddNote(selectedQuery._id, note)}>Add Note</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CQM;