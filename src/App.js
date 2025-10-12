import "./App.css";
import BeefreeEditor from "./BeefreeEditor";
import { useState, useEffect } from "react";
import axios from "axios";

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
  // Stores list of tamplates on the server
  const [templates, setTemplates] = useState([]);
  const [error, setError] = useState("");

  const handleClick = async (id) => {
    console.log(id);
    // make a request to access a single template in Json format
    try {
      const config = {
        method: "get",
        url: `http://localhost:3001/api/templates/${id}`,
      };

      const response = await axios(config);
      // console.log(JSON.stringify(response.data, null, 2));
      props.setSelectedTemplate(JSON.stringify(response.data, null, 2));
    } catch (error) {
      console.error("Error fetching template:", error.message);
    }
    // Convert to JSON if necessary
    // Pass to setSelectedTemplate
  };

  useEffect(() => {
    async function fetchTemplates() {
      try {
        const response = await axios.get("http://localhost:3001/api/templates");
        setTemplates(response.data); // expects an array of templates
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
            <li onClick={() => handleClick(template.id)} key={template.id}>
              {template.name} — <em>{template.created_at}</em>
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
