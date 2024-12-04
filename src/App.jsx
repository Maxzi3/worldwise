import {
  createBrowserRouter,
  createRoutesFromElements,
  Navigate,
  Route,
  RouterProvider,
} from "react-router-dom";

import HomePage from "./Pages/HomePage";
import Pricing from "./Pages/Pricing";
import Product from "./Pages/Product";
import PageNotFound from "./Pages/PageNotFound";
import Login from "./Pages/Login";
import AppLayout from "./Pages/AppLayout";
import CityList from "./Components/CityList";
import CountryList from "./Components/CountryList";
import City from "./Components/City";
import Form from "./Components/Form";
import { CitiesProvider } from "./Contexts/citiesContext";

const App = () => {
  const Router = createBrowserRouter(
    createRoutesFromElements(
      <Route>
        <Route index element={<HomePage />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/product" element={<Product />} />
        <Route path="/login" element={<Login />} />
        <Route path="/app" element={<AppLayout />}>
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
    <CitiesProvider>
      <RouterProvider router={Router} />
    </CitiesProvider>
  );
};

export default App;
