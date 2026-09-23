import { browser } from '$app/environment';
import { supabase, supabaseConfigured } from './supabase';

const STORAGE_KEY = 'terrabracket-v4';
const SUBMISSIONS_KEY = 'terrabracket-submissions';

export interface Player {
	name: string;
	score: number;
}

export interface Submission {
	username: string;
	regions: Player[][];
	center: number[];
	ts: number;
}

export const REGION_NAMES = ['North', 'East', 'South', 'West'];

// The four preselected players in each semifinal bracket, in seed order.
export const DEFAULT_REGIONS: Player[][] = [
	[
		{ name: 'MrFickles', score: 18 },
		{ name: 'Jekyl', score: 15 },
		{ name: 'ondas', score: 15 },
		{ name: 'Ryantheman1', score: 15 }
	],
	[
		{ name: 'Aaron W', score: 15 },
		{ name: 'Mellison', score: 14 },
		{ name: 'Redrame', score: 13 },
		{ name: 'Tens0r', score: 13 }
	],
	[
		{ name: 'Zoras', score: 13 },
		{ name: 'Kezilu', score: 13 },
		{ name: 'DeepFinesse', score: 13 },
		{ name: 'Alloran', score: 12.5 }
	],
	[
		{ name: 'Zaarito', score: 12 },
		{ name: 'Barnawal', score: 12 },
		{ name: 'MattTheLesser', score: 12 },
		{ name: 'Voxfini', score: 12 }
	]
];

function move<T>(arr: T[], from: number, to: number): T[] {
	const next = [...arr];
	const [x] = next.splice(from, 1);
	next.splice(to, 0, x);
	return next;
}

async function sha256(text: string): Promise<string> {
	const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text));
	return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, '0')).join('');
}

class Bracket {
	// regions[r] is semifinal r's players sorted top-to-bottom; index 0 advances to the final.
	regions = $state<Player[][]>(DEFAULT_REGIONS.map((r) => [...r]));
	// semifinal indices in ranked order for the center bracket; center[0]'s winner is champion.
	center = $state<number[]>([0, 1, 2, 3]);
	username = $state('');
	submittedAt = $state<number | null>(null);

	get champion(): Player {
		return this.regions[this.center[0]][0];
	}

	reorderRegion(r: number, from: number, to: number) {
		this.regions[r] = move(this.regions[r], from, to);
		this.save();
	}

	reorderCenter(from: number, to: number) {
		this.center = move(this.center, from, to);
		this.save();
	}

	// Returns null on success, or an error message to show the user.
	async submit(pin: string): Promise<string | null> {
		const username = this.username.trim();
		if (!username) return 'Enter your BGA username';
		if (!/^\d{4,6}$/.test(pin)) return 'PIN must be 4–6 digits';
		if (!supabaseConfigured) return 'Supabase is not configured (missing anon key)';
		this.username = username;

		const payload = JSON.stringify({
			regions: this.regions.map((r) => [...r]),
			center: [...this.center]
		});

		try {
			const pinHash = await sha256(pin);
			const { data: existing, error: selErr } = await supabase
				.from('brackets')
				.select('id, pin')
				.ilike('username', username)
				.maybeSingle();
			if (selErr) return `Server error: ${selErr.message}`;

			if (existing) {
				if (existing.pin !== pinHash) return 'Incorrect PIN for that username';
				const { error } = await supabase
					.from('brackets')
					.update({ data: payload, created_at: new Date().toISOString() })
					.eq('id', existing.id);
				if (error) return error.message;
			} else {
				const { error } = await supabase
					.from('brackets')
					.insert({ username, pin: pinHash, data: payload });
				if (error) return error.message;
			}
		} catch (e) {
			return `Could not reach the server — ${e instanceof Error ? e.message : 'try again'}`;
		}

		this.submittedAt = Date.now();
		this.save();
		const submission: Submission = {
			username,
			regions: this.regions.map((r) => [...r]),
			center: [...this.center],
			ts: this.submittedAt
		};
		const all = this.submissions();
		all[username.toLowerCase()] = submission;
		localStorage.setItem(SUBMISSIONS_KEY, JSON.stringify(all));
		return null;
	}

	submissions(): Record<string, Submission> {
		if (!browser) return {};
		try {
			return JSON.parse(localStorage.getItem(SUBMISSIONS_KEY) ?? '{}');
		} catch {
			return {};
		}
	}

	save() {
		if (!browser) return;
		localStorage.setItem(
			STORAGE_KEY,
			JSON.stringify({
				regions: this.regions,
				center: this.center,
				username: this.username,
				submittedAt: this.submittedAt
			})
		);
	}

	load() {
		if (!browser) return;
		try {
			const raw = localStorage.getItem(STORAGE_KEY);
			if (!raw) return;
			const data = JSON.parse(raw);
			if (Array.isArray(data?.regions) && Array.isArray(data?.center)) {
				this.regions = data.regions;
				this.center = data.center;
			}
			if (typeof data?.username === 'string') this.username = data.username;
			if (typeof data?.submittedAt === 'number') this.submittedAt = data.submittedAt;
		} catch {
			// corrupted storage, keep defaults
		}
	}
}

export const bracket = new Bracket();
