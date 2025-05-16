import { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import Image from 'next/image';

export default function VideoHero({
  videoSrc = '/eco-farm.mp4',
  fallbackImage = '/images/farm-fallback.jpg',
  observerThreshold = 0.5,
}) {
  const sectionRef = useRef(null);
  const videoRef = useRef(null);
  const [videoError, setVideoError] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true); // Track play state
  const [isMuted, setIsMuted] = useState(true); // Track mute state

  // Toggle play/pause
  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play().catch(() => {
          console.error('Video playback failed');
          setVideoError(true);
        });
      }
      setIsPlaying(!isPlaying);
    }
  };

  // Toggle mute/unmute
  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  // Intersection Observer to handle play/pause based on visibility
  useEffect(() => {
    const section = sectionRef.current; // Copy sectionRef.current
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (videoRef.current) {
          if (entry.isIntersecting && isPlaying && !videoError) {
            videoRef.current.play().catch(() => {
              console.error('Video playback failed');
              setVideoError(true);
            });
          } else {
            videoRef.current.pause();
          }
        }
      },
      { threshold: observerThreshold }
    );
  
    if (section) {
      observer.observe(section);
    }
  
    return () => {
      if (section) {
        observer.unobserve(section);
      }
    };
  }, [isPlaying, videoError, observerThreshold]);

  return (
    <section
      ref={sectionRef}
      className="max-w-7xl mx-auto relative overflow-hidden rounded-xl shadow-lg bg-[url('/bg-image.png')] bg-no-repeat bg-center bg-cover mb-4 min-h-[400px] flex items-center"
      aria-labelledby="video-hero-heading"
      lang="vi"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div className="space-y-4 text-white">
            <p className="text-green-200 font-semibold uppercase tracking-widest mt-7">
              NÔNG TRẠI ECO BẮC GIANG
            </p>
            <h2
              id="video-hero-heading"
              className="text-2xl md:text-3xl font-bold leading-tight"
            >
              Hành Trình Hữu Cơ Từ Trang Trại Đến Bàn Ăn
            </h2>
            <p className="text-gray-100 text-base md:text-lg leading-relaxed">
              Khám phá quy trình canh tác tự nhiên, thu hoạch tươi sạch và giao tận tay
              người tiêu dùng. Chúng tôi cam kết chất lượng và bền vững.
            </p>
            <div className="flex items-center space-x-4">
              <p className="text-base text-gray-200">
                <span className="font-semibold">Đặc điểm:</span> Tươi sạch, An toàn,
                Thân thiện môi trường
              </p>
            </div>
          </div>
          <div className="relative">
            <div className="relative w-full rounded-lg overflow-hidden md:pb-0 pb-5">
              {videoError ? (
                <Image
                  src={fallbackImage}
                  alt="Cảnh trang trại hữu cơ Eco Bắc Giang"
                  fill
                  style={{ objectFit: 'cover' }}
                  quality={75}
                  loading="lazy" // Changed from priority for performance
                />
              ) : (
                <div className="relative">
                  <video
                    ref={videoRef}
                    className="w-full h-auto max-h-full object-contain mx-auto"
                    src={videoSrc}
                    autoPlay // Autoplay muted video
                    muted={isMuted} // Controlled by state
                    loop
                    playsInline
                    preload="metadata"
                    tabIndex={0}
                    title="Video giới thiệu nông trại Eco Bắc Giang"
                    aria-label="Video giới thiệu nông trại Eco Bắc Giang"
                    onError={() => setVideoError(true)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        togglePlay();
                      }
                    }}
                  />
                  {/* Controls Overlay */}
                  <div className="absolute bottom-4 right-4 flex space-x-2">
                    <button
                      onClick={togglePlay}
                      className="bg-black bg-opacity-50 hover:bg-opacity-75 text-white p-2 rounded-full"
                      aria-label={isPlaying ? "Tạm dừng video" : "Phát video"}
                    >
                      {isPlaying ? "❚❚" : "▶"}
                    </button>
                    <button
                      onClick={toggleMute}
                      className="bg-black bg-opacity-50 hover:bg-opacity-75 text-white p-2 rounded-full"
                      aria-label={isMuted ? "Bật âm thanh" : "Tắt âm thanh"}
                    >
                      {isMuted ? "🔇" : "🔊"}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

VideoHero.propTypes = {
  videoSrc: PropTypes.string.isRequired,
  fallbackImage: PropTypes.string.isRequired,
  observerThreshold: PropTypes.number,
};