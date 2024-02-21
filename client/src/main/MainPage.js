import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Header from "./Header";
import MainContent from "./MainContent";

// function AuthenticatedRoute({ children }) {
//   const authContext = useAuth();

//   if (authContext.isAuthenticated) return children;

//   return <Navigate to="/" />;
// }

export default function MainPage() {
  return (
    <div className="MainPage">
      <Header />
      <MainContent />
      {/* <Login /> */}
    </div>
  );
}
