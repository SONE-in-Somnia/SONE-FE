"use client";

import * as React from "react";
import { MoreHorizontal, type LucideIcon } from "lucide-react";
import * as LucideIcons from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuBadge,
  useSidebar,
} from "@/components/ui/sidebar";
import Link from "next/link";
import { cn } from "@/lib/utils";

// Tách CSS tùy chỉnh cho các trạng thái khác nhau
const menuItemStyles = {
  // Style cho trạng thái hover
  hover: "hover:bg-[#190B4D] hover:text-white",
  // Style cho trạng thái disabled
  disabled: "opacity-50 cursor-not-allowed",
  // Style cho trạng thái coming soon
  comingSoon: "opacity-80",
  // Style cho badge
  badge: {
    new: "bg-green-500 text-white",
    soon: "bg-blue-500 text-white",
  },
  // Style cơ bản
  base: "flex justify-between items-center text-text/50",
};

export function NavMain({
  items,
  variant = "default",
}: {
  items: {
    title: string;
    url: string;
    iconName?: string;
    isActive?: boolean;
    disabled?: boolean;
    isNew?: boolean;
    comingSoon?: boolean;
    group?: string;
    items?: {
      title: string;
      url: string;
    }[];
  }[];
  variant?: "default" | "retro";
}) {
  const { isMobile, setOpenMobile } = useSidebar();

  // Hàm để lấy icon component từ tên icon
  const getIconByName = (iconName: string) => {
    // Chuyển đổi tên icon từ kebab-case sang PascalCase
    const pascalCaseName = iconName
      .split("-")
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join("");

    // Lấy icon component từ thư viện Lucide
    return (LucideIcons as any)[pascalCaseName];
  };

  const renderMenuItem = (item: any) => {
    const IconComponent = item.iconName ? getIconByName(item.iconName) : null;

    // Xác định nội dung của badge dựa trên trạng thái
    let badgeContent = null;
    let badgeClass = "";

    if (item.isNew) {
      badgeContent = "New";
      badgeClass = menuItemStyles.badge.new;
    } else if (item.comingSoon) {
      badgeContent = "Soon";
      badgeClass = menuItemStyles.badge.soon;
    }

    // Tạo các lớp CSS tùy chỉnh cho menu item
    const menuButtonClasses =
      variant === "retro"
        ? "bg-retro-gray border-2 border-r-black border-b-black border-l-white border-t-white p-2 text-left flex items-center space-x-4 hover:bg-gray-400 active:border-l-black active:border-t-black active:border-r-white active:border-b-white"
        : cn(
            menuItemStyles.base,
            menuItemStyles.hover,
            item.disabled ? menuItemStyles.disabled : "",
            item.comingSoon ? menuItemStyles.comingSoon : ""
          );

    const menuButton = (
      <SidebarMenuButton
        onClick={() => setOpenMobile(false)}
        isActive={item.isActive}
        className={menuButtonClasses}
        style={item.isActive ? { background: "transparent" } : undefined}
        disabled={item.disabled || item.comingSoon}
      >
        <div className="flex items-center gap-2">
          {IconComponent && (
            <div
              className={`grid aspect-square h-8 w-8 place-items-center rounded ${item.isActive ? "bg-gradient-to-br from-[#E83C61] to-[#9950E9]" : "border"}`}
            >
              <IconComponent
                className={`h-5 w-5 group-hover:text-white group-hover:opacity-100 ${item.isActive ? "text-white" : "text-text opacity-50"}`}
              />
            </div>
          )}
          <span>{item.title}</span>
        </div>
        {badgeContent && (
          <div className={`rounded-md px-2 py-0.5 text-xs ${badgeClass}`}>
            {badgeContent}
          </div>
        )}
      </SidebarMenuButton>
    );

    // Hiển thị bình thường
    return item.disabled || item.comingSoon ? (
      menuButton
    ) : (
      <Link href={item.url} passHref>
        <DropdownMenuTrigger asChild>{menuButton}</DropdownMenuTrigger>
      </Link>
    );
  };

  // Nhóm các mục menu theo thuộc tính group
  const groupedItems = items.reduce(
    (groups: Record<string, typeof items>, item) => {
      const group = item.group || "default";
      if (!groups[group]) {
        groups[group] = [];
      }
      groups[group].push(item);
      return groups;
    },
    {},
  );

  // Sắp xếp các nhóm theo thứ tự: main, games, social, default
  const groupOrder = ["main", "games", "social", "default"];
  const sortedGroups = Object.keys(groupedItems).sort(
    (a, b) => groupOrder.indexOf(a) - groupOrder.indexOf(b),
  );

  return (
    <SidebarGroup>
      {sortedGroups.map((groupName, groupIndex) => (
        <React.Fragment key={groupName}>
          <SidebarMenu className={cn("gap-2", groupIndex > 0 ? "" : "")}>
            {groupedItems[groupName].map((item) => (
              <DropdownMenu key={item.title}>
                <SidebarMenuItem>{renderMenuItem(item)}</SidebarMenuItem>
              </DropdownMenu>
            ))}
          </SidebarMenu>
        </React.Fragment>
      ))}
    </SidebarGroup>
  );
}
