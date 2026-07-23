import RootLayout from "./layouts/RootLayout";
import Home from "./pages/Home";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import NotFound from "./pages/NotFound";

// vite-react-ssg route table. "/404" is a real, statically-generated page
// (it prerenders to dist/404.html, which Vercel serves automatically for any
// unmatched path on a static deployment) — "*" is the client-side fallback
// so an in-app navigation to a bad path shows the same page post-hydration.
const routes = [
  {
    path: "/",
    Component: RootLayout,
    children: [
      { index: true, Component: Home },
      { path: "pravila-privatnosti", Component: PrivacyPolicy },
    ],
  },
  { path: "/404", Component: NotFound },
  { path: "*", Component: NotFound },
];

export default routes;
