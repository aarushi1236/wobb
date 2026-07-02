import { lazy, Suspense } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";

// Route-based code splitting
const SearchPage = lazy(() =>
  import("@/pages/SearchPage").then((module) => ({ default: module.SearchPage }))
);
const ProfileDetailPage = lazy(() =>
  import("@/pages/ProfileDetailPage").then((module) => ({ default: module.ProfileDetailPage }))
);

function App() {
  return (
    <BrowserRouter>
      <Suspense
        fallback={
          <div className="min-h-screen flex flex-col items-center justify-center bg-[#F8F9FA] gap-4">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#7E57C2]/20 border-t-[#7E57C2]"></div>
            <p className="text-gray-500 font-semibold animate-pulse">Loading InflueSearch...</p>
          </div>
        }
      >
        <Routes>
          <Route path="/" element={<SearchPage />} />
          <Route path="/profile/:username" element={<ProfileDetailPage />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
