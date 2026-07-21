import { Preloader } from "@/components/Preloader";
import { AudioPlayer } from "@/components/AudioPlayer";
import { ShareButton } from "@/components/ShareButton";
import { Cover } from "@/sections/Cover";
import { Opening } from "@/sections/Opening";
import { Couple } from "@/sections/Couple";
import { LoveStory } from "@/sections/LoveStory";
import { Gallery } from "@/sections/Gallery";
import { EventDetails } from "@/sections/EventDetails";
import { Gift } from "@/sections/Gift";
import { Rsvp } from "@/sections/Rsvp";
import { Guestbook } from "@/sections/Guestbook";
import { Closing } from "@/sections/Closing";

/**
 * Rakit undangan — semua section berurutan (spec §2).
 * Preloader & Cover (tirai) overlay di atas; isi undangan mengalir di bawahnya.
 */
export default function Home() {
  return (
    <>
      <Preloader />
      <Cover />
      <AudioPlayer />
      <ShareButton />

      <main>
        <Opening />
        <Couple />
        <LoveStory />
        <Gallery />
        <EventDetails />
        <Gift />
        <Rsvp />
        <Guestbook />
        <Closing />
      </main>
    </>
  );
}
