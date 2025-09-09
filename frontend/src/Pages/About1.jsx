import React from "react";

const About1 = () => {
  return (
    <>
      <section className="overflow-hidden pt-20 pb-12 lg:pt-[120px] lg:pb-[90px] dark:bg-dark mx-[30px]">
        <div className="container mx-auto">
          <div className="flex flex-wrap items-center justify-between -mx-4">
            <div className="w-full px-4 lg:w-6/12">
              <div className="flex items-center -mx-3 sm:-mx-4">
                <div className="w-full px-3 sm:px-4 xl:w-1/2">
                  <div className="py-3 sm:py-4">
                    <img
                      src="data:image/jpeg;base64,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"
                      alt=""
                      className="w-full rounded-2xl"
                    />
                  </div>
                  <div className="py-3 sm:py-4">
                    <img
                      src="data:image/jpeg;base64,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"
                      alt=""
                      className="w-full rounded-2xl"
                    />
                  </div>
                </div>
                <div className="w-full px-3 sm:px-4 xl:w-1/2">
                  <div className="relative z-10 my-4">
                    <img
                      src="https://cdn.tailgrids.com/assets/images/marketing/about/about-01/image-3.jpg"
                      alt=""
                      className="w-full rounded-2xl"
                    />
                    <span className="absolute -right-7 -bottom-7 z-[-1]">
                      <svg
                        width={134}
                        height={106}
                        viewBox="0 0 134 106"
                        fill="none"
                        xmlns="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTWgPl77M_LIkUQL3N7-jeb0AysrUIEaiE0Gw&s"
                      >
                        <circle
                          cx="1.66667"
                          cy={104}
                          r="1.66667"
                          transform="rotate(-90 1.66667 104)"
                          fill="#3056D3"
                        />
                        <circle
                          cx="16.3333"
                          cy={104}
                          r="1.66667"
                          transform="rotate(-90 16.3333 104)"
                          fill="#3056D3"
                        />
                        <circle
                          cx={31}
                          cy={104}
                          r="1.66667"
                          transform="rotate(-90 31 104)"
                          fill="#3056D3"
                        />
                        <circle
                          cx="45.6667"
                          cy={104}
                          r="1.66667"
                          transform="rotate(-90 45.6667 104)"
                          fill="#3056D3"
                        />
                        <circle
                          cx="60.3334"
                          cy={104}
                          r="1.66667"
                          transform="rotate(-90 60.3334 104)"
                          fill="#3056D3"
                        />
                        <circle
                          cx="88.6667"
                          cy={104}
                          r="1.66667"
                          transform="rotate(-90 88.6667 104)"
                          fill="#3056D3"
                        />
                        <circle
                          cx="117.667"
                          cy={104}
                          r="1.66667"
                          transform="rotate(-90 117.667 104)"
                          fill="#3056D3"
                        />
                        <circle
                          cx="74.6667"
                          cy={104}
                          r="1.66667"
                          transform="rotate(-90 74.6667 104)"
                          fill="#3056D3"
                        />
                        <circle
                          cx={103}
                          cy={104}
                          r="1.66667"
                          transform="rotate(-90 103 104)"
                          fill="#3056D3"
                        />
                        <circle
                          cx={132}
                          cy={104}
                          r="1.66667"
                          transform="rotate(-90 132 104)"
                          fill="#3056D3"
                        />
                        <circle
                          cx="1.66667"
                          cy="89.3333"
                          r="1.66667"
                          transform="rotate(-90 1.66667 89.3333)"
                          fill="#3056D3"
                        />
                        <circle
                          cx="16.3333"
                          cy="89.3333"
                          r="1.66667"
                          transform="rotate(-90 16.3333 89.3333)"
                          fill="#3056D3"
                        />
                        <circle
                          cx={31}
                          cy="89.3333"
                          r="1.66667"
                          transform="rotate(-90 31 89.3333)"
                          fill="#3056D3"
                        />
                        <circle
                          cx="45.6667"
                          cy="89.3333"
                          r="1.66667"
                          transform="rotate(-90 45.6667 89.3333)"
                          fill="#3056D3"
                        />
                        <circle
                          cx="60.3333"
                          cy="89.3338"
                          r="1.66667"
                          transform="rotate(-90 60.3333 89.3338)"
                          fill="#3056D3"
                        />
                        <circle
                          cx="88.6667"
                          cy="89.3338"
                          r="1.66667"
                          transform="rotate(-90 88.6667 89.3338)"
                          fill="#3056D3"
                        />
                        <circle
                          cx="117.667"
                          cy="89.3338"
                          r="1.66667"
                          transform="rotate(-90 117.667 89.3338)"
                          fill="#3056D3"
                        />
                        <circle
                          cx="74.6667"
                          cy="89.3338"
                          r="1.66667"
                          transform="rotate(-90 74.6667 89.3338)"
                          fill="#3056D3"
                        />
                        <circle
                          cx={103}
                          cy="89.3338"
                          r="1.66667"
                          transform="rotate(-90 103 89.3338)"
                          fill="#3056D3"
                        />
                        <circle
                          cx={132}
                          cy="89.3338"
                          r="1.66667"
                          transform="rotate(-90 132 89.3338)"
                          fill="#3056D3"
                        />
                        <circle
                          cx="1.66667"
                          cy="74.6673"
                          r="1.66667"
                          transform="rotate(-90 1.66667 74.6673)"
                          fill="#3056D3"
                        />
                        <circle
                          cx="1.66667"
                          cy="31.0003"
                          r="1.66667"
                          transform="rotate(-90 1.66667 31.0003)"
                          fill="#3056D3"
                        />
                        <circle
                          cx="16.3333"
                          cy="74.6668"
                          r="1.66667"
                          transform="rotate(-90 16.3333 74.6668)"
                          fill="#3056D3"
                        />
                        <circle
                          cx="16.3333"
                          cy="31.0003"
                          r="1.66667"
                          transform="rotate(-90 16.3333 31.0003)"
                          fill="#3056D3"
                        />
                        <circle
                          cx={31}
                          cy="74.6668"
                          r="1.66667"
                          transform="rotate(-90 31 74.6668)"
                          fill="#3056D3"
                        />
                        <circle
                          cx={31}
                          cy="31.0003"
                          r="1.66667"
                          transform="rotate(-90 31 31.0003)"
                          fill="#3056D3"
                        />
                        <circle
                          cx="45.6667"
                          cy="74.6668"
                          r="1.66667"
                          transform="rotate(-90 45.6667 74.6668)"
                          fill="#3056D3"
                        />
                        <circle
                          cx="45.6667"
                          cy="31.0003"
                          r="1.66667"
                          transform="rotate(-90 45.6667 31.0003)"
                          fill="#3056D3"
                        />
                        <circle
                          cx="60.3333"
                          cy="74.6668"
                          r="1.66667"
                          transform="rotate(-90 60.3333 74.6668)"
                          fill="#3056D3"
                        />
                        <circle
                          cx="60.3333"
                          cy="30.9998"
                          r="1.66667"
                          transform="rotate(-90 60.3333 30.9998)"
                          fill="#3056D3"
                        />
                        <circle
                          cx="88.6667"
                          cy="74.6668"
                          r="1.66667"
                          transform="rotate(-90 88.6667 74.6668)"
                          fill="#3056D3"
                        />
                        <circle
                          cx="88.6667"
                          cy="30.9998"
                          r="1.66667"
                          transform="rotate(-90 88.6667 30.9998)"
                          fill="#3056D3"
                        />
                        <circle
                          cx="117.667"
                          cy="74.6668"
                          r="1.66667"
                          transform="rotate(-90 117.667 74.6668)"
                          fill="#3056D3"
                        />
                        <circle
                          cx="117.667"
                          cy="30.9998"
                          r="1.66667"
                          transform="rotate(-90 117.667 30.9998)"
                          fill="#3056D3"
                        />
                        <circle
                          cx="74.6667"
                          cy="74.6668"
                          r="1.66667"
                          transform="rotate(-90 74.6667 74.6668)"
                          fill="#3056D3"
                        />
                        <circle
                          cx="74.6667"
                          cy="30.9998"
                          r="1.66667"
                          transform="rotate(-90 74.6667 30.9998)"
                          fill="#3056D3"
                        />
                        <circle
                          cx={103}
                          cy="74.6668"
                          r="1.66667"
                          transform="rotate(-90 103 74.6668)"
                          fill="#3056D3"
                        />
                        <circle
                          cx={103}
                          cy="30.9998"
                          r="1.66667"
                          transform="rotate(-90 103 30.9998)"
                          fill="#3056D3"
                        />
                        <circle
                          cx={132}
                          cy="74.6668"
                          r="1.66667"
                          transform="rotate(-90 132 74.6668)"
                          fill="#3056D3"
                        />
                        <circle
                          cx={132}
                          cy="30.9998"
                          r="1.66667"
                          transform="rotate(-90 132 30.9998)"
                          fill="#3056D3"
                        />
                        <circle
                          cx="1.66667"
                          cy="60.0003"
                          r="1.66667"
                          transform="rotate(-90 1.66667 60.0003)"
                          fill="#3056D3"
                        />
                        <circle
                          cx="1.66667"
                          cy="16.3333"
                          r="1.66667"
                          transform="rotate(-90 1.66667 16.3333)"
                          fill="#3056D3"
                        />
                        <circle
                          cx="16.3333"
                          cy="60.0003"
                          r="1.66667"
                          transform="rotate(-90 16.3333 60.0003)"
                          fill="#3056D3"
                        />
                        <circle
                          cx="16.3333"
                          cy="16.3333"
                          r="1.66667"
                          transform="rotate(-90 16.3333 16.3333)"
                          fill="#3056D3"
                        />
                        <circle
                          cx={31}
                          cy="60.0003"
                          r="1.66667"
                          transform="rotate(-90 31 60.0003)"
                          fill="#3056D3"
                        />
                        <circle
                          cx={31}
                          cy="16.3333"
                          r="1.66667"
                          transform="rotate(-90 31 16.3333)"
                          fill="#3056D3"
                        />
                        <circle
                          cx="45.6667"
                          cy="60.0003"
                          r="1.66667"
                          transform="rotate(-90 45.6667 60.0003)"
                          fill="#3056D3"
                        />
                        <circle
                          cx="45.6667"
                          cy="16.3333"
                          r="1.66667"
                          transform="rotate(-90 45.6667 16.3333)"
                          fill="#3056D3"
                        />
                        <circle
                          cx="60.3333"
                          cy="60.0003"
                          r="1.66667"
                          transform="rotate(-90 60.3333 60.0003)"
                          fill="#3056D3"
                        />
                        <circle
                          cx="60.3333"
                          cy="16.3333"
                          r="1.66667"
                          transform="rotate(-90 60.3333 16.3333)"
                          fill="#3056D3"
                        />
                        <circle
                          cx="88.6667"
                          cy="60.0003"
                          r="1.66667"
                          transform="rotate(-90 88.6667 60.0003)"
                          fill="#3056D3"
                        />
                        <circle
                          cx="88.6667"
                          cy="16.3333"
                          r="1.66667"
                          transform="rotate(-90 88.6667 16.3333)"
                          fill="#3056D3"
                        />
                        <circle
                          cx="117.667"
                          cy="60.0003"
                          r="1.66667"
                          transform="rotate(-90 117.667 60.0003)"
                          fill="#3056D3"
                        />
                        <circle
                          cx="117.667"
                          cy="16.3333"
                          r="1.66667"
                          transform="rotate(-90 117.667 16.3333)"
                          fill="#3056D3"
                        />
                        <circle
                          cx="74.6667"
                          cy="60.0003"
                          r="1.66667"
                          transform="rotate(-90 74.6667 60.0003)"
                          fill="#3056D3"
                        />
                        <circle
                          cx="74.6667"
                          cy="16.3333"
                          r="1.66667"
                          transform="rotate(-90 74.6667 16.3333)"
                          fill="#3056D3"
                        />
                        <circle
                          cx={103}
                          cy="60.0003"
                          r="1.66667"
                          transform="rotate(-90 103 60.0003)"
                          fill="#3056D3"
                        />
                        <circle
                          cx={103}
                          cy="16.3333"
                          r="1.66667"
                          transform="rotate(-90 103 16.3333)"
                          fill="#3056D3"
                        />
                        <circle
                          cx={132}
                          cy="60.0003"
                          r="1.66667"
                          transform="rotate(-90 132 60.0003)"
                          fill="#3056D3"
                        />
                        <circle
                          cx={132}
                          cy="16.3333"
                          r="1.66667"
                          transform="rotate(-90 132 16.3333)"
                          fill="#3056D3"
                        />
                        <circle
                          cx="1.66667"
                          cy="45.3333"
                          r="1.66667"
                          transform="rotate(-90 1.66667 45.3333)"
                          fill="#3056D3"
                        />
                        <circle
                          cx="1.66667"
                          cy="1.66683"
                          r="1.66667"
                          transform="rotate(-90 1.66667 1.66683)"
                          fill="#3056D3"
                        />
                        <circle
                          cx="16.3333"
                          cy="45.3333"
                          r="1.66667"
                          transform="rotate(-90 16.3333 45.3333)"
                          fill="#3056D3"
                        />
                        <circle
                          cx="16.3333"
                          cy="1.66683"
                          r="1.66667"
                          transform="rotate(-90 16.3333 1.66683)"
                          fill="#3056D3"
                        />
                        <circle
                          cx={31}
                          cy="45.3333"
                          r="1.66667"
                          transform="rotate(-90 31 45.3333)"
                          fill="#3056D3"
                        />
                        <circle
                          cx={31}
                          cy="1.66683"
                          r="1.66667"
                          transform="rotate(-90 31 1.66683)"
                          fill="#3056D3"
                        />
                        <circle
                          cx="45.6667"
                          cy="45.3333"
                          r="1.66667"
                          transform="rotate(-90 45.6667 45.3333)"
                          fill="#3056D3"
                        />
                        <circle
                          cx="45.6667"
                          cy="1.66683"
                          r="1.66667"
                          transform="rotate(-90 45.6667 1.66683)"
                          fill="#3056D3"
                        />
                        <circle
                          cx="60.3333"
                          cy="45.3338"
                          r="1.66667"
                          transform="rotate(-90 60.3333 45.3338)"
                          fill="#3056D3"
                        />
                        <circle
                          cx="60.3333"
                          cy="1.66683"
                          r="1.66667"
                          transform="rotate(-90 60.3333 1.66683)"
                          fill="#3056D3"
                        />
                        <circle
                          cx="88.6667"
                          cy="45.3338"
                          r="1.66667"
                          transform="rotate(-90 88.6667 45.3338)"
                          fill="#3056D3"
                        />
                        <circle
                          cx="88.6667"
                          cy="1.66683"
                          r="1.66667"
                          transform="rotate(-90 88.6667 1.66683)"
                          fill="#3056D3"
                        />
                        <circle
                          cx="117.667"
                          cy="45.3338"
                          r="1.66667"
                          transform="rotate(-90 117.667 45.3338)"
                          fill="#3056D3"
                        />
                        <circle
                          cx="117.667"
                          cy="1.66683"
                          r="1.66667"
                          transform="rotate(-90 117.667 1.66683)"
                          fill="#3056D3"
                        />
                        <circle
                          cx="74.6667"
                          cy="45.3338"
                          r="1.66667"
                          transform="rotate(-90 74.6667 45.3338)"
                          fill="#3056D3"
                        />
                        <circle
                          cx="74.6667"
                          cy="1.66683"
                          r="1.66667"
                          transform="rotate(-90 74.6667 1.66683)"
                          fill="#3056D3"
                        />
                        <circle
                          cx={103}
                          cy="45.3338"
                          r="1.66667"
                          transform="rotate(-90 103 45.3338)"
                          fill="#3056D3"
                        />
                        <circle
                          cx={103}
                          cy="1.66683"
                          r="1.66667"
                          transform="rotate(-90 103 1.66683)"
                          fill="#3056D3"
                        />
                        <circle
                          cx={132}
                          cy="45.3338"
                          r="1.66667"
                          transform="rotate(-90 132 45.3338)"
                          fill="#3056D3"
                        />
                        <circle
                          cx={132}
                          cy="1.66683"
                          r="1.66667"
                          transform="rotate(-90 132 1.66683)"
                          fill="#3056D3"
                        />
                      </svg>
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="w-full px-4 lg:w-1/2 xl:w-5/12">
              <div className="mt-10 lg:mt-0">
                <span className="block mb-4 text-lg font-bold text-white">
                  Why Choose Us
                </span>
                <h2 className="mb-5 text-3xl font-bold text-dark dark:text-white sm:text-[40px]/[48px]">
                  Make your customers happy by giving services.
                </h2>
                <p className="mb-5 text-base text-body-color dark:text-dark-6">
                  JanBahon is more than a bus management system — it’s a promise to make everyday travel easier. We work to provide accurate schedules, transparent pricing, and real-time updates so that commuters spend less time waiting and more time moving.
                </p>
                <p className="mb-8 text-base text-body-color dark:text-dark-6">
                 Born out of a vision to modernize traditional transport, JanBahon combines technology with transport management. From smart route planning to digital payments and live bus tracking, we are building the future of bus transportation for our cities
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default About1;
