/**
 * M3 TESTIMONIAL BATCH GENERATOR - EXAMPLE DATA
 * 
 * For Claude or any code assistant to easily generate testimonial cards.
 * 
 * USAGE:
 * 1. Import the batch generator and sample data
 * 2. Customize the testimonials array
 * 3. Render <TestimonialBatchGenerator testimonials={yourData} />
 * 4. Click "Export All Cards" or use autoExport={true}
 */

import type { TestimonialData } from './TestimonialBatchGenerator';

// Example testimonials for different use cases
export const sampleTestimonials: TestimonialData[] = [
  {
    id: 'teacher-priya-math',
    quote: 'M3 has transformed how I identify and address gaps in my students\' understanding. The diagnostic insights are incredibly precise.',
    teacherName: 'Priya Sharma',
    role: 'Senior Teacher',
    subject: 'Mathematics',
    schoolName: 'Delhi Public School',
    teacherPhoto: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400',
    size: 'square',
    theme: 'crimson',
  },
  {
    id: 'teacher-rajesh-science',
    quote: 'The misconception framework helped me understand exactly where students struggle. My teaching is now much more targeted and effective.',
    teacherName: 'Rajesh Kumar',
    role: 'Head of Science',
    subject: 'Physics & Chemistry',
    schoolName: 'Kendriya Vidyalaya',
    teacherPhoto: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400',
    size: 'landscape',
    theme: 'blue',
  },
  {
    id: 'teacher-meera-english',
    quote: 'As an educator, M3 gave me clarity on misconceptions I never knew existed. My students\' comprehension has improved dramatically since implementing the insights from Ei ASSET diagnostics.',
    teacherName: 'Meera Patel',
    role: 'English Teacher',
    subject: 'Language & Literature',
    schoolName: 'Bloom International School',
    teacherPhoto: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=400',
    size: 'story',
    theme: 'gradient',
  },
  {
    id: 'teacher-amit-compact',
    quote: 'M3 professional development changed my teaching approach completely.',
    teacherName: 'Amit Verma',
    role: 'Mathematics Teacher',
    schoolName: 'St. Xavier\'s School',
    teacherPhoto: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400',
    size: 'compact',
    theme: 'white',
  },
];

// Minimal example - just quote and name
export const minimalExample: TestimonialData[] = [
  {
    quote: 'M3 has been a game-changer for identifying student misconceptions.',
    teacherName: 'Anita Desai',
    theme: 'crimson',
  },
];

// Batch example for Instagram (all square format)
export const instagramBatch: TestimonialData[] = [
  {
    id: 'insta-1',
    quote: 'M3 helped me identify gaps in understanding I never knew existed.',
    teacherName: 'Kavya Reddy',
    role: 'Math Teacher',
    schoolName: 'Narayana School',
    teacherPhoto: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400',
    size: 'square',
    theme: 'crimson',
  },
  {
    id: 'insta-2',
    quote: 'The diagnostic precision of Ei ASSET combined with M3 framework is unmatched.',
    teacherName: 'Suresh Menon',
    role: 'Science Teacher',
    schoolName: 'PSBB School',
    teacherPhoto: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
    size: 'square',
    theme: 'blue',
  },
  {
    id: 'insta-3',
    quote: 'Every teacher should experience M3 professional development.',
    teacherName: 'Lakshmi Iyer',
    role: 'English Teacher',
    schoolName: 'Rishi Valley School',
    teacherPhoto: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400',
    size: 'square',
    theme: 'gradient',
  },
];

// LinkedIn landscape format batch
export const linkedInBatch: TestimonialData[] = [
  {
    id: 'linkedin-1',
    quote: 'M3 professional development equipped me with frameworks to systematically identify and remove misconceptions in mathematics.',
    teacherName: 'Dr. Ramesh Krishnan',
    role: 'Principal & Math Educator',
    subject: 'Mathematics',
    schoolName: 'National Public School',
    teacherPhoto: 'https://images.unsplash.com/photo-1556157382-97eda2f9e2bf?w=400',
    size: 'landscape',
    theme: 'white',
  },
  {
    id: 'linkedin-2',
    quote: 'The integration of Ei ASSET diagnostics with M3 methodology has transformed our approach to remedial teaching.',
    teacherName: 'Shalini Rao',
    role: 'Academic Coordinator',
    subject: 'Science & Math',
    schoolName: 'Delhi World Public School',
    teacherPhoto: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=400',
    size: 'landscape',
    theme: 'blue',
  },
];

// WhatsApp Stories batch (vertical format)
export const whatsappStoriesBatch: TestimonialData[] = [
  {
    id: 'story-1',
    quote: 'M3 changed everything. I can now pinpoint exactly where students have misconceptions and address them systematically. The Ei ASSET insights are phenomenal.',
    teacherName: 'Pooja Nair',
    role: 'Middle School Coordinator',
    subject: 'Mathematics',
    schoolName: 'Vidya Niketan',
    teacherPhoto: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400',
    size: 'story',
    theme: 'crimson',
  },
];

// Mixed sizes and themes - full variety
export const mixedBatch: TestimonialData[] = [
  ...instagramBatch.slice(0, 2),
  ...linkedInBatch.slice(0, 1),
  ...whatsappStoriesBatch.slice(0, 1),
];

/**
 * QUICK START GUIDE FOR CLAUDE:
 * 
 * 1. Copy one of the example arrays above
 * 2. Customize the testimonials with real data
 * 3. Use in App.tsx like this:
 * 
 *    import { TestimonialBatchGenerator } from './components/TestimonialBatchGenerator';
 *    import { sampleTestimonials } from './components/testimonial-data-examples';
 * 
 *    function App() {
 *      return <TestimonialBatchGenerator testimonials={sampleTestimonials} />;
 *    }
 * 
 * 4. To auto-export on load:
 *    <TestimonialBatchGenerator 
 *      testimonials={sampleTestimonials} 
 *      autoExport={true}
 *      onExportComplete={(results) => console.log('Exported:', results)}
 *    />
 * 
 * FIELD REFERENCE:
 * - quote: (required) The testimonial text
 * - teacherName: Teacher's full name
 * - role: Job title (e.g., "Math Teacher", "Head of Department")
 * - subject: Teaching subject(s)
 * - schoolName: School/institution name
 * - teacherPhoto: URL to teacher photo (use Unsplash or actual photo)
 * - schoolLogo: URL to school logo (optional)
 * - size: 'square' | 'landscape' | 'story' | 'compact'
 * - theme: 'crimson' | 'white' | 'blue' | 'gradient'
 * - showPhoto: true/false (default: true)
 * - showSchoolLogo: true/false (default: true)
 */
