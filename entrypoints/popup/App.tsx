import { useEffect, useState } from "react";
import reactLogo from "@/assets/react.svg";
import wxtLogo from "/wxt.svg";
import "./App.css";
import { sendMessage, onMessage } from "webext-bridge/popup";

function App() {
  const [count, setCount] = useState(0);
  const [domTree, setDomTree] = useState([] as any);

  const sendData = async () => {
    setCount((count) => count + 1);
    const tabs = await browser.tabs.query({
      active: true,
      currentWindow: true,
    });
    try {
      const response = await sendMessage(
        "count",
        {
          text: "hi",
          count: count,
        },
        "content-script@" + tabs[0].id
      );
      console.log("Message sent to content script:", response);
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  useEffect(() => {
    onMessage("get-selection", async (message) => {
      console.log("Received message from background script bridge:", message);
      setDomTree(
        ((message?.data as { data: any })?.data as { tree: any })?.tree
      );
      console.log(
        JSON.parse(
          ((message?.data as { data: any })?.data as { tree: any })?.tree
        )
      );
    });
  }, []);

  const domTreeToHtml = (
    domObjects: [
      {
        nodeName: string;
        nodeValue: string;
        attributes: { [x: string]: any };
        children: any;
        classList: any;
        nodeType: number;
      }
    ]
  ) => {
    return domObjects
      .map(
        (domObject: {
          nodeName: string;
          nodeValue: string;
          attributes: { [x: string]: any };
          children: any;
          classList: any;
          nodeType: number;
        }) => {
          if (domObject.nodeName === "#text") {
            return domObject.nodeValue.trim(); // Handle text node
          } else if (domObject.nodeName) {
            const tag = domObject.nodeName.toLowerCase();
            let attributes = "";
            if (domObject.attributes) {
              for (const attr in domObject.attributes) {
                attributes += ` ${attr}="${domObject.attributes[attr]}"`;
              }
            }
            let children = "";
            if (domObject.children) {
              children = domTreeToHtml(domObject.children); // Recursive call for children
            }
            return `<${tag}${attributes}>${children}</${tag}>`;
          } else {
            throw new Error("Unsupported DOM object format.");
          }
        }
      )
      .join("");
  };

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
      </div>
      {/* <p className="read-the-docs">{domTree}</p> */}
      {domTreeToHtml(JSON.parse(domTree))}
    </>
  );
}

export default App;
