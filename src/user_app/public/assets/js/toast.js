function showToast(type, message) {
  let toast = document.getElementById("toast");

  if (!toast) {
    toast = document.createElement("div");
    toast.id = "toast";
    toast.className = "toast";
    document.body.appendChild(toast);
  }

  // Set icon based on type
  let iconClass;
  let title;
  switch (type) {
    case "success":
      iconClass = "ri-check-line";
      title = "Success";
      break;
    case "error":
      iconClass = "ri-close-circle-line";
      title = "Error";
      break;
    case "info":
      iconClass = "ri-information-line";
      title = "Info";
      break;
    case "warning":
      iconClass = "ri-alert-line";
      title = "Warning";
      break;
    default:
      iconClass = "";
      title = "Notification";
  }

  // Set content and classes
  toast.className = `toast ${type}`;
  toast.innerHTML = `
    <div class="toast-content">
      <i class="toast-icon ${iconClass}"></i>
      <div class="message">
        <span class="text-title">${title}</span>
        <span class="text-body">${message}</span>
      </div>
    </div>
    <span class="close" onclick="hideToast()">✖</span>
    <div class="progress-bar"></div>`;

  // Show the toast
  toast.classList.add("show");

  // Hide after 3 seconds
  setTimeout(hideToast, 3000);
}

function hideToast() {
  const toast = document.getElementById("toast");
  if (toast) {
    toast.classList.remove("show");
  }
}

// Make functions globally available
window.showToast = showToast;
window.hideToast = hideToast;
