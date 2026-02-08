import { ChevronLeft, ChevronRight, Save, X, AlertCircle, CheckCircle2, Sparkles, HelpCircle, FileText, Send, PieChart, Users, Zap, Search, Layout } from 'lucide-react';

export interface Example {
  id: string;
  projectType: 'new-feature' | 'enhancement' | 'integration' | 'optimization';
  content: string;
  metrics: string[];
  context: string;
}

export interface Question {
  id: string;
  order: number;
  title: string;
  description: string;
  placeholder: string;
  subPrompts: string[];
  minCharacters: number;
  validationRules: {
    requiresMetrics: boolean;
    requiresNumbers: boolean;
    minimumLength: number;
  };
  examples: Example[];
}

export interface UserResponse {
  questionId: string;
  content: string;
  timestamp: Date;
  isComplete: boolean;
  validationStatus: 'valid' | 'incomplete' | 'needs-metrics';
}

export interface IntakeSession {
  id: string;
  userId: string;
  projectName: string;
  currentQuestionIndex: number;
  responses: UserResponse[];
  status: 'draft' | 'in-progress' | 'completed';
  lastSaved: Date;
  completionPercentage: number;
}

export const SEVEN_QUESTIONS: Question[] = [
  {
    id: 'q1-business-impact',
    order: 1,
    title: 'What specific business problem are you solving?',
    description: 'Focus on measurable impact to sales platform users and the organization.',
    placeholder: 'Example: Our sales team loses 5 hours per week manually updating opportunity stages across three different systems, costing approximately $150K annually in lost productivity...',
    subPrompts: [
      'What revenue impact do you expect?',
      'How will this improve productivity?',
      'What user satisfaction improvements are expected?'
    ],
    minCharacters: 150,
    validationRules: {
      requiresMetrics: true,
      requiresNumbers: true,
      minimumLength: 150,
    },
    examples: [
      {
        id: 'ex1',
        projectType: 'new-feature',
        content: 'Our enterprise sales reps spend 8-10 hours weekly searching for customer data across Salesforce, internal wiki, and email archives. This creates a 15% delay in quote turnaround time, resulting in an estimated $2M in delayed revenue annually. By implementing unified customer intelligence, we expect to reduce search time by 70% and improve quote response time by 40%.',
        metrics: ['8-10 hours weekly', '15% delay', '$2M annual impact', '70% reduction', '40% improvement'],
        context: 'Customer Intelligence Portal - Q3 2024'
      }
    ]
  },
  {
    id: 'q2-user-value',
    order: 2,
    title: 'Who are the primary users and what specific benefits will they gain?',
    description: 'Describe how daily workflows and productivity will change.',
    placeholder: 'Example: Enterprise Account Executives (75 users) will be able to access complete customer context in under 30 seconds instead of 10+ minutes. This will allow them to...',
    subPrompts: [
      'Which user personas are affected?',
      'What pain points are being addressed?',
      'How will workflows improve?'
    ],
    minCharacters: 150,
    validationRules: {
      requiresMetrics: true,
      requiresNumbers: true,
      minimumLength: 150,
    },
    examples: [
      {
        id: 'ex2',
        projectType: 'enhancement',
        content: 'The primary users are our 150+ Mid-Market Sales Managers. Currently, they spend 4 hours every Monday compiling pipeline reports manually. The new automated dashboard will provide real-time visibility into quota attainment and deal velocity, saving each manager 3.5 hours weekly. This allows them to spend more time coaching reps, which we expect will increase team quota attainment by 10%.',
        metrics: ['150+ Managers', '4 hours', '3.5 hours weekly', '10% increase'],
        context: 'Manager Performance Dashboard'
      }
    ]
  },
  {
    id: 'q3-technical-scope',
    order: 3,
    title: 'What are the core functional requirements?',
    description: 'Define the essential capabilities required to solve the problem.',
    placeholder: 'List the key features and functionalities...',
    subPrompts: [
      'What are the "must-have" features?',
      'Are there specific data integrations needed?',
      'What are the key user interactions?'
    ],
    minCharacters: 150,
    validationRules: {
      requiresMetrics: false,
      requiresNumbers: false,
      minimumLength: 150,
    },
    examples: []
  },
  {
    id: 'q4-success-metrics',
    order: 4,
    title: 'How will success be measured?',
    description: 'Define the KPIs and metrics that will track the project impact.',
    placeholder: 'Example: Target is a 20% reduction in churn rate within 6 months...',
    subPrompts: [
      'What are the primary KPIs?',
      'What is the baseline today?',
      'What is the target improvement?'
    ],
    minCharacters: 100,
    validationRules: {
      requiresMetrics: true,
      requiresNumbers: true,
      minimumLength: 100,
    },
    examples: []
  },
  {
    id: 'q5-dependencies',
    order: 5,
    title: 'What are the key dependencies and risks?',
    description: 'Identify technical, resource, or business dependencies.',
    placeholder: 'Identify potential blockers...',
    subPrompts: [
      'Technical dependencies (APIs, platforms)?',
      'Resource constraints?',
      'Major risks to timeline or adoption?'
    ],
    minCharacters: 100,
    validationRules: {
      requiresMetrics: false,
      requiresNumbers: false,
      minimumLength: 100,
    },
    examples: []
  },
  {
    id: 'q6-user-experience',
    order: 6,
    title: 'What are the key UX principles for this solution?',
    description: 'Describe the desired user journey and experience standards.',
    placeholder: 'Describe the look and feel...',
    subPrompts: [
      'Key design considerations?',
      'Mobile vs. Desktop priority?',
      'Accessibility requirements?'
    ],
    minCharacters: 100,
    validationRules: {
      requiresMetrics: false,
      requiresNumbers: false,
      minimumLength: 100,
    },
    examples: []
  },
  {
    id: 'q7-adoption-plan',
    order: 7,
    title: 'What is the rollout and adoption strategy?',
    description: 'How will you ensure users successfully transition to the new tool?',
    placeholder: 'Plan for training and communication...',
    subPrompts: [
      'Phased rollout vs big bang?',
      'Training requirements?',
      'Feedback loops?'
    ],
    minCharacters: 100,
    validationRules: {
      requiresMetrics: false,
      requiresNumbers: false,
      minimumLength: 100,
    },
    examples: []
  }
];
