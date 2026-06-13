import { Mistral } from "@mistralai/mistralai";
import type { UserProfile, Opportunity } from "@/types";

const mistral = new Mistral({ apiKey: process.env.MISTRAL_API_KEY! });

export interface MatchResult {
  match_score: number;
  match_reasons: string[];
  missing_requirements: string[];
  application_readiness_score: number;
  improvement_suggestions: string[];
  ai_advice: string;
}

export async function calculateMatch(
  profile: UserProfile,
  opportunity: Opportunity
): Promise<MatchResult> {
  const prompt = `You are an expert scholarship advisor for African students. Analyze the match between this student profile and scholarship opportunity.

STUDENT PROFILE:
- Name: ${profile.full_name}
- Nationality: ${profile.nationality}
- Education Level: ${profile.education_level}
- Course of Study: ${profile.course_of_study || "Not specified"}
- Institution: ${profile.institution || "Not specified"}
- GPA: ${profile.gpa || "Not specified"}
- Academic Interests: ${profile.academic_interests.join(", ")}
- Opportunity Types Wanted: ${profile.opportunity_types.join(", ")}
- Funding Preference: ${profile.funding_preference}
- Program Levels: ${profile.program_level.join(", ")}
- Preferred Countries: ${profile.preferred_countries.join(", ")}
- Start Timeline: ${profile.start_timeline}
- Study Format: ${profile.study_format}
- Languages: ${profile.language_preferences.join(", ")}
- IELTS: ${profile.ielts_score || "None"}, TOEFL: ${profile.toefl_score || "None"}, GRE: ${profile.gre_score || "None"}
- AI Instructions: ${profile.ai_instructions || "None"}

OPPORTUNITY:
- Name: ${opportunity.name}
- Description: ${opportunity.description}
- Country: ${opportunity.country}
- Program Type: ${opportunity.program_type}
- Funding Type: ${opportunity.funding_type}
- Eligibility: ${opportunity.eligibility_requirements.join("; ")}
- Benefits: ${opportunity.benefits.join(", ")}
- Tags: ${opportunity.tags.join(", ")}
- Deadline: ${opportunity.deadline || "Ongoing"}

Respond ONLY with valid JSON in this exact format:
{
  "match_score": <integer 0-100>,
  "match_reasons": [<array of 3-5 specific reasons why this matches>],
  "missing_requirements": [<array of requirements student may not currently meet, empty if none>],
  "application_readiness_score": <integer 0-100 based on how prepared the student is>,
  "improvement_suggestions": [<array of 2-4 concrete suggestions to improve application chances>],
  "ai_advice": "<2-3 sentence personalized advice paragraph>"
}`;

  const response = await mistral.chat.complete({
    model: "mistral-small-latest",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.3,
    responseFormat: { type: "json_object" },
  });

  const content = response.choices?.[0]?.message?.content;
  if (!content) throw new Error("Empty Mistral response");

  return JSON.parse(typeof content === "string" ? content : JSON.stringify(content)) as MatchResult;
}

export async function generateActionPlan(
  profile: UserProfile,
  opportunity: Opportunity
) {
  const prompt = `You are a scholarship application expert. Create a detailed, personalized week-by-week application action plan for this student.

STUDENT: ${profile.full_name}, studying ${profile.course_of_study || "not specified"} at ${profile.institution || "their institution"}, nationality: ${profile.nationality}
AI INSTRUCTIONS: ${profile.ai_instructions || "none"}

OPPORTUNITY: ${opportunity.name} in ${opportunity.country}
DEADLINE: ${opportunity.deadline || "Rolling/Ongoing"}
ELIGIBILITY: ${opportunity.eligibility_requirements.join("; ")}

Create a realistic 4-6 week plan. Respond ONLY with valid JSON:
{
  "weeks": [
    {
      "week": 1,
      "title": "<week theme>",
      "tasks": [
        { "id": "w1t1", "description": "<specific actionable task>", "completed": false }
      ]
    }
  ]
}`;

  const response = await mistral.chat.complete({
    model: "mistral-small-latest",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.4,
    responseFormat: { type: "json_object" },
  });

  const content = response.choices?.[0]?.message?.content;
  if (!content) throw new Error("Empty Mistral response");

  return JSON.parse(typeof content === "string" ? content : JSON.stringify(content));
}

export async function generateWeeklyDigestRecommendation(
  profile: UserProfile,
  topMatchNames: string[]
): Promise<string> {
  const prompt = `Write a 2-3 sentence personalized strategic scholarship recommendation paragraph for an African student.

Student: ${profile.full_name}, studying ${profile.course_of_study || "their field"}, from ${profile.nationality}
Current top opportunities: ${topMatchNames.join(", ")}
Student's AI instructions: ${profile.ai_instructions || "none"}

Write directly to the student, be specific and actionable. Do not use generic advice. Focus on their field and opportunities. Return plain text only, no JSON.`;

  const response = await mistral.chat.complete({
    model: "mistral-small-latest",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.6,
    maxTokens: 200,
  });

  const content = response.choices?.[0]?.message?.content;
  return typeof content === "string" ? content : "";
}
