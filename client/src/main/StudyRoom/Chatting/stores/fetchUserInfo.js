export async function fetchUserInfo() {
  try {
    const response = await fetch("http://localhost:8080/users/userinfo");
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching user info:", error);
    throw error;
  }
}
