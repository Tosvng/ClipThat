import { Button } from "@/components/ui/button";
import { auth } from "../lib/firebase";
import { useNavigate } from "react-router-dom";
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

const UnsubscribeButton = () => {
  const navigate = useNavigate();

  const handleUnsubscribe = async () => {
    try {
      if (!auth.currentUser) {
        console.error("No user logged in");
        return;
      }

      // Get current subscription data to keep the expiration date
      const userDoc = await getDoc(doc(db, "users", auth.currentUser.uid));
      const currentExpiryDate = userDoc.data()?.subscription?.expiresAt;

      await updateSubscriptionStatus(auth.currentUser.uid, {
        isActive: false,
        expiresAt: currentExpiryDate, // Keep the current expiry date
        canceledAt: new Date().toISOString(), // Add cancellation date
        autoRenew: false, // Add flag to prevent renewal
      });

      // Don't navigate away - let them continue using the app
      // Just close the dialog
    } catch (error) {
      console.error("Unsubscribe error:", error);
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant="outline"
          className="border-gold/50 text-gold hover:border-gold hover:bg-gold/10 transition-all duration-300"
        >
          Cancel Subscription
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="bg-charcoal border border-gold/20">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-gold text-xl">
            Cancel Subscription?
          </AlertDialogTitle>
          <AlertDialogDescription className="text-cream/80">
            Your subscription will be cancelled but you'll maintain access to
            all features until your current subscription period ends. After
            that, you'll need to resubscribe to regain access.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="hover:bg-gold/10 border-gold/50 text-cream">
            Keep Subscription
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleUnsubscribe}
            className="bg-gold text-charcoal hover:bg-darkGold"
          >
            Cancel Subscription
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default UnsubscribeButton;
