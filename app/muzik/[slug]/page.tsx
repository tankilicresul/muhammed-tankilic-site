import { redirect } from "next/navigation";

type OldSongPageProps = {
  params: Promise<{ slug: string }>;
};

export default async function OldSongPage({ params }: OldSongPageProps) {
  const { slug } = await params;
  redirect(`/sarkilarim/${slug}`);
}