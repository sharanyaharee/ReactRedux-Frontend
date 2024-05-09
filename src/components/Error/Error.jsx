import React from "react";

import { useRouteError } from "react-router-dom";

const Error = () => {
  const err = useRouteError();
  return (
    <div>
      <h1 className="mt-10 text-center text-2xl font-bold ">Oops!!!</h1>
      <h3 className="text-center text-2xl font-bold ">Page Not FOund!!</h3>
      <p className="text-center text-2xl font-semibold ">
        {err.status}:{err.statusText}
      </p>
    </div>
  );
};

export default Error;
