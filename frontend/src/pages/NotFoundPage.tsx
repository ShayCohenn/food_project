import React from "react";
import Layout from "components/Layout";
import { Link } from "react-router-dom";

const NotFoundPage = () => {
  return (
    <Layout title="SITE | 404" content="Page not found">
      <main className="grid min-h-full px-6 py-24 place-items-center sm:py-32 lg:px-8">
        <div className="text-center">
          <p className="text-base font-semibold text-indigo-600">404</p>
          <h1 className="mt-4 text-3xl font-bold tracking-tight sm:text-5xl">
            Page not found
          </h1>
          <p className="mt-6 text-base leading-7 text-gray-600">
            Sorry, we could not find the page you are looking for.
          </p>
          <div className="flex items-center justify-center mt-10 gap-x-6">
            <Link
             to={"/"}
              className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
              Go back home
            </Link>
            <Link to={"/"} className="text-sm font-semibold">
              Contact support <span> → </span>
            </Link>
          </div>
        </div>
      </main>
    </Layout>
  );
};

export default NotFoundPage;
