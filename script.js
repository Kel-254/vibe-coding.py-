// Course data
const courses = [
  {
    id: 1,
    title: "Intro to HTML",
    description: "Learn the basics of HTML and build simple web pages.",
    lessons: ["HTML Structure", "Headings & Paragraphs", "Links & Images", "Forms"]
  },
  {
    id: 2,
    title: "CSS Fundamentals",
    description: "Style your web pages and learn layout techniques.",
    lessons: ["Selectors & Colors", "Box Model", "Flexbox Basics", "CSS Grid"]
  },
  {
    id: 3,
    title: "JavaScript Essentials",
    description: "Add interactivity to your websites with JavaScript.",
    lessons: ["Variables & Data Types", "Functions", "DOM Manipulation", "Events"]
  }
];

// Track completed lessons per course
let courseProgress = JSON.parse(localStorage.getItem("courseProgress")) || {};

// DOM elements
const courseList = document.getElementById("courses");
const courseDetails = document.getElementById("course-details");
const courseTitle = document.getElementById("course-title");
const courseDescription = document.getElementById("course-description");
const lessonList = document.getElementById("lesson-list");
const courseProgressText = document.getElementById("course-progress");
const backBtn = document.getElementById("back-btn");
const progressFill = document.getElementById("progress-fill");
const progressText = document.getElementById("progress-text");
const progressPercent = document.getElementById("progress-percent");

// Render all courses
function renderCourses() {
  courseList.innerHTML = "";
  courses.forEach(course => {
    const card = document.createElement("div");
    card.classList.add("course-card");

    // Calculate per-course progress
    const completedLessons = courseProgress[course.id]?.length || 0;
    const totalLessons = course.lessons.length;
    const percentage = Math.round((completedLessons / totalLessons) * 100);

    card.innerHTML = `
      <h3>${course.title}</h3>
      <p>${course.description}</p>
      <div class="mini-progress">
        <div class="mini-fill" style="width:${percentage}%;"></div>
      </div>
      <p><small>${completedLessons}/${totalLessons} lessons completed</small></p>
    `;

    card.onclick = () => showCourse(course);
    courseList.appendChild(card);
  });

  updateOverallProgress();
}

// Show course details
function showCourse(course) {
  courseTitle.textContent = course.title;
  courseDescription.textContent = course.description;

  lessonList.innerHTML = "";
  const completed = courseProgress[course.id] || [];

  course.lessons.forEach((lesson, index) => {
    const li = document.createElement("li");
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = completed.includes(index);
    checkbox.onchange = () => toggleLesson(course.id, index, checkbox.checked);
    li.appendChild(checkbox);
    li.appendChild(document.createTextNode(lesson));
    lessonList.appendChild(li);
  });

  updateCourseProgress(course.id);

  document.getElementById("course-list").classList.add("hidden");
  courseDetails.classList.remove("hidden");
}

// Toggle lesson completion
function toggleLesson(courseId, lessonIndex, isCompleted) {
  if (!courseProgress[courseId]) courseProgress[courseId] = [];
  if (isCompleted) {
    if (!courseProgress[courseId].includes(lessonIndex)) {
      courseProgress[courseId].push(lessonIndex);
    }
  } else {
    courseProgress[courseId] = courseProgress[courseId].filter(i => i !== lessonIndex);
  }
  localStorage.setItem("courseProgress", JSON.stringify(courseProgress));

  updateCourseProgress(courseId);
  renderCourses();
}

// Update course-level progress
function updateCourseProgress(courseId) {
  const course = courses.find(c => c.id === courseId);
  const completed = courseProgress[courseId]?.length || 0;
  const total = course.lessons.length;
  const percentage = Math.round((completed / total) * 100);

  courseProgressText.textContent = `Course Progress: ${completed}/${total} lessons (${percentage}%)`;
}

// Back button
backBtn.onclick = () => {
  courseDetails.classList.add("hidden");
  document.getElementById("course-list").classList.remove("hidden");
};

// Update overall progress
function updateOverallProgress() {
  const totalCourses = courses.length;
  let completedCourses = 0;

  courses.forEach(course => {
    if ((courseProgress[course.id]?.length || 0) === course.lessons.length) {
      completedCourses++;
    }
  });

  const percentage = Math.round((completedCourses / totalCourses) * 100);
  progressFill.style.width = percentage + "%";

  if (percentage === 0) {
    progressFill.style.background = "red";
  } else if (percentage <= 33) {
    progressFill.style.background = "orangered";
  } else if (percentage <= 66) {
    progressFill.style.background = "gold";
  } else {
    progressFill.style.background = "green";
  }

  progressText.textContent = `You have completed ${completedCourses} of ${totalCourses} courses (${percentage}%)`;
  progressPercent.textContent = `${percentage}%`;
}

// Initial render
renderCourses();
