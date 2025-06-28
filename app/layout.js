import { Inter } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "sonner";
import Header from "@/components/header";
import { ThemeProvider } from "@/components/theme-provider";
import { dark } from "@clerk/themes";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Pathwise ",
  description: "",
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider
      appearance={{
        baseTheme: dark,
      }}
    >
      <html lang="en" suppressHydrationWarning>
        <head>
          <link rel="icon" href="/logo.png" sizes="any" />
        </head>
        <body className={`${inter.className}`}>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
            <Header />
            <main className="min-h-screen">{children}</main>
            <Toaster richColors />

            <footer className="bg-muted/50 py-12">
              <div className="container mx-auto px-4 text-center text-gray-200">
                <p>Made with 💗 by Prathik Pai</p>
              </div>

              {/* Social Media Links Section */}

              <footer className="w-full py-6 ">
                <div className="flex justify-center items-center space-x-6 text-muted-foreground">
                  {/* GitHub */}
                  <a
                    href="https://github.com/Prathik018"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="GitHub"
                    className="hover:text-white transition-colors"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="26"
                      height="26"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 
        3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 
        0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61 
        -.546-1.387-1.333-1.757-1.333-1.757-1.09-.744.084-.729.084-.729 
        1.205.084 1.838 1.236 1.838 1.236 1.07 1.834 2.807 1.304 
        3.492.997.108-.776.418-1.305.762-1.605-2.665-.3-5.467-1.334-5.467-5.93 
        0-1.31.468-2.38 1.236-3.22-.123-.303-.535-1.523.117-3.176 
        0 0 1.008-.322 3.3 1.23a11.51 11.51 0 013 0c2.29-1.552 
        3.297-1.23 3.297-1.23.653 1.653.24 2.873.118 3.176.77.84 
        1.234 1.91 1.234 3.22 0 4.61-2.807 5.625-5.48 5.92.43.372.823 1.102.823 
        2.222 0 1.606-.014 2.898-.014 3.293 0 .32.216.694.825.576 
        4.765-1.585 8.2-6.082 8.2-11.385 0-6.627-5.373-12-12-12z"
                      />
                    </svg>
                  </a>

                  {/* Gmail */}
                  <a
                    href="mailto:prathikvpai@gmail.com"
                    aria-label="Gmail"
                    className="hover:text-white transition-colors"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="26"
                      height="26"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 12.713l11.985-9.713h-23.97L12 12.713zm0 2.574l-12-9.711v16.424h24V5.576l-12 9.711z" />
                    </svg>
                  </a>

                  {/* Twitter */}
                  <a
                    href="https://twitter.com/Prathik__Pai"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Twitter"
                    className="hover:text-white transition-colors"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="26"
                      height="26"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M24 4.557a9.83 9.83 0 01-2.828.775 4.932 4.932 0 002.165-2.723 9.864 9.864 0 01-3.127 1.195 4.916 4.916 0 00-8.384 4.482C7.688 8.094 4.064 6.13 1.64 3.161a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.229-.616v.06a4.918 4.918 0 003.946 4.827 4.996 4.996 0 01-2.224.084 4.937 4.937 0 004.6 3.419A9.867 9.867 0 010 19.54a13.94 13.94 0 007.548 2.212c9.057 0 14.01-7.513 14.01-14.01 0-.213-.005-.425-.014-.636A10.012 10.012 0 0024 4.557z" />
                    </svg>
                  </a>

                  {/* Instagram */}
                  <a
                    href="https://www.instagram.com/prathikk.pai"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Instagram"
                    className="hover:text-white transition-colors"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="26"
                      height="26"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 2.2c3.2 0 3.584.012 4.85.07 1.17.056 1.97.24 2.427.403a4.92 4.92 0 011.774 1.153 4.92 4.92 0 011.153 1.774c.163.456.347 1.256.403 2.427.058 1.266.07 1.65.07 4.85s-.012 3.584-.07 4.85c-.056 1.17-.24 1.97-.403 2.427a4.92 4.92 0 01-1.153 1.774 4.92 4.92 0 01-1.774 1.153c-.456.163-1.256.347-2.427.403-1.266.058-1.65.07-4.85.07s-3.584-.012-4.85-.07c-1.17-.056-1.97-.24-2.427-.403a4.92 4.92 0 01-1.774-1.153 4.92 4.92 0 01-1.153-1.774c-.163-.456-.347-1.256-.403-2.427C2.212 15.784 2.2 15.4 2.2 12s.012-3.584.07-4.85c.056-1.17.24-1.97.403-2.427a4.92 4.92 0 011.153-1.774 4.92 4.92 0 011.774-1.153c.456-.163 1.256-.347 2.427-.403C8.416 2.212 8.8 2.2 12 2.2zm0 1.8c-3.135 0-3.507.012-4.743.068-1.022.048-1.575.215-1.944.36a3.12 3.12 0 00-1.132.738 3.12 3.12 0 00-.738 1.132c-.145.369-.312.922-.36 1.944-.056 1.236-.068 1.608-.068 4.743s.012 3.507.068 4.743c.048 1.022.215 1.575.36 1.944a3.12 3.12 0 00.738 1.132 3.12 3.12 0 001.132.738c.369.145.922.312 1.944.36 1.236.056 1.608.068 4.743.068s3.507-.012 4.743-.068c1.022-.048 1.575-.215 1.944-.36a3.12 3.12 0 001.132-.738 3.12 3.12 0 00.738-1.132c.145-.369.312-.922.36-1.944.056-1.236.068-1.608.068-4.743s-.012-3.507-.068-4.743c-.048-1.022-.215-1.575-.36-1.944a3.12 3.12 0 00-.738-1.132 3.12 3.12 0 00-1.132-.738c-.369-.145-.922-.312-1.944-.36-1.236-.056-1.608-.068-4.743-.068zm0 3.8a5.2 5.2 0 110 10.4 5.2 5.2 0 010-10.4zm0 1.8a3.4 3.4 0 100 6.8 3.4 3.4 0 000-6.8zm5.6-.9a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" />
                    </svg>
                  </a>
                </div>
              </footer>
            </footer>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
