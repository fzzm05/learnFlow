export type AuthUser = {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  occupation?: string;
  interests?: string[];
};

export type AuthSession = {
  user: AuthUser;
  accessToken: string;
  refreshToken?: string;
};

export type Instructor = {
  id: string;
  name: string;
  avatar: string;
  email: string;
  headline: string;
};

export type Course = {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  price: number;
  category: string;
  instructorId: string;
  instructorName: string;
  instructorAvatar: string;
  rating: number;
  lessons: number;
  isBookmarked: boolean;
  isEnrolled: boolean;
  heroImages: string[];
};

export type ApiEnvelope<T> = {
  statusCode: number;
  data: T;
  message: string;
  success: boolean;
};
