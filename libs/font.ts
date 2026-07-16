import localFont from "next/font/local";

export const myCustomFont = localFont({
  src: [
    {
      path: "../assets/satoshi/fonts/Satoshi-Medium.woff2",
      weight: "400",
      style: "normal",
    },

    {
      path: "../assets/satoshi/fonts/Satoshi-Bold.woff2",
      weight: "700",
      style: "normal",
    },

    {
      path: "../assets/satoshi/fonts/Satoshi-Light.woff2",
      weight: "300",
      style: "normal",
    },
  ],
  display: "swap",
  variable: "--font-satoshi",
});

export const Britney = localFont({
  src: [
    {
      path: "../assets/Britney/fonts/Britney-Regular.woff2",
      weight: "400",
      style: "normal",
    },

    {
      path: "../assets/Britney/fonts/Britney-Bold.woff2",
      weight: "700",
      style: "normal",
    },

    {
      path: "../assets/Britney/fonts/Britney-Light.woff2",
      weight: "300",
      style: "normal",
    },
  ],
  display: "swap",
  variable: "--font-britney",
});

export const Alpino = localFont({
  src: [
    {
      path: "../assets/Alpino/fonts/Alpino-Regular.woff2",
      weight: "400",
      style: "normal",
    },

    {
      path: "../assets/Alpino/fonts/Alpino-Bold.woff2",
      weight: "700",
      style: "normal",
    },

    {
      path: "../assets/Alpino/fonts/Alpino-Light.woff2",
      weight: "300",
      style: "normal",
    },
  ],
  display: "swap",
  variable: "--font-alpino",
});
