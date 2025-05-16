import Image from "next/image"
import Link from "next/link"
import logoImg from "../../public/logo1.png"

const Logo = () => {
  return (
    <Link href="/" className="flex items-start text-dark">
        <div 
        className="logo rounded-full overflow-hiden" 
        >
            <Image src={logoImg}  alt="Logo Eco Bắc Giang" className="rounded-full "/>
        </div>
    </Link>
  )
}

export default Logo