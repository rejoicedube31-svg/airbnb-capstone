import Header from "./Header";
import Footer from "./Footer";
import CopyrightFooter from "./CopyrightFooter";
import "./PageLayout.css";

/**
 * Shared page shell — header, main content, footers.
 * Why: Consistent layout + footers on every public view (rubric).
 */
export default function PageLayout({ children, headerProps = {} }) {
  return (
    <div className="page-layout">
      <Header {...headerProps} />
      {children}
      <Footer />
      <CopyrightFooter />
    </div>
  );
}
