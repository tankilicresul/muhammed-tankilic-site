export type MusicPlatform = {
  name: "Spotify" | "Apple Music";
  url: string;
};

export type SongDownload = {
  label: string;
  fileUrl: string;
  format: "MP3" | "WAV" | "MP4" | "PDF" | "IMAGE";
  requiresAuth: boolean;
  isActive: boolean;
};

export type Song = {
  slug: string;
  title: string;
  artist: string;
  type: "Single" | "EP" | "Album" | "Cover" | "Akustik" | "Arşiv";
  language: "Kürtçe" | "Türkçe" | "İngilizce" | "Enstrümantal";
  genre: string;
  releaseDate?: string;
  coverImage: string;
  shortDescription: string;
  description: string;
  story?: string;
  lyrics?: string;
  credits?: {
    vocal?: string;
    lyrics?: string;
    music?: string;
    arrangement?: string;
    guitar?: string;
    recording?: string;
    mixMaster?: string;
    coverDesign?: string;
  };
  platforms: MusicPlatform[];
  downloads: SongDownload[];
  youtubeEmbedUrl?: string;
  isLatest: boolean;
  isFeatured: boolean;
  isPublished: boolean;
};

export type ArtistLink = {
  name: "YouTube" | "Spotify" | "Apple Music" | "Instagram";
  label: string;
  url: string;
};

export const artistLinks: ArtistLink[] = [
  {
    name: "YouTube",
    label: "YouTube Kanalı",
    url: "https://www.youtube.com/@Muhammedtanklc",
  },
];

export const songs: Song[] = [
  {
    slug: "zef-cara",
    title: "Zef Cara",
    artist: "Muhammed Tankılıç",
    type: "Single",
    language: "Kürtçe",
    genre: "Kürtçe · Akustik · Folk",
    releaseDate: "2024",
    coverImage: "/muzik/zef-cara-cover.jpg",
    shortDescription:
      "Kürtçe sözler, akustik gitar ve sade bir yorumla şekillenen özgün çalışma.",
    description:
      "Zef Cara, Muhammed Tankılıç’ın Kürtçe müzik üretimindeki sade, duygusal ve akustik çizgisini yansıtan özgün bir single çalışmasıdır.",
    story:
      "Şarkı, yalın bir anlatım ve güçlü bir duygu atmosferi üzerine kurulu. Akustik yapı, sözlerin hikâyesini ön plana çıkaracak şekilde sade tutulmuştur.",
    lyrics: "",
    credits: {
      vocal: "Muhammed Tankılıç",
      lyrics: "Muhammed Tankılıç",
      music: "Muhammed Tankılıç",
      guitar: "Muhammed Tankılıç",
    },
    platforms: [
      {
        name: "Spotify",
        url: "https://open.spotify.com/intl-tr/track/7B5SGhv7YD7opodmyJQQqm?si=958d9492fbd4447b",
      },
      {
        name: "Apple Music",
        url: "https://music.apple.com/us/album/zef-cara-single/1779404301",
      },
    ],
    downloads: [
      {
        label: "MP3 İndir",
        fileUrl: "",
        format: "MP3",
        requiresAuth: true,
        isActive: false,
      },
      {
        label: "Kapak Görseli",
        fileUrl: "/muzik/zef-cara-cover.jpg",
        format: "IMAGE",
        requiresAuth: true,
        isActive: false,
      },
    ],
    isLatest: true,
    isFeatured: true,
    isPublished: true,
  },
];

export const publishedSongs = songs.filter((song) => song.isPublished);

export const featuredSongs = publishedSongs.filter((song) => song.isFeatured);

export const latestSong =
  publishedSongs.find((song) => song.isLatest) ?? publishedSongs[0];

export function getSongBySlug(slug: string) {
  return publishedSongs.find((song) => song.slug === slug);
}