import React from "react";
import { Github, Linkedin, Mail } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-black text-gray-300 py-8 mt-10">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between">
        
        {/* Left Section */}
        <div className="text-center md:text-left mb-4 md:mb-0">
          <h2 className="text-white text-xl font-semibold">
            Excel Analytics Platform
          </h2>
          <p className="text-sm text-gray-400">
            Empowering data-driven decisions with insights.
          </p>
        </div>

        {/* Middle Section - Navigation */}
        <div className="flex space-x-6 text-sm">
          <a href="/about" className="hover:text-white transition">
            About
          </a>
          <a href="/features" className="hover:text-white transition">
            Features
          </a>
          <a href="/pricing" className="hover:text-white transition">
            Pricing
          </a>
          <a href="/contact" className="hover:text-white transition">
            Contact
          </a>
        </div>

        {/* Right Section - Social Icons */}
        <div className="flex space-x-5 mt-4 md:mt-0">
          <a
            href="https://github.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white transition"
          >
            <Github size={20} />
          </a>
          <a
            href="https://linkedin.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white transition"
          >
            <Linkedin size={20} />
          </a>
          <a
            href="mailto:info@excelanalytics.com"
            className="hover:text-white transition"
          >
            <Mail size={20} />
          </a>
        </div>
      </div>

      {/* Bottom Line */}
      <div className="border-t border-gray-700 mt-6 pt-4 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} Excel Analytics Platform. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
