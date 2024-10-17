import Link from "next/link";
import {
  FaYoutube,
  FaGithub,
  FaInstagram,
  FaLinkedin,
  FaHouseUser,
} from "react-icons/fa";

export default function Navbar() {
  return (
    <nav className="!bg-pink-500 p-4 sticky top-0 drop-shadow-xl z-10">
      <div className="md:px-6 prose prose-xl mx-auto flex justify-between flex-col sm:flex-row">
        <h1 className="text-3xl font-bold text-white grid place-content-center mb-2 md:mb-0">
          <Link
            href="/"
            className="text-white/90 no-underline hover:text-white"
          >
            Mike Kudrik
          </Link>
        </h1>
        <div className="flex flex-row justify-center sm:justify-evenly align-middle gap-4 text-white text-4xl lg:text-5xl">
          <Link
            className="text-white/90 hover:text-white"
            href="https://www.linkedin.com/in/michael-kudrik"
            target={"_blank"}
          >
            <FaLinkedin />
          </Link>
          <Link
            className="text-white/90 hover:text-white"
            href="https://www.instagram.com/michael_kudrik/"
            target={"_blank"}
          >
            <FaInstagram />
          </Link>
          <Link
            className="text-white/90 hover:text-white"
            href="https://github.com/michael-kudrik"
            target={"_blank"}
          >
            <FaGithub />
          </Link>
          <Link
            className="text-white/90 hover:text-white"
            href="https://www.youtube.com/channel/UC5lVFEiOFT6QR9sJWy5Cmkg"
            target={"_blank"}
          >
            <FaYoutube />
          </Link>
          <Link
            className="text-white/90 hover:text-white"
            href="https://mikekudrik.boats/"
          >
            <FaHouseUser />
          </Link>
        </div>
      </div>
    </nav>
  );
}
