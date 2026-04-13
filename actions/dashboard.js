'use server';

import { db } from '@/lib/prisma';
import { auth } from '@clerk/nextjs/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-3-flash-preview' });

const normalizeSkill = (skill) =>
  String(skill || '')
    .trim()
    .toLowerCase();

const buildPersonalizedRecommendedSkills = ({
  recommendedSkills = [],
  topSkills = [],
  userSkills = [],
}) => {
  const userSkillSet = new Set(userSkills.map(normalizeSkill));
  const seen = new Set();
  const personalized = [];

  const pushUniqueMissing = (skills) => {
    for (const skill of skills) {
      const normalized = normalizeSkill(skill);
      if (!normalized || userSkillSet.has(normalized) || seen.has(normalized)) {
        continue;
      }
      seen.add(normalized);
      personalized.push(skill);
    }
  };

  // Prioritize explicit recommendations, then enrich with market top skills.
  pushUniqueMissing(recommendedSkills);
  pushUniqueMissing(topSkills);

  return personalized.slice(0, 12);
};

export const generateAIInsights = async (industry) => {
  const prompt = `
          Analyze the current state of the ${industry} industry and provide insights in ONLY the following JSON format without any additional notes or explanations:
          {
            "salaryRanges": [
              { "role": "string", "min": number, "max": number, "median": number, "location": "string" }
            ],
            "growthRate": number,
            "demandLevel": "High" | "Medium" | "Low",
            "topSkills": ["skill1", "skill2"],
            "marketOutlook": "Positive" | "Neutral" | "Negative",
            "keyTrends": ["trend1", "trend2"],
            "recommendedSkills": ["skill1", "skill2"]
          }
          
          IMPORTANT: Return ONLY the JSON. No additional text, notes, or markdown formatting.
          Include at least 5 common roles for salary ranges.
          Growth rate should be a percentage.
          Include at least 8 skills and trends.
          Include at least 10 recommendedSkills items.
        `;

  const result = await model.generateContent(prompt);
  const response = result.response;
  const text = response.text();
  const cleanedText = text.replace(/```(?:json)?\n?/g, '').trim();

  return JSON.parse(cleanedText);
};

export async function getIndustryInsights() {
  const { userId } = await auth();
  if (!userId) throw new Error('Unauthorized');

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
    include: {
      industryInsight: true,
    },
  });

  if (!user) throw new Error('User not found');

  // If no insights exist, generate them
  if (!user.industryInsight) {
    const insights = await generateAIInsights(user.industry);

    const industryInsight = await db.industryInsight.create({
      data: {
        industry: user.industry,
        ...insights,
        nextUpdate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });

    const personalizedRecommendedSkills = buildPersonalizedRecommendedSkills({
      recommendedSkills: industryInsight.recommendedSkills,
      topSkills: industryInsight.topSkills,
      userSkills: user.skills,
    });

    return {
      ...industryInsight,
      userSkills: user.skills,
      recommendedSkills: personalizedRecommendedSkills,
    };
  }

  const personalizedRecommendedSkills = buildPersonalizedRecommendedSkills({
    recommendedSkills: user.industryInsight.recommendedSkills,
    topSkills: user.industryInsight.topSkills,
    userSkills: user.skills,
  });

  return {
    ...user.industryInsight,
    userSkills: user.skills,
    recommendedSkills: personalizedRecommendedSkills,
  };
}
