'use client';

import Link from 'next/link';
import XIcon from './ui/x-icon';
import { motion } from 'motion/react';

export function Footer() {
  return (
    <motion.footer
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className="border-t border-zinc-200 dark:border-zinc-800"
    >
      <div className="mx-auto px-6 py-2">
        <div className="flex flex-col items-center justify-between py-6 sm:h-16 sm:flex-row">
          <div className="text-center text-sm text-zinc-600 sm:w-1/3 sm:text-left dark:text-zinc-400">
            © {new Date().getFullYear()} Pathwise
          </div>

          <div className="flex justify-end sm:w-1/3">
            <motion.div whileHover={{ y: -1 }}>
              <Link
                href="https://x.com/Prathik__Pai"
                target="_blank"
                className="mt-4 flex items-center gap-1 text-sm text-zinc-600 transition-colors hover:text-zinc-900 sm:mt-0 dark:text-zinc-400 dark:hover:text-white"
              >
                <XIcon className="h-4 w-4" />
                Designed and Developed by{' '}
                <span className="font-bold text-zinc-700 dark:text-zinc-300">
                  Prathik
                </span>
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.footer>
  );
}

export default Footer;
