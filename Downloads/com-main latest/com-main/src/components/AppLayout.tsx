import React, { useState, useEffect } from "react";
import { useAppContext } from "@/contexts/AppContext";
import { useIsMobile } from "@/hooks/use-mobile";
import { supabase } from "@/lib/supabase";
import emailjs from "@emailjs/browser";
import {
	Menu,
	X,
	Phone,
	MessageCircle,
	Mail,
	MapPin,
	Clock,
	Send,
	CheckCircle,
	Droplets,
	Sprout,
	Home,
	Leaf,
	Heart,
	ArrowRight,
	Users,
	Target,
	Eye,
	Shield,
	Award,
	Wrench,
	Sun,
	Building2,
	TestTube,
	Settings,
	Map,
	Building,
	Zap,
	Warehouse,
	BookOpen,
	Utensils,
	Handshake,
	Briefcase,
	ChevronDown,
	ChevronUp,
	GraduationCap,
	Filter,
	Calendar,
	ChevronLeft,
	ChevronRight,
	Image as ImageIcon,
} from "lucide-react";

// Image URLs
const IMAGES = {
	logo: "https://d64gsuwffb70l.cloudfront.net/6891fba9e84754e0b0fc9f86_1768205885796_f2d4cfcb.jpg",
	home: `${import.meta.env.BASE_URL}images/home.jpeg`,
	waterHompage1: "/images/waterHompage1.jpeg",
	borehole1: "https://ousrwhwfrwlrnheoavzk.supabase.co/storage/v1/object/public/blog-images/1769749774422-WhatsApp_Image_2026-01-24_at_1.37.05_PM.jpeg",
	borehole2:
		"https://ousrwhwfrwlrnheoavzk.supabase.co/storage/v1/object/public/blog-images/1769749773474-WhatsApp_Image_2026-01-24_at_1.37.05_PM__3_.jpeg",
	waterworks3:
		"https://ousrwhwfrwlrnheoavzk.supabase.co/storage/v1/object/public/blog-images/1770540396401-borehole_drilling_2.jpeg",
	waterworks4:
		"https://ousrwhwfrwlrnheoavzk.supabase.co/storage/v1/object/public/blog-images/1770540401643-borehole_drilling1.jpeg",
	waterworks5:
		"https://ousrwhwfrwlrnheoavzk.supabase.co/storage/v1/object/public/blog-images/1776666526272-Wassadu_whatsOnGambia_project_2.jpeg",
	ecovillage1:
		"https://ousrwhwfrwlrnheoavzk.supabase.co/storage/v1/object/public/blog-images/1769749187043-WhatsApp_Image_2026-01-24_at_1.37.33_PM__2_.jpeg",
	ecovillage2:
		"https://ousrwhwfrwlrnheoavzk.supabase.co/storage/v1/object/public/blog-images/1769749190014-WhatsApp_Image_2026-01-24_at_1.37.35_PM.jpeg",
	ecovillage3:
		"https://ousrwhwfrwlrnheoavzk.supabase.co/storage/v1/object/public/blog-images/1769749188424-WhatsApp_Image_2026-01-24_at_1.37.33_PM.jpeg",
	agricHompage1: "/images/agricHompage1.jpg",
	irrigation1: "https://ousrwhwfrwlrnheoavzk.supabase.co/storage/v1/object/public/blog-images/1770537226868-seedlings1.jpeg",
	irrigation2:
		"https://ousrwhwfrwlrnheoavzk.supabase.co/storage/v1/object/public/blog-images/1769991445202-irrigation_house.jpeg",
	irrigation3:
		"https://ousrwhwfrwlrnheoavzk.supabase.co/storage/v1/object/public/blog-images/1770537883260-transporting_oranges.jpeg",
	agriculture4:
		"https://ousrwhwfrwlrnheoavzk.supabase.co/storage/v1/object/public/blog-images/1770532379503-seedlings2.jpeg",
	about1: "/images/about1.jpg",
	community1:
		"https://ousrwhwfrwlrnheoavzk.supabase.co/storage/v1/object/public/blog-images/1769750135779-WhatsApp_Image_2026-01-24_at_1.39.45_PM.jpeg",
	community2:
		"https://ousrwhwfrwlrnheoavzk.supabase.co/storage/v1/object/public/blog-images/1769750136794-WhatsApp_Image_2026-01-24_at_1.39.47_PM__1_.jpeg",
	community3:
		"https://d64gsuwffb70l.cloudfront.net/6964af716e2480dea2a3526a_1768206436881_c4b173ae.png",
	team: "https://ousrwhwfrwlrnheoavzk.supabase.co/storage/v1/object/public/blog-images/1769991550873-team.jpeg",
};

// ─── usePageSettings — loads page hero content from Supabase ────────
function usePageSettings() {
	const [settings, setSettings] = React.useState<Record<string, any>>({});
	React.useEffect(() => {
		supabase
			.from("page_settings")
			.select("*")
			.then(({ data }) => {
				if (data) {
					const map: Record<string, any> = {};
					data.forEach((row: any) => {
						map[row.page] = row;
					});
					setSettings(map);
				}
			});
	}, []);
	// Returns saved value or fallback
	const get = (page: string, field: string, fallback: string): string => {
		const val = settings[page]?.[field];
		return val && val.trim() !== "" ? val : fallback;
	};
	return { get };
}

// Navigation items
const NAV_ITEMS = [
	{ id: "home", name: "Home" },
	{ id: "about", name: "About" },
	{ id: "waterworks", name: "Waterworks" },
	{ id: "realestate", name: "Real Estate" },
	{ id: "agriculture", name: "Agriculture" },
	{ id: "foundation", name: "Foundation" },
	{ id: "projects", name: "Projects" },
	{ id: "careers", name: "Careers" },
	{ id: "contact", name: "Contact" },
];

// Header Component
const Header: React.FC<{
	currentPage: string;
	setCurrentPage: (page: string) => void;
}> = ({ currentPage, setCurrentPage }) => {
	const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

	return (
		<header className="bg-white shadow-md sticky top-0 z-50">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="flex justify-between items-center py-3">
					<button
						onClick={() => setCurrentPage("home")}
						className="flex items-center space-x-3"
					>
						<img src={IMAGES.logo} alt="Bati-Ngalun" className="h-14 w-auto" />
						<div className="hidden sm:block">
							<h1 className="text-lg font-bold text-[#1a5f2a]">BATI-NGALUN</h1>
							<p className="text-xs text-gray-600">Company Limited</p>
						</div>
					</button>

					<nav className="hidden lg:flex items-center space-x-1">
						{NAV_ITEMS.map((item) => (
							<button
								key={item.id}
								onClick={() => setCurrentPage(item.id)}
								className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
									currentPage === item.id
										? "text-[#0077BE] bg-blue-50"
										: "text-gray-700 hover:text-[#0077BE] hover:bg-gray-50"
								}`}
							>
								{item.name}
							</button>
						))}
					</nav>

					<div className="hidden md:flex items-center space-x-3">
						<a
							href="tel:+2207311727"
							className="p-2 bg-[#0077BE] text-white rounded-full hover:bg-[#005a8f] transition-colors"
							title="Call Us"
						>
							<Phone className="h-5 w-5" />
						</a>
						<a
							href="https://wa.me/2207311727"
							target="_blank"
							rel="noopener noreferrer"
							className="p-2 bg-[#25D366] text-white rounded-full hover:bg-[#1da851] transition-colors"
							title="WhatsApp"
						>
							<MessageCircle className="h-5 w-5" />
						</a>
						<a
							href="https://www.facebook.com/profile.php?id=61573851003982"
							target="_blank"
							rel="noopener noreferrer"
							className="p-2 bg-[#1877F2] text-white rounded-full hover:bg-[#0d65d9] transition-colors"
							title="Facebook"
						>
							<svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
								<path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
							</svg>
						</a>
					</div>

					<button
						onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
						className="lg:hidden p-2 rounded-md text-gray-700 hover:bg-gray-100"
					>
						{mobileMenuOpen ? (
							<X className="h-6 w-6" />
						) : (
							<Menu className="h-6 w-6" />
						)}
					</button>
				</div>

				{mobileMenuOpen && (
					<div className="lg:hidden py-4 border-t">
						<nav className="flex flex-col space-y-1">
							{NAV_ITEMS.map((item) => (
								<button
									key={item.id}
									onClick={() => {
										setCurrentPage(item.id);
										setMobileMenuOpen(false);
									}}
									className={`px-4 py-3 text-sm font-medium rounded-md text-left ${
										currentPage === item.id
											? "text-[#0077BE] bg-blue-50"
											: "text-gray-700 hover:text-[#0077BE] hover:bg-gray-50"
									}`}
								>
									{item.name}
								</button>
							))}
						</nav>
						<div className="flex items-center space-x-3 mt-4 px-4">
							<a
								href="tel:+2207311727"
								className="flex-1 flex items-center justify-center space-x-2 py-2 bg-[#0077BE] text-white rounded-md"
							>
								<Phone className="h-4 w-4" />
								<span>Call</span>
							</a>
							<a
								href="https://wa.me/2207311727"
								target="_blank"
								rel="noopener noreferrer"
								className="flex-1 flex items-center justify-center space-x-2 py-2 bg-[#25D366] text-white rounded-md"
							>
								<MessageCircle className="h-4 w-4" />
								<span>WhatsApp</span>
							</a>
						</div>
					</div>
				)}
			</div>
		</header>
	);
};

// Footer Component
const Footer: React.FC<{ setCurrentPage: (page: string) => void }> = ({
	setCurrentPage,
}) => {
	const currentYear = new Date().getFullYear();

	return (
		<footer className="bg-gradient-to-b from-[#1a3a2a] to-[#0d1f16] text-white">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
					<div>
						<div className="flex items-center space-x-3 mb-4">
							<img
								src={IMAGES.logo}
								alt="Bati-Ngalun"
								className="h-12 w-auto bg-white rounded-lg p-1"
							/>
							<div>
								<h3 className="font-bold text-lg">BATI-NGALUN</h3>
								<p className="text-xs text-gray-300">Company Limited</p>
							</div>
						</div>
						<p className="text-gray-300 text-sm mb-4">
							A legally registered social enterprise in The Gambia, providing
							sustainable water, real estate, and agricultural solutions for
							Africa.
						</p>
						<div className="flex space-x-3">
							<a
								href="https://www.facebook.com/profile.php?id=61573851003982"
								target="_blank"
								rel="noopener noreferrer"
								className="p-2 bg-[#1877F2] rounded-full hover:bg-[#0d65d9] transition-colors"
							>
								<svg
									className="h-5 w-5"
									fill="currentColor"
									viewBox="0 0 24 24"
								>
									<path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
								</svg>
							</a>
							<a
								href="https://wa.me/2207311727"
								target="_blank"
								rel="noopener noreferrer"
								className="p-2 bg-[#25D366] rounded-full hover:bg-[#1da851] transition-colors"
							>
								<MessageCircle className="h-5 w-5" />
							</a>
						</div>
					</div>

					<div>
						<h4 className="font-semibold text-lg mb-4 text-[#7CB342]">
							Quick Links
						</h4>
						<ul className="space-y-2">
							{[
								{ name: "Home", id: "home" },
								{ name: "About Us", id: "about" },
								{ name: "Our Projects", id: "projects" },
								{ name: "Careers", id: "careers" },
								{ name: "Contact Us", id: "contact" },
							].map((link) => (
								<li key={link.id}>
									<button
										onClick={() => setCurrentPage(link.id)}
										className="text-gray-300 hover:text-[#7CB342] transition-colors text-sm text-left"
									>
										{link.name}
									</button>
								</li>
							))}
						</ul>
					</div>

					<div>
						<h4 className="font-semibold text-lg mb-4 text-[#4A90E2]">
							Our Services
						</h4>
						<ul className="space-y-2">
							{[
								{ name: "Waterworks", id: "waterworks" },
								{ name: "Real Estate", id: "realestate" },
								{ name: "Agriculture", id: "agriculture" },
								{ name: "Foundation", id: "foundation" },
							].map((link) => (
								<li key={link.id}>
									<button
										onClick={() => setCurrentPage(link.id)}
										className="text-gray-300 hover:text-[#4A90E2] transition-colors text-sm text-left"
									>
										{link.name}
									</button>
								</li>
							))}
						</ul>
					</div>

					<div>
						<h4 className="font-semibold text-lg mb-4 text-[#7CB342]">
							Contact Us
						</h4>
						<ul className="space-y-3">
							<li className="flex items-start space-x-3">
								<Phone className="h-5 w-5 text-[#4A90E2] flex-shrink-0 mt-0.5" />
								<div className="text-sm">
									<a
										href="tel:+2207311727"
										className="text-gray-300 hover:text-white block"
									>
										+220 731 1727
									</a>
									<a
										href="tel:+2202167819"
										className="text-gray-300 hover:text-white block"
									>
										+220 216 7819
									</a>
									<a
										href="tel:+2206822093"
										className="text-gray-300 hover:text-white block"
									>
										+220 682 2093
									</a>
								</div>
							</li>
							<li className="flex items-center space-x-3">
								<Mail className="h-5 w-5 text-[#4A90E2] flex-shrink-0" />
								<a
									href="mailto:batingalunadmin@gmail.com"
									className="text-gray-300 hover:text-white text-sm"
								>
									batingalunadmin@gmail.com
								</a>
							</li>
							<li className="flex items-start space-x-3">
								<MapPin className="h-5 w-5 text-[#4A90E2] flex-shrink-0 mt-0.5" />
								<span className="text-gray-300 text-sm">
									Brikama Nyambai, The Gambia
									<br />
									West Africa
								</span>
							</li>
						</ul>
						<a
							href="https://wa.me/2207311727"
							target="_blank"
							rel="noopener noreferrer"
							className="inline-flex items-center space-x-2 mt-4 px-4 py-2 bg-[#25D366] text-white rounded-lg hover:bg-[#1da851] transition-colors"
						>
							<MessageCircle className="h-5 w-5" />
							<span>WhatsApp Chat</span>
						</a>
					</div>
				</div>
			</div>

			<div className="border-t border-gray-700">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
					<div className="flex flex-col md:flex-row justify-between items-center space-y-2 md:space-y-0">
						<p className="text-gray-400 text-sm">
							© {currentYear} Bati-Ngalun Company Limited. All rights reserved.
						</p>
						<div className="flex space-x-4 text-sm">
							<span className="text-gray-400">Privacy Policy</span>
							<span className="text-gray-400">Terms of Service</span>
						</div>
					</div>
				</div>
			</div>
		</footer>
	);
};

// WhatsApp Button
const WhatsAppButton: React.FC = () => (
	<a
		href="https://wa.me/2207311727?text=Hello%20Bati-Ngalun,%20I%20would%20like%20to%20inquire%20about%20your%20services."
		target="_blank"
		rel="noopener noreferrer"
		className="fixed bottom-6 right-6 z-50 flex items-center space-x-2 bg-[#25D366] text-white px-4 py-3 rounded-full shadow-lg hover:bg-[#1da851] transition-all hover:scale-105"
	>
		<MessageCircle className="h-6 w-6" />
		<span className="hidden sm:inline font-medium">Chat with us</span>
	</a>
);

// CountUp Component
const CountUp: React.FC<{ end: number; suffix: string }> = ({
	end,
	suffix,
}) => {
	const [count, setCount] = useState(0);
	useEffect(() => {
		const duration = 2000;
		const steps = 50;
		const increment = end / steps;
		let current = 0;
		const timer = setInterval(() => {
			current += increment;
			if (current >= end) {
				setCount(end);
				clearInterval(timer);
			} else {
				setCount(Math.floor(current));
			}
		}, duration / steps);
		return () => clearInterval(timer);
	}, [end]);
	return (
		<>
			{count.toLocaleString()}
			{suffix}
		</>
	);
};

// ── Dynamic Posts Component ────────────────────────────────────────
interface Post {
	id: string;
	title: string;
	content: string;
	featured_image_url: string;
	status: string;
	created_at: string;
}

const SectionPosts: React.FC<{ section: string; title?: string }> = ({
	section,
	title = "Latest Updates",
}) => {
	const [posts, setPosts] = React.useState<Post[]>([]);
	const [loading, setLoading] = React.useState(true);
	const [expanded, setExpanded] = React.useState<string | null>(null);

	useEffect(() => {
		supabase
			.from("posts")
			.select("*")
			.eq("section", section)
			.eq("status", "published")
			.order("created_at", { ascending: false })
			.then(({ data }) => {
				setPosts((data as Post[]) || []);
				setLoading(false);
			});
	}, [section]);

	if (loading || posts.length === 0) return null;

	return (
		<section className="py-16 bg-white border-t border-gray-100">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="text-center mb-10">
					<h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
						{title}
					</h2>
					<div className="w-16 h-1 bg-gradient-to-r from-[#1a5f2a] to-[#0077BE] rounded-full mx-auto" />
				</div>
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
					{posts.map((post) => (
						<div
							key={post.id}
							className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all border border-gray-100 group flex flex-col"
						>
							{post.featured_image_url ? (
								<div className="relative h-52 overflow-hidden flex-shrink-0">
									<img
										src={post.featured_image_url}
										alt={post.title}
										className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
									/>
								</div>
							) : (
								<div className="h-52 bg-gradient-to-br from-[#1a5f2a]/10 to-[#0077BE]/10 flex items-center justify-center flex-shrink-0">
									<ImageIcon className="h-12 w-12 text-gray-300" />
								</div>
							)}
							<div className="p-5 flex flex-col flex-1">
								<span className="text-xs text-gray-400 mb-2">
									{new Date(post.created_at).toLocaleDateString("en-GB", {
										day: "numeric",
										month: "short",
										year: "numeric",
									})}
								</span>
								<h3 className="text-lg font-bold text-gray-900 mb-2 leading-snug">
									{post.title}
								</h3>
								{post.content && (
									<div className="flex-1">
										<p className="text-gray-600 text-sm leading-relaxed">
											{expanded === post.id
												? post.content
												: post.content.length > 150
													? post.content.substring(0, 150) + "..."
													: post.content}
										</p>
										{post.content.length > 150 && (
											<button
												onClick={() =>
													setExpanded(expanded === post.id ? null : post.id)
												}
												className="text-[#0077BE] text-sm font-medium mt-2 hover:underline inline-flex items-center gap-1"
											>
												{expanded === post.id ? "Read less" : "Read more"}
												<ArrowRight className="h-3 w-3" />
											</button>
										)}
									</div>
								)}
							</div>
						</div>
					))}
				</div>
			</div>
		</section>
	);
};

// Home Page
const HomePage: React.FC<{
	setCurrentPage: (page: string) => void;
	ps: { get: (page: string, field: string, fallback: string) => string };
}> = ({ setCurrentPage, ps }) => {
	const [currentSlide, setCurrentSlide] = useState(0);
	const [impactAnimated, setImpactAnimated] = useState(false);

	const heroSlides = [
		{
			image: IMAGES.home,
			title: "Sustainable Water Solutions",
			subtitle:
				"Providing clean water access to communities across The Gambia and the sub-region",
		},
		{
			image: IMAGES.ecovillage1,
			title: "Eco-Village Development",
			subtitle: "Building sustainable communities for a better future",
		},
		{
			image: IMAGES.agriculture4,
			title: "Agricultural Innovation",
			subtitle: "Empowering farmers with modern irrigation solutions",
		},
		{
			image: IMAGES.community1,
			title: "Bati-ngalun foundation",
			subtitle: "Tree Planting for Climate and Community Development",
		},
	];

	const services = [
		{
			icon: Droplets,
			title: "Waterworks",
			description:
				"Borehole drilling, pump installation, water towers, and maintenance services.",
			link: "waterworks",
			color: "bg-blue-50 border-blue-200",
			iconColor: "text-[#0077BE]",
		},
		{
			icon: Home,
			title: "Real Estate",
			description:
				"Eco-village development, sustainable housing, and land planning.",
			link: "realestate",
			color: "bg-amber-50 border-amber-200",
			iconColor: "text-amber-600",
		},
		{
			icon: Leaf,
			title: "Agriculture",
			description:
				"Irrigation systems, solar pumping, and farmer training programs.",
			link: "agriculture",
			color: "bg-green-50 border-green-200",
			iconColor: "text-[#2D5016]",
		},
		{
			icon: Heart,
			title: "Foundation",
			description:
				"Community water programs, youth training, and social impact initiatives.",
			link: "foundation",
			color: "bg-rose-50 border-rose-200",
			iconColor: "text-rose-600",
		},
	];

	// Featured projects — pulled live from Supabase (featured=true first, then latest published)
	const [featuredProjects, setFeaturedProjects] = React.useState<
		{ image: string; title: string; category: string; description: string }[]
	>([]);
	const [featuredLoaded, setFeaturedLoaded] = React.useState(false);

	React.useEffect(() => {
		supabase
			.from("posts")
			.select("title, excerpt, featured_image_url, category, featured")
			.eq("status", "published")
			.order("featured", { ascending: false })
			.order("created_at", { ascending: false })
			.limit(3)
			.then(({ data }) => {
				const categoryLabels: Record<string, string> = {
					water: "Water Projects",
					realestate: "Real Estate",
					agriculture: "Agriculture",
					social: "Social Impact",
					news: "News",
				};
				setFeaturedProjects(
					(data || []).map((p: any) => ({
						image: p.featured_image_url || "",
						title: p.title,
						category: categoryLabels[p.category] || p.category || "Projects",
						description: p.excerpt || "",
					})),
				);
				setFeaturedLoaded(true);
			});
	}, []);

	const defaultFeaturedProjects = [
		{
			image: IMAGES.ecovillage2,
			title: "Bati-Ngalun Ecovillage",
			category: "Real Estate",
			description:
				"Sustainable community with eco-friendly housing and integrated water systems.",
		},
		{
			image: IMAGES.irrigation2,
			title: "Irrigation House – Gambia",
			category: "Agriculture",
			description: "State-of-the-art irrigation demonstration center.",
		},
		{
			image: IMAGES.borehole1,
			title: "Civil Service Drilling Project 2026",
			category: "Waterworks",
			description: "Large-scale borehole drilling for civil servants.",
		},
	];

	const displayedFeatured =
		featuredLoaded && featuredProjects.length === 0
			? defaultFeaturedProjects
			: featuredProjects;

	const impactStats = [
		{ value: 50, suffix: "+", label: "Communities Served", icon: Users },
		{ value: 500, suffix: "+", label: "Projects Completed", icon: CheckCircle },
		{ value: 10000, suffix: "+", label: "People Impacted", icon: Heart },
		{ value: 200, suffix: "+", label: "Locations", icon: MapPin },
	];

	useEffect(() => {
		const timer = setInterval(
			() => setCurrentSlide((prev) => (prev + 1) % heroSlides.length),
			5000,
		);
		return () => clearInterval(timer);
	}, []);

	useEffect(() => {
		const handleScroll = () => {
			const section = document.getElementById("impact-section");
			if (
				section &&
				section.getBoundingClientRect().top < window.innerHeight * 0.75
			)
				setImpactAnimated(true);
		};
		window.addEventListener("scroll", handleScroll);
		handleScroll();
		return () => window.removeEventListener("scroll", handleScroll);
	}, []);

	return (
		<div>
			{/* Hero Section */}
			<section className="relative h-[550px] lg:h-[700px] overflow-hidden">
				{heroSlides.map((slide, index) => (
					<div
						key={index}
						className={`absolute inset-0 transition-opacity duration-1000 ${index === currentSlide ? "opacity-100" : "opacity-0"}`}
					>
						<img
							src={slide.image}
							alt={slide.title}
							/* Changed h-auto to h-full and object-contain to object-cover */
							className="w-full h-full object-cover object-top"
						/>
						{/* The gradient overlay below ensures your white text remains readable over the image */}
						<div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
					</div>
				))}
				<div className="absolute inset-0 flex items-center">
					<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
						<div className="max-w-2xl">
							<h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 leading-tight">
								Sustainable Water, Real Estate & Agricultural Solutions for
								Africa
							</h1>
							<p className="text-lg md:text-xl text-gray-200 mb-8">
								Bati-Ngalun Company Limited is a trusted Gambian social
								enterprise delivering innovative solutions for communities and
								national development.
							</p>
							<div className="flex flex-wrap gap-4">
								<button
									onClick={() => setCurrentPage("projects")}
									className="inline-flex items-center px-6 py-3 bg-[#0077BE] text-white font-semibold rounded-lg hover:bg-[#005a8f] transition-colors"
								>
									View Our Projects <ArrowRight className="ml-2 h-5 w-5" />
								</button>
								<button
									onClick={() => setCurrentPage("contact")}
									className="inline-flex items-center px-6 py-3 bg-[#2D5016] text-white font-semibold rounded-lg hover:bg-[#1a3a0d] transition-colors"
								>
									Contact Us
								</button>
								<a
									href="https://wa.me/2207311727?text=Hello,%20I%20would%20like%20to%20request%20a%20borehole%20quote."
									target="_blank"
									rel="noopener noreferrer"
									className="inline-flex items-center px-6 py-3 bg-[#25D366] text-white font-semibold rounded-lg hover:bg-[#1da851] transition-colors"
								>
									Get a Borehole Quote
								</a>
							</div>
						</div>
					</div>
				</div>
				<button
					onClick={() =>
						setCurrentSlide(
							(prev) => (prev - 1 + heroSlides.length) % heroSlides.length,
						)
					}
					className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-white/20 hover:bg-white/40 rounded-full text-white transition-colors"
				>
					<ChevronLeft className="h-6 w-6" />
				</button>
				<button
					onClick={() =>
						setCurrentSlide((prev) => (prev + 1) % heroSlides.length)
					}
					className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-white/20 hover:bg-white/40 rounded-full text-white transition-colors"
				>
					<ChevronRight className="h-6 w-6" />
				</button>
				<div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex space-x-2">
					{heroSlides.map((_, index) => (
						<button
							key={index}
							onClick={() => setCurrentSlide(index)}
							className={`w-3 h-3 rounded-full transition-colors ${index === currentSlide ? "bg-white" : "bg-white/50"}`}
						/>
					))}
				</div>
			</section>

			{/* Company Introduction */}
			<section className="py-16 bg-gradient-to-b from-gray-50 to-white">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="text-center max-w-3xl mx-auto">
						<h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
							Building Sustainable Communities Since 2014
						</h2>
						<p className="text-lg text-gray-600">
							Bati-Ngalun Company Limited is a legally registered social
							enterprise in The Gambia, committed to providing affordable,
							high-quality water solutions, sustainable real estate development,
							and innovative agricultural services.
						</p>
					</div>
				</div>
			</section>

			{/* Service Pillars */}
			<section className="py-16 bg-white">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="text-center mb-12">
						<h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
							Our Service Pillars
						</h2>
						<p className="text-lg text-gray-600">
							Four integrated business areas driving sustainable development
						</p>
					</div>
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
						{services.map((service, index) => (
							<button
								key={index}
								onClick={() => setCurrentPage(service.link)}
								className={`group p-6 rounded-xl border-2 ${service.color} hover:shadow-lg transition-all duration-300 hover:-translate-y-1 text-left`}
							>
								<div
									className={`w-16 h-16 rounded-full ${service.color} flex items-center justify-center mb-4`}
								>
									<service.icon className={`h-8 w-8 ${service.iconColor}`} />
								</div>
								<h3 className="text-xl font-bold text-gray-900 mb-2">
									{service.title}
								</h3>
								<p className="text-gray-600 text-sm mb-4">
									{service.description}
								</p>
								<span
									className={`inline-flex items-center text-sm font-medium ${service.iconColor} group-hover:underline`}
								>
									Learn More <ArrowRight className="ml-1 h-4 w-4" />
								</span>
							</button>
						))}
					</div>
				</div>
			</section>

			{/* Featured Projects */}
			<section className="py-16 bg-gray-50">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="text-center mb-12">
						<h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
							Featured Projects
						</h2>
						<p className="text-lg text-gray-600">
							Discover our flagship initiatives making a difference
						</p>
					</div>
					<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
						{displayedFeatured.map((project, index) => (
							<div
								key={index}
								className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-shadow group"
							>
								<div className="relative h-96 overflow-hidden">
									<img
										src={project.image}
										alt={project.title}
										className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
									/>
									<span className="absolute top-4 left-4 px-3 py-1 bg-[#0077BE] text-white text-xs font-medium rounded-full">
										{project.category}
									</span>
								</div>
								<div className="p-6">
									<h3 className="text-xl font-bold text-gray-900 mb-2">
										{project.title}
									</h3>
									<p className="text-gray-600 text-sm mb-4">
										{project.description}
									</p>
									<button
										onClick={() => setCurrentPage("projects")}
										className="inline-flex items-center text-[#0077BE] font-medium hover:underline"
									>
										Learn More <ArrowRight className="ml-1 h-4 w-4" />
									</button>
								</div>
							</div>
						))}
					</div>
					<div className="text-center mt-10">
						<button
							onClick={() => setCurrentPage("projects")}
							className="inline-flex items-center px-8 py-3 bg-[#0077BE] text-white font-semibold rounded-lg hover:bg-[#005a8f] transition-colors"
						>
							View All Projects <ArrowRight className="ml-2 h-5 w-5" />
						</button>
					</div>
					{/* blog button*/}
					<div className="text-center mt-10">
						<button
							onClick={() =>
								window.open("https://blog.bati-ngalun.com", "_blank")
							}
							className="inline-flex items-center px-8 py-3 bg-[#0077BE] text-white font-semibold rounded-lg hover:bg-[#005a8f] transition-colors"
						>
							View Our Blog
							<ArrowRight className="ml-2 h-5 w-5" />
						</button>
					</div>
				</div>
			</section>

			{/* Impact Stats */}
			<section
				id="impact-section"
				className="py-16 bg-gradient-to-r from-[#1a5f2a] to-[#0077BE]"
			>
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="text-center mb-12">
						<h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
							Our Impact
						</h2>
						<p className="text-lg text-white/80">
							Making a measurable difference in communities across The Gambia
							and the sub-region
						</p>
					</div>
					<div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
						{impactStats.map((stat, index) => (
							<div
								key={index}
								className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center"
							>
								<stat.icon className="h-10 w-10 text-white mx-auto mb-4" />
								<div className="text-4xl md:text-5xl font-bold text-white mb-2">
									{impactAnimated ? (
										<CountUp end={stat.value} suffix={stat.suffix} />
									) : (
										"0"
									)}
								</div>
								<p className="text-white/80 font-medium">{stat.label}</p>
							</div>
						))}
					</div>
				</div>
			</section>

			{/* CTA Section */}
			<section className="py-16 bg-white">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="bg-gradient-to-r from-[#0077BE] to-[#4A90E2] rounded-2xl p-8 md:p-12 text-center">
						<h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
							Ready to Start Your Project?
						</h2>
						<p className="text-lg text-white/90 mb-8 max-w-2xl mx-auto">
							Whether you need a borehole, sustainable housing, or agricultural
							solutions, our team is ready to help.
						</p>
						<div className="flex flex-wrap justify-center gap-4">
							<a
								href="https://wa.me/2207311727?text=Hello,%20I%20would%20like%20to%20request%20a%20survey."
								target="_blank"
								rel="noopener noreferrer"
								className="inline-flex items-center px-6 py-3 bg-[#25D366] text-white font-semibold rounded-lg hover:bg-[#1da851] transition-colors"
							>
								Request a Survey
							</a>
							<button
								onClick={() => setCurrentPage("contact")}
								className="inline-flex items-center px-6 py-3 bg-white text-[#0077BE] font-semibold rounded-lg hover:bg-gray-100 transition-colors"
							>
								Contact Us
							</button>
							<a
								href="tel:+2207311727"
								className="inline-flex items-center px-6 py-3 border-2 border-white text-white font-semibold rounded-lg hover:bg-white/10 transition-colors"
							>
								Call: +220 731 1727
							</a>
						</div>
					</div>
				</div>
			</section>
		</div>
	);
};

// About Page
const AboutPage: React.FC<{
	setCurrentPage: (page: string) => void;
	ps: { get: (page: string, field: string, fallback: string) => string };
}> = ({ setCurrentPage, ps }) => {
	const values = [
		{
			icon: Shield,
			title: "Integrity",
			description:
				"We operate with transparency and honesty in all our dealings.",
		},
		{
			icon: Award,
			title: "Excellence",
			description:
				"We strive for the highest quality in every project we undertake.",
		},
		{
			icon: Users,
			title: "Community",
			description:
				"We prioritize the needs and well-being of the communities we serve.",
		},
		{
			icon: Leaf,
			title: "Sustainability",
			description: "We are committed to environmentally responsible practices.",
		},
	];

	return (
		<div>
			<section className="relative py-20 bg-gradient-to-r from-[#1a5f2a] to-[#0077BE]">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
					<h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
						{ps.get("about", "hero_title", "About Us")}
					</h1>
					<p className="text-xl text-white/90 max-w-3xl mx-auto">
						{ps.get(
							"about",
							"hero_subtitle",
							"Learn about Bati-Ngalun Company Limited, our mission, vision, and the team driving sustainable development in The Gambia.",
						)}
					</p>
				</div>
			</section>

			<section className="py-16 bg-white">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="grid lg:grid-cols-2 gap-12 items-center">
						<div>
							<h2 className="text-3xl font-bold text-gray-900 mb-6">
								Company Profile
							</h2>
							<p className="text-gray-600 mb-4">
								<strong>Bati-Ngalun Company Limited</strong>, also known as{" "}
								<strong>Bati-Ngalun Group Social Enterprise</strong>, is a
								legally registered social enterprise in The Gambia, established
								in 2014.
							</p>
							<p className="text-gray-600 mb-4">
								We are dedicated to providing sustainable solutions in
								waterworks, real estate, and agriculture while making a positive
								social impact through our foundation.
							</p>
							<p className="text-gray-600">
								As a social enterprise, we reinvest part of our profits into
								community development programs, youth training initiatives, and
								environmental restoration projects.
							</p>
						</div>
						<div className="relative">
							<img
								src={ps.get("about", "hero_image", IMAGES.community1)}
								alt="About us"
								className="rounded-xl shadow-lg"
							/>
							<div className="absolute -bottom-6 -left-6 bg-[#0077BE] text-white p-6 rounded-xl shadow-lg">
								<div className="text-4xl font-bold">Since</div>
								<div className="text-5xl font-bold">2014</div>
							</div>
						</div>
					</div>
				</div>
			</section>

			<section className="py-16 bg-gray-50">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="grid md:grid-cols-2 gap-8">
						<div className="bg-white p-8 rounded-xl shadow-md border-l-4 border-[#0077BE]">
							<div className="flex items-center mb-4">
								<div className="p-3 bg-blue-100 rounded-full mr-4">
									<Eye className="h-8 w-8 text-[#0077BE]" />
								</div>
								<h3 className="text-2xl font-bold text-gray-900">Our Vision</h3>
							</div>
							<p className="text-gray-600 text-lg">
								To be the leading social enterprise in West Africa, transforming
								communities through sustainable water solutions, eco-friendly
								real estate development, and innovative agricultural practices.
							</p>
						</div>
						<div className="bg-white p-8 rounded-xl shadow-md border-l-4 border-[#2D5016]">
							<div className="flex items-center mb-4">
								<div className="p-3 bg-green-100 rounded-full mr-4">
									<Target className="h-8 w-8 text-[#2D5016]" />
								</div>
								<h3 className="text-2xl font-bold text-gray-900">
									Our Mission
								</h3>
							</div>
							<p className="text-gray-600 text-lg">
								To deliver affordable, high-quality services in waterworks, real
								estate, and agriculture while creating meaningful social impact
								through community programs and environmental stewardship.
							</p>
						</div>
					</div>
				</div>
			</section>

			<section className="py-16 bg-white">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="text-center mb-12">
						<h2 className="text-3xl font-bold text-gray-900 mb-4">
							Our Core Values
						</h2>
						<p className="text-lg text-gray-600">
							The principles that guide everything we do
						</p>
					</div>
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
						{values.map((value, index) => (
							<div
								key={index}
								className="text-center p-6 bg-gray-50 rounded-xl hover:shadow-md transition-shadow"
							>
								<div className="w-16 h-16 bg-gradient-to-br from-[#0077BE] to-[#2D5016] rounded-full flex items-center justify-center mx-auto mb-4">
									<value.icon className="h-8 w-8 text-white" />
								</div>
								<h3 className="text-xl font-bold text-gray-900 mb-2">
									{value.title}
								</h3>
								<p className="text-gray-600">{value.description}</p>
							</div>
						))}
					</div>
				</div>
			</section>

			<section className="py-16 bg-gray-50">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="max-w-4xl mx-auto">
						<div className="text-center mb-8">
							<h2 className="text-3xl font-bold text-gray-900 mb-4">
								Leadership & Team
							</h2>
							<p className="text-lg text-gray-600">
								Meet the dedicated professionals driving our mission
							</p>
						</div>
						<div className="bg-white rounded-xl overflow-hidden shadow-lg">
							<img
								src={IMAGES.team}
								alt="Leadership Team"
								className="w-full h-auto object-contain"
							/>
							<div className="p-8">
								<h3 className="text-2xl font-bold text-gray-900 mb-4">
									Our Leadership Team
								</h3>
								<p className="text-gray-600">
									Our leadership team brings together over a decade of
									experience in engineering, business development, community
									engagement, and social enterprise management. United by a
									shared vision of sustainable development, they guide
									Bati-Ngalun's strategic direction.
								</p>
							</div>
						</div>
					</div>
				</div>
			</section>

			<section className="py-16 bg-white text-center">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<h2 className="text-3xl font-bold text-gray-900 mb-4">
						Partner With Us
					</h2>
					<p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
						Join us in building sustainable communities.
					</p>
					<div className="flex flex-wrap justify-center gap-4">
						<button
							onClick={() => setCurrentPage("contact")}
							className="inline-flex items-center px-6 py-3 bg-[#0077BE] text-white font-semibold rounded-lg hover:bg-[#005a8f] transition-colors"
						>
							Contact Us
						</button>
						<button
							onClick={() => setCurrentPage("projects")}
							className="inline-flex items-center px-6 py-3 border-2 border-[#0077BE] text-[#0077BE] font-semibold rounded-lg hover:bg-blue-50 transition-colors"
						>
							View Our Projects
						</button>
					</div>
				</div>
			</section>
		</div>
	);
};

// Waterworks Page
const WaterworksPage: React.FC<{
	setCurrentPage: (page: string) => void;
	ps: { get: (page: string, field: string, fallback: string) => string };
}> = ({ setCurrentPage, ps }) => {
	const services = [
		{
			icon: Droplets,
			title: "Borehole Drilling & Rehabilitation",
			description:
				"Professional borehole drilling services using modern equipment.",
		},
		{
			icon: Sun,
			title: "Pump Installation (Solar & Electric)",
			description:
				"Installation of high-quality solar and electric pumps for reliable water supply.",
		},
		{
			icon: Building2,
			title: "Water Towers & Pipelines",
			description:
				"Design and construction of water storage towers and distribution pipelines.",
		},
		{
			icon: TestTube,
			title: "Water Quality Testing",
			description:
				"Comprehensive water quality analysis to ensure safe drinking water.",
		},
		{
			icon: Settings,
			title: "Maintenance Services",
			description: "Regular maintenance and emergency repair services.",
		},
		{
			icon: Sprout,
			title: "Drip Irrigation Systems",
			description:
				"Precision water delivery solutions designed to maximize crop yield while reducing water waste through efficient root-zone irrigation.",
		},
	];

	return (
		<div>
			<section className="relative py-20 bg-gradient-to-r from-[#0077BE] to-[#4A90E2]">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="grid lg:grid-cols-2 gap-12 items-center">
						<div className="text-white">
							<div className="flex items-center mb-4">
								<Droplets className="h-10 w-10 mr-3" />
								<span className="text-lg font-medium">Waterworks Division</span>
							</div>
							<h1 className="text-4xl md:text-5xl font-bold mb-4">
								{ps.get(
									"waterworks",
									"hero_title",
									"Sustainable Water Solutions for The Gambia",
								)}
							</h1>
							<p className="text-xl text-white/90 mb-8">
								{ps.get(
									"waterworks",
									"hero_subtitle",
									"From borehole drilling to pump installation and maintenance, we provide comprehensive water solutions.",
								)}
							</p>
							<div className="flex flex-wrap gap-4">
								<a
									href="https://wa.me/2207311727?text=Hello,%20I%20would%20like%20to%20get%20a%20borehole%20quote."
									target="_blank"
									rel="noopener noreferrer"
									className="inline-flex items-center px-6 py-3 bg-[#25D366] text-white font-semibold rounded-lg hover:bg-[#1da851] transition-colors"
								>
									Get a Borehole Quote
								</a>
								<a
									href="tel:+2207311727"
									className="inline-flex items-center px-6 py-3 bg-white text-[#0077BE] font-semibold rounded-lg hover:bg-gray-100 transition-colors"
								>
									Call: +220 731 1727
								</a>
							</div>
						</div>
						<div>
							<img
								src={ps.get("waterworks", "hero_image", IMAGES.borehole1)}
								alt="Borehole Drilling"
								className="rounded-xl shadow-2xl"
							/>
						</div>
					</div>
				</div>
			</section>

			<section className="py-16 bg-white">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="text-center mb-12">
						<h2 className="text-3xl font-bold text-gray-900 mb-4">
							Our Waterworks Services
						</h2>
						<p className="text-lg text-gray-600">
							Comprehensive water solutions from drilling to maintenance
						</p>
					</div>
					<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
						{services.map((service, index) => (
							<div
								key={index}
								className="bg-gray-50 rounded-xl p-6 hover:shadow-lg transition-shadow"
							>
								<div className="p-3 bg-blue-100 rounded-full w-fit mb-4">
									<service.icon className="h-8 w-8 text-[#0077BE]" />
								</div>
								<h3 className="text-xl font-bold text-gray-900 mb-3">
									{service.title}
								</h3>
								<p className="text-gray-600">{service.description}</p>
							</div>
						))}
					</div>
				</div>
			</section>

			<section className="py-16 bg-gray-50 text-center">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<h2 className="text-3xl font-bold text-gray-900 mb-4">
						Ready to Get Started?
					</h2>
					<p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
						Contact us today for a free site survey and quote.
					</p>
					<div className="flex flex-wrap justify-center gap-4">
						<a
							href="https://wa.me/2207311727?text=Hello,%20I%20would%20like%20to%20request%20a%20borehole%20survey."
							target="_blank"
							rel="noopener noreferrer"
							className="inline-flex items-center px-6 py-3 bg-[#25D366] text-white font-semibold rounded-lg hover:bg-[#1da851] transition-colors"
						>
							Request a Survey
						</a>
						<button
							onClick={() => setCurrentPage("contact")}
							className="inline-flex items-center px-6 py-3 bg-[#0077BE] text-white font-semibold rounded-lg hover:bg-[#005a8f] transition-colors"
						>
							Contact Us
						</button>
					</div>
				</div>
			</section>
		</div>
	);
};

// Real Estate Page
const RealEstatePage: React.FC<{
	setCurrentPage: (page: string) => void;
	ps: { get: (page: string, field: string, fallback: string) => string };
}> = ({ setCurrentPage, ps }) => {
	const services = [
		{
			icon: Home,
			title: "Eco-Village Development",
			description: "Comprehensive eco-village planning and development.",
		},
		{
			icon: Map,
			title: "Land Planning & Infrastructure",
			description:
				"Professional land surveying and infrastructure development.",
		},
		{
			icon: Building,
			title: "Sustainable Housing",
			description:
				"Construction of eco-friendly homes using sustainable materials.",
		},
		{
			icon: Zap,
			title: "Utilities Integration",
			description:
				"Integration of essential utilities including water and solar power.",
		},
		{
			icon: Shield,
			title: "Security & Community Services",
			description:
				"Comprehensive security infrastructure and community management.",
		},
	];

	return (
		<div>
			<section className="relative py-20 bg-gradient-to-r from-amber-600 to-amber-500">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="grid lg:grid-cols-2 gap-12 items-center">
						<div className="text-white">
							<div className="flex items-center mb-4">
								<Home className="h-10 w-10 mr-3" />
								<span className="text-lg font-medium">
									Real Estate Division
								</span>
							</div>
							<h1 className="text-4xl md:text-5xl font-bold mb-4">
								{ps.get(
									"realestate",
									"hero_title",
									"Sustainable Real Estate Development",
								)}
							</h1>
							<p className="text-xl text-white/90 mb-8">
								{ps.get(
									"realestate",
									"hero_subtitle",
									"Building eco-friendly communities that combine modern living with environmental sustainability.",
								)}
							</p>
							<div className="flex flex-wrap gap-4">
								<button
									onClick={() => setCurrentPage("contact")}
									className="inline-flex items-center px-6 py-3 bg-white text-amber-600 font-semibold rounded-lg hover:bg-gray-100 transition-colors"
								>
									Inquire About Properties
								</button>
								<a
									href="https://wa.me/2207311727?text=Hello,%20I%20am%20interested%20in%20your%20real%20estate%20developments."
									target="_blank"
									rel="noopener noreferrer"
									className="inline-flex items-center px-6 py-3 bg-[#25D366] text-white font-semibold rounded-lg hover:bg-[#1da851] transition-colors"
								>
									WhatsApp Us
								</a>
							</div>
						</div>
						<div>
							<img
								src={ps.get("realestate", "hero_image", IMAGES.ecovillage1)}
								alt="Eco-Village"
								className="rounded-xl shadow-2xl"
							/>
						</div>
					</div>
				</div>
			</section>

			<section className="py-16 bg-white">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="text-center mb-12">
						<h2 className="text-3xl font-bold text-gray-900 mb-4">
							Our Real Estate Services
						</h2>
						<p className="text-lg text-gray-600">
							Comprehensive development solutions for sustainable communities
						</p>
					</div>
					<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
						{services.map((service, index) => (
							<div
								key={index}
								className="bg-gray-50 rounded-xl p-6 hover:shadow-lg transition-shadow"
							>
								<div className="p-3 bg-amber-100 rounded-full w-fit mb-4">
									<service.icon className="h-8 w-8 text-amber-600" />
								</div>
								<h3 className="text-xl font-bold text-gray-900 mb-3">
									{service.title}
								</h3>
								<p className="text-gray-600">{service.description}</p>
							</div>
						))}
					</div>
				</div>
			</section>

			<section className="py-16 bg-gradient-to-r from-amber-600 to-amber-500 text-center">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<h2 className="text-3xl font-bold text-white mb-4">
						Interested in Our Developments?
					</h2>
					<p className="text-lg text-white/90 mb-8 max-w-2xl mx-auto">
						Contact us to learn more about available properties.
					</p>
					<div className="flex flex-wrap justify-center gap-4">
						<button
							onClick={() => setCurrentPage("contact")}
							className="inline-flex items-center px-6 py-3 bg-white text-amber-600 font-semibold rounded-lg hover:bg-gray-100 transition-colors"
						>
							Contact Us
						</button>
						<a
							href="https://wa.me/2207311727?text=Hello,%20I%20would%20like%20to%20inquire%20about%20property%20availability."
							target="_blank"
							rel="noopener noreferrer"
							className="inline-flex items-center px-6 py-3 bg-[#25D366] text-white font-semibold rounded-lg hover:bg-[#1da851] transition-colors"
						>
							WhatsApp Inquiry
						</a>
					</div>
				</div>
			</section>
		</div>
	);
};

// Agriculture Page
const AgriculturePage: React.FC<{
	setCurrentPage: (page: string) => void;
	ps: { get: (page: string, field: string, fallback: string) => string };
}> = ({ setCurrentPage, ps }) => {
	const services = [
		{
			icon: Droplets,
			title: "Irrigation System Design & Installation",
			description:
				"Custom irrigation solutions designed for Gambian conditions.",
		},
		{
			icon: Sun,
			title: "Solar Pumping Solutions",
			description: "Sustainable solar-powered pumping systems.",
		},
		{
			icon: Warehouse,
			title: "Greenhouse Systems",
			description: "Modern greenhouse construction for year-round production.",
		},
		{
			icon: Leaf,
			title: "Soil & Water Management",
			description:
				"Comprehensive soil analysis and water management strategies.",
		},
		{
			icon: BookOpen,
			title: "Farmer Training",
			description:
				"Hands-on training programs for modern agricultural techniques.",
		},
	];

	return (
		<div>
			<section className="relative py-20 bg-gradient-to-r from-[#2D5016] to-[#4a7c23]">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="grid lg:grid-cols-2 gap-12 items-center">
						<div className="text-white">
							<div className="flex items-center mb-4">
								<Leaf className="h-10 w-10 mr-3" />
								<span className="text-lg font-medium">
									Agriculture Division
								</span>
							</div>
							<h1 className="text-4xl md:text-5xl font-bold mb-4">
								{ps.get(
									"agriculture",
									"hero_title",
									"Agricultural Innovation for Food Security",
								)}
							</h1>
							<p className="text-xl text-white/90 mb-8">
								{ps.get(
									"agriculture",
									"hero_subtitle",
									"Empowering Gambian farmers with modern irrigation systems and sustainable practices.",
								)}
							</p>
							<div className="flex flex-wrap gap-4">
								<button
									onClick={() => setCurrentPage("contact")}
									className="inline-flex items-center px-6 py-3 bg-white text-[#2D5016] font-semibold rounded-lg hover:bg-gray-100 transition-colors"
								>
									Get Agricultural Solutions
								</button>
								<a
									href="https://wa.me/2207311727?text=Hello,%20I%20need%20agricultural%20irrigation%20solutions."
									target="_blank"
									rel="noopener noreferrer"
									className="inline-flex items-center px-6 py-3 bg-[#25D366] text-white font-semibold rounded-lg hover:bg-[#1da851] transition-colors"
								>
									WhatsApp Us
								</a>
							</div>
						</div>
						<div>
							<img
								src={ps.get("agriculture", "hero_image", IMAGES.agricHompage1)}
								alt="Agricultural Irrigation"
								className="rounded-xl shadow-2xl"
							/>
						</div>
					</div>
				</div>
			</section>

			<section className="py-16 bg-white">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="text-center mb-12">
						<h2 className="text-3xl font-bold text-gray-900 mb-4">
							Our Agricultural Services
						</h2>
						<p className="text-lg text-gray-600">
							Comprehensive solutions for modern, sustainable farming
						</p>
					</div>
					<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
						{services.map((service, index) => (
							<div
								key={index}
								className="bg-gray-50 rounded-xl p-6 hover:shadow-lg transition-shadow"
							>
								<div className="p-3 bg-green-100 rounded-full w-fit mb-4">
									<service.icon className="h-8 w-8 text-[#2D5016]" />
								</div>
								<h3 className="text-xl font-bold text-gray-900 mb-3">
									{service.title}
								</h3>
								<p className="text-gray-600">{service.description}</p>
							</div>
						))}
					</div>
				</div>
			</section>

			<section className="py-16 bg-gradient-to-r from-[#2D5016] to-[#4a7c23] text-center">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<h2 className="text-3xl font-bold text-white mb-4">
						Ready to Transform Your Farm?
					</h2>
					<p className="text-lg text-white/90 mb-8 max-w-2xl mx-auto">
						Contact us today to discuss your agricultural needs.
					</p>
					<div className="flex flex-wrap justify-center gap-4">
						<button
							onClick={() => setCurrentPage("contact")}
							className="inline-flex items-center px-6 py-3 bg-white text-[#2D5016] font-semibold rounded-lg hover:bg-gray-100 transition-colors"
						>
							Contact Us
						</button>
						<a
							href="https://wa.me/2207311727?text=Hello,%20I%20would%20like%20to%20discuss%20irrigation%20solutions."
							target="_blank"
							rel="noopener noreferrer"
							className="inline-flex items-center px-6 py-3 bg-[#25D366] text-white font-semibold rounded-lg hover:bg-[#1da851] transition-colors"
						>
							WhatsApp Consultation
						</a>
					</div>
				</div>
			</section>
		</div>
	);
};

// Foundation Page
const FoundationPage: React.FC<{
	setCurrentPage: (page: string) => void;
	ps: { get: (page: string, field: string, fallback: string) => string };
}> = ({ setCurrentPage, ps }) => {
	const programs = [
		{
			icon: Droplets,
			title: "Community Water Access Programs",
			description: "Providing clean water to underserved communities.",
			impact: "25+ communities served",
		},
		{
			icon: Leaf,
			title: "Environmental Restoration",
			description: "Tree planting and watershed protection initiatives.",
			impact: "5000+ trees planted",
		},
		{
			icon: Users,
			title: "Youth Training & Skills Development",
			description: "Vocational training programs for young Gambians.",
			impact: "50+ youth trained",
		},
		{
			icon: Utensils,
			title: "Food Security Projects",
			description:
				"Supporting smallholder farmers with irrigation and training.",
			impact: "100+ farmers supported",
		},
	];

	return (
		<div>
			<section className="relative py-20 bg-gradient-to-r from-rose-600 to-rose-500">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="grid lg:grid-cols-2 gap-12 items-center">
						<div className="text-white">
							<div className="flex items-center mb-4">
								<Heart className="h-10 w-10 mr-3" />
								<span className="text-lg font-medium">
									Bati-Ngalun Foundation
								</span>
							</div>
							<h1 className="text-4xl md:text-5xl font-bold mb-4">
								{ps.get(
									"foundation",
									"hero_title",
									"Social Enterprise for Community Impact",
								)}
							</h1>
							<p className="text-xl text-white/90 mb-8">
								{ps.get(
									"foundation",
									"hero_subtitle",
									"As a registered social enterprise, we reinvest part of our profits into community development programs.",
								)}
							</p>
							<div className="flex flex-wrap gap-4">
								<button
									onClick={() => setCurrentPage("contact")}
									className="inline-flex items-center px-6 py-3 bg-white text-rose-600 font-semibold rounded-lg hover:bg-gray-100 transition-colors"
								>
									Partner With Us
								</button>
								<a
									href="https://wa.me/2202167819?text=Hello,%20I%20am%20interested%20in%20supporting%20the%20Bati-Ngalun%20Foundation."
									target="_blank"
									rel="noopener noreferrer"
									className="inline-flex items-center px-6 py-3 bg-[#25D366] text-white font-semibold rounded-lg hover:bg-[#1da851] transition-colors"
								>
									Contact Foundation
								</a>
							</div>
						</div>
						<div>
							<img
								src={ps.get("foundation", "hero_image", IMAGES.community1)}
								alt="Community Impact"
								className="rounded-xl shadow-2xl"
							/>
						</div>
					</div>
				</div>
			</section>

			<section className="py-16 bg-gray-50">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="text-center mb-12">
						<h2 className="text-3xl font-bold text-gray-900 mb-4">
							Our Programs
						</h2>
						<p className="text-lg text-gray-600">
							Making a difference through targeted community initiatives
						</p>
					</div>
					<div className="grid md:grid-cols-2 gap-8">
						{programs.map((program, index) => (
							<div
								key={index}
								className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow"
							>
								<div className="flex items-start">
									<div className="p-3 bg-rose-100 rounded-full mr-4 flex-shrink-0">
										<program.icon className="h-8 w-8 text-rose-600" />
									</div>
									<div>
										<h3 className="text-xl font-bold text-gray-900 mb-2">
											{program.title}
										</h3>
										<p className="text-gray-600 mb-3">{program.description}</p>
										<span className="inline-block px-3 py-1 bg-rose-100 text-rose-700 rounded-full text-sm font-medium">
											{program.impact}
										</span>
									</div>
								</div>
							</div>
						))}
					</div>
				</div>
			</section>

			<section className="py-16 bg-gradient-to-r from-rose-600 to-rose-500">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="text-center mb-12">
						<h2 className="text-3xl font-bold text-white mb-4">
							Our Impact in Numbers
						</h2>
					</div>
					<div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
						{[
							{ value: "20+", label: "Communities Served" },
							{ value: "1000+", label: "People Impacted" },
							{ value: "50+", label: "Youth Trained" },
							{ value: "5,000+", label: "Trees Planted" },
						].map((stat, index) => (
							<div
								key={index}
								className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center"
							>
								<div className="text-4xl font-bold text-white mb-2">
									{stat.value}
								</div>
								<p className="text-white/80">{stat.label}</p>
							</div>
						))}
					</div>
				</div>
			</section>

			<section className="py-16 bg-white text-center">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<h2 className="text-3xl font-bold text-gray-900 mb-4">
						Support Our Mission
					</h2>
					<p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
						Join us in creating lasting positive change in Gambian communities.
					</p>
					<div className="flex flex-wrap justify-center gap-4">
						<button
							onClick={() => setCurrentPage("contact")}
							className="inline-flex items-center px-6 py-3 bg-rose-600 text-white font-semibold rounded-lg hover:bg-rose-700 transition-colors"
						>
							Contact Us
						</button>
						<a
							href="https://wa.me/2202167819?text=Hello,%20I%20would%20like%20to%20support%20the%20Bati-Ngalun%20Foundation."
							target="_blank"
							rel="noopener noreferrer"
							className="inline-flex items-center px-6 py-3 bg-[#25D366] text-white font-semibold rounded-lg hover:bg-[#1da851] transition-colors"
						>
							WhatsApp Us
						</a>
					</div>
				</div>
			</section>
		</div>
	);
};

// Projects Page
const ProjectsPage: React.FC<{
	setCurrentPage: (page: string) => void;
	ps: { get: (page: string, field: string, fallback: string) => string };
}> = ({ setCurrentPage, ps }) => {
	const [activeFilter, setActiveFilter] = useState("all");
	const [adminPosts, setAdminPosts] = React.useState<any[]>([]);

	const categories = [
		{ id: "all", name: "All Projects" },
		{ id: "water", name: "Water Projects" },
		{ id: "realestate", name: "Real Estate" },
		{ id: "agriculture", name: "Agriculture" },
		{ id: "social", name: "Social Impact" },
		{ id: "news", name: "News" },
	];

	// Admin posts now use category directly (waterworks, agriculture, realestate, foundation, news)

	useEffect(() => {
		supabase
			.from("posts")
			.select("*")
			.eq("section", "projects")
			.eq("status", "published")
			.order("created_at", { ascending: false })
			.then(({ data }) => setAdminPosts(data || []));
	}, []);

	const staticProjects = [
		{
			id: "s1",
			title: "Bati-Ngalun Ecovillage",
			category: "realestate",
			image: IMAGES.ecovillage1,
			location: "Marakissa",
			timeline: "2023 - Ongoing",
			description: "Sustainable community with 50+ eco-friendly housing units.",
			impact: "200+ residents",
		},
		{
			id: "s2",
			title: "The Irrigation House – Gambia",
			category: "agriculture",
			image: IMAGES.irrigation2,
			location: "Brikama",
			timeline: "2025 - 2030",
			description:
				"Retail enterprise for the importation of agricultural and irrigation materials.",
			impact: "200+ farmers trained",
		},
		{
			id: "s3",
			title: "Civil Service Drilling Project 2026",
			category: "water",
			image: IMAGES.borehole1,
			location: "Multiple Locations",
			timeline: "2025 - 2026",
			description: "Large-scale borehole drilling for civil servants.",
			impact: "300+ civil servants",
		},
		{
			id: "s4",
			title: "Kerewan Community Water Project",
			category: "water",
			image: IMAGES.borehole2,
			location: "North Bank Region",
			timeline: "2023",
			description: "Clean water for 500+ residents.",
			impact: "500+ people",
		},
		{
			id: "s5",
			title: "Youth Skills Training Center",
			category: "social",
			image: IMAGES.community2,
			location: "Banjul",
			timeline: "2022 - Ongoing",
			description: "Vocational training facility for young Gambians.",
			impact: "50+ youth trained",
		},
		{
			id: "s6",
			title: "Sustainable Housing Development",
			category: "realestate",
			image: IMAGES.ecovillage2,
			location: "Multiple Locations",
			timeline: "2024 - Ongoing",
			description: "Affordable eco-friendly housing project.",
			impact: "30 housing units",
		},
		{
			id: "s7",
			title: "Safe Transportation of Seedlings",
			category: "agriculture",
			image: IMAGES.irrigation3,
			location: "Marakissa",
			timeline: "2022 - Ongoing",
			description:
				"Seedlings carefully transported to planting sites. Proper handling reduces damage and stress on young plants.",
			impact: "5000+ Seedlings sold",
		},
		{
			id: "s8",
			title: "From Nursery to Field",
			category: "agriculture",
			image: IMAGES.irrigation1,
			location: "Marakissa",
			timeline: "2022 - Ongoing",
			description:
				"From raising strong seedlings in the nursery to cultivating healthy crops and transporting plants for large-scale planting.",
			impact: "10000+ seedlings sold",
		},
		{
			id: "s9",
			title: "Pawpaw Seedlings for Sale",
			category: "agriculture",
			image: IMAGES.agriculture4,
			location: "Marakissa",
			timeline: "2022 - Ongoing",
			description:
				"Quality pawpaw seedlings grown and sold by Bati-Ngalun Company.",
			impact: "10000+ seedlings sold",
		},
		{
			id: "s10",
			title: "Borehole Drilling Works",
			category: "water",
			image: IMAGES.waterworks3,
			location: "Sanyang",
			timeline: "2025",
			description:
				"Professional borehole drilling to provide safe and reliable water for the community.",
			impact: "Clean & sustainable water supply",
		},
		{
			id: "s11",
			title: "Borehole Casing and Installation",
			category: "water",
			image: IMAGES.waterworks4,
			location: "Provinces",
			timeline: "2025",
			description:
				"Installation of borehole casing as part of sustainable water supply solutions.",
			impact: "Clean & sustainable water supply",
		},
		{
			id: "s12",
			title: "Solar-Powered Water Project – Wassadu, Foni",
			category: "water",
			image: IMAGES.waterworks5,
			location: "Wassadu",
			timeline: "2026 April",
			description:
				"A solar-powered water system installed in Wassadu, bringing sustainable water access to the community.",
			impact: "Lives elevated",
		},
	];

	// Convert admin posts to project card format
	const adminProjects = adminPosts.map((post) => ({
		id: `admin-${post.id}`,
		title: post.title,
		category: post.category || "all",
		image: post.featured_image_url || "",
		location: "",
		timeline: new Date(post.created_at).toLocaleDateString("en-GB", {
			month: "short",
			year: "numeric",
		}),
		description: post.excerpt || post.content?.replace(/<[^>]+>/g, "") || "",
		impact: "",
		isAdmin: true,
	}));

	// Merge: admin posts appear first (newest), then static
	const allProjects = [...adminProjects, ...staticProjects];

	const filteredProjects =
		activeFilter === "all"
			? allProjects
			: allProjects.filter((p) => p.category === activeFilter);

	return (
		<div>
			<section className="relative py-20 bg-gradient-to-r from-[#1a5f2a] to-[#0077BE]">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
					<h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
						{ps.get("projects", "hero_title", "Our Projects")}
					</h1>
					<p className="text-xl text-white/90 max-w-3xl mx-auto">
						{ps.get(
							"projects",
							"hero_subtitle",
							"Explore our portfolio of water, real estate, agriculture, and social impact projects.",
						)}
					</p>
				</div>
			</section>

			<section className="py-8 bg-white border-b sticky top-16 z-40">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="flex items-center justify-between flex-wrap gap-4">
						<div className="flex items-center">
							<Filter className="h-5 w-5 text-gray-500 mr-2" />
							<span className="text-gray-600 font-medium">Filter by:</span>
						</div>
						<div className="flex flex-wrap gap-2">
							{categories.map((category) => (
								<button
									key={category.id}
									onClick={() => setActiveFilter(category.id)}
									className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${activeFilter === category.id ? "bg-[#0077BE] text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
								>
									{category.name}
								</button>
							))}
						</div>
					</div>
				</div>
			</section>

			<section className="py-16 bg-gray-50">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
						{filteredProjects.map((project) => (
							<div
								key={project.id}
								className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all group"
							>
								<div className="relative h-80 overflow-hidden">
									{project.image ? (
										<img
											src={project.image}
											alt={project.title}
											className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
										/>
									) : (
										<div className="w-full h-full bg-gradient-to-br from-[#1a5f2a]/10 to-[#0077BE]/10 flex items-center justify-center">
											<ImageIcon className="h-16 w-16 text-gray-300" />
										</div>
									)}
									<span
										className={`absolute top-4 left-4 px-3 py-1 text-white text-xs font-medium rounded-full ${project.category === "water" ? "bg-[#0077BE]" : project.category === "realestate" ? "bg-amber-600" : project.category === "agriculture" ? "bg-[#2D5016]" : project.category === "news" ? "bg-gray-600" : "bg-rose-600"}`}
									>
										{categories.find((c) => c.id === project.category)?.name}
									</span>
								</div>
								<div className="p-6">
									<h3 className="text-xl font-bold text-gray-900 mb-2">
										{project.title}
									</h3>
									{project.location && (
										<div className="flex items-center text-sm text-gray-500 mb-2">
											<MapPin className="h-4 w-4 mr-1" />
											{project.location}
										</div>
									)}
									<div className="flex items-center text-sm text-gray-500 mb-3">
										<Calendar className="h-4 w-4 mr-1" />
										{project.timeline}
									</div>
									{project.description && (
										<p className="text-gray-600 text-sm mb-4">
											{project.description}
										</p>
									)}
									{project.impact && (
										<div className="flex items-center text-sm">
											<Users className="h-4 w-4 text-[#0077BE] mr-1" />
											<span className="text-gray-600">{project.impact}</span>
										</div>
									)}
								</div>
							</div>
						))}
					</div>
				</div>
			</section>

			<section className="py-16 bg-white text-center">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<h2 className="text-3xl font-bold text-gray-900 mb-4">
						Start Your Project With Us
					</h2>
					<p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
						Our experienced team is ready to bring your project to life.
					</p>
					<div className="flex flex-wrap justify-center gap-4">
						<button
							onClick={() => setCurrentPage("contact")}
							className="inline-flex items-center px-6 py-3 bg-[#0077BE] text-white font-semibold rounded-lg hover:bg-[#005a8f] transition-colors"
						>
							Contact Us
						</button>
						<a
							href="https://wa.me/2207311727?text=Hello,%20I%20would%20like%20to%20discuss%20a%20project."
							target="_blank"
							rel="noopener noreferrer"
							className="inline-flex items-center px-6 py-3 bg-[#25D366] text-white font-semibold rounded-lg hover:bg-[#1da851] transition-colors"
						>
							WhatsApp Us
						</a>
					</div>
				</div>
			</section>
		</div>
	);
};
// Careers Page
const CareersPage: React.FC<{
	setCurrentPage: (page: string) => void;
	ps: { get: (page: string, field: string, fallback: string) => string };
}> = ({ setCurrentPage, ps }) => {
	const [expandedJob, setExpandedJob] = useState<number | null>(null);

	const jobs = [
		{
			id: 1,
			title: "Agronomist",
			department: "Agronomist expert",
			location: "Marakissa",
			type: "Full-time",
			description: "Agronomist to support farming operations.",
		},
		{
			id: 2,
			title: "Marketing Officer",
			department: "Sales",
			location: "Marakissa",
			type: "Full-time",
			description:
				"Promote company services across waterworks, real estate, and agriculture by implementing effective marketing strategies and managing social media platforms. Create engaging content, respond to client inquiries, support sales activities, and contribute to branding, promotions, and community outreach initiatives",
		},
	];

	return (
		<div>
			<section className="relative py-20 bg-gradient-to-r from-[#1a5f2a] to-[#0077BE]">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
					<h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
						{ps.get("careers", "hero_title", "Join Our Team")}
					</h1>
					<p className="text-xl text-white/90 max-w-3xl mx-auto">
						{ps.get(
							"careers",
							"hero_subtitle",
							"Build your career while making a difference in Gambian communities.",
						)}
					</p>
				</div>
			</section>

			<section className="py-16 bg-white">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="text-center mb-12">
						<h2 className="text-3xl font-bold text-gray-900 mb-4">
							Why Work With Us?
						</h2>
					</div>
					<div className="grid md:grid-cols-3 gap-8">
						{[
							{
								icon: Heart,
								title: "Meaningful Work",
								description:
									"Every project contributes to community development.",
							},
							{
								icon: GraduationCap,
								title: "Growth Opportunities",
								description: "We invest in training and career development.",
							},
							{
								icon: Users,
								title: "Collaborative Culture",
								description: "Work alongside passionate professionals.",
							},
						].map((benefit, index) => (
							<div
								key={index}
								className="text-center p-6 bg-gray-50 rounded-xl"
							>
								<div className="w-16 h-16 bg-gradient-to-br from-[#0077BE] to-[#2D5016] rounded-full flex items-center justify-center mx-auto mb-4">
									<benefit.icon className="h-8 w-8 text-white" />
								</div>
								<h3 className="text-xl font-bold text-gray-900 mb-2">
									{benefit.title}
								</h3>
								<p className="text-gray-600">{benefit.description}</p>
							</div>
						))}
					</div>
				</div>
			</section>

			<section className="py-16 bg-gray-50">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="text-center mb-12">
						<h2 className="text-3xl font-bold text-gray-900 mb-4">
							Current Openings
						</h2>
					</div>
					<div className="space-y-4">
						{jobs.map((job) => (
							<div
								key={job.id}
								className="bg-white rounded-xl shadow-md overflow-hidden"
							>
								<button
									onClick={() =>
										setExpandedJob(expandedJob === job.id ? null : job.id)
									}
									className="w-full p-6 flex items-center justify-between hover:bg-gray-50 transition-colors text-left"
								>
									<div className="flex items-start">
										<div className="p-3 bg-blue-100 rounded-full mr-4">
											<Briefcase className="h-6 w-6 text-[#0077BE]" />
										</div>
										<div>
											<h3 className="text-xl font-bold text-gray-900">
												{job.title}
											</h3>
											<div className="flex flex-wrap gap-4 mt-2 text-sm text-gray-500">
												<span className="flex items-center">
													<Users className="h-4 w-4 mr-1" />
													{job.department}
												</span>
												<span className="flex items-center">
													<MapPin className="h-4 w-4 mr-1" />
													{job.location}
												</span>
												<span className="flex items-center">
													<Clock className="h-4 w-4 mr-1" />
													{job.type}
												</span>
											</div>
										</div>
									</div>
									{expandedJob === job.id ? (
										<ChevronUp className="h-6 w-6 text-gray-400" />
									) : (
										<ChevronDown className="h-6 w-6 text-gray-400" />
									)}
								</button>
								{expandedJob === job.id && (
									<div className="px-6 pb-6 border-t pt-6">
										<p className="text-gray-600 mb-6">{job.description}</p>
										<div className="flex flex-wrap gap-4">
											<a
												href={`https://wa.me/2207311727?text=Hello,%20I%20am%20interested%20in%20the%20${encodeURIComponent(job.title)}%20position.`}
												target="_blank"
												rel="noopener noreferrer"
												className="inline-flex items-center px-6 py-3 bg-[#25D366] text-white font-semibold rounded-lg hover:bg-[#1da851] transition-colors"
											>
												<MessageCircle className="h-5 w-5 mr-2" />
												Apply via WhatsApp
											</a>
											<a
												href="mailto:careers@bati-ngalun.com"
												className="inline-flex items-center px-6 py-3 bg-[#0077BE] text-white font-semibold rounded-lg hover:bg-[#005a8f] transition-colors"
											>
												Apply via Email
											</a>
										</div>
									</div>
								)}
							</div>
						))}
					</div>
				</div>
			</section>

			<section className="py-16 bg-gradient-to-r from-[#0077BE] to-[#4A90E2] text-center">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<h2 className="text-3xl font-bold text-white mb-4">How to Apply</h2>
					<p className="text-lg text-white/90 mb-8 max-w-2xl mx-auto">
						Send your CV and cover letter via WhatsApp or email.
					</p>
					<div className="flex flex-wrap justify-center gap-4">
						<a
							href="https://wa.me/2207311727?text=Hello,%20I%20would%20like%20to%20apply%20for%20a%20position%20at%20Bati-Ngalun."
							target="_blank"
							rel="noopener noreferrer"
							className="inline-flex items-center px-6 py-3 bg-[#25D366] text-white font-semibold rounded-lg hover:bg-[#1da851] transition-colors"
						>
							<MessageCircle className="h-5 w-5 mr-2" />
							Apply via WhatsApp
						</a>
						<a
							href="mailto:careers@bati-ngalun.com"
							className="inline-flex items-center px-6 py-3 bg-white text-[#0077BE] font-semibold rounded-lg hover:bg-gray-100 transition-colors"
						>
							Email: careers@bati-ngalun.com
						</a>
					</div>
				</div>
			</section>
		</div>
	);
};

// Contact Page
const ContactPage: React.FC<{
	ps: { get: (page: string, field: string, fallback: string) => string };
}> = ({ ps }) => {
	const [formData, setFormData] = useState({
		name: "",
		email: "",
		phone: "",
		subject: "",
		message: "",
	});
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [isSubmitted, setIsSubmitted] = useState(false);

	const handleChange = (
		e: React.ChangeEvent<
			HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
		>,
	) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsSubmitting(true);

		try {
			// Save to Supabase
			const { error: dbError } = await supabase
				.from("contact_submissions")
				.insert([{
					name:    formData.name,
					email:   formData.email,
					phone:   formData.phone,
					subject: formData.subject,
					message: formData.message,
				}]);

			if (dbError) throw dbError;

			// Send email via EmailJS
			await emailjs.send(
				import.meta.env.VITE_EMAILJS_SERVICE_ID,
				import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
				{
					name:    formData.name,
					email:   formData.email,
					phone:   formData.phone || "Not provided",
					subject: formData.subject,
					message: formData.message,
					time:    new Date().toLocaleString("en-GB"),
				},
				import.meta.env.VITE_EMAILJS_PUBLIC_KEY
			);

			// Success
			setIsSubmitted(true);
			setFormData({ name: "", email: "", phone: "", subject: "", message: "" });
			setTimeout(() => setIsSubmitted(false), 5000);

		} catch (error) {
			console.error("Submission error:", error);
			alert("Something went wrong. Please contact us directly on WhatsApp: +220 731 1727");
		} finally {
			setIsSubmitting(false);
		}
	};

	const contactInfo = [
		{
			icon: Phone,
			title: "Phone Numbers",
			details: ["+220 731 1727", "+220 216 7819", "+220 682 2093"],
			action: "tel:+2207311727",
			actionText: "Call Now",
		},
		{
			icon: MessageCircle,
			title: "WhatsApp",
			details: ["+220 731 1727"],
			action: "https://wa.me/2207311727",
			actionText: "Chat Now",
		},
		{
			icon: Mail,
			title: "Email",
			details: ["batingalunadmin@gmail.com"],
			action: "mailto:batingalunadmin@gmail.com",
			actionText: "Send Email",
		},
		{
			icon: MapPin,
			title: "Office Location",
			details: ["Brikama Nyambai Opposit Jah Oil, The Gambia", "West Africa"],
			action: "https://maps.google.com/?q=Brikama Nyambai,Gambia",
			actionText: "Get Directions",
		},
	];

	return (
		<div>
			<section className="relative py-20 bg-gradient-to-r from-[#1a5f2a] to-[#0077BE]">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
					<h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
						{ps.get("contact", "hero_title", "Contact Us")}
					</h1>
					<p className="text-xl text-white/90 max-w-3xl mx-auto">
						{ps.get(
							"contact",
							"hero_subtitle",
							"Get in touch with our team. We're here to answer your questions.",
						)}
					</p>
				</div>
			</section>

			<section className="py-8 bg-white border-b">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="flex flex-wrap justify-center gap-4">
						<a
							href="https://wa.me/2207311727?text=Hello,%20I%20would%20like%20to%20inquire%20about%20your%20services."
							target="_blank"
							rel="noopener noreferrer"
							className="inline-flex items-center px-6 py-3 bg-[#25D366] text-white font-semibold rounded-lg hover:bg-[#1da851] transition-colors"
						>
							<MessageCircle className="h-5 w-5 mr-2" />
							WhatsApp Chat
						</a>
						<a
							href="tel:+2207311727"
							className="inline-flex items-center px-6 py-3 bg-[#0077BE] text-white font-semibold rounded-lg hover:bg-[#005a8f] transition-colors"
						>
							<Phone className="h-5 w-5 mr-2" />
							Call: +220 731 1727
						</a>
						<a
							href="https://wa.me/2207311727?text=Hello,%20I%20would%20like%20to%20request%20a%20borehole%20survey."
							target="_blank"
							rel="noopener noreferrer"
							className="inline-flex items-center px-6 py-3 bg-[#2D5016] text-white font-semibold rounded-lg hover:bg-[#1a3a0d] transition-colors"
						>
							Request a Survey
						</a>
					</div>
				</div>
			</section>

			<section className="py-16 bg-gray-50">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="grid lg:grid-cols-3 gap-12">
						<div className="lg:col-span-1">
							<h2 className="text-2xl font-bold text-gray-900 mb-6">
								Get In Touch
							</h2>
							<div className="space-y-6">
								{contactInfo.map((info, index) => (
									<div
										key={index}
										className="bg-white rounded-xl p-6 shadow-md"
									>
										<div className="flex items-start">
											<div className="p-3 bg-blue-100 rounded-full mr-4">
												<info.icon className="h-6 w-6 text-[#0077BE]" />
											</div>
											<div>
												<h3 className="font-semibold text-gray-900 mb-2">
													{info.title}
												</h3>
												{info.details.map((detail, idx) => (
													<p key={idx} className="text-gray-600 text-sm">
														{detail}
													</p>
												))}
												<a
													href={info.action}
													target={
														info.action.startsWith("http")
															? "_blank"
															: undefined
													}
													rel={
														info.action.startsWith("http")
															? "noopener noreferrer"
															: undefined
													}
													className="inline-block mt-2 text-[#0077BE] font-medium text-sm hover:underline"
												>
													{info.actionText}
												</a>
											</div>
										</div>
									</div>
								))}
							</div>
							<div className="bg-white rounded-xl p-6 shadow-md mt-6">
								<div className="flex items-start">
									<div className="p-3 bg-green-100 rounded-full mr-4">
										<Clock className="h-6 w-6 text-[#2D5016]" />
									</div>
									<div>
										<h3 className="font-semibold text-gray-900 mb-2">
											Business Hours
										</h3>
										<p className="text-gray-600 text-sm">
											Monday - Friday: 8:00 AM - 5:00 PM
										</p>
										<p className="text-gray-600 text-sm">
											Saturday: 9:00 AM - 1:00 PM
										</p>
										<p className="text-gray-600 text-sm">Sunday: Closed</p>
									</div>
								</div>
							</div>
						</div>

						<div className="lg:col-span-2">
							<div className="bg-white rounded-xl p-8 shadow-md">
								<h2 className="text-2xl font-bold text-gray-900 mb-6">
									Send Us a Message
								</h2>
								{isSubmitted && (
									<div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center">
										<CheckCircle className="h-5 w-5 text-green-600 mr-3" />
										<span className="text-green-700">
											Thank you! Your message has been sent successfully.
										</span>
									</div>
								)}
								<form onSubmit={handleSubmit} className="space-y-6">
									<div className="grid md:grid-cols-2 gap-6">
										<div>
											<label
												htmlFor="name"
												className="block text-sm font-medium text-gray-700 mb-2"
											>
												Full Name *
											</label>
											<input
												type="text"
												id="name"
												name="name"
												value={formData.name}
												onChange={handleChange}
												required
												className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0077BE] focus:border-transparent outline-none transition-all"
												placeholder="Your full name"
											/>
										</div>
										<div>
											<label
												htmlFor="email"
												className="block text-sm font-medium text-gray-700 mb-2"
											>
												Email Address *
											</label>
											<input
												type="email"
												id="email"
												name="email"
												value={formData.email}
												onChange={handleChange}
												required
												className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0077BE] focus:border-transparent outline-none transition-all"
												placeholder="your@email.com"
											/>
										</div>
									</div>
									<div className="grid md:grid-cols-2 gap-6">
										<div>
											<label
												htmlFor="phone"
												className="block text-sm font-medium text-gray-700 mb-2"
											>
												Phone Number
											</label>
											<input
												type="tel"
												id="phone"
												name="phone"
												value={formData.phone}
												onChange={handleChange}
												className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0077BE] focus:border-transparent outline-none transition-all"
												placeholder="+220 XXX XXXX"
											/>
										</div>
										<div>
											<label
												htmlFor="subject"
												className="block text-sm font-medium text-gray-700 mb-2"
											>
												Subject *
											</label>
											<select
												id="subject"
												name="subject"
												value={formData.subject}
												onChange={handleChange}
												required
												className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0077BE] focus:border-transparent outline-none transition-all"
											>
												<option value="">Select a subject</option>
												<option value="borehole">
													Borehole Drilling Inquiry
												</option>
												<option value="survey">Request a Survey</option>
												<option value="realestate">Real Estate Inquiry</option>
												<option value="agriculture">
													Agriculture Services
												</option>
												<option value="foundation">
													Foundation/Partnership
												</option>
												<option value="careers">Careers/Employment</option>
												<option value="other">Other</option>
											</select>
										</div>
									</div>
									<div>
										<label
											htmlFor="message"
											className="block text-sm font-medium text-gray-700 mb-2"
										>
											Message *
										</label>
										<textarea
											id="message"
											name="message"
											value={formData.message}
											onChange={handleChange}
											required
											rows={6}
											className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0077BE] focus:border-transparent outline-none transition-all resize-none"
											placeholder="Tell us about your project or inquiry..."
										/>
									</div>
									<button
										type="submit"
										disabled={isSubmitting}
										className="w-full md:w-auto inline-flex items-center justify-center px-8 py-3 bg-[#0077BE] text-white font-semibold rounded-lg hover:bg-[#005a8f] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
									>
										{isSubmitting ? (
											<>
												<svg
													className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
													xmlns="http://www.w3.org/2000/svg"
													fill="none"
													viewBox="0 0 24 24"
												>
													<circle
														className="opacity-25"
														cx="12"
														cy="12"
														r="10"
														stroke="currentColor"
														strokeWidth="4"
													></circle>
													<path
														className="opacity-75"
														fill="currentColor"
														d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
													></path>
												</svg>
												Sending...
											</>
										) : (
											<>
												<Send className="h-5 w-5 mr-2" />
												Send Message
											</>
										)}
									</button>
								</form>
							</div>
						</div>
					</div>
				</div>
			</section>

			<section className="py-16 bg-white">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="text-center mb-8">
						<h2 className="text-2xl font-bold text-gray-900 mb-4">
							Our Location
						</h2>
						<p className="text-gray-600">
							Visit us at our office in Brikama Nyambai, West Coast
							Region, The Gambia
						</p>
					</div>
					<div className="bg-gray-200 rounded-xl overflow-hidden h-96">
						<iframe
							src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d62036.41567285!2d-16.6291!3d13.4549!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xec29c2a1d6e5555%3A0x5c6e5d5e5d5e5d5e!2sBrikama%2C%20The%20Gambia!5e0!3m2!1sen!2s!4v1234567890"
							width="100%"
							height="100%"
							style={{ border: 0 }}
							allowFullScreen
							loading="lazy"
							referrerPolicy="no-referrer-when-downgrade"
							title="Bati-Ngalun Office Location"
						/>
					</div>
				</div>
			</section>

			<section className="py-16 bg-gradient-to-r from-[#0077BE] to-[#4A90E2] text-center">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<h2 className="text-3xl font-bold text-white mb-4">
						Prefer to Chat?
					</h2>
					<p className="text-lg text-white/90 mb-8 max-w-2xl mx-auto">
						For quick responses, reach out to us on WhatsApp.
					</p>
					<a
						href="https://wa.me/2207311727?text=Hello%20Bati-Ngalun,%20I%20would%20like%20to%20inquire%20about%20your%20services."
						target="_blank"
						rel="noopener noreferrer"
						className="inline-flex items-center px-8 py-4 bg-[#25D366] text-white font-semibold rounded-lg hover:bg-[#1da851] transition-colors text-lg"
					>
						<MessageCircle className="h-6 w-6 mr-3" />
						Start WhatsApp Chat
					</a>
				</div>
			</section>
		</div>
	);
};

// Main AppLayout Component
const AppLayout: React.FC = () => {
	const { sidebarOpen, toggleSidebar } = useAppContext();
	const isMobile = useIsMobile();
	const [currentPage, setCurrentPage] = useState("home");
	const ps = usePageSettings();

	// Scroll to top when page changes
	useEffect(() => {
		window.scrollTo(0, 0);
	}, [currentPage]);

	const renderPage = () => {
		switch (currentPage) {
			case "home":
				return <HomePage setCurrentPage={setCurrentPage} ps={ps} />;
			case "about":
				return <AboutPage setCurrentPage={setCurrentPage} ps={ps} />;
			case "waterworks":
				return <WaterworksPage setCurrentPage={setCurrentPage} ps={ps} />;
			case "realestate":
				return <RealEstatePage setCurrentPage={setCurrentPage} ps={ps} />;
			case "agriculture":
				return <AgriculturePage setCurrentPage={setCurrentPage} ps={ps} />;
			case "foundation":
				return <FoundationPage setCurrentPage={setCurrentPage} ps={ps} />;
			case "projects":
				return <ProjectsPage setCurrentPage={setCurrentPage} ps={ps} />;
			case "careers":
				return <CareersPage setCurrentPage={setCurrentPage} ps={ps} />;
			case "contact":
				return <ContactPage ps={ps} />;
			default:
				return <HomePage setCurrentPage={setCurrentPage} ps={ps} />;
		}
	};

	return (
		<div className="min-h-screen flex flex-col bg-white">
			<Header currentPage={currentPage} setCurrentPage={setCurrentPage} />
			<main className="flex-grow">{renderPage()}</main>
			<Footer setCurrentPage={setCurrentPage} />
			<WhatsAppButton />
		</div>
	);
};

export default AppLayout;
