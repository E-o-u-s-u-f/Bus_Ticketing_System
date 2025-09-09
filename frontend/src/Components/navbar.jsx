import React, { useState } from "react";
const navbar = () =>
{
  return (
    <div classname = "flex mb-5 p-3 bg-blue-600 text-white justify-center items-center">
      <a href="/">BookMyDoc</a>
      <a href="/">Home</a>
      <a href="/aboutPage">about us</a>
      <a href="/loginPage">login</a>
      <a href="/registerPage">Sign up</a>
    </div>
  )
}
export default navbar;