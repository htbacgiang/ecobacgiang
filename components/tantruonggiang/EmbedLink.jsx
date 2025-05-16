// components/EmbedLink.js
export default function EmbedLink() {
    return (
      <div className="w-ful flex justify-center items-center">
        <div className="w-full bg-white shadow-lg rounded-lg p-6 flex flex-col justify-between">
          <iframe
            src="https://www.jegaai.com/720/S5DDIGDJCI"
            className="w-full h-96 rounded-lg border-2 border-gray-300"
            title="Embedded Content"
            frameBorder="0"
            allowFullScreen
          ></iframe>
          {/* Deco 3D */}
          <div className="mt-6 relative text-center">
            <div className="absolute inset-0 flex items-center justify-center transform rotate-3d z-10">
            </div>
            <p className="text-xl font-bold text-gray-700 z-20 uppercase ">Công nghệ 3D hiện đại</p>
          </div>
        </div>
      </div>
    );
  }
  