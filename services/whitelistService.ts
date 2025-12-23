
import { supabase } from './supabaseClient';

export interface CheckResult {
    found: boolean;
    data?: {
        username: string | null;
        wallet_address: string | null;
    };
}

export async function checkWhitelistStatus(input: string): Promise<CheckResult> {
    if (!input) return { found: false };

    // Detect if input is a Wallet Address (starts with 0x) or Username
    const isWallet = /^0x[a-fA-F0-9]{40}$/.test(input);
    const normalizedInput = input.trim().toLowerCase(); // Normalize input

    try {
        let query = supabase.from('checker').select('username, wallet_address');

        if (isWallet) {
            query = query.eq('wallet_address', normalizedInput);
        } else {
            // Remove leading '@' if user typed it
            const cleanUsername = normalizedInput.startsWith('@') ? normalizedInput.slice(1) : normalizedInput;
            query = query.eq('username', cleanUsername);
        }

        const { data, error } = await query.maybeSingle();


        if (error) {
            console.error('Error checking whitelist:', error);
            return { found: false };
        }

        // If data exists, the user is in the whitelist
        return {
            found: !!data,
            data: data || undefined
        };
    } catch (err) {
        console.error('Unexpected error checking whitelist:', err);
        return { found: false };
    }
}

export async function updateWalletAddress(username: string, walletAddress: string): Promise<{ success: boolean; message?: string }> {
    try {
        const { error } = await supabase
            .from('checker')
            .update({ wallet_address: walletAddress })
            .eq('username', username);

        if (error) {
            console.error('Error updating wallet:', error);
            return { success: false, message: error.message };
        }
        return { success: true };
    } catch (err) {
        return { success: false, message: 'Unexpected error' };
    }
}
