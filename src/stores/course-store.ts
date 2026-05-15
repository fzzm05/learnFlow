import { create } from "zustand";
import NetInfo from "@react-native-community/netinfo";

import { STORAGE_KEYS } from "@/config/constants";
import { fetchCatalogSeed } from "@/features/courses/course-service";
import { normalizeCourses, normalizeInstructors, shouldSendBookmarkMilestone } from "@/features/courses/course-utils";
import { getErrorMessage } from "@/lib/api";
import { sendBookmarkMilestoneNotification } from "@/lib/notifications";
import { appStorage } from "@/lib/storage";
import { usePreferencesStore } from "@/stores/preferences-store";
import type { Course, Instructor } from "@/types/models";

type CourseStore = {
  courses: Course[];
  instructors: Instructor[];
  searchQuery: string;
  bookmarkedIds: string[];
  enrolledIds: string[];
  isLoading: boolean;
  isRefreshing: boolean;
  error: string | null;
  hydrateLocalState: () => Promise<void>;
  fetchCourses: () => Promise<void>;
  refreshCourses: () => Promise<void>;
  setSearchQuery: (value: string) => void;
  toggleBookmark: (courseId: string) => Promise<void>;
  enroll: (courseId: string) => Promise<void>;
};

function syncFlags(courses: Course[], bookmarkedIds: string[], enrolledIds: string[]) {
  return courses.map((course) => ({
    ...course,
    isBookmarked: bookmarkedIds.includes(course.id),
    isEnrolled: enrolledIds.includes(course.id)
  }));
}

export const useCourseStore = create<CourseStore>((set, get) => ({
  courses: [],
  instructors: [],
  searchQuery: "",
  bookmarkedIds: [],
  enrolledIds: [],
  isLoading: false,
  isRefreshing: false,
  error: null,
  async hydrateLocalState() {
    const [bookmarkedIds, enrolledIds] = await Promise.all([
      appStorage.getObject<string[]>(STORAGE_KEYS.bookmarks),
      appStorage.getObject<string[]>(STORAGE_KEYS.enrollments)
    ]);

    set({
      bookmarkedIds: bookmarkedIds ?? [],
      enrolledIds: enrolledIds ?? []
    });
  },
  async fetchCourses() {
    const netState = await NetInfo.fetch();
    if (!netState.isConnected) {
      return;
    }

    set({ isLoading: true, error: null });
    try {
      const { users, products } = await fetchCatalogSeed();
      const instructors = normalizeInstructors(users);
      const courses = normalizeCourses(products, instructors, get().bookmarkedIds, get().enrolledIds);
      set({ instructors, courses, isLoading: false });
    } catch (error) {
      set({ error: getErrorMessage(error), isLoading: false });
    }
  },
  async refreshCourses() {
    const netState = await NetInfo.fetch();
    if (!netState.isConnected) {
      return;
    }

    set({ isRefreshing: true, error: null });
    try {
      const { users, products } = await fetchCatalogSeed();
      const instructors = normalizeInstructors(users);
      const courses = normalizeCourses(products, instructors, get().bookmarkedIds, get().enrolledIds);
      set({ instructors, courses, isRefreshing: false });
    } catch (error) {
      set({ error: getErrorMessage(error), isRefreshing: false });
    }
  },
  setSearchQuery(value) {
    set({ searchQuery: value });
  },
  async toggleBookmark(courseId) {
    const previousCount = get().bookmarkedIds.length;
    const nextIds = get().bookmarkedIds.includes(courseId)
      ? get().bookmarkedIds.filter((id) => id !== courseId)
      : [...get().bookmarkedIds, courseId];

    await appStorage.setObject(STORAGE_KEYS.bookmarks, nextIds);

    set({
      bookmarkedIds: nextIds,
      courses: syncFlags(get().courses, nextIds, get().enrolledIds)
    });

    const preferencesStore = usePreferencesStore.getState();
    const nextCount = nextIds.length;

    if (
      preferencesStore.notificationsEnabled &&
      !preferencesStore.bookmarkMilestoneSent &&
      shouldSendBookmarkMilestone(previousCount, nextCount)
    ) {
      await sendBookmarkMilestoneNotification(nextCount);
      await preferencesStore.setBookmarkMilestoneSent(true);
    }

    if (nextCount < 5 && preferencesStore.bookmarkMilestoneSent) {
      await preferencesStore.setBookmarkMilestoneSent(false);
    }
  },
  async enroll(courseId) {
    if (get().enrolledIds.includes(courseId)) {
      return;
    }

    const nextIds = [...get().enrolledIds, courseId];
    await appStorage.setObject(STORAGE_KEYS.enrollments, nextIds);

    set({
      enrolledIds: nextIds,
      courses: syncFlags(get().courses, get().bookmarkedIds, nextIds)
    });
  }
}));
