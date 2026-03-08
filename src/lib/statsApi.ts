const STATS_API =
  "https://r2yweyjn7f.execute-api.us-east-1.amazonaws.com/prod/interview";

export interface UserStatsResponse {
  xp: number;
  hearts: number;
  streak: number;
  badges: string[];
  lastActiveDate?: string | null;
}

export async function fetchUserStats(email: string): Promise<UserStatsResponse> {
  const response = await fetch(STATS_API, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ mode: "get-user-stats", email }),
  });
  const data = await response.json();
  return typeof data.body === "string" ? JSON.parse(data.body) : data;
}

export interface UpdateUserStatsParams {
  xpDelta: number;
  heartsDelta: number;
  streakDelta?: number;
  newBadge: string | null;
}

export async function updateUserStats(
  email: string,
  params: UpdateUserStatsParams
): Promise<UserStatsResponse> {
  const response = await fetch(STATS_API, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      mode: "update-user-stats",
      email,
      xpDelta: params.xpDelta,
      heartsDelta: params.heartsDelta,
      streakDelta: params.streakDelta ?? 0,
      newBadge: params.newBadge,
    }),
  });
  const data = await response.json();
  return typeof data.body === "string" ? JSON.parse(data.body) : data;
}
