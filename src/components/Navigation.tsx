"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { Home, Search, MessageCircle, Users, UserPlus, User, LogOut, PlusSquare } from "lucide-react";
import AddPostModal from "./AddPostModal";


const navItems = [
	{ label: "Main", icon: Home },
	{ label: "Search", icon: Search },
	{ label: "Add Post", icon: PlusSquare },
	{ label: "Messages", icon: MessageCircle },
	{ label: "Followers", icon: Users },
	{ label: "Following", icon: UserPlus },
	{ label: "Profile", icon: User },
	{ label: "Logout", icon: LogOut },
];

export default function Navigation() {
	const router = useRouter();
	const [showAddPost, setShowAddPost] = React.useState(false);
	const handleNavClick = (label: string) => {
		if (label === "Logout") {
			localStorage.removeItem("token");
			localStorage.removeItem("user");
			router.replace("/auth");
		} else if (label === "Add Post") {
			setShowAddPost(true);
		} else if (label === "Main") {
			router.push('/');
		} else if (label === "Profile") {
			// navigate to current user's profile
			const uStr = localStorage.getItem('user');
			if (uStr) {
				try {
					const u = JSON.parse(uStr);
					if (u?.username) router.push(`/${u.username}`);
				} catch {}
			}
		}
		// Add navigation logic for other items if needed
	};
	return (
		<>
			<nav className="flex flex-col gap-4 w-full">
				{navItems.map(({ label, icon: Icon }) => (
					<button
						key={label}
						className="flex items-center gap-3 px-4 py-2 rounded-lg transition-all backdrop-blur-md bg-card/60 hover:bg-card/80 hover:shadow-lg hover:ring-2 hover:ring-primary/30 font-semibold"
						onClick={() => handleNavClick(label)}
					>
						<Icon className="w-5 h-5" />
						<span>{label}</span>
					</button>
				))}
			</nav>
			<AddPostModal open={showAddPost} onClose={() => setShowAddPost(false)} />
		</>
	);
}
