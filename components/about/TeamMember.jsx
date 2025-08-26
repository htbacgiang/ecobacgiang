import React from "react";
import { FaLinkedin, FaTwitter, FaFacebook } from "react-icons/fa";

const TeamMember = () => {
  const teamMembers = [
    {
      name: "Ngô Quang Trường",
      role: "CEO & Founder ",
      imageUrl: "/images/truong.jpg",
      linkedin: "#",
      twitter: "#",
      facebook: "https://www.facebook.com/www.truongnq.vn",
    },
    {
      name: "Đôn Nguyễn",
      role: "Co-Founder",
      imageUrl: "https://via.placeholder.com/300x300",
      linkedin: "#",
      twitter: "#",
      facebook: "#",
    },
    {
      name: "Ngô Công Hà",
      role: "Co-Founder",
      imageUrl: "https://via.placeholder.com/300x300",
      linkedin: "#",
      twitter: "#",
      facebook: "#",
    },

  ];

  return (
    <div className="max-w-screen-xl mx-auto px-5 py-10">
      <h2 className="text-4xl font-bold text-center mb-10 uppercase">Thành viên</h2>
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {teamMembers.map((member, index) => (
          <div
            key={index}
            className="bg-white rounded-lg shadow-md overflow-hidden text-center p-5 hidden-scrollbar select-none"
          >
            <img
              src={member.imageUrl || "/images/default-avatar.jpg"}
              alt={member.name}
              className="w-full h-48 object-cover rounded-lg"
            />
            <h3 className="text-xl font-semibold mt-4">{member.name}</h3>
            <p className="text-green-600 font-medium mt-2">{member.role} </p>
            <div className="flex justify-center space-x-4 mt-4">
              {member.linkedin && (
                <a
                  href={member.linkedin}
                  className="text-blue-700 hover:text-blue-900 transition"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FaLinkedin size={24} />
                </a>
              )}
              {member.twitter && (
                <a
                  href={member.twitter}
                  className="text-blue-400 hover:text-blue-600 transition"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FaTwitter size={24} />
                </a>
              )}
              {member.facebook && (
                <a
                  href={member.facebook}
                  className="text-blue-500 hover:text-blue-700 transition"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FaFacebook size={24} />
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TeamMember;
