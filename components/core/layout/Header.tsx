import Image from 'next/image';
import Link from 'next/link';
import { HeaderProps } from '../types/core-types';

export const Header: React.FC<HeaderProps> = ({ 
  showMenu = true, 
  showNotifications = true,
  className,
  ...props 
}) => {
  return (
    <header className={`flex justify-between items-center h-[72px] -mt-[10px] ${className || ''}`} {...props}>
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

      <Link href="/">
        <Image
          src="/img/jazzcash.png"
          alt="JazzCash"
          width={125}
          height={30}
          priority
          quality={100}
          sizes="(max-width: 768px) 125px, 125px"
          className="cursor-pointer"
        />
      </Link>

      {showNotifications && (
        <button className="w-[40px] h-[40px] bg-[#FCFDFD] rounded-full flex justify-center items-center relative">
          <Image
            src="/img/bell-icon.svg"
            alt="Notifications"
            width={18}
            height={18}
            className="brightness-100 invert-0"
            style={{ filter: 'invert(0)', opacity: 1 }}
          />
          <span className="absolute top-[-2px] right-[-2px] w-[12px] h-[12px] bg-[#81201F] rounded-full border-[2.5px] border-[#FCFDFD]" />
        </button>
      )}
    </header>
  );
};
