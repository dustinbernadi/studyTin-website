export async function updateMinutesToServer(notYetUploaded) {
  const token = localStorage.getItem("token");

  if (!token)
    return console.warn("No token found. User might not be logged in.");

  try {
    const res = await fetch("https://studytin-server-production.up.railway.app/api/auth/update-minutes", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ minutesToAdd: notYetUploaded }),
    });

    const data = await res.json();
    if (res.ok) {
      console.log(
        "✅ Minutes uploaded:",
        notYetUploaded,
        "| New total:",
        data.newTotal
      );
    } else {
      console.error("❌ Failed to upload minutes:", data.message);
    }
  } catch (error) {
    console.error("❌ Network error during minutes upload:", error);
  }
}
