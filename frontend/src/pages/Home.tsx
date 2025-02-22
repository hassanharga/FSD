import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

type User = {
  id: string;
  email: string;
  name: string;
};
async function getUserProfile(): Promise<User> {
  const response = await fetch("/api/auth/profile", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
    },
  });

  if (response?.status === 401) {
    console.log("Unauthorized! Logging out...");
    localStorage.removeItem("accessToken"); // Clear access token
    window.location.href = "/login"; // Redirect to login page
  }
  if (!response.ok) {
    const errorResponse = await response.json();
    throw new Error(errorResponse.message || "Network response was not ok");
  }
  return response.json();
}

function Home() {
  const navigate = useNavigate();

  const { data, isLoading } = useQuery({
    queryKey: ["user"],
    queryFn: getUserProfile,
  });

  console.log("data ====>", data);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      navigate("/login");
    }
  }, [navigate]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Home</h1>
      <p>Name: {data?.name}</p>
      <p>Email: {data?.email}</p>
    </div>
  );
}

export default Home;
