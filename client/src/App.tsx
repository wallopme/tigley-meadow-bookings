import { Route, Routes } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import ScrollToTop from "./components/ScrollToTop";
import HomePage from "./pages/HomePage";
import PropertyPage from "./pages/PropertyPage";
import LocationPage from "./pages/LocationPage";
import BookPage from "./pages/BookPage";
import BlogPage from "./pages/BlogPage";
import BlogPostPage from "./pages/BlogPostPage";
import ThingsToDoPage from "./pages/ThingsToDoPage";
import AdminPage from "./pages/AdminPage";

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route
          path="/admin"
          element={
            <>
              <Header />
              <AdminPage />
              <Footer />
            </>
          }
        />
        <Route
          path="/*"
          element={
            <>
              <Header />
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/property" element={<PropertyPage />} />
                <Route path="/location" element={<LocationPage />} />
                <Route path="/things-to-do" element={<ThingsToDoPage />} />
                <Route path="/book" element={<BookPage />} />
                <Route path="/blog" element={<BlogPage />} />
                <Route path="/blog/:slug" element={<BlogPostPage />} />
              </Routes>
              <Footer />
            </>
          }
        />
      </Routes>
    </>
  );
}
