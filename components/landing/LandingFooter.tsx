import Link from "next/link"
import { Zap } from "lucide-react"

const links = {
  Product: [
    { label: "Dashboard",  href: "/dashboard" },
    { label: "Features",   href: "#features" },
    { label: "Modules",    href: "#modules" },
    { label: "Pricing",    href: "#pricing" },
  ],
  Company: [
    { label: "About",      href: "#" },
    { label: "Blog",       href: "#" },
    { label: "Careers",    href: "#" },
    { label: "Contact",    href: "#" },
  ],
  Legal: [
    { label: "Privacy",    href: "#" },
    { label: "Terms",      href: "#" },
    { label: "Security",   href: "#" },
    { label: "Cookies",    href: "#" },
  ],
}

export default function LandingFooter() {
  return (
    <footer className="bg-gray-900 text-gray-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-600 to-purple-800 flex items-center justify-center">
                <Zap className="w-4 h-4 text-white" strokeWidth={2.5} />
              </div>
              <span className="text-white text-lg font-bold">
                Tree<span className="text-purple-400">livine</span>
              </span>
            </Link>
            <p className="text-sm leading-relaxed mb-4 max-w-xs">
              The modern ERP platform built for growing businesses. Manage everything from one
              intelligent dashboard.
            </p>
          </div>

          {/* Link columns */}
          {Object.entries(links).map(([group, items]) => (
            <div key={group}>
              <div className="text-white text-sm font-semibold mb-4">{group}</div>
              <ul className="space-y-3">
                {items.map((item) => (
                  <li key={item.label}>
                    <Link
                      href={item.href}
                      className="text-sm hover:text-white transition-colors"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-gray-800 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm">
            © {new Date().getFullYear()} Treelivine ERP. All rights reserved.
          </p>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs text-emerald-400">All systems operational</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
