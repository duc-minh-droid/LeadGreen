import { useContext, useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { DEMO_MODE } from "../config";
import Button from "../Components/Button";
import Input from "../Components/Input";
import Label from "../Components/Label";
import Page from "./Page";
import AuthContext from "../Context/AuthContext";
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import NavBar from "../Components/NavBar/NavBar";

//  Validation Schema
const schema = yup.object().shape({
  username: yup.string().required("Username is required"),
  password: yup.string().required("Password is required"),
});

export default function LoginPage() {

   // Get the loginUser function from the AuthContext
   const { loginUser, loginError, setLoginError } = useContext(AuthContext);

  // Initialise form handling with useForm
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    mode: "onChange", // Validation runs on input change
  });

  useEffect(() => {
    return () => {
      if (setLoginError) setLoginError(null);
    };
  }, [setLoginError]);

  // Send the user back to the page that asked them to log in (e.g. /game)
  const location = useLocation();
  const redirectTo = location.state?.from || "/";

  const onSubmit = (data) => {
      loginUser(data, redirectTo);// Calls loginUser with the form data
  };

  return (
    <Page className="bg-gradient-to-b from-green-50 to-green-100">
      <NavBar/>
      <div className=" min-h-screen bg-gradient-to-b from-green-50 to-green-100 flex flex-col items-center justify-center px-6 py-16 space-y-12">
        {/* Header */}
        <div className="text-center max-w-2xl space-y-4">
          <h1 className="text-3xl font-bold text-green-700">Log in</h1>
          <p className="mt-2 text-lg text-gray-700 leading-relaxed">
            Help the University achieve its <span className="font-semibold text-green-700">carbon net zero</span> goal by 2030.  
            Be part of the change.
          </p>
        </div>

        {/* Form Box */}
        <div className="w-full max-w-lg bg-white p-8 shadow-lg rounded-4xl">
          <div className="text-center space-y-3">
            <h1 className="text-3xl font-bold text-green-700">Log in to your account</h1>
            <p className="text-sm text-gray-600">
              Don't have an account?{" "}
              <Link to="/register" className="font-medium text-green-700 hover:text-green-800">
                Sign up
              </Link>
            </p>
          </div>

          {DEMO_MODE && (
            <div className="mt-4 p-3 bg-amber-50 border border-amber-200 text-amber-900 rounded-lg text-sm">
              <span className="font-semibold">Demo mode:</span> there is no server, so any username and password will log you in.
            </div>
          )}

          {/* Display login error message if it exists */}
          {loginError && (
            <div className="mt-4 p-3 bg-red-50 border border-red-300 text-red-700 rounded-lg">
              {loginError}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-6">
            <div className="space-y-5">
              <div>
                <Label htmlFor="username" className="sr-only">Username</Label>
                <Input
                  id="username"
                  name="username"
                  type="text"
                  autoComplete="username"
                  className="w-full text-black placeholder-gray-500 border border-green-300 bg-green-50 rounded-lg px-4 py-3"
                  placeholder="Username"
                  {...register("username")} // Register input
                />
                {errors.username && (
                  <p className="text-red-600 text-sm mt-1">{errors.username.message}</p>
                )}
              </div>
              <div>
                <Label htmlFor="password" className="sr-only">Password</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  className="w-full text-black placeholder-gray-500 border border-green-300 bg-green-50 rounded-lg px-4 py-3"
                  placeholder="Password"
                  {...register("password")} // Register input
                />
                {errors.password && (
                  <p className="text-red-600 text-sm mt-1">{errors.password.message}</p>
                )}
              </div>
            </div>

            {/* Remember Me */}
            <div className="flex items-center">
              <input
                id="rememberMe"
                name="rememberMe"
                type="checkbox"
                className="text-green-600 focus:ring-green-500"
              />
              <label htmlFor="rememberMe" className="ml-2 text-sm text-green-600">Remember me</label>
            </div>

            <div>
              <Button type="submit" className="w-full bg-green-600 hover:bg-green-700 py-3 rounded-lg text-lg">
                Log In
              </Button>
            </div>
          </form>

          {/* Forgot Password */}
          <div className="mt-4 text-center">
            <Link to="/forgot-password" className="text-sm text-green-700 hover:text-green-800">
              Forgot Password?
            </Link>
          </div>
        </div>
      </div>
    </Page>
  );
}

