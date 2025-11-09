import React, { useState, useEffect, useRef } from "react";
import { useWallet } from "../../hooks/useWallet";
import { connectWallet, disconnectWallet } from "../../util/wallet";
import {
  ChevronDown,
  Copy,
  Check,
  LogOut,
  User,
  Menu as MenuIcon,
  X,
  Send,
  Download,
  Lock,
  LayoutDashboard,
} from "lucide-react";

export const Menu: React.FC = () => {
  const { address, isPending, disconnect } = useWallet();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [copied, setCopied] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const truncateAddress = (addr: string | null) => {
    if (!addr) return "";
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  const copyAddress = async () => {
    if (address) {
      try {
        await navigator.clipboard.writeText(address);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error("Failed to copy address:", err);
      }
    }
  };

  const handleDisconnect = async () => {
    console.log("Disconnecting wallet...");
    setShowDropdown(false);
    setMobileMenuOpen(false);

    try {
      if (disconnect) {
        await disconnect();
        console.log("Disconnected via context");
      } else {
        await disconnectWallet();
        console.log("Disconnected via utility");
      }
    } catch (error) {
      console.error("Error during disconnect:", error);
    }
  };

  const handleNavigation = () => {
    setShowDropdown(false);
    setMobileMenuOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    };

    if (showDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showDropdown]);

  // Navigation items with icons
  const navigationItems = [
    {
      name: "Protect Content",
      href: "/x402-protection",
      icon: Lock,
      color: "text-purple-600",
    },
    {
      name: "Send XLM",
      href: "/send-payment",
      icon: Send,
      color: "text-blue-600",
    },
    {
      name: "Receive XLM",
      href: "/generate-payment",
      icon: Download,
      color: "text-emerald-600",
    },
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-white border-b border-gray-200 shadow-sm">
      <div className="container flex h-16 sm:h-20 items-center justify-between mx-auto px-4 sm:px-6 max-w-7xl">
        {/* Logo */}
        <a href="/" className="flex items-center gap-2.5 group flex-shrink-0">
          <div className="w-9 h-9 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform shadow-lg shadow-purple-500/30">
            <span className="text-white font-bold text-base">X</span>
          </div>
          <span className="hidden sm:inline text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            XPay
          </span>
        </a>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-2">
          {navigationItems.map((item) => {
            const IconComponent = item.icon;
            return (
              <a
                key={item.name}
                href={item.href}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-all"
              >
                <IconComponent className={`h-4 w-4 ${item.color}`} />
                <span>{item.name}</span>
              </a>
            );
          })}
        </nav>

        {/* Right Section - Wallet & Mobile Menu */}
        <div className="flex items-center gap-3">
          {!address ? (
            <button
              onClick={() => void connectWallet()}
              disabled={isPending}
              className="hidden sm:inline-flex items-center justify-center px-6 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm font-semibold rounded-lg hover:from-blue-700 hover:to-purple-700 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-purple-500/30"
            >
              {isPending ? "Loading..." : "Connect Wallet"}
            </button>
          ) : (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="hidden sm:inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-50 to-purple-50 text-gray-900 text-sm font-medium rounded-lg hover:from-blue-100 hover:to-purple-100 transition-all border-2 border-purple-200"
              >
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                <span className="truncate font-mono">
                  {truncateAddress(address)}
                </span>
                <ChevronDown
                  className="h-4 w-4 flex-shrink-0 transition-transform"
                  style={{
                    transform: showDropdown ? "rotate(180deg)" : "rotate(0deg)",
                  }}
                />
              </button>

              {/* Desktop Dropdown */}
              {showDropdown && (
                <div className="absolute top-14 right-0 w-72 bg-white rounded-xl shadow-2xl border-2 border-gray-200 overflow-hidden z-50">
                  {/* Wallet Info Section */}
                  <div className="p-4 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 border-b-2 border-gray-200">
                    <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-3 flex items-center gap-2">
                      <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                      Connected Wallet
                    </p>
                    <div className="flex items-center gap-2 bg-white rounded-lg p-3 border-2 border-purple-200 shadow-sm">
                      <code className="text-sm font-mono text-gray-900 truncate flex-1">
                        {truncateAddress(address)}
                      </code>
                      <button
                        onClick={copyAddress}
                        className="p-1.5 rounded-md hover:bg-purple-50 transition-colors flex-shrink-0"
                        title={copied ? "Copied!" : "Copy address"}
                      >
                        {copied ? (
                          <Check className="h-4 w-4 text-emerald-600" />
                        ) : (
                          <Copy className="h-4 w-4 text-purple-600" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Links Section */}
                  <div className="p-2">
                    <a
                      href="/dashboard"
                      onClick={handleNavigation}
                      className="flex items-center gap-3 w-full px-3 py-2.5 text-sm font-medium text-gray-700 rounded-lg hover:bg-blue-50 hover:text-blue-700 transition-colors"
                    >
                      <LayoutDashboard className="h-4 w-4" />
                      <span>Dashboard</span>
                    </a>
                    {/* <a
                      href="/settings"
                      onClick={handleNavigation}
                      className="flex items-center gap-3 w-full px-3 py-2.5 text-sm font-medium text-gray-700 rounded-lg hover:bg-purple-50 hover:text-purple-700 transition-colors"
                    >
                      <Settings className="h-4 w-4" />
                      <span>Settings</span>
                    </a> */}
                  </div>

                  {/* Disconnect Button */}
                  <div className="p-2 border-t-2 border-gray-200 z-50">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        console.log("Disconnect button clicked");
                        handleDisconnect();
                      }}
                      className="cursor-pointer flex items-center justify-center gap-2 w-full px-3 py-2.5 text-sm font-medium text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                    >
                      <LogOut className="h-4 w-4" />
                      <span>Disconnect</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Mobile Menu Button */}
          <button
            className="md:hidden inline-flex items-center justify-center p-2 rounded-lg bg-gradient-to-r from-blue-50 to-purple-50 hover:from-blue-100 hover:to-purple-100 transition-colors border-2 border-purple-200"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6 text-gray-900" />
            ) : (
              <MenuIcon className="h-6 w-6 text-gray-900" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t-2 border-gray-200">
          <div className="container mx-auto px-4 sm:px-6 py-4 max-w-7xl">
            <nav className="space-y-1 mb-4">
              {navigationItems.map((item) => {
                const IconComponent = item.icon;
                return (
                  <a
                    key={item.name}
                    href={item.href}
                    className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <IconComponent className={`h-4 w-4 ${item.color}`} />
                    {item.name}
                  </a>
                );
              })}
            </nav>

            <div className="border-t-2 border-gray-200 pt-4">
              {!address ? (
                <button
                  onClick={() => {
                    void connectWallet();
                    setMobileMenuOpen(false);
                  }}
                  disabled={isPending}
                  className="w-full px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm font-semibold rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all disabled:opacity-50 shadow-lg shadow-purple-500/30"
                >
                  {isPending ? "Loading..." : "Connect Wallet"}
                </button>
              ) : (
                <>
                  {/* Mobile Wallet Info */}
                  <div className="flex items-center gap-2 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-3 mb-3 border-2 border-purple-200">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse flex-shrink-0"></div>
                    <code className="text-sm font-mono text-gray-900 truncate flex-1">
                      {truncateAddress(address)}
                    </code>
                    <button
                      onClick={copyAddress}
                      className="p-1.5 rounded-md hover:bg-white transition-colors flex-shrink-0"
                    >
                      {copied ? (
                        <Check className="h-4 w-4 text-emerald-600" />
                      ) : (
                        <Copy className="h-4 w-4 text-purple-600" />
                      )}
                    </button>
                  </div>

                  {/* Mobile Links */}
                  <div className="space-y-1 mb-3">
                    <a
                      href="/dashboard"
                      onClick={handleNavigation}
                      className="flex items-center gap-3 w-full px-4 py-2.5 text-sm font-medium text-gray-700 rounded-lg hover:bg-blue-50 hover:text-blue-700 transition-colors"
                    >
                      <User className="h-4 w-4" />
                      Dashboard
                    </a>
                  </div>

                  {/* Mobile Disconnect */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      console.log("Mobile disconnect button clicked");
                      handleDisconnect();
                    }}
                    className="flex items-center justify-center gap-2 w-full px-4 py-2.5 text-sm font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
                  >
                    <LogOut className="h-4 w-4" />
                    Disconnect
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Dropdown Overlay */}
      {showDropdown && (
        <div
          onClick={() => setShowDropdown(false)}
          className="fixed inset-0 z-40 cursor-default"
          aria-label="Close dropdown"
        />
      )}
    </header>
  );
};
