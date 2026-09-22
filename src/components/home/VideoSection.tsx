'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { AnimatePresence, motion, type Variants } from 'framer-motion';
import { Play, X } from 'lucide-react';
import SectionHeading from '@/components/ui/SectionHeading';
import { sectionHidden } from '@/lib/cms/merge';
import type { HomeContent } from '@/lib/cms/pages/home';
import type { MediaValue } from '@/lib/cms/types';

const galleryContainer: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

const galleryItem: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' as const } },
};

export default function VideoSection({ content }: { content: HomeContent }): React.JSX.Element {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const [lightbox, setLightbox] = useState<MediaValue | null>(null);

  // Escape closes the enlarged photo
  useEffect(() => {
    if (!lightbox) return;
    function onKeyDown(event: KeyboardEvent): void {
      if (event.key === 'Escape') setLightbox(null);
    }
    window.addEventListener('keydown', onKeyDown);
    return (): void => window.removeEventListener('keydown', onKeyDown);
  }, [lightbox]);

  function handlePlay(): void {
    const video = videoRef.current;
    if (!video) return;
    void video.play();
    setPlaying(true);
  }

  // Staff can remove either half of this section in the editor; the page
  // itself only skips the whole section when both are removed.
  const showVideo = !sectionHidden(content, 'video');
  const showGallery = !sectionHidden(content, 'gallery');

  return (
    <section className="relative overflow-hidden bg-forest-green-900 py-24 px-6">
      {/* Soft ambient glow */}
      <div className="pointer-events-none absolute -top-32 left-1/2 h-80 w-80 -translate-x-1/2 rounded-full bg-amber-400/10 blur-3xl" />

      <div className="container relative z-10 mx-auto max-w-6xl">
        {/* The former eyebrow is the heading here; the old heading sits under
            it in the same serif, regular weight, a step smaller. */}
        <SectionHeading
          title={content.videoEyebrow}
          lead={
            <>
              <span className="block font-serif text-xl leading-snug font-normal text-white/90 sm:text-2xl">
                {content.videoTitle}
              </span>
              <span className="mt-3 block">{content.videoLead}</span>
            </>
          }
          tone="dark"
          align="center"
          className="mb-12 max-w-2xl"
        />

        {/* One mosaic: the video is the large tile, photos fill in around it */}
        <motion.div
          variants={galleryContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          className="grid auto-rows-[150px] grid-cols-2 gap-3 sm:auto-rows-[190px] lg:grid-cols-4"
        >
          {/* Video tile — same size as the photo tiles */}
          {showVideo && (
          <motion.div
            variants={galleryItem}
            className="group relative overflow-hidden rounded-2xl shadow-float ring-1 ring-white/10"
          >
          <video
            ref={videoRef}
            src={content.videoFile.src}
            poster={content.videoPoster.src}
            controls={playing}
            playsInline
            preload="none"
            className="h-full w-full bg-black object-cover"
            onPause={(): void => setPlaying(true)}
          />

          {/* Poster overlay with play button (hidden once playing starts) */}
          {!playing && (
            <button
              type="button"
              onClick={handlePlay}
              aria-label="Play the Healthy Steps Foundation outreach video"
              className="absolute inset-0 flex items-center justify-center"
            >
              <Image
                src={content.videoPoster.src}
                alt={content.videoPoster.alt}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 50vw, 25vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-forest-green-900/70 via-forest-green-900/10 to-transparent transition-colors group-hover:from-forest-green-900/60" />
              <span className="relative z-10 flex h-12 w-12 items-center justify-center rounded-full bg-amber-500 text-forest-green-900 shadow-glow-amber transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-110 sm:h-14 sm:w-14">
                {/* Pulsing halo draws the eye to the only interactive element here */}
                <span
                  aria-hidden="true"
                  className="absolute inset-0 animate-ping rounded-full bg-amber-400/40"
                />
                <Play size={22} className="relative ml-0.5 fill-current" />
              </span>
              <span className="absolute bottom-3 left-3 z-10 text-left">
                <span className="block font-serif text-sm leading-snug font-bold text-white">
                  {content.videoCaptionTitle}
                </span>
                <span className="block text-xs text-white/70">{content.videoCaptionMeta}</span>
              </span>
            </button>
          )}
          </motion.div>
          )}

          {/* Photo tiles — all the same size; tap one to see it full size */}
          {showGallery && content.galleryPhotos.map((entry, i) => {
            const photo = entry.photo as MediaValue | undefined;
            if (!photo?.src) return null;

            return (
              <motion.button
                key={`${photo.src}-${i}`}
                type="button"
                variants={galleryItem}
                onClick={(): void => setLightbox(photo)}
                aria-label={`View photo full size: ${photo.alt}`}
                className="group relative cursor-pointer overflow-hidden rounded-2xl ring-1 ring-white/10 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:z-10 hover:shadow-float hover:ring-amber-300/50"
              >
                <Image
                  src={photo.src}
                  alt={photo.alt}
                  fill
                  className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.07]"
                  sizes="(max-width: 1024px) 50vw, 25vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-forest-green-900/45 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
              </motion.button>
            );
          })}
        </motion.div>
      </div>

      {/* Lightbox — the tapped photo at its natural size */}
      <AnimatePresence>
        {lightbox && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={(): void => setLightbox(null)}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-forest-green-900/95 p-4 backdrop-blur-sm sm:p-10"
            role="dialog"
            aria-modal="true"
            aria-label={lightbox.alt}
          >
            <button
              type="button"
              onClick={(): void => setLightbox(null)}
              aria-label="Close photo"
              className="absolute top-4 right-4 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
            >
              <X size={22} />
            </button>
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              onClick={(event): void => event.stopPropagation()}
              className="relative h-full max-h-[85vh] w-full max-w-5xl"
            >
              <Image
                src={lightbox.src}
                alt={lightbox.alt}
                fill
                className="object-contain"
                sizes="100vw"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
