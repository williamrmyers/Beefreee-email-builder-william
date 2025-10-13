import { useEffect, useRef } from "react";
import axios from "axios";
import BeefreeSDK from "@beefree.io/sdk";

export default function BeefreeEditor(props) {
  const containerRef = useRef(null);
  const beeRef = useRef(null); // Init Ref for SDK

  useEffect(() => {
    async function initializeEditor() {
      try {
        const authResponse = await axios.post(
          "http://localhost:3001/proxy/bee-auth",
          {
            uid: "demo-user",
          }
        );

        const beeToken = authResponse.data;

        // BeeFree SDK configuration
        const beeConfig = {
          container: "beefree-react-demo",
          language: "en-US",
          // Save
          onSave: async (
            pageJson,
            pageHtml,
            ampHtml,
            templateVersion,
            language
          ) => {
            // inside onSave or onChange handler
            console.log("Saving template......");

            const templateData = {
              name: pageJson?.name || "Untitled Template",
              data: {
                json: pageJson,
                html: pageHtml,
                ampHtml,
                version: templateVersion,
                language,
              },
            };

            try {
              const saveResponse = await axios.post(
                "http://localhost:3001/api/templates",
                templateData,
                {
                  headers: { "Content-Type": "application/json" },
                }
              );

              console.log("Template saved successfully:", saveResponse.data);
              alert(`Template saved: ${saveResponse.data.name}`);
            } catch (error) {
              console.error("Error saving template:", error);
              alert("Failed to save template — check console logs");
            }
          },

          onError: (error) => {
            console.error("BeeFree Error:", error);
          },
        };

        // Initialize BeeFree
        const bee = new BeefreeSDK(beeToken);
        // Save reference for later updates,
        // WILL be used to reinitialize without having to reload the component or the SDK.
        beeRef.current = bee;
        await bee.start(beeConfig, {});
      } catch (error) {
        console.error("Error initializing BeeFree:", error);
      }
    }

    initializeEditor();
  }, []);

  useEffect(() => {
    if (!props.selectedTemplate) return;
    // Convert to JSON with metadata
    const templateData = JSON.parse(props.selectedTemplate);

    // Contains only the JSON template
    const loadedTemplate = templateData.data.json;

    if (loadedTemplate) {
      console.log("Loading new template into BeeFree", loadedTemplate);

      // Will loads new template JSON into BeeFree editor
      beeRef.current.load(loadedTemplate);
    }
  }, [props.selectedTemplate]); // Dependency array is going rerender whenever template changes

  return (
    <div
      id="beefree-react-demo"
      ref={containerRef}
      style={{
        height: "600px",
        width: "90%",
        margin: "20px auto",
        border: "1px solid #ddd",
        borderRadius: "8px",
      }}
    />
  );
}
