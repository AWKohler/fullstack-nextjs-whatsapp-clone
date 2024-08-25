// import './globals.css';
//
// export const metadata = {
//   title: 'Whatsapp Clone',
//   description: 'Created and powered by Stream',
// };
//
// export default function RootLayout({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   return (
//     <html lang="en">
//       <body>
//         <main className="min-h-screen flex flex-col items-center">
//           {children}
//         </main>
//       </body>
//     </html>
//   );
// }

import './globals.css';
import { ClerkProvider } from '@clerk/nextjs';

export const metadata = {
  title: 'Botflow support',
  description: 'Receive support for the Botflow.io platform',
};

export default function RootLayout({
                                     children,
                                   }: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en">
      <body>
      <main className="min-h-screen flex flex-col items-center">
        {children}
      </main>
      </body>
      </html>
    </ClerkProvider>
  );
}