import React, { useState } from "react";
import { Button } from "../Components/ui/stateful-button";
import { useNavigate } from "react-router-dom";
import bus2 from "../assets/bus2.png"; 
import About1 from "./About1";
 export default function  Home() {
  const [expanded, setExpanded] = useState(false);
  const navigate = useNavigate();
    const handleClick = () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve();
        navigate("/schedules"); // 👈 change path as needed
      }, 4000); // simulates API delay before navigating
    });
  };
  return (
    <div>
      <header className="py-4 bg-black sm:py-6 ">
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="shrink-0">
              <a href="#" className="flex">
                <img
                  className="w-auto h-9"
                  src="https://landingfoliocom.imgix.net/store/collection/dusk/images/logo.svg"
                  alt="Logo"
                />
              </a>
            </div>

            {/* Mobile toggle */}
            <div className="flex md:hidden">
              <button
                type="button"
                className="text-white"
                aria-expanded={expanded}
                onClick={() => setExpanded(!expanded)}
              >
                {!expanded ? (
                  <svg
                    className="w-7 h-7"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1.5"
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  </svg>
                ) : (
                  <svg
                    className="w-7 h-7"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                )}
              </button>
            </div>

            {/* Desktop Nav */}
            <nav className="hidden ml-10 mr-auto space-x-10 lg:ml-20 lg:space-x-12 md:flex md:items-center md:justify-start">
            </nav>

            {/* Desktop CTA */}
            <div className="relative hidden md:inline-flex group">
              <div className="absolute transition-all duration-200 rounded-full -inset-px bg-gradient-to-r from-cyan-500 to-purple-500 group-hover:shadow-lg group-hover:shadow-cyan-500/50"></div>
              <a
                href="/admin/login"
                className="relative inline-flex items-center justify-center px-6 py-2 text-base font-normal text-white bg-black border border-transparent rounded-full"
              >
                Admin
              </a>
            </div>
          </div>

          {/* Mobile Nav */}
          {expanded && (
            <nav>
              <div className="flex flex-col pt-8 pb-4 space-y-6">
                <div className="relative inline-flex items-center justify-center group">
                  <div className="absolute transition-all duration-200 rounded-full -inset-px bg-gradient-to-r from-cyan-500 to-purple-500 group-hover:shadow-lg group-hover:shadow-cyan-500/50"></div>
                  <a
                    href="/admin/login"
                    className="relative inline-flex items-center justify-center w-full px-6 py-2 text-base font-normal text-white bg-black border border-transparent rounded-full"
                  >
                  </a>
                </div>
              </div>
            </nav>
          )}
        </div>
      </header>

      {/* Hero Section (unchanged except style fix) */}
      <section className="relative py-12 overflow-hidden bg-black sm:pb-16 lg:pb-20 xl:pb-24">
        <div className="px-4 mx-auto sm:px-6 lg:px-8 max-w-7xl">
          <div className="grid items-center grid-cols-1 gap-y-12 lg:grid-cols-2 gap-x-16">
            <div className="gap-y-6 flex flex-col">
              <h1 className="text-2xl  text-white font-bold sm:text-5xl lg:text-4xl xl:text-5xl">
                Your Journey, Our Responsibility – JanBahon
              </h1>
              <p className="mt-4 text-lg font-normal text-gray-400 sm:mt-8">
                Seamless routes, reliable schedules, and a smarter way to travel. With JanBahon, commuting becomes faster, safer, and more convenient
              </p>
                <Button onClick={handleClick} className="w-[15rem] bg-gray-800 ">Get Your Seat Pack</Button>
            </div>

            <div className="relative">
              <div className="absolute inset-0">
                <svg
                  className="blur-3xl opacity-70"
                  style={{ filter: "blur(64px)" }}
                  width="444"
                  height="536"
                  viewBox="0 0 444 536"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M225.919 112.719C343.98 64.6648 389.388 -70.487 437.442 47.574C485.496 165.635 253.266 481.381 135.205 529.435C17.1445 577.488 57.9596 339.654 9.9057 221.593C-38.1482 103.532 107.858 160.773 225.919 112.719Z"
                    fill="url(#c)"
                  />
                  <defs>
                    <linearGradient
                      id="c"
                      x1="82.7339"
                      y1="550.792"
                      x2="-39.945"
                      y2="118.965"
                      gradientUnits="userSpaceOnUse"
                    >
                      <stop offset="0%" stopColor="var(--color-cyan-500)" />
                      <stop offset="100%" stopColor="var(--color-purple-500)" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>
              <div className="absolute inset-0">
                <img
                  className="object-cover w-full h-full opacity-50"
                  src="https://landingfoliocom.imgix.net/store/collection/dusk/images/noise.png"
                  alt=""
                />
              </div>
              <img
                className="relative w-full max-w-md mx-auto"
                src={bus2}
                alt=""
              />
            </div>
          </div>
        </div>
      </section>
      <About1 />
    </div>
  );
};

