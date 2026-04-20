import "./globals.css";

export const metadata = {
  title: "TrendStep — learn TikTok dances",
  description: "Step-by-step tutorials for trending TikTok dances.",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
  themeColor: "#0b0b10",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="font-sys min-h-screen">
        <div className="mx-auto max-w-md px-4 pt-4 pb-24">{children}</div>
      </body>
    </html>
  );
}
