import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { HeaderProps } from '../types/core-types';

export const Header: React.FC<HeaderProps> = ({ 
  showMenu = true, 
  showNotifications = true,
  className,
  ...props 
}) => {
  const router = useRouter();
  return (
    <header className={`flex justify-between items-center h-[72px] ${className || ''}`} {...props}>
      {showMenu && (
        <button className="w-[40px] h-[40px] bg-[#FCFDFD] rounded-full flex justify-center items-center">
          <Image
            src="/img/menu-icon.svg"
            alt="Menu"
            width={16}
            height={16}
            className="brightness-100 invert-0"
            style={{ filter: 'invert(0)', opacity: 1 }}
          />
        </button>
      )}
      {/* Back button to the left of the logo - styled as on Transfer page */}
      <button
        onClick={() => router.back()}
        className="w-10 h-10 flex items-center justify-center bg-[#FEFEFE] rounded-[4px] border border-[#D9D9D9] mr-2"
        aria-label="Back"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M8 6L3 12L8 18" stroke="#A8A8A8" strokeWidth="2" strokeLinecap="round" />
          <path d="M21 12H4" stroke="#A8A8A8" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </button>
      <Link href="/">
        <Image
          src="/img/zindigi.png"
          alt="Zindigi"
          width={125}
          height={30}
          priority
          quality={100}
          sizes="(max-width: 768px) 125px, 125px"
          className="cursor-pointer"
        />
      </Link>
      {showNotifications && (
        <button className="w-10 h-10 flex items-center justify-center bg-[#FEFEFE] rounded-[4px] border border-[#D9D9D9] relative">
          <span className="relative inline-block w-4 h-4">
            <Image
              src="/img/bell-icon.svg"
              alt="Notifications"
              width={16}
              height={16}
              className="brightness-0 invert-[60%] sepia-[0%] saturate-0 hue-rotate-0 opacity-100"
            />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-[#00BD5F] rounded-full border-2 border-white" />
          </span>
        </button>
      )}
    </header>
  );
};
