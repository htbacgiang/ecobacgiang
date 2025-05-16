import { useState, useRef, useEffect } from "react";
import BusinessPhilosophy from "../../components/about/BusinessPhilosophy ";
import Intro from "../../components/about/Intro";
import QualityPolicy from "../../components/about/QualityPolicy";
import DefaultLayout from "../../components/layout/DefaultLayout";
import Head from "next/head";
import Image from "next/image";

export default function AboutSection() {
  const [videoError, setVideoError] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true); // Track play state
  const [isMuted, setIsMuted] = useState(true); // Track mute state
  const videoRef = useRef(null); // Reference to video element

  const videoSrc = "/eco-farm.mp4";
  const fallbackImage = "/images/farm-fallback.jpg";

  // Toggle play/pause
  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play().catch(() => {
          setVideoError(true); // Fallback to image if playback fails
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
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (videoRef.current) {
          if (entry.isIntersecting && isPlaying) {
            // Play video if visible and not manually paused
            videoRef.current.play().catch(() => setVideoError(true));
          } else {
            // Pause video if not visible
            videoRef.current.pause();
          }
        }
      },
      {
        threshold: 0.5, // Trigger when 50% of the video is visible
      }
    );

    if (videoRef.current) {
      observer.observe(videoRef.current);
    }

    // Cleanup observer on component unmount
    return () => {
      if (videoRef.current) {
        observer.unobserve(videoRef.current);
      }
    };
  }, [isPlaying]); // Re-run effect if isPlaying changes

  return (
    <DefaultLayout>
      <Head>
        {/* Existing metadata unchanged */}
        <title>Eco Bắc Giang: Tương Lai Của Nông Nghiệp Bền Vững</title>
        <meta
          name="description"
          content="Khám phá ý nghĩa logo của Eco Bắc Giang - biểu tượng của sự kết hợp giữa nông nghiệp hữu cơ và công nghệ cao, định hướng phát triển bền vững tại Việt Nam."
        />
        <meta
          name="keywords"
          content="Eco Bắc Giang, ý nghĩa logo Eco Bắc Giang, nông nghiệp công nghệ cao, sản xuất hữu cơ, phát triển bền vững, công nghệ thông minh"
        />
        <meta name="author" content="Eco Bắc Giang" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta
          property="og:title"
          content="Eco Bắc Giang: Tương Lai Của Nông Nghiệp Bền Vững"
        />
        <meta
          property="og:description"
          content="Khám phá ý nghĩa logo của Eco Bắc Giang - biểu tượng của sự kết hợp giữa nông nghiệp hữu cơ và công nghệ cao, định hướng phát triển bền vững tại Việt Nam."
        />
        <meta
          property="og:image"
          content={`${process.env.NEXT_PUBLIC_BASE_URL}/baner.webp`}
        />
        <meta
          property="og:url"
          content={`${process.env.NEXT_PUBLIC_BASE_URL}/baner.webp`}
        />
        <meta property="og:type" content="website" />
        <meta property="og:locale" content="vi_VN" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content="Ý nghĩa logo Eco Bắc Giang | Phát triển bền vững"
        />
        <meta
          name="twitter:description"
          content="Biểu tượng Eco Bắc Giang phản ánh sự kết hợp giữa nông nghiệp hữu cơ và công nghệ cao, hướng đến mục tiêu phát triển bền vững."
        />
        <meta
          name="twitter:image"
          content={`${process.env.NEXT_PUBLIC_BASE_URL}/baner.webp`}
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="h-[80px] bg-white"></div>

      <div className="bg-white py-6 px-6">
        <div className="container md:w-10/12 mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          {/* Text Section */}
          <div>
            <h2 className="text-2xl font-bold text-green-700 mb-4 border-b-4 border-green-300 inline-block pb-1">
              Eco Bắc Giang: <br />
              Tương Lai Của Nông Nghiệp Bền Vững
            </h2>
            <p className="mb-4 text-gray-700">
              <strong className="text-green-700">Khởi Nguồn Từ Một Tầm Nhìn: </strong>
              Giữa vùng đất trù phú của Bắc Giang, Eco Bắc Giang không chỉ đơn thuần là một công ty nông nghiệp, mà còn là biểu tượng của sự đổi mới trong ngành nông nghiệp Việt Nam.
            </p>
            <p className="mb-4 text-gray-700">
              Với tầm nhìn rõ ràng và đầy tham vọng, <strong className="text-green-700">Eco Bắc Giang</strong> hướng tới trở thành người tiên phong trong lĩnh vực nông nghiệp thông minh và sản xuất hữu cơ bền vững. Được thành lập dựa trên nền tảng của tri thức hiện đại và tình yêu thiên nhiên, Eco Bắc Giang cam kết xây dựng một hệ sinh thái nông nghiệp hài hòa giữa con người và môi trường, đồng thời góp phần vào mục tiêu <strong className="text-green-700">Net Zero 2050</strong>.
            </p>
          </div>

          {/* Video Section */}
          <div className="relative max-w-screen-xl mx-auto rounded-lg shadow-lg overflow-hidden">
            <div className="relative w-full rounded-lg overflow-hidden">
              {videoError ? (
                <Image
                  src={fallbackImage}
                  alt="Cảnh trang trại hữu cơ Eco Bắc Giang"
                  fill
                  style={{ objectFit: "cover" }}
                  quality={75}
                  loading="lazy"
                />
              ) : (
                <div className="relative">
                  <video
                    ref={videoRef}
                    className="w-full h-auto max-h-full object-contain mx-auto"
                    src={videoSrc}
                    autoPlay // Start muted autoplay
                    muted={isMuted} // Controlled by state
                    loop
                    playsInline
                    preload="metadata"
                    tabIndex={0}
                    title="Video giới thiệu nông trại Eco Bắc Giang"
                    aria-label="Video giới thiệu nông trại Eco Bắc Giang"
                    onError={() => setVideoError(true)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
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
        <BusinessPhilosophy />
        <Intro />
        <QualityPolicy />
      </div>
    </DefaultLayout>
  );
}