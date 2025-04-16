
import React from 'react'
import Link from 'next/link'

const Footer = () => {
    const currentYear = new Date().getFullYear();
  return (
    <footer className="mt-6 sm:p-4 border-t border-dark-200">
        <div className="flex justify-between items-center max-sm:flex-col-reverse">
            <p className="text-blue-400 text-semibold">
            © {currentYear} Bhupesh Bora. All rights reserved.
            </p>
        
            <Link 
            href="https://github.com/bhupesh227" 
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-400 hover:text-primary-100 transition-colors"
            aria-label="GitHub Repository"
            >
                GitHub
            </Link>
      </div>
    </footer>
  )
}

export default Footer