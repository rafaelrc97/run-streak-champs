import { Activity, User } from '@/types/activity';

const ACTIVITIES_KEY = 'speedrun_activities';
const USER_KEY = 'user';
const USERS_KEY = 'speedrun_users'; // All registered users

export function saveActivity(activity: Activity): void {
  const activities = getActivities();
  activities.push(activity);
  localStorage.setItem(ACTIVITIES_KEY, JSON.stringify(activities));
}

export function getActivities(): Activity[] {
  const data = localStorage.getItem(ACTIVITIES_KEY);
  return data ? JSON.parse(data) : [];
}

export function getUserActivities(username: string): Activity[] {
  return getActivities().filter(a => a.username === username);
}

export function getCurrentUser(): User | null {
  const data = localStorage.getItem(USER_KEY);
  return data ? JSON.parse(data) : null;
}

export function saveUser(user: User): void {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
  
  // Also save to global users list
  const users = getAllUsers();
  const existingIndex = users.findIndex(u => u.username === user.username);
  if (existingIndex >= 0) {
    users[existingIndex] = user;
  } else {
    users.push(user);
  }
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

export function getAllUsers(): User[] {
  const data = localStorage.getItem(USERS_KEY);
  return data ? JSON.parse(data) : [];
}

export function findUserByUsername(username: string): User | null {
  const users = getAllUsers();
  return users.find(u => u.username === username) || null;
}

export function calculateWeeklyStats(username: string) {
  const activities = getUserActivities(username);
  const now = new Date();
  const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  
  const weeklyActivities = activities.filter(a => new Date(a.date) >= weekAgo);
  
  const totalDistance = weeklyActivities.reduce((sum, a) => sum + a.distance, 0);
  const totalDuration = weeklyActivities.reduce((sum, a) => sum + a.duration, 0);
  const avgSpeed = totalDuration > 0 ? (totalDistance / (totalDuration / 3600)) : 0;
  
  // Calculate average pace in min/km
  const avgPaceMinutes = totalDistance > 0 ? (totalDuration / 60) / totalDistance : 0;
  const paceMin = Math.floor(avgPaceMinutes);
  const paceSec = Math.floor((avgPaceMinutes - paceMin) * 60);
  const avgPace = `${paceMin}:${paceSec.toString().padStart(2, '0')}`;
  
  return {
    distance: totalDistance,
    duration: totalDuration,
    avgSpeed,
    avgPace,
    count: weeklyActivities.length
  };
}

export function getWeeklyRanking(): Array<{ username: string; distance: number; name: string }> {
  const users = getAllUsers();
  const ranking = users.map(user => {
    const stats = calculateWeeklyStats(user.username);
    return {
      username: user.username,
      name: user.name,
      distance: stats.distance
    };
  });
  
  return ranking.sort((a, b) => b.distance - a.distance);
}
