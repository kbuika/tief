import { TreeObject } from "../types/types";

export default defineContentScript({
  matches: ["*://*/*"],
  runAt: "document_end",
  main() {
    console.log("Hello content.");
    browser.runtime.onMessage.addListener((request, sender, sendResponse) => {
      if (request.message === "hi") {
        console.log("Received message from popup:", request.message);
        console.log("Received message from popup:", request.count);

        // Process the received data and optionally send a response
        // sendResponse({ message: 'Received and processed!' });
      }
    });
    function getDomTree(node: Document | HTMLElement | ChildNode) {
      const treeObject: TreeObject = {
        nodeName: node.nodeName,
        nodeType: node.nodeType,
        nodeStyle: isHTMLElement(node) ? node.style : null,
        nodeValue: node.nodeValue,
        classList: isHTMLElement(node) ? node.classList : null,
        children: [],
      };

      // Check for child nodes
      if (node.childNodes.length) {
        treeObject.children = [];
        for (const child of Array.from(node.childNodes)) {
          treeObject.children.push(getDomTree(child));
        }
      }

      return treeObject;
    }

    function isHTMLElement(
      node: Document | HTMLElement | ChildNode
    ): node is HTMLElement {
      return (node as HTMLElement).style !== undefined;
    }
    const domTree = getDomTree(document as unknown as HTMLElement);
    console.log(domTree, "domTree");
    const transVal =
      domTree.children[1].children[2].children[1].children[9].children[1]
        .children;

    browser.runtime.sendMessage({ message: "hey", tree: transVal });
    console.log(transVal, "transVal");
    transVal.forEach((el: TreeObject) => {
      console.log(el.nodeStyle);
      if (el.nodeName === "DIV" || el.nodeName === "MAIN") {
        el.nodeStyle.border = "2px solid white";
      }
    });
  },
});
