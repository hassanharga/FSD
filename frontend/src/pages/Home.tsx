import { Button } from "@/components/ui/button";
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

const Home = () => {
  const navigate = useNavigate();

  const { data, isLoading } = useQuery({
    queryKey: ["user"],
    queryFn: getUserProfile,
  });

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      navigate("/login");
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    navigate("/login");
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen text-center">
      <h1 className="text-4xl font-bold mb-4">
        Hello, {data?.name} <p className="text-sm font-light mb-4">({data?.email})</p>
      </h1>
      <Button onClick={handleLogout} className="px-4 py-2">
        Logout
      </Button>
    </div>
  );
};

export default Home;
