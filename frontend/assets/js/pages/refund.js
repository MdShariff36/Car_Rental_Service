// FILE: assets/js/pages/refund.js

document.addEventListener("DOMContentLoaded", function () {
  const refundForm = document.getElementById("refundForm");
  const submitBtn = refundForm.querySelector(".submit-btn");

  const urlParams = new URLSearchParams(window.location.search);
  const bookingId = urlParams.get("bookingId");

  if (!bookingId) {
    showNotification("Invalid booking", "error");
    setTimeout(() => (window.location.href = "/user/my-bookings.html"), 2000);
    return;
  }

  refundForm.addEventListener("submit", async function (e) {
    e.preventDefault();

    const reason = document.getElementById("refundReason").value.trim();
    const bankAccount = document.getElementById("bankAccount").value.trim();

    if (!reason) {
      showNotification("Please provide a reason for refund", "error");
      return;
    }

    if (!bankAccount) {
      showNotification("Please provide bank account details", "error");
      return;
    }

    setLoadingState(true);

    try {
      const token = AuthService.getToken();
      const response = await fetch(
        "http://localhost:8080/api/payments/refund",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            bookingId: parseInt(bookingId),
            reason: reason,
            bankAccount: bankAccount,
          }),
        },
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Refund request failed");
      }

      showNotification("Refund request submitted successfully", "success");

      setTimeout(() => {
        window.location.href = "/user/my-bookings.html";
      }, 2000);
    } catch (error) {
      console.error("Refund error:", error);
      showNotification(error.message || "Refund request failed", "error");
    } finally {
      setLoadingState(false);
    }
  });

  function setLoadingState(loading) {
    if (loading) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<span class="btn-text">Submitting...</span>';
    } else {
      submitBtn.disabled = false;
      submitBtn.innerHTML =
        '<span class="btn-text">Submit Refund Request</span>';
    }
  }

  function showNotification(message, type) {
    const notification = document.createElement("div");
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
            <div class="notification-content">
                <span class="notification-message">${message}</span>
            </div>
        `;
    document.body.appendChild(notification);
    setTimeout(() => notification.remove(), 5000);
  }
});
