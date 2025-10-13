import "./App.css";
import BeefreeEditor from "./BeefreeEditor";
import { useState, useEffect } from "react";
import axios from "axios";
import dayjs from "dayjs";

function SavedTemplatesButton(props) {
  return (
    <button
      onClick={props.toggleShowSaves}
      style={{ padding: "10px 20px", fontSize: "16px" }}
    >
      Saved Templates
    </button>
  );
}

function TemplateList(props) {
  const [templates, setTemplates] = useState([]);
  const [error, setError] = useState("");

  const handleDelete = async (id) => {
    try {
      const response = await axios.delete(
        `http://localhost:3001/api/templates/${id}`
      );
      console.log("record deleted", response.data);
      setTemplates((prev) => prev.filter((t) => t.id !== id));
    } catch {
      console.error("Error Deleting Template.");
    }
  };

  const handleClick = async (id) => {
    try {
      const config = {
        method: "get",
        url: `http://localhost:3001/api/templates/${id}`,
      };

      const response = await axios(config);

      props.setSelectedTemplate(JSON.stringify(response.data, null, 2));
    } catch (error) {
      console.error("Error fetching template:", error.message);
    }
  };

  useEffect(() => {
    async function fetchTemplates() {
      try {
        const response = await axios.get("http://localhost:3001/api/templates");
        setTemplates(response.data);
      } catch (err) {
        console.error("Error fetching templates:", err);
        setError("Failed to load templates");
      }
    }

    fetchTemplates();
  }, []);

  if (error) return <p>{error}</p>;

  return (
    <div style={{ padding: "1rem" }}>
      <h2>Email Templates</h2>
      {templates.length === 0 ? (
        <p>No templates found.</p>
      ) : (
        <ul>
          {templates.map((template) => (
            <li key={template.id}>
              <span onClick={() => handleClick(template.id)}>
                {" "}
                Email Template saved at:{" "}
                {dayjs(template.created_at).format("MMM D, YYYY h:mm")}{" "}
              </span>
              <a onClick={() => handleDelete(template.id)} href="#">
                (Delete)
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function DocsButton() {
  return (
    <a
      href="https://docs.beefree.io/beefree-sdk"
      target="_blank"
      rel="noopener noreferrer"
    >
      <button style={{ padding: "10px 20px", fontSize: "16px" }}>
        Read the Docs
      </button>
    </a>
  );
}

function App() {
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  // toggle saved tamplates
  const [showSaves, setShowSaves] = useState(false);

  const toggleShowSaves = () => {
    setShowSaves((prev) => !prev);
  };
  return (
    <div className="App">
      <header className="App-header">
        <h1>Welcome to My Beefree Demo</h1>
        <div>
          <DocsButton />
          <SavedTemplatesButton
            setShowSaves={setShowSaves}
            toggleShowSaves={toggleShowSaves}
          />
        </div>
        {showSaves && (
          <TemplateList setSelectedTemplate={setSelectedTemplate} />
        )}
        <BeefreeEditor selectedTemplate={selectedTemplate} />
      </header>
    </div>
  );
}

export default App;
