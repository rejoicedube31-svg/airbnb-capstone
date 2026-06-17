import AdminHeader from "../components/AdminHeader";
import "./PlaceholderPage.css";

export default function PlaceholderPage({ title, description, dayLabel }) {
  return (
    <div className="admin-app">
      <AdminHeader />
      <main className="placeholder-page">
        <p className="placeholder-page__eyebrow">{dayLabel}</p>
        <h1>{title}</h1>
        <p>{description}</p>
      </main>
    </div>
  );
}
