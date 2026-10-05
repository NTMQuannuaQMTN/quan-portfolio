import { requireAdmin } from "@/lib/auth";
import { getSite } from "@/lib/content";
import { supabaseWritable } from "@/lib/supabase";
import PageTitle from "../../ui/PageTitle";
import ProfileForm from "../../ui/ProfileForm";
import ProfilePhotos from "../../ui/ProfilePhotos";

export default async function ProfilePage() {
  await requireAdmin();
  const { profile } = await getSite();
  return (
    <>
      <PageTitle title="Profile" subtitle="Your photos, name, links and the About text." />
      <ProfilePhotos avatar={profile.avatar} cover={profile.cover} writable={supabaseWritable} />
      <ProfileForm initial={profile} />
    </>
  );
}
