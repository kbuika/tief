import { onMessage, sendMessage } from "webext-bridge/background";

export default defineBackground(() => {
  console.log("Hello background!", { id: browser.runtime.id });

  onMessage("get-selection", async (message: any) => {
    console.log("Received message from content:", message);
    await sendMessage("get-selection", message, "popup");
    return "Hello from background!";
  });

  // browser.runtime.onMessage.addListener(async (message) => {
  //   console.log("background message:", message);
  //   // forward message to popup
  //   await sendMessage("get-selection", message, "popup");
  //   // Grab tabs matching content scripts
  //   const allTabs = await browser.tabs.query({});
  //   const contentScriptMatches = new MatchPattern("*://*/*");
  //   const contentScriptTabs = allTabs.filter(
  //     (tab) =>
  //       tab.id != null &&
  //       tab.url != null &&
  //       contentScriptMatches.includes(tab.url)
  //   );

  //   // Forward message to tabs, collecting the responses
  //   const responses = await Promise.all(
  //     contentScriptTabs.map(async (tab) => {
  //       const response = await browser.tabs.sendMessage(tab.id!, message);
  //       return { tab: tab.id, response };
  //     })
  //   );

  //   // Return an array of all responses back to popup.
  //   return responses;
  // });
});
