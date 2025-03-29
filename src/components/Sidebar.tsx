import React from 'react';

interface SidebarProps {
  className?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({ className = '' }) => {
  return (
    <aside className={`w-64 border-r bg-background hidden lg:block ${className}`}>
      <div className="sticky top-0 p-4 overflow-y-auto h-[calc(100vh-4rem)]">
        <nav>
          <ul className="space-y-1">
            <li>
              <a
                href="/"
                className="block px-3 py-2 rounded-md hover:bg-gray-100 transition-colors duration-200"
              >
                Home
              </a>
            </li>
            <li>
              <a
                href="/blog"
                className="block px-3 py-2 rounded-md hover:bg-gray-100 transition-colors duration-200"
              >
                Blog
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar; 