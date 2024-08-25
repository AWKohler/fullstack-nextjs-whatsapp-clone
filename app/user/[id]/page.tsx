// 'use client';
//
// import { useEffect, useState } from 'react';
// import { useRouter } from 'next/navigation';
// import { useUser } from '@clerk/nextjs';
// import { StreamChat } from 'stream-chat';
//
// interface UserProfile {
//   id: string;
//   name: string;
//   image: string;
// }
//
// export default function UserProfilePage({ params }: { params: { id: string } }) {
//   const router = useRouter();
//   const { user: currentUser } = useUser();
//   const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
//   const [isLoading, setIsLoading] = useState(true);
//
//   useEffect(() => {
//     const fetchUserProfile = async () => {
//       try {
//         // In a real application, you would fetch this data from your backend
//         // For this example, we'll simulate fetching user data
//         const response = await fetch(`/api/user/${params.id}`);
//         if (!response.ok) {
//           throw new Error('Failed to fetch user profile');
//         }
//         const userData = await response.json();
//         setUserProfile(userData);
//       } catch (error) {
//         console.error('Error fetching user profile:', error);
//       } finally {
//         setIsLoading(false);
//       }
//     };
//
//     fetchUserProfile();
//   }, [params.id]);
//
//   const startChat = async () => {
//     if (!currentUser || !userProfile) return;
//
//     const apiKey = process.env.NEXT_PUBLIC_REACT_APP_STREAM_KEY;
//     if (!apiKey) {
//       console.error('Stream API key is not set');
//       return;
//     }
//
//     try {
//       const response = await fetch('/api/create-user', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ userId: currentUser.id }),
//       });
//
//       if (!response.ok) {
//         throw new Error('Failed to create user');
//       }
//
//       const { userToken } = await response.json();
//
//       const chatClient = StreamChat.getInstance(apiKey);
//       await chatClient.connectUser(
//         {
//           id: currentUser.id,
//           name: currentUser.fullName || currentUser.username || currentUser.id,
//           image: currentUser.imageUrl,
//         },
//         userToken
//       );
//
//       const channel = chatClient.channel('messaging', {
//         members: [currentUser.id, userProfile.id],
//       });
//
//       await channel.create();
//
//       router.push('/'); // Redirect to the main chat UI
//     } catch (error) {
//       console.error('Error starting chat:', error);
//     }
//   };
//
//   if (isLoading) {
//     return <div>Loading...</div>;
//   }
//
//   if (!userProfile) {
//     return <div>User not found</div>;
//   }
//
//   return (
//     <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
//       <div className="bg-white p-8 rounded-lg shadow-md text-center">
//         <img
//           src={userProfile.image}
//           alt={userProfile.name}
//           className="w-32 h-32 rounded-full mx-auto mb-4"
//         />
//         <h1 className="text-2xl font-bold mb-4">{userProfile.name}</h1>
//         <button
//           onClick={startChat}
//           className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
//         >
//           Start Chat
//         </button>
//       </div>
//     </div>
//   );
// }

'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import { StreamChat } from 'stream-chat';

interface UserProfile {
  id: string;
  name: string;
  image: string;
}

export default function UserProfilePage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { user: currentUser } = useUser();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const apiKey = process.env.NEXT_PUBLIC_REACT_APP_STREAM_KEY;
        if (!apiKey) {
          throw new Error('Stream API key is not set');
        }

        const chatClient = StreamChat.getInstance(apiKey);

        // Fetch the current user's token
        const response = await fetch('/api/create-user', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId: currentUser?.id }),
        });

        if (!response.ok) {
          throw new Error('Failed to create user token');
        }

        const { userToken } = await response.json();

        // Connect the current user
        await chatClient.connectUser(
          {
            id: currentUser?.id || '',
            name: currentUser?.fullName || currentUser?.username || '',
            image: currentUser?.imageUrl,
          },
          userToken
        );

        // Fetch the profile user's data
        const user = await chatClient.queryUsers({ id: params.id });

        if (user.users.length > 0) {
          const profileUser = user.users[0];
          setUserProfile({
            id: profileUser.id,
            name: profileUser.name || profileUser.id,
            // @ts-ignore
            image: profileUser.image || `https://api.dicebear.com/6.x/initials/svg?seed=${profileUser.id}`,
          });
        } else {
          throw new Error('User not found');
        }

        // Disconnect the client after fetching data
        await chatClient.disconnectUser();
      } catch (error) {
        console.error('Error fetching user profile:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (currentUser) {
      fetchUserProfile();
    }
  }, [params.id, currentUser]);

  const startChat = async () => {
    if (!currentUser || !userProfile) return;

    const apiKey = process.env.NEXT_PUBLIC_REACT_APP_STREAM_KEY;
    if (!apiKey) {
      console.error('Stream API key is not set');
      return;
    }

    try {
      const response = await fetch('/api/create-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: currentUser.id }),
      });

      if (!response.ok) {
        throw new Error('Failed to create user');
      }

      const { userToken } = await response.json();

      const chatClient = StreamChat.getInstance(apiKey);
      await chatClient.connectUser(
        {
          id: currentUser.id,
          name: currentUser.fullName || currentUser.username || currentUser.id,
          image: currentUser.imageUrl,
        },
        userToken
      );

      const channel = chatClient.channel('messaging', {
        members: [currentUser.id, userProfile.id],
      });

      await channel.create();

      // Disconnect the client
      await chatClient.disconnectUser();

      // Redirect to the main chat UI with the new channel ID
      router.push(`/?channelId=${channel.id}`);
    } catch (error) {
      console.error('Error starting chat:', error);
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!userProfile) {
    return <div>User not found</div>;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md text-center">
        <img
          src={userProfile.image}
          alt={userProfile.name}
          className="w-32 h-32 rounded-full mx-auto mb-4"
        />
        <h1 className="text-2xl font-bold mb-4">{userProfile.name}</h1>
        <button
          onClick={startChat}
          className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
        >
          Start Chat
        </button>
      </div>
    </div>
  );
}