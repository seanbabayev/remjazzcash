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
        <button className="w-[40px] h-[40px] bg-[#322D3C] rounded-full flex justify-center items-center">
          <Image
            src="/img/menu-icon.svg"
            alt="Menu"
            width={16}
            height={16}
            className="brightness-0 invert"
          />
        </button>
      )}

      <Link href="/">
        <Image
          src="/img/easypaisa.svg"
          alt="Easypaisa"
          width={125}
          height={30}
          className="cursor-pointer"
        />
      </Link>

      {showNotifications && (
        <button className="w-[40px] h-[40px] bg-[#322D3C] rounded-full flex justify-center items-center relative">
          <Image
            src="/img/bell-icon.svg"
            alt="Notifications"
            width={18}
            height={18}
            className="brightness-0 invert"
          />
          <span className="absolute top-0 right-0 w-[10px] h-[10px] bg-[#00BD5F] rounded-full border-2 border-[#FCF7F1]" />
        </button>
      )}
    </header>
  );
};
