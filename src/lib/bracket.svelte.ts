import { browser } from '$app/environment';

const STORAGE_KEY = 'terrabracket-v3';
const SUBMISSIONS_KEY = 'terrabracket-submissions';

export interface Submission {
	username: string;
	regions: string[][];
	center: number[];
	ts: number;
}

export const REGION_NAMES = ['North', 'East', 'South', 'West'];

// The four preselected players in each semifinal bracket, in seed order.
export const DEFAULT_REGIONS: string[][] = [
	['Team A', 'Team B', 'Team C', 'Team D'],
	['Team E', 'Team F', 'Team G', 'Team H'],
	['Team I', 'Team J', 'Team K', 'Team L'],
	['Team M', 'Team N', 'Team O', 'Team P']
];

function move<T>(arr: T[], from: number, to: number): T[] {
	const next = [...arr];
	const [x] = next.splice(from, 1);
	next.splice(to, 0, x);
	return next;
}

class Bracket {
	// regions[r] is semifinal r's players sorted top-to-bottom; index 0 advances to the final.
	regions = $state<string[][]>(DEFAULT_REGIONS.map((r) => [...r]));
	// semifinal indices in ranked order for the center bracket; center[0]'s winner is champion.
	center = $state<number[]>([0, 1, 2, 3]);
	username = $state('');
	submittedAt = $state<number | null>(null);

	get champion(): string {
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

	submit() {
		const username = this.username.trim();
		if (!username) return;
		this.username = username;
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
