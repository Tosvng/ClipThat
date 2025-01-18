import { useState, useEffect } from "react";
import { auth } from "../lib/firebase";
import { getSubscriptionDetails } from "../lib/subscription";

const StatusBar = () => {
  const [subscriptionInfo, setSubscriptionInfo] = useState(null);

  useEffect(() => {
    const checkSubscription = async () => {
      if (auth.currentUser) {
        const details = await getSubscriptionDetails(auth.currentUser.uid);
        setSubscriptionInfo(details);
      }
    };

    checkSubscription();
    const unsubscribe = auth.onAuthStateChanged(checkSubscription);
    return () => unsubscribe();
  }, []);

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getSubscriptionText = () => {
    if (!subscriptionInfo) return "No active subscription";
    if (subscriptionInfo.canceledAt) {
      return `Access until ${formatDate(subscriptionInfo.expiresAt)}`;
    }
    return subscriptionInfo.autoRenew
      ? `Renews on ${formatDate(subscriptionInfo.expiresAt)}`
      : `Expires on ${formatDate(subscriptionInfo.expiresAt)}`;
  };

  return (
    <div className="h-6 bg-charcoal border-t border-gold/20 flex items-center px-4 text-xs text-cream/60">
      <div className="flex items-center space-x-4">
        <span>Ready</span>
        <div className="w-[1px] h-3 bg-gold/20" />
        <span>Version 3.2.0</span>
        <div className="w-[1px] h-3 bg-gold/20" />
        <span>{getSubscriptionText()}</span>
      </div>
    </div>
  );
};

export default StatusBar;
