import { BOOKMARK_MILESTONE } from "@/config/constants";
import type { Course, Instructor } from "@/types/models";

type RandomUserResponse = {
  id: number;
  email: string;
  picture: {
    large: string;
  };
  name: {
    first: string;
    last: string;
  };
  location: {
    country: string;
  };
};

type RandomProductResponse = {
  id: number;
  title: string;
  description: string;
  price: number;
  category: string;
  thumbnail: string;
  rating: number;
  images: string[];
};

export function normalizeInstructors(items: RandomUserResponse[]): Instructor[] {
  return items.map((item) => ({
    id: String(item.id),
    name: `${item.name.first} ${item.name.last}`,
    avatar: item.picture.large,
    email: item.email,
    headline: `Mentor from ${item.location.country}`
  }));
}

const COURSE_IMAGES = [
  "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&h=400&fit=crop",
  "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=600&h=400&fit=crop",
  "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&h=400&fit=crop",
  "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=600&h=400&fit=crop",
  "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=600&h=400&fit=crop",
  "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600&h=400&fit=crop",
  "https://images.unsplash.com/photo-1501504905252-473c47e087f8?w=600&h=400&fit=crop",
  "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=600&h=400&fit=crop",
  "https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=600&h=400&fit=crop",
  "https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=600&h=400&fit=crop",
];

export function normalizeCourses(
  products: RandomProductResponse[],
  instructors: Instructor[],
  bookmarkedIds: string[],
  enrolledIds: string[]
): Course[] {
  return products.map((product, index) => {
    const instructor = instructors[index % instructors.length];
    const fallbackImage = COURSE_IMAGES[product.id % COURSE_IMAGES.length];

    return {
      id: String(product.id),
      title: product.title,
      description: product.description,
      thumbnail: fallbackImage,
      price: product.price,
      category: product.category,
      instructorId: instructor.id,
      instructorName: instructor.name,
      instructorAvatar: instructor.avatar,
      rating: product.rating,
      lessons: 8 + ((product.id * 3) % 15),
      isBookmarked: bookmarkedIds.includes(String(product.id)),
      isEnrolled: enrolledIds.includes(String(product.id)),
      heroImages: [fallbackImage]
    };
  });
}

export function shouldSendBookmarkMilestone(previousCount: number, nextCount: number) {
  return previousCount < BOOKMARK_MILESTONE && nextCount >= BOOKMARK_MILESTONE;
}

export function buildCourseHtml(course: Course) {
  return `<!DOCTYPE html>
<html>
  <head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <style>
      body { font-family: -apple-system, BlinkMacSystemFont, sans-serif; background: #020617; color: #e2e8f0; padding: 24px; }
      .card { background: linear-gradient(135deg, rgba(56,189,248,0.2), rgba(94,234,212,0.12)); border: 1px solid rgba(226,232,240,0.1); border-radius: 24px; padding: 24px; }
      .pill { display: inline-block; padding: 6px 12px; border-radius: 999px; background: rgba(56,189,248,0.2); margin-right: 8px; font-size: 12px; }
      button { margin-top: 18px; background: #38bdf8; border: 0; border-radius: 999px; color: #082f49; font-weight: 700; padding: 12px 16px; }
      .hero { margin-top: 18px; border-radius: 18px; overflow: hidden; border: 1px solid rgba(226,232,240,0.08); background: rgba(15,23,42,0.55); }
      .hero-fallback { padding: 24px; background: linear-gradient(135deg, rgba(8,47,73,0.95), rgba(21,94,117,0.85)); }
      .hero-fallback h2 { margin: 0; font-size: 22px; }
      .hero-fallback p { margin: 8px 0 0; color: #cbd5e1; line-height: 1.6; }
      img { width: 100%; display: block; max-height: 220px; object-fit: cover; background: #0f172a; }
      .lesson-list { margin-top: 20px; padding-left: 18px; color: #cbd5e1; line-height: 1.8; }
    </style>
  </head>
  <body>
    <div class="card">
      <div class="pill">${course.category}</div>
      <div class="pill">${course.lessons} lessons</div>
      <h1>${course.title}</h1>
      <p>${course.description}</p>
      <p><strong>Instructor:</strong> ${course.instructorName}</p>
      <p><strong>Rating:</strong> ${course.rating.toFixed(1)} / 5</p>
      <div class="hero">
        <img src="${course.thumbnail}" alt="${course.title}" onerror="this.style.display='none'; document.getElementById('fallback').style.display='block';" />
        <div id="fallback" class="hero-fallback" style="display:none;">
          <h2>${course.title}</h2>
          <p>Lesson media preview unavailable. Continue with the lesson overview and module notes below.</p>
        </div>
      </div>
      <ol class="lesson-list">
        <li>Course orientation and expected outcomes</li>
        <li>Core concept breakdown for this module</li>
        <li>Practical walkthrough with instructor guidance</li>
        <li>Quick recap and next-lesson preparation</li>
      </ol>
      <button onclick="window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'content_loaded', courseId: '${course.id}' }))">Mark lesson as opened</button>
    </div>
  </body>
</html>`;
}
