import React from "react";

const AuthLayout = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return <div className="font-display">{children}</div>;
};

export default AuthLayout;