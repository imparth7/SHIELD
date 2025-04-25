// // List of filter list URLs
// const filterLists = ["https://easylist.to/easylist/easylist.txt", "https://easylist.to/easylist/easyprivacy.txt"];

// // Store loaded filters and tracking
// let activeFilters = [];
// let blockedCount = 0;
// let usedIds = new Set();

// // Initialize on install
// chrome.runtime.onInstalled.addListener(() => {
//   chrome.storage.local.get(["blockedCount"], (result) => {
//     blockedCount = result.blockedCount || 0;
//   });
//   updateFilterLists();
//   setupBlockedRequestListener();
// });

// // Track blocked requests
// function setupBlockedRequestListener() {
//   chrome.declarativeNetRequest.onRuleMatchedDebug.addListener((info) => {
//     if (info.rule.ruleType === "block") {
//       blockedCount++;
//       chrome.storage.local.set({ blockedCount });
//     }
//   });
// }

// // Update filter lists
// async function updateFilterLists() {
//   try {
//     blockedCount = 0;
//     await chrome.storage.local.set({ blockedCount: 0, filterCount: 0 });

//     const responses = await Promise.all(filterLists.map((url) => fetch(url)));
//     const texts = await Promise.all(responses.map((res) => res.text()));

//     activeFilters = [];
//     usedIds.clear();
//     let ruleCounter = 1;

//     const allRules = texts.join("\n").split("\n");
//     for (const rule of allRules) {
//       if (activeFilters.length >= 5000) break;

//       const trimmed = rule.trim();
//       if (!trimmed || trimmed.startsWith("!") || trimmed.startsWith("#")) continue;

//       const dnrRule = convertToDNRRule(trimmed, ruleCounter++);
//       if (dnrRule && !usedIds.has(dnrRule.id)) {
//         activeFilters.push(dnrRule);
//         usedIds.add(dnrRule.id);
//       }
//     }

//     await updateDNREngine();
//     await chrome.storage.local.set({ filterCount: activeFilters.length });
//   } catch (error) {
//     console.error("Error updating filter lists:", error);
//   }
// }

// // Convert filter rules
// function convertToDNRRule(filterRule, id) {
//   // Domain blocking rules
//   if (filterRule.startsWith("||") && filterRule.endsWith("^")) {
//     const domain = filterRule.substring(2, filterRule.length - 1);
//     return {
//       id: id,
//       priority: 1,
//       action: { type: "block" },
//       condition: {
//         urlFilter: `||${domain}^`,
//         resourceTypes: ["script", "image", "stylesheet", "xmlhttprequest"],
//       },
//     };
//   }

//   // URL patterns
//   if (filterRule.startsWith("http://") || filterRule.startsWith("https://")) {
//     return {
//       id: id,
//       priority: 1,
//       action: { type: "block" },
//       condition: {
//         urlFilter: filterRule,
//         resourceTypes: ["script", "image"],
//       },
//     };
//   }

//   return null;
// }

// // Update DNR engine
// async function updateDNREngine() {
//   try {
//     const existingRules = await chrome.declarativeNetRequest.getDynamicRules();
//     const existingIds = existingRules.map((rule) => rule.id);

//     if (existingIds.length > 0) {
//       await chrome.declarativeNetRequest.updateDynamicRules({
//         removeRuleIds: existingIds,
//       });
//     }

//     const MAX_RULES_PER_UPDATE = 1000;
//     for (let i = 0; i < activeFilters.length; i += MAX_RULES_PER_UPDATE) {
//       const chunk = activeFilters.slice(i, i + MAX_RULES_PER_UPDATE);
//       await chrome.declarativeNetRequest.updateDynamicRules({
//         addRules: chunk,
//       });
//     }
//   } catch (error) {
//     console.error("Error updating DNR engine:", error);
//   }
// }

// // Message handling
// chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
//   if (request.action === "updateFilters") {
//     updateFilterLists().then(() => sendResponse({ success: true }));
//     return true;
//   }
//   if (request.action === "resetCounter") {
//     blockedCount = 0;
//     chrome.storage.local.set({ blockedCount: 0 });
//     sendResponse({ success: true });
//     return true;
//   }
// });

// // Daily updates
// setInterval(updateFilterLists, 24 * 60 * 60 * 1000);

chrome.runtime.onInstalled.addListener(() => {
  console.log("SHIELD is installed and blocking ads.");
});
