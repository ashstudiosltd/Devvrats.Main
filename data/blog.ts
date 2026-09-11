// Static mock data for the Devvrats Blogs UI.
// No backend, no database — this file is the single source of sample content.

export type Category =
  | "All"
  | "Engineering"
  | "Programming"
  | "Systems"
  | "Career"
  | "Community"
  | "Ideas";

export interface BlogAuthor {
  name: string;
  username: string;
  avatarInitials: string;
  avatarColor: string; // used as a subtle solid background for the initials avatar
}

export interface BlogPost {
  id: string;
  author: BlogAuthor;
  date: string; // pre-formatted, e.g. "Sep 3"
  readTime: string; // e.g. "6 min read"
  title: string;
  excerpt: string;
  category: Category;
  tags: string[];
  coverImage?: string; // optional cover, omitted for text-first posts
  likes: number;
  comments: number;
}

export const categories: Category[] = [
  "All",
  "Engineering",
  "Programming",
  "Systems",
  "Career",
  "Community",
  "Ideas",
];

export const tags: string[] = [
  "rust",
  "system-design",
  "typescript",
  "career-advice",
  "open-source",
  "distributed-systems",
  "debugging",
  "interviews",
  "architecture",
  "postgres",
];

export const blogPosts: BlogPost[] = [
  {
    id: "1",
    author: {
      name: "Aditi Rao",
      username: "aditirao",
      avatarInitials: "AR",
      avatarColor: "#2F4B3C",
    },
    date: "Sep 8",
    readTime: "7 min read",
    title: "Why we rewrote Devvrats' search in Rust",
    excerpt:
      "Our Elasticsearch cluster was costing more to babysit than it was saving us in query time. Here's what changed when we moved to a purpose-built Rust index, and the three assumptions that turned out to be wrong.",
    category: "Engineering",
    tags: ["rust", "architecture"],
    coverImage:
      "https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200&q=80",
    likes: 214,
    comments: 38,
  },
  {
    id: "2",
    author: {
      name: "Karan Mehta",
      username: "karanm",
      avatarInitials: "KM",
      avatarColor: "#6E4B2A",
    },
    date: "Sep 7",
    readTime: "4 min read",
    title: "The case for boring technology",
    excerpt:
      "Every new tool promises to save you time. Most of them cost it instead. A short argument for choosing the stack you can debug at 3am over the one that looks good in a blog post.",
    category: "Ideas",
    tags: ["architecture"],
    likes: 341,
    comments: 52,
  },
  {
    id: "3",
    author: {
      name: "Sana Iqbal",
      username: "sana.codes",
      avatarInitials: "SI",
      avatarColor: "#3B4C6B",
    },
    date: "Sep 6",
    readTime: "9 min read",
    title: "How I prepared for system design interviews",
    excerpt:
      "Not another checklist. This is the actual six-week plan I followed, including the two mock interviews that made me rewrite my approach to estimating capacity from scratch.",
    category: "Career",
    tags: ["interviews", "system-design"],
    coverImage:
      "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=1200&q=80",
    likes: 502,
    comments: 71,
  },
  {
    id: "4",
    author: {
      name: "Rohan Verma",
      username: "rverma",
      avatarInitials: "RV",
      avatarColor: "#7A2E2E",
    },
    date: "Sep 5",
    readTime: "11 min read",
    title: "Understanding consistent hashing from first principles",
    excerpt:
      "Most explanations start with the ring and skip the problem it solves. We'll build one up from a naive modulo hash, watch it fall apart under a single node failure, and fix it step by step.",
    category: "Systems",
    tags: ["distributed-systems", "architecture"],
    likes: 288,
    comments: 24,
  },
  {
    id: "5",
    author: {
      name: "Priya Nair",
      username: "priyanair",
      avatarInitials: "PN",
      avatarColor: "#4B4B4B",
    },
    date: "Sep 4",
    readTime: "5 min read",
    title: "A style guide for TypeScript I actually enforce",
    excerpt:
      "Most style guides are aspirational. This one only contains rules our linter enforces, because the rest just becomes a document nobody reads during review.",
    category: "Programming",
    tags: ["typescript"],
    coverImage:
      "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=1200&q=80",
    likes: 176,
    comments: 19,
  },
  {
    id: "6",
    author: {
      name: "Devansh Gupta",
      username: "devansh.g",
      avatarInitials: "DG",
      avatarColor: "#2F4B3C",
    },
    date: "Sep 3",
    readTime: "6 min read",
    title: "Six months into open source: what I learned",
    excerpt:
      "I shipped my first real PR to a project with 40,000 stars and got it merged in a day. I also had three PRs sit unreviewed for months. Both taught me something about how maintainers actually work.",
    category: "Community",
    tags: ["open-source"],
    likes: 163,
    comments: 27,
  },
  {
    id: "7",
    author: {
      name: "Meera Iyer",
      username: "meera.iyer",
      avatarInitials: "MI",
      avatarColor: "#6E4B2A",
    },
    date: "Sep 2",
    readTime: "8 min read",
    title: "Notes on debugging a memory leak in production",
    excerpt:
      "The heap graph looked fine for six hours, then climbed for six minutes and paged the whole team. A walkthrough of the leak, the wrong turns we took, and the one flag that gave it away.",
    category: "Engineering",
    tags: ["debugging", "postgres"],
    likes: 229,
    comments: 33,
  },
  {
    id: "8",
    author: {
      name: "Arjun Pillai",
      username: "arjunp",
      avatarInitials: "AP",
      avatarColor: "#3B4C6B",
    },
    date: "Sep 1",
    readTime: "5 min read",
    title: "Junior engineers should write more design docs",
    excerpt:
      "Not because anyone will read them closely, but because writing one forces you to notice the three decisions you were about to make by accident.",
    category: "Career",
    tags: ["career-advice"],
    likes: 197,
    comments: 21,
  },
];

export interface TrendingItem {
  id: string;
  title: string;
  authorName: string;
  date: string;
}

export const trendingBlogs: TrendingItem[] = [
  { id: "t1", title: "The case for boring technology", authorName: "Karan Mehta", date: "Sep 7" },
  { id: "t2", title: "How I prepared for system design interviews", authorName: "Sana Iqbal", date: "Sep 6" },
  { id: "t3", title: "Understanding consistent hashing from first principles", authorName: "Rohan Verma", date: "Sep 5" },
  { id: "t4", title: "Notes on debugging a memory leak in production", authorName: "Meera Iyer", date: "Sep 2" },
  { id: "t5", title: "Why we rewrote Devvrats' search in Rust", authorName: "Aditi Rao", date: "Sep 8" },
];
