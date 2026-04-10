import Link from 'next/link';
import XIcon from './ui/x-icon';

export function Footer() {
  return (
    <footer className="border-t border-zinc-200 dark:border-zinc-800">
      <div className="mx-auto px-6 py-2">
        <div className="flex flex-col items-center justify-between py-6 sm:h-16 sm:flex-row">
          <div className="text-center text-sm text-zinc-600 sm:w-1/3 sm:text-left dark:text-zinc-400">
            © {new Date().getFullYear()} Pathwise
          </div>

          <div className="flex justify-end sm:w-1/3">
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
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
