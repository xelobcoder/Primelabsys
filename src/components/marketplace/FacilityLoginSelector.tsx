"use client";

import { useState } from "react";
import type { PublicFacility } from "@/lib/public-catalog";

export function FacilityLoginSelector({ facilities }: { facilities: PublicFacility[] }) {
	const [slug, setSlug] = useState("");
	const selected = facilities.find(facility => facility.slug === slug);
	return <form className="facility-login-list" onSubmit={event => {
		event.preventDefault();
		if (selected?.facilityLoginUrl) window.location.assign(selected.facilityLoginUrl);
	}}>
		<label htmlFor="client-facility"><h3>Select your laboratory facility</h3></label>
		<select id="client-facility" name="facility" value={slug} required onChange={event => setSlug(event.target.value)}>
			<option value="">Choose a facility</option>
			{facilities.map(facility => <option key={facility.slug} value={facility.slug}>{facility.name} — {facility.locality}</option>)}
		</select>
		<button className="button button-dark" type="submit" disabled={!selected?.facilityLoginUrl}>Continue to client login <span aria-hidden="true">↗</span></button>
	</form>;
}
