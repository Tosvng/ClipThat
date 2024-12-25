import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { auth } from "../lib/firebase";
import { checkSubscriptionStatus } from "../lib/subscription";

const ProtectedRoute = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [hasAccess, setHasAccess] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      if (!auth.currentUser) {
        setLoading(false);
        return;
      }

      const hasSubscription = await checkSubscriptionStatus(
        auth.currentUser.uid
      );
      setHasAccess(hasSubscription);
      setLoading(false);
    };

    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        checkAuth();
      } else {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!auth.currentUser) {
    return <Navigate to="/signin" />;
  }

  if (!hasAccess) {
    return <Navigate to="/subscription" />;
  }

  return children;
};

export default ProtectedRoute;
