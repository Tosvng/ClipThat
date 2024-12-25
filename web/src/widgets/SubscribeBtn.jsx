import React from "react";

const SubscribeBtn = () => {
  const STRIPE_KEY = import.meta.env.VITE_STRIP_LIVE_KEY;
  return (
    <div>
      <script async src="https://js.stripe.com/v3/buy-button.js"></script>

      <stripe-buy-button
        buy-button-id="buy_btn_1QWNyHKe5JbG50qr5Hs7QJYc"
        publishable-key={STRIPE_KEY}
      ></stripe-buy-button>
    </div>
  );
};

export default SubscribeBtn;
