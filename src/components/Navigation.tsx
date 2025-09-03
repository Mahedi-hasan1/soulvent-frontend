"use client";
import React from "react";
import { Search, MessageCircle, Users, UserPlus, User, LogOut } from "lucide-react";

const navItems = [
	{ label: "Search", icon: Search },
	{ label: "Messages", icon: MessageCircle },
	{ label: "Followers", icon: Users },
	{ label: "Following", icon: UserPlus },
	{ label: "Profile", icon: User },
	{ label: "Logout", icon: LogOut },
];

export default function Navigation() {
	return (
		<nav className="flex flex-col gap-4 w-full">
			{navItems.map(({ label, icon: Icon }) => (
				<button
					key={label}
					className="flex items-center gap-3 px-4 py-2 rounded-lg transition-all backdrop-blur-md bg-card/60 hover:bg-card/80 hover:shadow-lg hover:ring-2 hover:ring-primary/30 font-semibold"
				>
					<Icon className="w-5 h-5" />
					<span>{label}</span>
				</button>
			))}
		</nav>
	);
}
