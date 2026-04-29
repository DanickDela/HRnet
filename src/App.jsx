import { lazy, Suspense, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

import RequiredAuth from "./components/RequiredAuth/RequiredAuth";
import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";

import { fetchUserProfile, clearUserProfile } from "./store/userSlice";
import { loadEmployees } from "./store/employeesSlice";

import styles from "../src/styles/app.module.scss";

const Login = lazy(() => import("./pages/Login/Login"));
const CreateEmployee = lazy(
  () => import("./pages/CreateEmployee/CreateEmployee"),
);
const ViewEmployees = lazy(() => import("./pages/ViewEmployees/ViewEmployees"));

function App() {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);
  const { error, status } = useSelector((state) => state.user);
  const employees = useSelector((state) => state.employees.employees);

  useEffect(() => {
    if (!token) {
      dispatch(clearUserProfile());
      return;
    }

    if (status === "idle") {
      dispatch(fetchUserProfile(token));
    }
  }, [token, status, dispatch]);

  useEffect(() => {
    if (!employees || employees.length === 0) {
      dispatch(loadEmployees());
    }
  }, [dispatch, employees]);

  return (
    <>
      {status === "failed" && (
        <div className={styles.error}>Error : {error}</div>
      )}

      <Header />

      <main className="main">
        <Suspense fallback={<p>Loading...</p>}>
          <Routes>
            <Route
              path="/"
              element={
                token ? <Navigate to="/createemployee" replace /> : <Login />
              }
            />

            <Route
              path="/login"
              element={
                token ? <Navigate to="/createemployee" replace /> : <Login />
              }
            />

            <Route
              path="/createemployee"
              element={
                <RequiredAuth>
                  <CreateEmployee />
                </RequiredAuth>
              }
            />

            <Route
              path="/listeemployees"
              element={
                <RequiredAuth>
                  <ViewEmployees />
                </RequiredAuth>
              }
            />

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </main>

      <Footer />
    </>
  );
}

export default App;
