"use client";

import Image from "next/image";
import Link from "next/link";

const navIcons = [
	{ src: "/assets/icons/search.svg", alt: "Search" },
	{ src: "/assets/icons/black-heart.svg", alt: "Heart" },
	{ src: "/assets/icons/user.svg", alt: "User" },
];

const Navbar = () => {
	return (
		<header className='w-full'>
			<nav className='nav'>
				<Link href='/' className='flex items-center gap-1'>
					<Image
						src='/assets/icons/savemelin3.svg'
						width={150}
						height={150}
						alt='Logo'
					/>
				</Link>
				<div className='flex items-center gap-5'>
					{navIcons.map((icon) => (
						<Image
							src={icon.src}
							alt={icon.alt}
							width={28}
							height={28}
							className='object-contain'
						/>
					))}
				</div>
			</nav>
		</header>
	);
};

export default Navbar;
