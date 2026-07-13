import type { NextApiRequest, NextApiResponse } from 'next';
import { createClient as createServerClient } from '@/utils/supabase/server';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

    // Check if admin
    const supabase = createServerClient({ req, res } as any);
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) return res.status(401).json({ error: 'Unauthorized' });

    if (req.method === 'POST') {
        try {
            const { code, name } = req.body;

            const { data: existing } = await supabase
                .from('subjects').select('id, is_active').eq('code', code.trim()).maybeSingle();

            if (existing) {
                if (existing.is_active) {
                     return res.status(409).json({ error: 'Course code already exists.' });
                } else {
                    const { error: updateError } = await supabase
                        .from('subjects')
                        .update({
                            name: name.trim(),
                            is_active: true
                        })
                        .eq('id', existing.id);
                    if (updateError) throw updateError;

                    return res.status(200).json({ ok: true, message: 'Subject has been restored.' });
                }
            }

            const { error: insertError } = await supabase
                .from('subjects')
                .insert({ 
                    code: code.trim(), 
                    name: name.trim(),
                    is_active: true
            });

            if (insertError) {
                throw insertError;
            }
            return res.status(200).json({ ok: true });
            
            
        } catch (error: any) {
            console.error('Add Subject Error:', error);
            return res.status(500).json({ error: error.message });
        }
    }
}