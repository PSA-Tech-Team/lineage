import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../firebase/config";
import { isBoardMember, isEditor } from "../fixtures/Editors";

/**
 * Hook for routing the user to login depending on auth state.
 * Automatically redirects the user to the login page if not logged in.
 * @returns the current auth state
 */
const useAuth = () => {
  const router = useRouter();
  const [user, userLoading] = useAuthState(auth);
  const [isValidUser, setValidUser] = useState(false);

  useEffect(() => {
    if (userLoading) {
      return;
    }

    if (user === null) {
      setValidUser(false);
      router.push('/login');
      return;
    }

    // Checks if PSA board member or is allowed to edit
    const isValidEmail = isEditor(user.email) || isBoardMember(user.email);
    const isValidUser = user !== null && isValidEmail;
    console.log({isValidUser});

    if (!isValidUser) {
      setValidUser(false);
      router.push('/login');
    } else {
      setValidUser(true)
    }
  }, [user, userLoading]);

  return { user, isValidUser, userLoading, loadSplash: userLoading || !isValidUser };
};

export default useAuth;
