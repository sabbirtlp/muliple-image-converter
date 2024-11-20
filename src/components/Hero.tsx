import React from 'react';
import { motion } from 'framer-motion';
import { Github, Linkedin, Twitter } from 'lucide-react';

export default function Hero() {
  return (
    <section className="pt-32 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5 }}
            className="relative w-32 h-32 mx-auto mb-8"
          >
            <img
              src="https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=400&h=400&fit=crop"
              alt="DeVsabbir"
              className="rounded-full shadow-lg"
            />
          </motion.div>
          
          <motion.h1
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-4"
          >
            Hi, I'm DeVsabbir
          </motion.h1>
          
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-gray-600 dark:text-gray-400 mb-8"
          >
            Full Stack Developer & UI/UX Enthusiast
          </motion.p>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="flex justify-center space-x-4"
          >
            {[
              { Icon: Github, href: 'https://github.com/devsabbir' },
              { Icon: Linkedin, href: 'https://linkedin.com/in/devsabbir' },
              { Icon: Twitter, href: 'https://twitter.com/devsabbir' }
            ].map(({ Icon, href }, index) => (
              <motion.a
                key={href}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.1 }}
                className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                <Icon size={24} />
              </motion.a>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}