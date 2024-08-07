import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { handleError } from "../javaScript/errorHandler";
import useAuth from "../javaScript/useAuth";
// import axios from "axios"
import axiosInstance from "../javaScript/axiosInstance";

function Account() {
  const [userData, setUserData] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();
  const { authToken, loadingToken } = useAuth();

  const logout = async () => {
    const deleteCookie = (name) => {
      document.cookie =
        // name + "=; Max-Age=0; path=/; domain=" + window.location.hostname;
        `${name}=; Max-Age=0; path=/; domain=${window.location.hostname}`;
    };
    try {
      // await axios.post("/api/logout");
      await axiosInstance.post("/api/logout");
      sessionStorage.clear();
      deleteCookie("refreshToken");
      navigate("/");
    } catch (error) {
      setErrorMessage(handleError(error));
      console.error("Error logging out:", error);
    }
  };

  useEffect(() => {
    const fetchUserData = async () => {
      if (loadingToken) return; // Wait until token has been loaded (true)

      if (!authToken) {
        navigate("/LoginRegister");
        return;
      }

      try {
        console.log(`Token found @ Account.jsx ${authToken}`);
        // const res = await axios.get("/api/user", {
        const res = await axiosInstance.get("/api/user", {
          headers: { Authorization: `Bearer ${authToken}` },
        });
        setUserData(res.data);
      } catch (error) {
        console.error("Error fetching user data");
        setErrorMessage(handleError(error));
      }
    };
    fetchUserData();
  }, [authToken, loadingToken]); // empty dependency array to run once on mount

  if (!userData) {
    return (
      <div>
        Loading...<p>{errorMessage}</p>{" "}
      </div>
    );
  }

  return (
    <>
      <div>Welcome, {userData.username}</div>
      <button onClick={logout}>logout</button>
      <p>{errorMessage}</p>
    </>
  );
}

export default Account;
