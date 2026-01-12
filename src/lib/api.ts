// In production, API is on same domain. In development, use localhost:3001
const API_BASE_URL = import.meta.env.VITE_API_URL || (import.meta.env.DEV ? 'http://localhost:3001/api' : '/api');

// Get token from localStorage
const getToken = (): string | null => {
  return localStorage.getItem('auth_token');
};

// Base fetch wrapper with auth
async function apiFetch<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getToken();
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    (headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'Something went wrong');
  }

  return data;
}

// Auth API
export const authApi = {
  signup: async (data: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
  }) => {
    return apiFetch<{
      message: string;
      token: string;
      user: User;
    }>('/auth/signup', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  login: async (data: { email: string; password: string }) => {
    return apiFetch<{
      message: string;
      token: string;
      user: User;
    }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  getMe: async () => {
    return apiFetch<User>('/auth/me');
  },
};

// Therapist API
export const therapistApi = {
  search: async (params?: {
    location?: string;
    specialty?: string;
    available?: boolean;
    verified?: boolean;
  }) => {
    const searchParams = new URLSearchParams();
    if (params?.location) searchParams.set('location', params.location);
    if (params?.specialty) searchParams.set('specialty', params.specialty);
    if (params?.available !== undefined) searchParams.set('available', String(params.available));
    if (params?.verified !== undefined) searchParams.set('verified', String(params.verified));
    
    const query = searchParams.toString();
    return apiFetch<Therapist[]>(`/therapists${query ? `?${query}` : ''}`);
  },

  getById: async (id: number) => {
    return apiFetch<TherapistDetail>(`/therapists/${id}`);
  },

  register: async (data: TherapistRegistration) => {
    return apiFetch<{ message: string; id: number }>('/therapists', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
};

// Stories API
export const storiesApi = {
  getAll: async (params?: { category?: string; search?: string }) => {
    const searchParams = new URLSearchParams();
    if (params?.category && params.category !== 'All') {
      searchParams.set('category', params.category);
    }
    if (params?.search) searchParams.set('search', params.search);
    
    const query = searchParams.toString();
    return apiFetch<Story[]>(`/stories${query ? `?${query}` : ''}`);
  },

  getById: async (id: number) => {
    return apiFetch<StoryDetail>(`/stories/${id}`);
  },

  create: async (data: {
    title: string;
    content: string;
    authorName: string;
    category: string;
  }) => {
    return apiFetch<{ message: string; id: number }>('/stories', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  toggleLike: async (id: number) => {
    return apiFetch<{ liked: boolean }>(`/stories/${id}/like`, {
      method: 'POST',
    });
  },

  addComment: async (id: number, data: { content: string; authorName?: string }) => {
    return apiFetch<{ message: string; id: number }>(`/stories/${id}/comments`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  getCategories: async () => {
    return apiFetch<string[]>('/categories');
  },
};

// Types
export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
}

export interface Therapist {
  id: number;
  name: string;
  title: string;
  specialties: string[];
  rating: number;
  reviews: number;
  distance: string;
  available: boolean;
  verified: boolean;
  city: string;
  state: string;
  bio?: string;
  phone?: string;
  email?: string;
  photoUrl?: string;
}

export interface TherapistDetail extends Therapist {
  address?: string;
  zip?: string;
  photoUrl?: string;
}

export interface TherapistRegistration {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  licenseType: string;
  licenseNumber: string;
  specialties: string;
  bio?: string;
  address?: string;
  city: string;
  state: string;
  zip: string;
}

export interface Story {
  id: number;
  title: string;
  excerpt: string;
  author: string;
  category: string;
  likes: number;
  comments: number;
  date: string;
  readTime: string;
  userLiked?: boolean;
}

export interface StoryComment {
  id: number;
  author: string;
  content: string;
  date: string;
}

export interface StoryDetail extends Story {
  content: string;
  comments: StoryComment[];
}

export interface SendMessageData {
  therapistId: number;
  senderName: string;
  senderEmail: string;
  senderPhone?: string;
  subject: string;
  message: string;
}

// Messaging API
export const messagesApi = {
  send: async (data: SendMessageData) => {
    return apiFetch<{ message: string; id: number; therapistName: string }>('/messages', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
};

// Mood Tracker API
export interface MoodEntry {
  id: number;
  mood: number;
  energy: number | null;
  notes: string | null;
  activities: string[];
  date: string;
  formattedDate: string;
}

export interface MoodStats {
  totalEntries: number;
  avgMood: number | null;
  avgEnergy: number | null;
  bestMood: number | null;
  lowestMood: number | null;
  weeklyMoods: { dayOfWeek: number; avgMood: number }[];
}

export const moodApi = {
  log: async (data: { mood: number; energy?: number; notes?: string; activities?: string[] }) => {
    return apiFetch<{ message: string; id: number }>('/moods', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  getEntries: async (days?: number) => {
    const query = days ? `?days=${days}` : '';
    return apiFetch<MoodEntry[]>(`/moods${query}`);
  },

  getStats: async () => {
    return apiFetch<MoodStats>('/moods/stats');
  },
};

