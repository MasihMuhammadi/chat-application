import axios from "axios";
import Cookies from "js-cookie";
import { redirect } from "next/navigation";

// This helper checks if the logged-in user's ID matches the URL parameter ID
const CheckParams = async (paramId: any) => {
  const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL_TEST;

  try {
    // Get the logged-in user's data using the token from cookies
    const checkId = await axios.get(`${baseUrl}/api/user/get`, {
      headers: { Authorization: `Bearer ${Cookies.get("userId")}` },
      withCredentials: true,
    });

    const loggedInUserId = checkId.data.data._id;
    console.log(loggedInUserId, paramId);

    // If the logged-in user's ID does not match the paramId, redirect to their own dashboard
    if (loggedInUserId !== paramId) {
      redirect(`/dashboard/${loggedInUserId}`);
    }

    return loggedInUserId; // Return the logged-in user's ID if it matches
  } catch (err) {
    console.error("Error fetching user data or redirecting:", err);
    // You can redirect here as well in case of an error (e.g., if the token is invalid)
    redirect("/login");
  }
};

export default CheckParams;
