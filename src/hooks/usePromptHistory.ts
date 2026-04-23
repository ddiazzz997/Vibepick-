import { useState, useCallback } from 'react'
import { supabase } from '../lib/supabase'

export interface PromptHistoryItem {
    id:          string
    description: string
    vibe:        string | null
    sections:    string[] | null
    prompt_text: string
    created_at:  string
}

export function usePromptHistory() {
    const [history, setHistory] = useState<PromptHistoryItem[]>([])
    const [loading, setLoading] = useState(false)

    const loadHistory = useCallback(async (userId: string) => {
        setLoading(true)
        const { data } = await supabase
            .from('prompt_history')
            .select('id, description, vibe, sections, prompt_text, created_at')
            .eq('user_id', userId)
            .order('created_at', { ascending: false })
            .limit(20)
        setHistory((data as PromptHistoryItem[]) ?? [])
        setLoading(false)
    }, [])

    const savePrompt = useCallback(async (
        userId: string,
        entry: { description: string; vibe?: string; sections?: string[]; prompt_text: string }
    ) => {
        const { data } = await supabase
            .from('prompt_history')
            .insert({
                user_id:     userId,
                description: entry.description,
                vibe:        entry.vibe ?? null,
                sections:    entry.sections ?? null,
                prompt_text: entry.prompt_text,
            })
            .select('id, description, vibe, sections, prompt_text, created_at')
            .single()

        if (data) {
            setHistory(prev => [data as PromptHistoryItem, ...prev.slice(0, 19)])
        }
    }, [])

    return { history, loading, loadHistory, savePrompt }
}
