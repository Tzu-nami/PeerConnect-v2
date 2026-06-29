import type { NextApiRequest, NextApiResponse } from 'next';
import { createClient as createServerClient } from '@/utils/supabase/server';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

    // Check if admin
    const supabase = createServerClient({ req, res } as any);
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return res.status(401).json({ error: 'Unauthorized' });
    
    if (!session) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    if (req.method === 'POST') {
        try {
            const { code, name } = req.body;

            const { error } = await supabase
            .from('subjects')
            .insert([{ code: code.trim(), name: name.trim() }]);

            if (error) {
            // Check if subject already exists
            if (error.code === '23505') {
                throw new Error(`The subject "${code}" already exists in the registry.`);
            }
            throw error;
            }
            return res.status(200).json({ ok: true });
            
        } catch (error: any) {
            console.error('Add Subject Error:', error);
            return res.status(500).json({ error: error.message });
        }
    }
}