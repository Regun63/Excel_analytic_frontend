import React from 'react';

const AppLandingPage = () => {
  
  const ExcelLogo = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-white bg-emerald-600 p-2 rounded-xl">
      <rect width="18" height="18" x="3" y="3" rx="4" ry="4" />
      <path d="M7 3v18" />
      <path d="M17 3v18" />
      <path d="M3 12h18" />
    </svg>
  );

  // Data for the feature cards.
  const features = [
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.19" />
          <path d="M16 16v2" />
          <path d="M16 22v-2" />
          <path d="M17.5 18H14.5" />
        </svg>
      ),
      title: "Secure File Upload",
      desc: "Safely upload your Excel spreadsheets to our platform and get started with your analysis in minutes."
    },
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="12" x2="12" y1="20" y2="10" />
          <line x1="18" x2="18" y1="20" y2="4" />
          <line x1="6" x2="6" y1="20" y2="16" />
        </svg>
      ),
      title: "Dynamic Chart Generation",
      desc: "Instantly create a variety of 2D and interactive 3D charts to visualize your data insights."
    },
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
        </svg>
      ),
      title: "Insightful Comparisons",
      desc: "Compare different categories within your datasets to uncover trends and make data-driven decisions."
    },
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M5 8h14" />
          <path d="M5 12h14" />
          <path d="M5 16h14" />
          <circle cx="12" cy="12" r="10" />
        </svg>
      ),
      title: "User-Friendly Dashboard",
      desc: "Access a centralized dashboard to manage your files, view your charts, and track your analytics progress."
    },
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
          <polyline points="7 10 12 15 17 10" />
          <line x1="12" x2="12" y1="15" y2="3" />
        </svg>
      ),
      title: "Export & Share",
      desc: "Easily download your high-quality charts as images to use in reports or presentations."
    },
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
        </svg>
      ),
      title: "Secure Authentication",
      desc: "Your data is protected with our secure user authentication system and role-based access control."
    },
  ];

  // Data for the user testimonials.
  const testimonials = [
    {
      name: "Jane Doe",
      quote: "The best analytics tool I've used. It's incredibly intuitive and the charts are beautiful!",
      avatar: "https://placehold.co/100x100/90EE90/000000?text=JD",
    },
    {
      name: "John Smith",
      quote: "I saved so much time with the automatic chart generation. Highly recommend for any data professional.",
      avatar: "https://placehold.co/100x100/ADD8E6/000000?text=JS",
    },
    {
      name: "Sarah Lee",
      quote: "My team loves the collaborative dashboard. We can all view and share our insights easily.",
      avatar: "https://placehold.co/100x100/FFB6C1/000000?text=SL",
    },
  ];

  return (
    <div className="font-sans antialiased bg-emerald-50 min-h-screen flex flex-col items-center p-4 text-slate-800">
      <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12 lg:p-16 w-full max-w-6xl my-auto">
        {/* Header Section */}
        <header className="text-center mb-10 md:mb-16">
          <div className="flex justify-center mb-4">
            <ExcelLogo />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-emerald-900 mb-2">
            Excel Analytics Hub
          </h1>
          <p className="text-lg text-emerald-700 max-w-3xl mx-auto">
            A comprehensive platform to upload your data, generate stunning charts, and gain actionable insights effortlessly.
          </p>
        </header>

        {/* Action Buttons */}
        <section className="flex flex-col md:flex-row justify-center gap-4 mb-12 md:mb-20">
          <a href="/signup" className="w-full md:w-auto">
            <button className="w-full md:w-56 flex items-center justify-center gap-2 px-6 py-3 bg-emerald-600 text-white font-semibold rounded-full shadow-lg hover:bg-emerald-700 hover:scale-105 transition-all duration-300">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
              Sign Up
            </button>
          </a>
          <a href="/login" className="w-full md:w-auto">
            <button className="w-full md:w-56 flex items-center justify-center gap-2 px-6 py-3 bg-white text-emerald-600 font-semibold rounded-full border border-emerald-600 shadow-md hover:bg-emerald-50 hover:scale-105 transition-all duration-300">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
                <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
                <polyline points="10 17 15 12 10 7" />
                <line x1="15" x2="3" y1="12" y2="12" />
              </svg>
              Login
            </button>
          </a>
        </section>

        {/* Feature Cards Grid */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mb-12 md:mb-20">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-emerald-50 rounded-2xl p-6 shadow-sm border border-emerald-200 hover:shadow-lg hover:scale-105 transition-all duration-300 transform"
            >
              <div className="text-emerald-600 mb-4 p-3 bg-white rounded-full w-fit">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-emerald-900 mb-2">
                {feature.title}
              </h3>
              <p className="text-slate-600">
                {feature.desc}
              </p>
            </div>
          ))}
        </section>

        {/* Testimonials Section */}
        <section className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-emerald-900 mb-6">
            What Our Users Say
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="bg-emerald-100 rounded-2xl p-6 shadow-sm border border-emerald-200"
              >
                <div className="flex justify-center mb-4">
                  <img
                    src={testimonial.avatar}
                    alt={`${testimonial.name}'s avatar`}
                    className="w-16 h-16 rounded-full border-2 border-white shadow-md"
                  />
                </div>
                <p className="text-slate-700 italic mb-4">"{testimonial.quote}"</p>
                <p className="font-semibold text-emerald-900">- {testimonial.name}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default AppLandingPage;
