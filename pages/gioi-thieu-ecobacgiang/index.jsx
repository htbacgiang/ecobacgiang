import { useState, useRef, useEffect } from "react";
import BusinessPhilosophy from "../../components/about/BusinessPhilosophy ";
import Intro from "../../components/about/Intro";
import QualityPolicy from "../../components/about/QualityPolicy";
import DefaultLayout from "../../components/layout/DefaultLayout";
import Head from "next/head";
import Image from "next/image";

export default function AboutSection() {
  const [videoError, setVideoError] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);
  const [ibaseuted, setIbaseuted] = useState(true);
  const videoRef = useRef(null);

  const videoSrc = "/eco-farm.mp4";
  const fallbackImage = "/images/farm-fallback.jpg";

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play().catch(() => {
          setVideoError(true);
        });
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !ibaseuted;
      setIbaseuted(!ibaseuted);
    }
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (videoRef.current) {
          if (entry.isIntersecting && isPlaying) {
            videoRef.current.play().catch(() => setVideoError(true));
          } else {
            videoRef.current.pause();
          }
        }
      },
      {
        threshold: 0.5,
      }
    );

    if (videoRef.current) {
      observer.observe(videoRef.current);
    }

    return () => {
      if (videoRef.current) {
        observer.unobserve(videoRef.current);
      }
    };
  }, [isPlaying]);

  return (
    <DefaultLayout>
      <Head>
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
      
      {/* Header Spacer */}
      <div className="h-[80px] bg-gradient-to-r from-green-50 to-green-100"></div>

      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-green-50 via-emerald-50 to-green-100 py-16 px-6 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-72 h-72 bg-green-300 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
          <div className="absolute top-0 right-0 w-72 h-72 bg-green-400 rounded-full mix-blend-multiply filter blur-xl animate-pulse animation-delay-2000"></div>
          <div className="absolute bottom-0 left-0 w-72 h-72 bg-green-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse animation-delay-4000"></div>
        </div>

        <div className="relative container mx-auto max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Text Section */}
            <div className="space-y-8">
              {/* Badge */}
              <div className="inline-flex items-center  px-4 py-2 bg-green-600 text-white text-base font-bold rounded-full shadow-lg hover:bg-green-700 transition-colors duration-300">
                <span className="w-2 h-2 bg-white rounded-full mr-2 animate-pulse"></span>
                Nông Nghiệp Bền Vững
              </div>

              {/* Main Heading */}
              <div className="space-y-4">
                <h1 className="text-2xl md:text-3xl font-bold leading-tight">
                  <span className="text-green-700">
                    Eco Bắc Giang
                  </span>
                  <br />
                  <span className="text-gray-800">
                    Tương Lai Của Nông Nghiệp Bền Vững
                  </span>
                </h1>
              </div>

              {/* Description */}
              <div className="space-y-6 text-lg text-gray-700 leading-relaxed">
                <p className="border-l-4 border-green-600 pl-6 bg-white/50 backdrop-blur-base rounded-r-lg py-4">
                  <strong className="text-green-700 font-semibold">Khởi Nguồn Từ Một Tầm Nhìn: </strong>
                  Giữa vùng đất trù phú của Bắc Giang, Eco Bắc Giang không chỉ đơn thuần là một công ty nông nghiệp, mà còn là biểu tượng của sự đổi mới trong ngành nông nghiệp Việt Nam.
                </p>
                
                <p className="bg-white/70 backdrop-blur-base rounded-lg p-6 shadow-lg">
                  Với tầm nhìn rõ ràng và đầy tham vọng, <strong className="text-green-700 font-semibold">Eco Bắc Giang</strong> hướng tới trở thành người tiên phong trong lĩnh vực nông nghiệp thông minh và sản xuất hữu cơ bền vững. Được thành lập dựa trên nền tảng của tri thức hiện đại và tình yêu thiên nhiên, Eco Bắc Giang cam kết xây dựng một hệ sinh thái nông nghiệp hài hòa giữa con người và môi trường, đồng thời góp phần vào mục tiêu <strong className="text-green-700 font-semibold">Net Zero 2050</strong>.
                </p>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-6 pt-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600">100%</div>
                  <div className="text-base text-gray-600">Hữu Cơ</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600">2050</div>
                  <div className="text-base text-gray-600">Net Zero</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600">24/7</div>
                  <div className="text-base text-gray-600">Giám Sát</div>
                </div>
              </div>
            </div>

            {/* Video Section */}
            <div className="relative">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl transform hover:scale-105 transition-transform duration-500">
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent z-10"></div>
                
                {videoError ? (
                  <div className="relative w-full h-96 rounded-2xl overflow-hidden">
                    <Image
                      src={fallbackImage}
                      alt="Cảnh trang trại hữu cơ Eco Bắc Giang"
                      fill
                      style={{ objectFit: "cover" }}
                      quality={90}
                      loading="lazy"
                      className="rounded-2xl"
                    />
                  </div>
                ) : (
                  <div className="relative w-full h-96 rounded-2xl overflow-hidden">
                    <video
                      ref={videoRef}
                      className="w-full h-full object-cover rounded-2xl"
                      src={videoSrc}
                      autoPlay
                      muted={ibaseuted}
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
                    
                    {/* Enhanced Controls Overlay */}
                    <div className="absolute bottom-6 right-6 flex space-x-3">
                      <button
                        onClick={togglePlay}
                        className="bg-black/60 hover:bg-black/80 text-white p-3 rounded-full backdrop-blur-base transition-all duration-300 hover:scale-110 shadow-lg"
                        aria-label={isPlaying ? "Tạm dừng video" : "Phát video"}
                      >
                        {isPlaying ? (
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                          </svg>
                        ) : (
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                          </svg>
                        )}
                      </button>
                      <button
                        onClick={toggleMute}
                        className="bg-black/60 hover:bg-black/80 text-white p-3 rounded-full backdrop-blur-base transition-all duration-300 hover:scale-110 shadow-lg"
                        aria-label={ibaseuted ? "Bật âm thanh" : "Tắt âm thanh"}
                      >
                        {ibaseuted ? (
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM12.293 7.293a1 1 0 011.414 0L15 8.586l1.293-1.293a1 1 0 111.414 1.414L16.414 10l1.293 1.293a1 1 0 01-1.414 1.414L15 11.414l-1.293 1.293a1 1 0 01-1.414-1.414L13.586 10l-1.293-1.293a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                        ) : (
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM12.293 7.293a1 1 0 011.414 0L15 8.586l1.293-1.293a1 1 0 111.414 1.414L16.414 10l1.293 1.293a1 1 0 01-1.414 1.414L15 11.414l-1.293 1.293a1 1 0 01-1.414-1.414L13.586 10l-1.293-1.293a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                        )}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Sections */}
      <div className="bg-white">
        <BusinessPhilosophy />
        <Intro />
        <QualityPolicy />
      </div>
    </DefaultLayout>
  );
}