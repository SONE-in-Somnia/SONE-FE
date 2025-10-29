import React from 'react';
import { AppFooterNavigation } from "@/components/app-footer-navigation";

interface FooterProps {
  className?: string;
}

const Footer: React.FC<FooterProps> = ({ className }) => {
  return (
    <div className={`w-full bg-retro-gray border-2 border-r-black border-b-black border-l-white border-t-white  p-4 flex justify-between items-center text-white text-sm ${className}`}>
      <AppFooterNavigation />
    </div>
  );
};

export default Footer;
