import { useEffect, useRef } from "react";
import BeefreeSDK from "@beefree.io/sdk";

export default function BeefreeEditor() {
  const containerRef = useRef(HTMLDivElement);

  useEffect(() => {
    async function initializeEditor() {
      // Beefree SDK configuration
      const beeConfig = {
        container: "beefree-react-demo",
        language: "en-US",
        onSave: (pageJson, pageHtml, ampHtml, templateVersion, language) => {
          console.log("Saved!", {
            pageJson,
            pageHtml,
            ampHtml,
            templateVersion,
            language,
          });
        },
        onError: (error) => {
          console.error("Error:", error);
        },
      };

      // Get a token from your backend
      const response = await fetch("http://localhost:3001/proxy/bee-auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ uid: "demo-user" }),
      });

      const token = await response.json();

      // Initialize the editor
      const bee = new BeefreeSDK(token);
      bee.start(beeConfig, {});
    }

    initializeEditor();
  }, []);

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
