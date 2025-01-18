import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../lib/firebase";
import { Button } from "@/components/ui/button";
import {
  getSubscriptionDetails,
  STRIPE_PAYMENT_LINK,
} from "../lib/subscription";
import LogoutButton from "@/components/LogoutButton";
import { open } from "@tauri-apps/plugin-shell";

const POLLING_INTERVAL = 5000; // Check every 5 seconds

const SubscriptionPage = () => {
  const [loading, setLoading] = useState(true);
  const [subscriptionDetails, setSubscriptionDetails] = useState(null);
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
        const details = await getSubscriptionDetails(auth.currentUser.uid);
        if (mounted) {
          setSubscriptionDetails(details);
          if (details?.isActive) {
            clearInterval(intervalId);
            navigate("/app");
          }
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
        window.open(subscriptionUrl, "_blank");
      });
    } catch (error) {
      console.error("Error opening subscription page:", error);
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="min-h-screen">
      <div className="p-4 flex justify-end">
        <LogoutButton />
      </div>
      <div className="flex items-center justify-center">
        <div className="max-w-md space-y-8 p-6 text-center">
          {subscriptionDetails?.isActive ? (
            <>
              <h2 className="text-2xl font-bold text-gold">
                {subscriptionDetails.canceledAt
                  ? "Subscription Canceled"
                  : "Active Subscription"}
              </h2>
              <div className="space-y-4 text-cream">
                {subscriptionDetails.canceledAt ? (
                  <>
                    <p>
                      Your subscription has been canceled but you still have
                      access until:
                    </p>
                    <p className="text-xl font-semibold text-gold">
                      {formatDate(subscriptionDetails.expiresAt)}
                    </p>
                    <Button onClick={handleSubscribe} className="w-full">
                      Resubscribe
                    </Button>
                  </>
                ) : (
                  <>
                    <p>
                      Your subscription will{" "}
                      {subscriptionDetails.autoRenew ? "renew" : "expire"} on:
                    </p>
                    <p className="text-xl font-semibold text-gold">
                      {formatDate(subscriptionDetails.expiresAt)}
                    </p>
                  </>
                )}
              </div>
            </>
          ) : (
            <>
              <h2 className="text-2xl font-bold">Subscribe to Continue</h2>
              <p className="text-cream/80">
                You need an active subscription to access all features.
              </p>
              <div className="space-y-4">
                <Button onClick={handleSubscribe} className="w-full">
                  Subscribe Now
                </Button>
                <p className="text-sm text-cream/60">
                  Already subscribed? The app will automatically detect your
                  subscription.
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default SubscriptionPage;
