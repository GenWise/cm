import { supabase } from './supabase';
import type { Program, Video, Clip, ContentPost, VideoWithTags } from './types';
import { aggregateVideoTags } from './tagUtils';

// Programs
export const programsApi = {
  getAll: async () => {
    const { data, error } = await supabase
      .from('programs')
      .select('*')
      .order('name');
    if (error) throw error;
    return data as Program[];
  },

  getById: async (id: string) => {
    const { data, error } = await supabase
      .from('programs')
      .select('*')
      .eq('id', id)
      .single();
    if (error) throw error;
    return data as Program;
  },

  create: async (program: Omit<Program, 'created_at'>) => {
    const { data, error } = await supabase
      .from('programs')
      .insert(program)
      .select()
      .single();
    if (error) throw error;
    return data as Program;
  },

  update: async (id: string, updates: Partial<Program>) => {
    const { data, error } = await supabase
      .from('programs')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data as Program;
  },

  delete: async (id: string) => {
    const { error } = await supabase
      .from('programs')
      .delete()
      .eq('id', id);
    if (error) throw error;
  },
};

// Videos
export const videosApi = {
  getAll: async (filters?: { program_id?: string; status?: string }) => {
    let query = supabase
      .from('videos')
      .select('*, program:programs(*), clips(*)')
      .order('created_at', { ascending: false });

    if (filters?.program_id) {
      query = query.eq('program_id', filters.program_id);
    }
    if (filters?.status) {
      query = query.eq('status', filters.status);
    }

    const { data, error } = await query;
    if (error) throw error;
    
    // Aggregate tags from clips for each video
    return (data || []).map(video => aggregateVideoTags(video, video.clips));
  },

  getById: async (id: string) => {
    const { data, error } = await supabase
      .from('videos')
      .select('*, program:programs(*), clips(*), posts:content_posts(*)')
      .eq('id', id)
      .single();
    if (error) throw error;
    
    // Aggregate tags from clips
    return aggregateVideoTags(data, data.clips);
  },

  create: async (video: Omit<Video, 'id' | 'created_at' | 'updated_at'>) => {
    const { data, error } = await supabase
      .from('videos')
      .insert(video)
      .select()
      .single();
    if (error) throw error;
    return data as Video;
  },

  update: async (id: string, updates: Partial<Video>) => {
    const { data, error } = await supabase
      .from('videos')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data as Video;
  },

  delete: async (id: string) => {
    const { error } = await supabase
      .from('videos')
      .delete()
      .eq('id', id);
    if (error) throw error;
  },

  search: async (searchTerm: string) => {
    const { data, error } = await supabase
      .from('videos')
      .select('*, program:programs(*), clips(*)')
      .or(`title.ilike.%${searchTerm}%,subject_name.ilike.%${searchTerm}%,tags.ilike.%${searchTerm}%`)
      .order('created_at', { ascending: false });
    if (error) throw error;
    
    // Aggregate tags and filter by search term in clip tags too
    const videosWithTags = (data || []).map(video => aggregateVideoTags(video, video.clips));
    
    // Further filter to include videos where clip tags match the search term
    return videosWithTags.filter(video => {
      const lowerSearch = searchTerm.toLowerCase();
      return video.title.toLowerCase().includes(lowerSearch) ||
             video.subject_name?.toLowerCase().includes(lowerSearch) ||
             video.all_tags.some(tag => tag.toLowerCase().includes(lowerSearch));
    });
  },
};

// Clips
export const clipsApi = {
  getAll: async () => {
    const { data, error } = await supabase
      .from('clips')
      .select('*, video:videos(id, title, program_id)')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data;
  },

  getByVideoId: async (videoId: string) => {
    const { data, error } = await supabase
      .from('clips')
      .select('*')
      .eq('video_id', videoId)
      .order('start_seconds');
    if (error) throw error;
    return data as Clip[];
  },

  create: async (clip: Omit<Clip, 'created_at'>) => {
    const { data, error } = await supabase
      .from('clips')
      .insert(clip)
      .select()
      .single();
    if (error) throw error;
    return data as Clip;
  },

  createMany: async (clips: Omit<Clip, 'id' | 'created_at'>[]) => {
    const { data, error } = await supabase
      .from('clips')
      .insert(clips)
      .select();
    if (error) throw error;
    return data as Clip[];
  },

  update: async (id: string, updates: Partial<Clip>) => {
    const { data, error } = await supabase
      .from('clips')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data as Clip;
  },

  delete: async (id: string) => {
    const { error } = await supabase
      .from('clips')
      .delete()
      .eq('id', id);
    if (error) throw error;
  },

  search: async (searchTerm: string) => {
    const { data, error } = await supabase
      .from('clips')
      .select('*, video:videos(id, title, program_id)')
      .or(`title.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%,tags.ilike.%${searchTerm}%`)
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data;
  },

  getByTag: async (tag: string) => {
    const { data, error } = await supabase
      .from('clips')
      .select('*, video:videos(id, title, program_id)')
      .ilike('tags', `%${tag}%`)
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data;
  },
};

// Content Posts
export const postsApi = {
  getAll: async (filters?: { status?: string; platform?: string }) => {
    let query = supabase
      .from('content_posts')
      .select('*, video:videos(id, title), clip:clips(id, description)')
      .order('created_at', { ascending: false });

    if (filters?.status) {
      query = query.eq('status', filters.status);
    }
    if (filters?.platform) {
      query = query.eq('platform', filters.platform);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data;
  },

  getById: async (id: string) => {
    const { data, error } = await supabase
      .from('content_posts')
      .select('*, video:videos(*), clip:clips(*)')
      .eq('id', id)
      .single();
    if (error) throw error;
    return data;
  },

  create: async (post: Omit<ContentPost, 'created_at' | 'updated_at'>) => {
    const { data, error } = await supabase
      .from('content_posts')
      .insert(post)
      .select()
      .single();
    if (error) throw error;
    return data as ContentPost;
  },

  update: async (id: string, updates: Partial<ContentPost>) => {
    const { data, error } = await supabase
      .from('content_posts')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data as ContentPost;
  },

  delete: async (id: string) => {
    const { error } = await supabase
      .from('content_posts')
      .delete()
      .eq('id', id);
    if (error) throw error;
  },

  getUpcoming: async (limit: number = 5) => {
    const { data, error } = await supabase
      .from('content_posts')
      .select('*, video:videos(id, title), clip:clips(id, description)')
      .in('status', ['ready', 'scheduled'])
      .not('target_date', 'is', null)
      .order('target_date')
      .limit(limit);
    if (error) throw error;
    return data;
  },
};

// Stats
export const statsApi = {
  getCounts: async () => {
    const [videos, clips, posts, ideas] = await Promise.all([
      supabase.from('videos').select('id', { count: 'exact', head: true }),
      supabase.from('clips').select('id', { count: 'exact', head: true }),
      supabase.from('content_posts').select('id', { count: 'exact', head: true }).eq('status', 'posted'),
      supabase.from('content_posts').select('id', { count: 'exact', head: true }).eq('status', 'idea'),
    ]);

    return {
      videos: videos.count || 0,
      clips: clips.count || 0,
      posts: posts.count || 0,
      ideas: ideas.count || 0,
    };
  },
};