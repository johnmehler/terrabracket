import { browser } from '$app/environment';
import type { User } from '@supabase/supabase-js';
import { supabase } from './supabase';

class Auth {
	user = $state<User | null>(null);
	guest = $state(false);
	ready = $state(false);
	private initialized = false;

	async init() {
		if (this.initialized || !browser) return;
		this.initialized = true;
		this.guest = localStorage.getItem('terrabracket-guest') === '1';
		const { data } = await supabase.auth.getSession();
		this.user = data.session?.user ?? null;
		supabase.auth.onAuthStateChange((_event, session) => {
			this.user = session?.user ?? null;
		});
		this.ready = true;
	}

	continueAsGuest() {
		this.guest = true;
		localStorage.setItem('terrabracket-guest', '1');
	}

	// returns null on success, 'confirm' if email confirmation is required, or the error message
	async signIn(email: string, password: string): Promise<string | null> {
		const { error } = await supabase.auth.signInWithPassword({ email, password });
		return error?.message ?? null;
	}

	async signUp(email: string, password: string): Promise<string | null> {
		const { data, error } = await supabase.auth.signUp({ email, password });
		if (error) return error.message;
		if (!data.session) return 'confirm';
		return null;
	}

	async signOut() {
		await supabase.auth.signOut();
	}
}

export const auth = new Auth();
