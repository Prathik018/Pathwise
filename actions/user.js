'use server';

import { db } from '@/lib/prisma';
import { auth, currentUser } from '@clerk/nextjs/server';
import { revalidatePath } from 'next/cache';
import { generateAIInsights } from './dashboard';

export async function updateUser(data) {
  const { userId } = await auth();
  if (!userId) throw new Error('Unauthorized');

  let user = await db.user.findUnique({
    where: { clerkUserId: userId },
  });

  if (!user) {
    const clerkUser = await currentUser();
    if (!clerkUser) throw new Error('User not found');

    const name = `${clerkUser.firstName} ${clerkUser.lastName}`;
    user = await db.user.create({
      data: {
        clerkUserId: clerkUser.id,
        name,
        imageUrl: clerkUser.imageUrl,
        email: clerkUser.emailAddresses[0].emailAddress,
      },
    });
  }

  try {
    // Start a transaction to handle both operations
    const result = await db.$transaction(
      async (tx) => {
        // First check if industry exists
        let industryInsight = await tx.industryInsight.findUnique({
          where: {
            industry: data.industry,
          },
        });

        // If industry doesn't exist, create it with default values
        if (!industryInsight) {
          const insights = await generateAIInsights(data.industry);

          industryInsight = await db.industryInsight.create({
            data: {
              industry: data.industry,
              ...insights,
              nextUpdate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            },
          });
        }

        // Now update the user
        const updatedUser = await tx.user.update({
          where: {
            id: user.id,
          },
          data: {
            industry: data.industry,
            experience: data.experience,
            bio: data.bio,
            skills: data.skills,
          },
        });

        return { updatedUser, industryInsight };
      },
      {
        timeout: 10000, // default: 5000
      },
    );

    revalidatePath('/');
    return result.updatedUser;
  } catch (error) {
    console.error('Error updating user and industry:', error.message);
    throw new Error('Failed to update profile');
  }
}

export async function getUserOnboardingStatus() {
  const { userId } = await auth();
  if (!userId) throw new Error('Unauthorized');

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
  });

  if (!user) return { isOnboarded: false };

  return {
    isOnboarded: !!user.industry,
  };
}
