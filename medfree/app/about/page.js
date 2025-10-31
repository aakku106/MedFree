import Navbar from "@/components/Navbar";

export default function AboutPage() {
  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-5xl font-bold text-gray-900 mb-4">
              About MedFree
            </h1>
            <p className="text-xl text-gray-600">
              Bridging the gap between free healthcare services and the people
              who need them
            </p>
          </div>

          {/* Mission Section */}
          <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-8">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mr-4">
                <svg
                  className="w-6 h-6 text-emerald-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h2 className="text-3xl font-bold text-gray-900">Our Mission</h2>
            </div>
            <p className="text-lg text-gray-700 leading-relaxed">
              Our mission is to ensure that every citizen has access to
              information about free government-provided medical services. We
              believe that healthcare is a fundamental right, and that awareness
              is the first step toward ensuring everyone can benefit from the
              services available to them. By creating a centralized, easy-to-use
              platform, we aim to increase public health awareness and improve
              overall health outcomes across Nepal.
            </p>
          </section>

          {/* Problem Section */}
          <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-8">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mr-4">
                <svg
                  className="w-6 h-6 text-red-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              </div>
              <h2 className="text-3xl font-bold text-gray-900">
                The Problem We Are Solving
              </h2>
            </div>
            <div className="space-y-4 text-gray-700 leading-relaxed">
              <p className="text-lg">
                There is a significant information gap in Nepal regarding free
                government-provided medical services. While the government
                offers numerous valuable services such as:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4 text-lg">
                <li>Free health checkups and screenings</li>
                <li>Free medications for chronic conditions</li>
                <li>Special health camps and vaccination drives</li>
                <li>Maternal and child health services</li>
                <li>Mental health support programs</li>
              </ul>
              <p className="text-lg">
                Many citizens are simply unaware these services exist, when they
                are scheduled, or where they are available. This leads to
                underutilization of critical healthcare resources and
                preventable health issues, particularly in underserved
                communities.
              </p>
            </div>
          </section>

          {/* How It Works Section */}
          <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-8">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                <svg
                  className="w-6 h-6 text-blue-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
              <h2 className="text-3xl font-bold text-gray-900">How It Works</h2>
            </div>
            <div className="space-y-6">
              <p className="text-lg text-gray-700 leading-relaxed">
                MedFree operates through a network of dedicated data collection
                agents, ensuring real-time, accurate information reaches those
                who need it most.
              </p>

              {/* Process Steps */}
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-10 h-10 bg-emerald-600 text-white rounded-full flex items-center justify-center font-bold mr-4">
                    1
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      Data Collection Network
                    </h3>
                    <p className="text-gray-700">
                      We have assigned specialized agents to each metropolitan
                      area across Nepal. These agents are the bridge between
                      government health centers and our platform.
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex-shrink-0 w-10 h-10 bg-emerald-600 text-white rounded-full flex items-center justify-center font-bold mr-4">
                    2
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      Direct Updates from Health Centers
                    </h3>
                    <p className="text-gray-700">
                      Government health posts, hospitals, and service centers
                      notify their designated agent as soon as a new free
                      service or health camp is planned.
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex-shrink-0 w-10 h-10 bg-emerald-600 text-white rounded-full flex items-center justify-center font-bold mr-4">
                    3
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      Real-Time Platform Updates
                    </h3>
                    <p className="text-gray-700">
                      Agents immediately update the MedFree platform with
                      detailed information about each service, including dates,
                      locations, requirements, and contact information.
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex-shrink-0 w-10 h-10 bg-emerald-600 text-white rounded-full flex items-center justify-center font-bold mr-4">
                    4
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      Citizens Access Information
                    </h3>
                    <p className="text-gray-700">
                      Users can browse services by location, category, or
                      specific health needs. Location-based search helps people
                      find nearby services quickly and easily.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Impact Section */}
          <section className="bg-linear-to-r from-emerald-600 to-blue-600 rounded-xl p-8 text-white">
            <h2 className="text-3xl font-bold mb-4">Our Impact Goal</h2>
            <p className="text-lg leading-relaxed mb-6">
              By bridging the information gap, we aim to increase the
              utilization of free government medical services, improve public
              health outcomes, and ensure that no one misses out on healthcare
              they are entitled to simply due to lack of awareness.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-4xl font-bold mb-2">100%</div>
                <div className="text-emerald-100">Free Services</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold mb-2">Real-time</div>
                <div className="text-emerald-100">Updated Information</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold mb-2">24/7</div>
                <div className="text-emerald-100">Platform Access</div>
              </div>
            </div>
          </section>
        </div>
      </main>
    </>
  );
}
