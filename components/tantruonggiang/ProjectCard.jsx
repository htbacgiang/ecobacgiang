// components/tantruonggiang/ProjectCard.js
import Image from "next/image";
import Link from "next/link";
import { FaArrowRight } from "react-icons/fa"; // Import for button icon

const ProjectCard = ({ project, onQuoteClick }) => {
  return (
    <div className="bg-gray-900 rounded-lg overflow-hidden relative group">
      <div className="relative">
        <Image
          src={project.image}
          alt={`Hình ảnh chính của ${project.title}`}
          width={400}
          height={300}
          className="w-full h-64 object-cover transition-opacity duration-300 group-hover:opacity-50"
        />
        <div className="absolute inset-0 flex items-center justify-center space-x-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button
            className="flex items-center bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors focus:outline-none focus:ring-2 focus:ring-orange-400"
            onClick={onQuoteClick}
            aria-label={`Yêu cầu báo giá cho ${project.title}`}
          >
            Báo giá
          </button>
          <Link href={`/du-an/${project.slug}`}>
            <button className="bg-white text-black px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-white">
              Xem chi tiết
            </button>
          </Link>
        </div>
      </div>

      <div className="p-4">
        <h3 className="text-lg font-bold text-white">{project.title}</h3>
        <div className="mt-4 pt-4 border-t border-gray-700 flex justify-between text-gray-400">
          <div>
            <p>Khách hàng: {project.customer}</p>
            <p>Phong cách: {project.style}</p>
          </div>
          <div>
            <p>Diện tích: {project.area}</p>
            <p>Loại hình: {project.location}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;