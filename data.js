// Mock database. Replace coverImage with real poster URLs whenever you like.
// NOTE: hindiDubbed flags are best-effort guesses and vary by platform/region;
// edit them to match what you actually see on your streaming apps.
const cover = (title, bg = "262b38") =>
  `https://placehold.co/400x600/${bg}/ebe8e2?font=montserrat&text=${encodeURIComponent(title)}`;

export const TITLES = [
  { id: 1, title: "Money Heist", type: "series", genres: ["Heist", "Crime", "Thriller", "Strategy"], rating: 8.2, hindiDubbed: true },
  { id: 2, title: "Inception", type: "movie", genres: ["Heist", "Sci-Fi", "Action", "Psychological", "Thriller"], rating: 8.8, hindiDubbed: true },
  { id: 3, title: "Ocean's Eleven", type: "movie", genres: ["Heist", "Crime", "Comedy", "Strategy"], rating: 7.7, hindiDubbed: true },
  { id: 4, title: "Now You See Me", type: "movie", genres: ["Heist", "Mystery", "Thriller", "Action"], rating: 7.2, hindiDubbed: true },
  { id: 5, title: "The Prestige", type: "movie", genres: ["Psychological", "Mystery", "Thriller", "Drama"], rating: 8.5, hindiDubbed: false },
  { id: 6, title: "Shutter Island", type: "movie", genres: ["Psychological", "Thriller", "Mystery"], rating: 8.2, hindiDubbed: true },
  { id: 7, title: "Se7en", type: "movie", genres: ["Psychological", "Crime", "Thriller", "Mystery"], rating: 8.6, hindiDubbed: true },
  { id: 8, title: "Gone Girl", type: "movie", genres: ["Psychological", "Thriller", "Mystery", "Drama"], rating: 8.1, hindiDubbed: false },
  { id: 9, title: "Prison Break", type: "series", genres: ["Action", "Thriller", "Crime", "Strategy", "Heist"], rating: 8.3, hindiDubbed: true },
  { id: 10, title: "Lupin", type: "series", genres: ["Heist", "Crime", "Mystery", "Action"], rating: 7.5, hindiDubbed: true },
  { id: 11, title: "Dark", type: "series", genres: ["Sci-Fi", "Mystery", "Psychological", "Thriller", "Drama"], rating: 8.7, hindiDubbed: true },
  { id: 12, title: "Mindhunter", type: "series", genres: ["Psychological", "Crime", "Thriller", "Drama"], rating: 8.6, hindiDubbed: false },
  { id: 13, title: "Breaking Bad", type: "series", genres: ["Crime", "Drama", "Thriller", "Strategy"], rating: 9.5, hindiDubbed: false },
  { id: 14, title: "Sherlock", type: "series", genres: ["Mystery", "Crime", "Psychological", "Strategy"], rating: 9.1, hindiDubbed: false },
  { id: 15, title: "Death Note", type: "anime", genres: ["Psychological", "Thriller", "Mystery", "Strategy", "Supernatural"], rating: 8.6, hindiDubbed: false },
  { id: 16, title: "Code Geass", type: "anime", genres: ["Strategy", "Action", "Sci-Fi", "Psychological", "Drama"], rating: 8.7, hindiDubbed: false },
  { id: 17, title: "Monster", type: "anime", genres: ["Psychological", "Thriller", "Mystery", "Drama"], rating: 8.8, hindiDubbed: false },
  { id: 18, title: "Attack on Titan", type: "anime", genres: ["Action", "Drama", "Strategy", "Fantasy"], rating: 9.1, hindiDubbed: true },
  { id: 19, title: "Jujutsu Kaisen", type: "anime", genres: ["Action", "Fantasy", "Strategy"], rating: 8.6, hindiDubbed: true },
  { id: 20, title: "Demon Slayer", type: "anime", genres: ["Action", "Fantasy"], rating: 8.4, hindiDubbed: true },
  { id: 21, title: "Detective Conan", type: "anime", genres: ["Mystery", "Crime", "Strategy"], rating: 8.3, hindiDubbed: true },
  { id: 22, title: "Psycho-Pass", type: "anime", genres: ["Psychological", "Sci-Fi", "Crime", "Thriller"], rating: 8.4, hindiDubbed: false },
].map((t) => ({ ...t, coverImage: cover(t.title) }));
