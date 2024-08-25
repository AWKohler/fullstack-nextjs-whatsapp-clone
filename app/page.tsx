// // import WhatsAppChat from '@/components/WhatsAppChat';
// // import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
// // import { cookies } from 'next/headers';
// // import Link from 'next/link';
// //
// // export const dynamic = 'force-dynamic';
// //
// // export default async function Index() {
// //   const supabase = createServerComponentClient({ cookies });
// //
// //   const {
// //     data: { user },
// //   } = await supabase.auth.getUser();
// //
// //   return (
// //     <div className="w-full h-screen flex flex-col items-center px-8 pt-8 custom">
// //       {!user && (
// //         <nav className="w-full flex justify-center border-b border-b-foreground/10 h-16">
// //           <div className="w-full max-w-4xl flex justify-end items-center p-3 text-sm text-foreground">
// //             <div>
// //               <Link
// //                 href="/login"
// //                 className="py-2 px-4 rounded-md no-underline bg-btn-background hover:bg-btn-background-hover"
// //               >
// //                 Login
// //               </Link>
// //             </div>
// //           </div>
// //         </nav>
// //       )}
// //       {user && <WhatsAppChat user={user} />}
// //     </div>
// //   );
// // }
//
// import WhatsAppChat from '@/components/WhatsAppChat';
// import { auth } from '@clerk/nextjs';
// import Link from 'next/link';
//
// export default async function Index() {
//   const { userId } = await auth();
//
//   return (
//     <div className="w-full h-screen flex flex-col items-center px-8 pt-8 custom">
//       {!userId && (
//         <nav className="w-full flex justify-center border-b border-b-foreground/10 h-16">
//           <div className="w-full max-w-4xl flex justify-end items-center p-3 text-sm text-foreground">
//             <div>
//               <Link
//                 href="/sign-in"
//                 className="py-2 px-4 rounded-md no-underline bg-btn-background hover:bg-btn-background-hover"
//               >
//                 Sign In
//               </Link>
//             </div>
//           </div>
//         </nav>
//       )}
//       {userId && <WhatsAppChat userId={userId} />}
//     </div>
//   );
// }

import WhatsAppChat from '@/components/WhatsAppChat';
import { auth } from '@clerk/nextjs';
import { SignInButton, SignUpButton } from "@clerk/nextjs";

export default async function Index() {
  const { userId } = await auth();

  // @ts-ignore
  return (
    <div className="w-full h-screen flex flex-col items-center px-8 pt-8 custom">
      {!userId && (
        <nav className="w-full flex justify-center border-b border-b-foreground/10 h-16">
          <div className="w-full max-w-4xl flex justify-end items-center p-3 text-sm text-foreground">
            <SignInButton mode="modal">
              <button className="py-2 px-4 rounded-md no-underline bg-btn-background hover:bg-btn-background-hover mr-2">
                Sign In
              </button>
            </SignInButton>
            <SignUpButton mode="modal">
              <button className="py-2 px-4 rounded-md no-underline bg-btn-background hover:bg-btn-background-hover">
                Sign Up
              </button>
            </SignUpButton>
          </div>
        </nav>
      )}
      {userId && <WhatsAppChat userId={userId} />}
    </div>
  );
}