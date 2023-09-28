import React from "react";
import Loginpage from "pages/Loginpage";
import Registerpage from "pages/Registerpage";
import Homepage from "pages/Homepage";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import NotFoundPage from "pages/NotFoundPage";
import "App.css";
import ProfilePage from "pages/ProfilePage";
import { useSelector } from "react-redux";
import { user_theme } from "redux/features/slices/userSlice";
import EditProfilePage from "pages/EditProfilePage";
import RecipePage from "pages/RecipePage";
import CreateRecipe from "pages/CreateRecipe";
import RecipeSearchPage from "pages/RecipeSearchPage";
import UserSearchPage from "pages/UserSearchPage";
import ForgotPasswordPage from "pages/ForgotPasswordPage";

function App() {
  const selected_theme = useSelector(user_theme);

  return (
    <div data-theme={selected_theme} className="h-auto min-h-screen">
      <Router>
        <Routes>
          <Route path="/" element={<RecipeSearchPage />} />
          <Route path="/search/recipes" element={<RecipeSearchPage />} />
          <Route path="/search/users" element={<UserSearchPage />} />
          <Route path="/login" element={<Loginpage />} />
          <Route path="/profile/:username" element={<ProfilePage />} />
          <Route path="/register" element={<Registerpage />} />
          <Route path="/edit" element={<EditProfilePage />} />
          <Route path="/recipe/:uuid" element={<RecipePage />} />
          <Route path="/new/recipe" element={<CreateRecipe />} />
          <Route path="/reset-password" element={<ForgotPasswordPage />} />
          {/* Catch-all route */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
