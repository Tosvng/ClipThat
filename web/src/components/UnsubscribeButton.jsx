import { Button } from "@/components/ui/button";
import { auth } from "../lib/firebase";
import { updateSubscriptionStatus } from "../lib/firebase_utils";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../lib/firebase";
import { open } from "@tauri-apps/plugin-shell";

const UnsubscribeButton = () => {
  const handleUnsubscribe = async () => {
    try {
      if (!auth.currentUser) {
        console.error("No user logged in");
        return;
      }

      // Get current subscription data
      const userDoc = await getDoc(doc(db, "users", auth.currentUser.uid));
      const stripeCustomerId = userDoc.data()?.subscription?.stripeCustomerId;

      if (!stripeCustomerId) {
        console.error("No Stripe customer ID found");
        return;
      }

      // Open Stripe Customer Portal
      const portalUrl = `${
        import.meta.env.VITE_STRIPE_CUSTOMER_PORTAL_URL
      }?customer=${stripeCustomerId}`;
      await open(portalUrl).catch((error) => {
        console.error("Failed to open URL:", error);
        window.open(portalUrl, "_blank");
      });
    } catch (error) {
      console.error("Error opening customer portal:", error);
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant="outline"
          className="border-gold/50 text-gold hover:border-gold hover:bg-gold/10 transition-all duration-300"
        >
          Manage Subscription
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="bg-charcoal border border-gold/20">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-gold text-xl">
            Manage Your Subscription
          </AlertDialogTitle>
          <AlertDialogDescription className="text-cream/80">
            You&apos;ll be redirected to the Stripe Customer Portal where you
            can manage your subscription, including cancellation. If you cancel,
            you&apos;ll maintain access until the end of your current billing
            period.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="hover:bg-gold/10 border-gold/50 text-cream">
            Close
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleUnsubscribe}
            className="bg-gold text-charcoal hover:bg-darkGold"
          >
            Continue to Portal
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default UnsubscribeButton;
