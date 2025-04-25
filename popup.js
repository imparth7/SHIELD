document.addEventListener("DOMContentLoaded", function () {
  // Update button
  document.getElementById("update").addEventListener("click", function () {
    document.getElementById("status").textContent = "Updating...";
    document.getElementById("status").style.color = "#f39c12";

    chrome.runtime.sendMessage({ action: "updateFilters" }, (response) => {
      if (response && response.success) {
        document.getElementById("status").textContent = "Active";
        document.getElementById("status").style.color = "#27ae60";
      } else {
        document.getElementById("status").textContent = "Error";
        document.getElementById("status").style.color = "#e74c3c";
      }
    });
  });

  // Reset button
  document.getElementById("reset").addEventListener("click", function () {
    chrome.runtime.sendMessage({ action: "resetCounter" });
  });

  // Load initial data
  updatePopupData();

  // Update every second for real-time counter
  setInterval(updatePopupData, 1000);
});

function updatePopupData() {
  chrome.storage.local.get(["filterCount", "blockedCount"], function (result) {
    // Format number with commas
    const blockedFormatted = (result.blockedCount || 0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    document.getElementById("blockedCounter").textContent = blockedFormatted;
    document.getElementById("filterCount").textContent = result.filterCount || "0";
  });
}
