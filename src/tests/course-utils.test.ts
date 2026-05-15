import { normalizeCourses, normalizeInstructors, shouldSendBookmarkMilestone } from "@/features/courses/course-utils";

describe("course utilities", () => {
  it("normalizes instructors and courses deterministically", () => {
    const instructors = normalizeInstructors([
      {
        id: 1,
        email: "mentor@example.com",
        picture: { large: "avatar.jpg" },
        name: { first: "Ada", last: "Lovelace" },
        location: { country: "India" }
      }
    ]);

    const courses = normalizeCourses(
      [
        {
          id: 10,
          title: "Product Thinking",
          description: "Build useful software",
          price: 120,
          category: "design",
          thumbnail: "thumb.jpg",
          rating: 4.5,
          images: ["hero.jpg"]
        }
      ],
      instructors,
      ["10"],
      []
    );

    expect(instructors[0].name).toBe("Ada Lovelace");
    expect(courses[0].instructorName).toBe("Ada Lovelace");
    expect(courses[0].isBookmarked).toBe(true);
  });

  it("detects the bookmark milestone edge correctly", () => {
    expect(shouldSendBookmarkMilestone(4, 5)).toBe(true);
    expect(shouldSendBookmarkMilestone(5, 6)).toBe(false);
  });
});
