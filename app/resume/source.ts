export type ResumeLink = {
  label: string
  href: string
}

export type ResumeMetric = {
  value: string
  label: string
}

export type ResumeExperience = {
  company: string
  role: string
  dates: string
  bullets: Array<{
    lead: string
    text: string
    links?: ResumeLink[]
  }>
}

export type ResumeEducation = {
  school: string
  dates: string
  details: string[]
}

export type ResumeSkill = {
  label: string
  items: string[]
}

// Resume source of truth.
// Keep raw content here; keep rendering/styling in page.tsx.
export const resume = {
  name: 'Linghao Zhang',
  title: 'Engineering Leader · Generative AI · Memory Architecture',
  summary:
    'Engineering Leader in Generative AI with full-stack depth across foundational models, scalable infrastructure, and product experiences. Currently leading next-generation Memory Architecture for Gemini Personalization, bridging AI research with world-class products serving 900M+ monthly active users.',
  contact: {
    email: 'zlh@google.com',
    phone: '+1 (412) 209-5680',
    blog: 'linghao.io',
    blogUrl: 'https://linghao.io',
    organization: 'Google DeepMind',
  },
  metrics: [
    { value: '900M+ MAU', label: 'Gemini product scale' },
    { value: '5×', label: 'Gemini TPU throughput' },
    { value: '$50M+ ARR', label: 'BigQuery migration scope' },
    { value: '8', label: 'Engineers led for 0→1 GenAI' },
  ] satisfies ResumeMetric[],
  experience: [
    {
      company: 'Google DeepMind',
      role: 'Staff Research Engineer (Uber TL)',
      dates: 'Oct 2025 – Present',
      bullets: [
        {
          lead: 'Global Impact at Scale (900M+ MAU)',
          text: 'Led technical execution for the worldwide MVP launch of Gemini Personal Intelligence, owning Short-Term Memory and Correctability for one of the world’s largest and fastest-growing AI assistant products.',
          links: [
            {
              label: 'Gemini Personal Intelligence',
              href: 'https://gemini.google/overview/personal-intelligence/',
            },
          ],
        },
        {
          lead: 'Next-Gen Memory',
          text: 'Architecting the framework and building blocks that transform fragmented chat sessions into high-quality, retrievable memory artifacts: the backbone for seamless, human-like conversational continuity across the Gemini ecosystem.',
        },
        {
          lead: 'Full-Stack Technical Leadership',
          text: 'Drove the initiative from early prototyping and executive buy-in to memory synthesis and retrieval infrastructure from scratch; established the quality flywheel through human eval protocols, 3P data vendors, automated eval pipelines, A/B test tooling, and telemetry for sparse, noisy, global multilingual traffic.',
        },
      ],
    },
    {
      company: 'Google',
      role: 'Staff Software Engineer',
      dates: 'Nov 2018 – Oct 2025',
      bullets: [
        {
          lead: 'TL, Vertex AI (Gemini Tuning Quality)',
          text: 'Post-trained Gemini models for Cloud customers with SFT, RL, Preference Optimization, and Distillation. Built infrastructure for customizable RL reward functions and user simulation for multi-turn agentic tasks.',
          links: [{ label: 'Vertex AI', href: 'https://cloud.google.com/vertex-ai' }],
        },
        {
          lead: 'TL, ML Runtime (Inference Optimization)',
          text: 'Productionized mixed inference with paged attention, a new paradigm that boosted inference throughput of Gemini models on TPUs by up to ~5× on latency-insensitive workloads.',
          links: [
            { label: 'mixed inference', href: 'https://arxiv.org/abs/2403.02310' },
            { label: 'paged attention', href: 'https://arxiv.org/pdf/2309.06180' },
          ],
        },
        {
          lead: 'TLM, Conversational Analytics (Data Science Agent)',
          text: 'Led a team of 8 to launch a 0-to-1 GenAI product featuring Text-to-SQL and generative dashboards. Achieved 75% retention within 3 months of launch.',
          links: [
            {
              label: 'Conversational Analytics',
              href: 'https://cloud.google.com/blog/products/business-intelligence/looker-conversational-analytics-now-ga',
            },
          ],
        },
        {
          lead: 'TLM, Data Studio (Distributed Systems)',
          text: 'Managed a team of 7 and owned the C++ federated query engine powering 10M+ MAUs. Led stack unification for BigQuery traffic, securing $50M+ ARR and saving 5+ SWE-years.',
          links: [{ label: 'Data Studio', href: 'https://cloud.google.com/looker-studio' }],
        },
      ],
    },
    {
      company: 'NVIDIA',
      role: 'Research Intern · Computer Architecture Group',
      dates: 'Apr 2017 – Jul 2017',
      bullets: [
        {
          lead: '',
          text: 'Prototyped GPU-accelerated video encoding and decoding for data compression in neural network training using Caffe.',
        },
      ],
    },
    {
      company: 'Strikingly',
      role: 'Data Engineer Intern',
      dates: 'Jun 2016 – Jan 2017',
      bullets: [
        {
          lead: '',
          text: 'Developed next-generation analytics dashboards and analyzed user churn for executive teams.',
        },
      ],
    },
  ] satisfies ResumeExperience[],
  education: [
    {
      school: 'Carnegie Mellon University',
      dates: 'Aug 2017 – Aug 2018',
      details: [
        'Master of Information Technology Strategy, Data Analytics Track · GPA: 4.08',
        'Coursework: Machine Learning (A+), ML with Large Datasets (A+), Deep Learning (A), Distributed Systems (A+).',
      ],
    },
    {
      school: 'Fudan University',
      dates: 'Sep 2013 – Jun 2017',
      details: ['Bachelor of Science in Computer Science · TA for Intro to Machine Learning'],
    },
  ] satisfies ResumeEducation[],
  skills: [
    { label: 'Languages', items: ['C++', 'Python', 'SQL', 'Java', 'TypeScript', 'LaTeX', 'Japanese (JLPT N2)'] },
    { label: 'AI / ML', items: ['JAX', 'TensorFlow', 'SFT / LoRA', 'RL', 'RAG', 'LLM Evals', 'Human & Synthetic Data'] },
    { label: 'Infra', items: ['GCP', 'BigQuery', 'PostgreSQL', 'JDBC', 'Query Engines', 'Vectorized Processing'] },
  ] satisfies ResumeSkill[],
}
