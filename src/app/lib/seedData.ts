import { supabase } from './supabase';

export async function seedDatabase() {
  try {
    console.log('Starting database seed...');

    // Check if already seeded
    const { data: existingPrograms } = await supabase
      .from('programs')
      .select('id')
      .limit(1);

    if (existingPrograms && existingPrograms.length > 0) {
      console.log('Database already seeded');
      return;
    }

    // Seed Programs
    const programs = [
      {
        id: 'prog_m3',
        name: 'M3',
        full_name: 'My Misconception Mentor',
        description: 'Teaching mathematics through understanding misconceptions',
        color: '#6366f1',
      },
      {
        id: 'prog_gsp',
        name: 'GSP',
        full_name: 'GenWise School Program',
        description: 'Comprehensive school transformation program',
        color: '#8b5cf6',
      },
      {
        id: 'prog_tnp365',
        name: 'TNP365',
        full_name: 'The Next Practice 365',
        description: 'Year-round professional development',
        color: '#ec4899',
      },
      {
        id: 'prog_genai',
        name: 'GenAI',
        full_name: 'Generative AI in Education',
        description: 'AI integration for modern classrooms',
        color: '#14b8a6',
      },
    ];

    await supabase.from('programs').insert(programs);
    console.log('Programs seeded');

    // Seed Videos
    const videos = [
      {
        id: 'video_1',
        program_id: 'prog_m3',
        title: 'Binu C K - Primary School Math Teacher',
        subject_name: 'Binu C K',
        subject_role: 'Primary School Math Teacher',
        subject_org: 'Sri Kumaran Children\'s Home - CBSE',
        raw_video_url: 'https://drive.google.com/file/d/example1',
        duration_seconds: 312,
        recorded_date: '2026-02-10',
        status: 'published',
        tags: JSON.stringify(['testimonial', 'teacher', 'math']),
      },
      {
        id: 'video_2',
        program_id: 'prog_m3',
        title: 'Pushkala Parasuraman - Principal',
        subject_name: 'Pushkala Parasuraman',
        subject_role: 'Principal',
        subject_org: 'Sri Kumaran Children\'s Home - CBSE',
        raw_video_url: 'https://drive.google.com/file/d/example2',
        duration_seconds: 375,
        recorded_date: '2026-02-12',
        status: 'published',
        tags: JSON.stringify(['testimonial', 'principal', 'leadership']),
      },
      {
        id: 'video_3',
        program_id: 'prog_m3',
        title: 'Ramya MS - Primary School Math Coordinator',
        subject_name: 'Ramya MS',
        subject_role: 'Primary School Math Coordinator',
        subject_org: 'Sri Kumaran Children\'s Home - CBSE',
        raw_video_url: 'https://drive.google.com/file/d/example3',
        duration_seconds: 285,
        recorded_date: '2026-02-13',
        status: 'review',
        tags: JSON.stringify(['testimonial', 'coordinator', 'math']),
      },
      {
        id: 'video_4',
        program_id: 'prog_m3',
        title: 'Shyamala Devi M - Primary School Math Teacher',
        subject_name: 'Shyamala Devi M',
        subject_role: 'Primary School Math Teacher',
        subject_org: 'Sri Kumaran Children\'s Home - CBSE',
        raw_video_url: 'https://drive.google.com/file/d/example4',
        duration_seconds: 272,
        recorded_date: '2026-02-15',
        status: 'published',
        tags: JSON.stringify(['testimonial', 'teacher', 'math', 'questioning']),
      },
    ];

    await supabase.from('videos').insert(videos);
    console.log('Videos seeded');

    // Seed Clips
    const clips = [
      {
        id: 'clip_1',
        video_id: 'video_4',
        start_time: '0:45',
        end_time: '1:37',
        start_seconds: 45,
        end_seconds: 97,
        duration_seconds: 52,
        title: 'Asking "why" instead of "wrong"',
        description: 'Instead of telling students they\'re wrong, asking them why they thought that way',
        transcript_snippet: 'Instead of telling student they\'re wrong, I now ask "why did you think that?"',
        tags: JSON.stringify(['questioning', 'mental-models', 'pedagogy']),
      },
      {
        id: 'clip_2',
        video_id: 'video_4',
        start_time: '2:21',
        end_time: '2:45',
        start_seconds: 141,
        end_seconds: 165,
        duration_seconds: 24,
        title: '"How to make 7" - multiple approaches',
        description: 'Encouraging students to find different ways to make the number 7',
        transcript_snippet: 'I asked them how many ways can you make 7, and they came up with so many different approaches',
        tags: JSON.stringify(['multiple-approaches', 'addition', 'number-sense']),
      },
      {
        id: 'clip_3',
        video_id: 'video_4',
        start_time: '11:12',
        end_time: '11:47',
        start_seconds: 672,
        end_seconds: 707,
        duration_seconds: 35,
        title: '_=3+1 vs 3+1=_ misconception',
        description: 'Understanding why equation format matters for student comprehension',
        transcript_snippet: 'When I wrote _=3+1, students were confused. But when I wrote 3+1=_, they understood immediately',
        tags: JSON.stringify(['equation-format', 'misconceptions', 'notation']),
      },
      {
        id: 'clip_4',
        video_id: 'video_2',
        start_time: '2:15',
        end_time: '3:02',
        start_seconds: 135,
        end_seconds: 182,
        duration_seconds: 47,
        title: 'Why understanding matters more than answers',
        description: 'Principal perspective on shifting from right answers to understanding process',
        transcript_snippet: 'The biggest shift was realizing that getting the right answer is not as important as understanding how we got there',
        tags: JSON.stringify(['questioning', 'understanding', 'assessment']),
      },
    ];

    await supabase.from('clips').insert(clips);
    console.log('Clips seeded');

    // Seed Content Posts
    const posts = [
      {
        id: 'post_1',
        video_id: 'video_1',
        platform: 'youtube',
        title: 'M3 Teacher Testimonial - Binu CK',
        caption: 'Hear from Binu CK, a primary math teacher at Sri Kumaran, about her transformation journey with M3.',
        status: 'posted',
        posted_at: '2026-02-17T10:30:00Z',
        platform_url: 'https://youtube.com/watch?v=example1',
        views: 234,
        likes: 12,
        comments: 3,
        target_date: '2026-02-17',
      },
      {
        id: 'post_2',
        video_id: 'video_1',
        platform: 'whatsapp',
        title: 'Sales & Marketing - Binu testimonial',
        caption: 'New M3 testimonial from Sri Kumaran CBSE 🎓',
        status: 'posted',
        posted_at: '2026-02-17T11:00:00Z',
        notes: 'Shared to Sales & Marketing group',
        target_date: '2026-02-17',
      },
      {
        id: 'post_3',
        video_id: 'video_2',
        platform: 'youtube',
        title: 'Pushkala Parasuraman - Principal Perspective on M3',
        caption: 'Principal Pushkala shares how M3 transformed teaching at her school.',
        status: 'scheduled',
        target_date: '2026-02-21',
        scheduled_date: '2026-02-21T09:00:00Z',
      },
      {
        id: 'post_4',
        clip_id: 'clip_1',
        platform: 'instagram',
        post_type: 'reel',
        title: 'Quick Tip: Asking "Why" Instead of "Wrong"',
        caption: 'Transform your classroom with one simple shift 💡\n\n#M3 #TeachingTips #MathEducation #Pedagogy',
        hashtags: JSON.stringify(['M3', 'TeachingTips', 'MathEducation', 'Pedagogy']),
        status: 'draft',
        target_date: '2026-02-22',
      },
      {
        id: 'post_5',
        platform: 'linkedin',
        title: 'Compile questioning technique clips',
        caption: 'Create a compilation of all clips showing questioning techniques from M3 teachers',
        status: 'idea',
        idea_date: '2026-02-18',
        notes: 'Look for clips with #questioning tag',
      },
    ];

    await supabase.from('content_posts').insert(posts);
    console.log('Content posts seeded');

    console.log('✅ Database seeded successfully!');
  } catch (error) {
    console.error('Error seeding database:', error);
  }
}
