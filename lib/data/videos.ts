export type VideoType = "Cover" | "Performans" | "Klip" | "Akustik";

export type Video = {
  slug: string;
  title: string;
  artist: string;
  type: VideoType;
  description: string;
  youtubeUrl: string;
  youtubeEmbedUrl: string;
  isFeatured: boolean;
  isPublished: boolean;
};

export const youtubeChannelUrl = "https://www.youtube.com/@Muhammedtanklc";

export const videos: Video[] = [
  {
    slug: "pela-dur-cover",
    title: "Pela Dur",
    artist: "Muhammed Tankılıç",
    type: "Cover",
    description:
      "Muhammed Tankılıç’ın YouTube kanalında paylaştığı bağımsız cover yorumu.",
    youtubeUrl: "https://youtu.be/-eXQX6gigvU?si=XKi-bIJPd5X5BDo_",
    youtubeEmbedUrl: "https://www.youtube.com/embed/-eXQX6gigvU",
    isFeatured: true,
    isPublished: true,
  },
];

export const publishedVideos = videos.filter((video) => video.isPublished);

export const featuredVideo =
  publishedVideos.find((video) => video.isFeatured) ?? publishedVideos[0];