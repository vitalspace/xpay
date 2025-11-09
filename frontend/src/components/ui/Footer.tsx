import React from "react";
import { Github, Twitter, Mail, ExternalLink } from "lucide-react";

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="container mx-auto px-4 sm:px-6 max-w-7xl">
        {/* Main Footer Content */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-8 py-16 sm:py-20">
          {/* Brand Section */}
          <div className="col-span-2 sm:col-span-3 lg:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="text-white font-bold text-sm">S</span>
              </div>
              <span className="text-lg font-bold text-gray-900">
                StellarPay
              </span>
            </div>
            <p className="text-sm text-gray-600 leading-relaxed mb-6 max-w-xs">
              Lightning-fast global payments powered by Stellar blockchain.
            </p>
            {/* Social Links */}
            <div className="flex gap-2">
              {[
                { 
                  icon: Twitter, 
                  label: "Twitter", 
                  href: "https://twitter.com",
                  color: "text-blue-400"
                },
                { 
                  icon: Github, 
                  label: "GitHub", 
                  href: "https://github.com",
                  color: "text-gray-700"
                },
                { 
                  icon: Mail, 
                  label: "Discord", 
                  href: "https://discord.com",
                  color: "text-indigo-500"
                },
              ].map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    aria-label={social.label}
                    className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors group"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Icon className="w-4 h-4 text-gray-600 group-hover:text-gray-900 transition-colors" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Links Sections */}
          {[
            {
              title: "Product",
              links: [
                { label: "Generate Payment", href: "/generate-payment" },
                { label: "Send Payment", href: "/send-payment" },
                { label: "Dashboard", href: "/dashboard" },
                { label: "API Docs", href: "/docs/api" },
              ],
            },
            {
              title: "Company",
              links: [
                { label: "About", href: "/about" },
                { label: "Blog", href: "/blog" },
                { label: "Careers", href: "/careers" },
                { label: "Contact", href: "/contact" },
              ],
            },
            {
              title: "Resources",
              links: [
                { label: "Documentation", href: "/docs" },
                { label: "Status", href: "/status" },
                { label: "Support", href: "/support" },
                { label: "Community", href: "/community" },
              ],
            },
            {
              title: "Legal",
              links: [
                { label: "Privacy Policy", href: "/privacy" },
                { label: "Terms of Service", href: "/terms" },
                { label: "Security", href: "/security" },
                { label: "Compliance", href: "/compliance" },
              ],
            },
          ].map((section) => (
            <div key={section.title}>
              <h3 className="font-semibold text-sm text-gray-900 mb-4">
                {section.title}
              </h3>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-sm text-gray-600 hover:text-gray-900 transition-colors flex items-center gap-1 group"
                    >
                      {link.label}
                      <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div className="border-t border-gray-200"></div>

        {/* Footer Bottom */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-8 text-sm text-gray-600">
          <p>
            © {currentYear} StellarPay. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <a href="/privacy" className="hover:text-gray-900 transition-colors">
              Privacy
            </a>
            <a href="/terms" className="hover:text-gray-900 transition-colors">
              Terms
            </a>
            <a href="/security" className="hover:text-gray-900 transition-colors">
              Security
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
