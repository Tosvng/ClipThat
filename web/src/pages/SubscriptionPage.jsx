import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../lib/firebase";
import { Button } from "@/components/ui/button";
import {
  checkSubscriptionStatus,
  STRIPE_PAYMENT_LINK,
} from "../lib/subscription";
import LogoutButton from "@/components/LogoutButton";
import { open } from "@tauri-apps/plugin-shell";

const POLLING_INTERVAL = 5000; // Check every 5 seconds

const SubscriptionPage = () => {
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    let intervalId;
    let mounted = true;

    const checkStatus = async () => {
      if (!mounted) return;
      if (!auth.currentUser) {
        navigate("/");
        return;
      }

      try {
        const status = await checkSubscriptionStatus(auth.currentUser.uid);
        if (status && mounted) {
          clearInterval(intervalId);
          navigate("/app");
        }
      } catch (error) {
        console.error("Error checking subscription:", error);
      }
      if (mounted) setLoading(false);
    };

    checkStatus();
    intervalId = setInterval(checkStatus, POLLING_INTERVAL);

    return () => {
      mounted = false;
      if (intervalId) clearInterval(intervalId);
    };
  }, [navigate]);

  const handleSubscribe = async () => {
    try {
      if (!auth.currentUser?.uid) {
        console.error("No user ID available");
        return;
      }

      const subscriptionUrl = `${STRIPE_PAYMENT_LINK}?client_reference_id=${auth.currentUser.uid}`;
      await open(subscriptionUrl).catch((error) => {
        console.error("Failed to open URL:", error);
        // Fallback to window.open if Tauri shell.open fails
        window.open(subscriptionUrl, "_blank");
      });
    } catch (error) {
      console.error("Error opening subscription page:", error);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="min-h-screen">
      <div className="p-4 flex justify-end">
        <LogoutButton />
      </div>
      <div className="flex items-center justify-center">
        <div className="max-w-md space-y-8 p-6 text-center">
          <h2 className="text-2xl font-bold">Subscribe to Continue</h2>
          <p className="text-gray-600">
            You need an active subscription to access all features.
          </p>
          <div className="space-y-4">
            <Button onClick={handleSubscribe} className="w-full">
              Subscribe Now
            </Button>
            <p className="text-sm text-gray-500">
              Already subscribed? The app will automatically detect your
              subscription.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionPage;
