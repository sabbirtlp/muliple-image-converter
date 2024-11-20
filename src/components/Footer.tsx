import React from 'react';
import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="py-8 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-800">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          className="flex flex-col items-center justify-center space-y-4"
        >
          <p className="flex items-center text-gray-600 dark:text-gray-400">
            Made with <Heart className="w-5 h-5 mx-1 text-red-500" /> by DeVsabbir
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-500">
            © {new Date().getFullYear()} All rights reserved
          </p>
        </motion.div>
      </div>
    </footer>
  );
}