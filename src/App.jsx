import {
  createBrowserRouter,
  createRoutesFromElements,
  Navigate,
  Route,
  RouterProvider,
} from "react-router-dom";

import CityList from "./Components/CityList";
import CountryList from "./Components/CountryList";
import City from "./Components/City";
import Form from "./Components/Form";
import { CitiesProvider } from "./Contexts/CitiesContext";
import { AuthProvider } from "./Contexts/FakeAuthContext";
import ProtectedRoute from "./Pages/ProtectedRoute";
import { lazy, Suspense } from "react";
import SpinnerFullPage from "./Components/SpinnerFullPage";
// import HomePage from "./Pages/HomePage";
// import Pricing from "./Pages/Pricing";
// import Product from "./Pages/Product";
// import PageNotFound from "./Pages/PageNotFound";
// import Login from "./Pages/Login";
// import AppLayout from "./Pages/AppLayout";

const HomePage = lazy(() => import("./Pages/Homepage"));
const Pricing = lazy(() => import("./Pages/Pricing"));
const Product = lazy(() => import("./Pages/Product"));
const PageNotFound = lazy(() => import("./Pages/PageNotFound"));
const Login = lazy(() => import("./Pages/Login"));
const AppLayout = lazy(() => import("./Pages/AppLayout"));

const App = () => {
  const Router = createBrowserRouter(
    createRoutesFromElements(
      <Route>
        <Route index element={<HomePage />} />
        <Route path="/pricing" element={<Pricing />}  />
        <Route path="/product" element={<Product />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/app"
          element={
            <ProtectedRoute>
              <AppLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate replace to="/app/cities" />} />
          <Route path="/app/cities" element={<CityList />} />
          <Route path="/app/cities/:id" element={<City />} />
          <Route path="/app/countries" element={<CountryList />} />
          <Route path="/app/form" element={<Form />} />
        </Route>
        <Route path="*" element={<PageNotFound />} />
      </Route>
    )
  );
  return (
    <AuthProvider>
      <CitiesProvider>
        <Suspense fallback={<SpinnerFullPage />}>
          <RouterProvider router={Router} />
        </Suspense>
      </CitiesProvider>
    </AuthProvider>
  );
};

export default App;
