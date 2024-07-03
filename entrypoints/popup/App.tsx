import { useEffect, useState } from "react";
import reactLogo from "@/assets/react.svg";
import wxtLogo from "/wxt.svg";
import "./App.css";

function App() {
  const [count, setCount] = useState(0);

  const sendData = async () => {
    setCount((count) => count + 1);
    try {
      const response = await sendMessageToContentScript({
        message: "hi",
        count: count,
      });
      console.log("Message sent to content script:", response);
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  // const dataToSend = { message: "Hello from popup!" }; // Your data to send

  // document.getElementById("sendButton")?.addEventListener("click", async () => {
  //   try {
  //     const response = await sendMessageToContentScript(dataToSend);
  //     console.log("Message sent to content script:", response);
  //   } catch (error) {
  //     console.error("Error sending message:", error);
  //   }
  // });

  // messageUtils.ts (Optional - for cleaner code)
  async function sendMessageToContentScript(data: any) {
    const tabs = await browser.tabs.query({
      active: true,
      currentWindow: true,
    });
    if (!tabs.length) return;

    const response = await browser.tabs.sendMessage(tabs[0].id!, data);
    return response;
  }

  useEffect(() => {
    browser.runtime.onMessage.addListener((request, sender, sendResponse) => {
      console.log("Received message from content script:", request);
      if (request.someData) {
        // Identify data from content script
        console.log("Received message from content script:", request.someData);
      }
    });
  }, []);

  browser.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.log("Received message from content script:", request);
    if (request.someData) {
      // Identify data from content script
      console.log("Received message from content script:", request.someData);
    }
  });

  return (
    <>
      <div>
        <a href="https://wxt.dev" target="_blank">
          <img src={wxtLogo} className="logo" alt="WXT logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>WXT + React</h1>
      <div className="card">
        <button onClick={() => sendData()}>count is {count}</button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the WXT and React logos to learn more
      </p>
    </>
  );
}

export default App;
