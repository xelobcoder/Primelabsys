"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { solutions, announcement } from "@/data/content";

const navigation = [
	{ label: "Solutions", href: "/solutions", hasMenu: true },
	{ label: "Features", href: "/features" },
	{ label: "Product tour", href: "/product-tour" },
	{ label: "Pricing", href: "/pricing" },
	{ label: "Industries", href: "/industries" },
	{ label: "Marketplace", href: "/marketplace" },
	{ label: "Facilities", href: "/facilities" },
	{ label: "Resources", href: "/resources" },
	{ label: "About", href: "/about" },
];

export function SiteHeader() {
	const [open, setOpen] = useState(false);
	const [solutionsOpen, setSolutionsOpen] = useState(false);
	const headerRef = useRef<HTMLElement>(null);
	const toggleRef = useRef<HTMLButtonElement>(null);
	const solutionsTriggerRef = useRef<HTMLButtonElement>(null);

	useEffect(() => {
		function handleClickOutside(event: MouseEvent) {
			if (headerRef.current && !headerRef.current.contains(event.target as Node)) {
				setSolutionsOpen(false);
				setOpen(false);
			}
		}
		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, []);

	useEffect(() => {
		if (!open) return;
		const originalOverflow = document.body.style.overflow;
		document.body.style.overflow = "hidden";
		return () => {
			document.body.style.overflow = originalOverflow;
		};
	}, [open]);

	const closeAll = () => {
		setOpen(false);
		setSolutionsOpen(false);
	};

	return (
		<>
			{announcement && (
				<div className="announcement">
					<Link href={announcement.href}>
						{announcement.label}<span aria-hidden="true"> ↗</span>
					</Link>
				</div>
			)}
			<header ref={headerRef} className="site-header">
				<div className="header-inner wrap">
					<Link className="wordmark" href="/" aria-label="Prime Laboratory Software home" onClick={closeAll}>
						<span className="wordmark-mark" aria-hidden="true"><i /><i /><i /></span>
						<span className="wordmark-type"><strong>prime</strong><small>LABORATORY SOFTWARE</small></span>
					</Link>
					<button
						ref={toggleRef}
						className="menu-toggle"
						type="button"
						aria-expanded={open}
						aria-controls="primary-navigation"
						onClick={() => {
							setOpen((prev) => !prev);
							if (open) setSolutionsOpen(false);
						}}
					>
						<span className="sr-only">{open ? "Close navigation" : "Open navigation"}</span>
						<span aria-hidden="true" />
						<span aria-hidden="true" />
					</button>
					<nav
						id="primary-navigation"
						className={`primary-nav ${open ? "is-open" : ""}`}
						aria-label="Main navigation"
						onKeyDown={(event) => {
							if (event.key === "Escape") {
								if (solutionsOpen) {
									setSolutionsOpen(false);
									solutionsTriggerRef.current?.focus();
								} else if (open) {
									setOpen(false);
									toggleRef.current?.focus();
								}
							}
						}}
					>
						{navigation.map((item) => (
							<div
								key={item.label}
								className={`nav-item ${item.hasMenu ? "nav-has-menu" : ""} ${item.hasMenu && solutionsOpen ? "is-open" : ""}`}
								onMouseEnter={() => {
									if (item.hasMenu && typeof window !== "undefined" && window.innerWidth > 850) {
										setSolutionsOpen(true);
									}
								}}
								onMouseLeave={() => {
									if (item.hasMenu && typeof window !== "undefined" && window.innerWidth > 850) {
										setSolutionsOpen(false);
									}
								}}
							>
								{item.hasMenu ? (
									<div className="nav-item-row">
										<Link href={item.href} onClick={closeAll}>
											{item.label}
										</Link>
										<button
											ref={solutionsTriggerRef}
											type="button"
											className="nav-dropdown-toggle"
											aria-expanded={solutionsOpen}
											aria-controls="solutions-mega-menu"
											aria-haspopup="true"
											aria-label="Toggle Solutions menu"
											onClick={(e) => {
												e.preventDefault();
												setSolutionsOpen((prev) => !prev);
											}}
										>
											<span className={`nav-caret ${solutionsOpen ? "is-expanded" : ""}`} aria-hidden="true">⌄</span>
										</button>
									</div>
								) : (
									<Link href={item.href} onClick={closeAll}>
										{item.label}
									</Link>
								)}
								{item.hasMenu && (
									<div
										id="solutions-mega-menu"
										className={`mega-menu ${solutionsOpen ? "is-active" : ""}`}
										role="region"
										aria-label="Solutions menu"
									>
										<div className="mega-intro">
											<span className="eyebrow">CONNECTED OPERATIONS</span>
											<strong>One platform, clearer workflows.</strong>
											<Link href="/solutions" onClick={closeAll}>
												Explore all solutions <span aria-hidden="true">→</span>
											</Link>
										</div>
										<div className="mega-links">
											{solutions.slice(0, 6).map((solution) => (
												<Link
													key={solution.slug}
													href={`/solutions/${solution.slug}`}
													onClick={closeAll}
												>
													<span>{solution.shortTitle}</span>
													<small>{solution.eyebrow}</small>
												</Link>
											))}
										</div>
									</div>
								)}
							</div>
						))}
						<div className="nav-mobile-portals">
							<Link href="/facility-login" onClick={closeAll}>Facility login</Link>
							<Link href="/patient-portal" onClick={closeAll}>Patient results</Link>
						</div>
						<Link className="nav-demo" href="/request-demo" onClick={closeAll}>
							Request a demo <span aria-hidden="true">↗</span>
						</Link>
					</nav>
					<div className="header-portals">
						<Link href="/facility-login">Client login</Link>
						<Link className="button button-small" href="/request-demo">
							Request a demo <span aria-hidden="true">↗</span>
						</Link>
					</div>
				</div>
			</header>
		</>
	);
}
