
import { Lead, LeadStats } from '../types/lead';

export const mockLeads: Lead[] = [
  {
    id: '1',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    phone: '+1 (555) 123-4567',
    company: 'Acme Corp',
    position: 'CTO',
    priority: 'high',
    status: 'contacted',
    source: 'website',
    value: 50000,
    createdAt: '2023-10-15T09:30:00Z',
    updatedAt: '2023-10-17T14:45:00Z',
    lastContactedAt: '2023-10-17T14:45:00Z',
    nextFollowUp: '2023-10-24T10:00:00Z',
    notes: 'Interested in our enterprise solution. Needs pricing details.'
  },
  {
    id: '2',
    firstName: 'Jane',
    lastName: 'Smith',
    email: 'jane.smith@example.com',
    company: 'Tech Solutions Inc',
    position: 'Marketing Director',
    priority: 'medium',
    status: 'new',
    source: 'referral',
    value: 25000,
    createdAt: '2023-10-16T11:20:00Z',
    updatedAt: '2023-10-16T11:20:00Z',
    nextFollowUp: '2023-10-23T15:30:00Z',
    notes: 'Referred by Mike Johnson. Looking for marketing automation.'
  },
  {
    id: '3',
    firstName: 'Robert',
    lastName: 'Brown',
    email: 'robert.brown@example.com',
    phone: '+1 (555) 987-6543',
    company: 'Global Enterprises',
    position: 'CEO',
    priority: 'high',
    status: 'qualified',
    source: 'event',
    value: 100000,
    createdAt: '2023-10-10T15:45:00Z',
    updatedAt: '2023-10-18T09:15:00Z',
    lastContactedAt: '2023-10-18T09:15:00Z',
    nextFollowUp: '2023-10-25T11:00:00Z',
    notes: 'Met at Tech Conference 2023. Very interested in our AI solutions.'
  },
  {
    id: '4',
    firstName: 'Emily',
    lastName: 'Davis',
    email: 'emily.davis@example.com',
    company: 'Creative Designs',
    priority: 'low',
    status: 'new',
    source: 'social',
    value: 10000,
    createdAt: '2023-10-17T10:00:00Z',
    updatedAt: '2023-10-17T10:00:00Z',
    nextFollowUp: '2023-10-24T14:00:00Z',
    notes: 'Found us on LinkedIn. Requested more information.'
  },
  {
    id: '5',
    firstName: 'Michael',
    lastName: 'Wilson',
    email: 'michael.wilson@example.com',
    phone: '+1 (555) 234-5678',
    company: 'Innovative Solutions',
    position: 'IT Manager',
    priority: 'medium',
    status: 'proposal',
    source: 'website',
    value: 35000,
    createdAt: '2023-10-05T13:30:00Z',
    updatedAt: '2023-10-16T16:20:00Z',
    lastContactedAt: '2023-10-16T16:20:00Z',
    nextFollowUp: '2023-10-23T10:30:00Z',
    notes: 'Proposal sent. Waiting for feedback.'
  },
  {
    id: '6',
    firstName: 'Sarah',
    lastName: 'Johnson',
    email: 'sarah.johnson@example.com',
    company: 'Health Systems',
    position: 'Procurement Manager',
    priority: 'high',
    status: 'negotiation',
    source: 'email',
    value: 75000,
    createdAt: '2023-09-28T09:15:00Z',
    updatedAt: '2023-10-18T11:30:00Z',
    lastContactedAt: '2023-10-18T11:30:00Z',
    nextFollowUp: '2023-10-20T15:00:00Z',
    notes: 'Negotiating final terms. Needs approval from legal team.'
  },
  {
    id: '7',
    firstName: 'David',
    lastName: 'Miller',
    email: 'david.miller@example.com',
    phone: '+1 (555) 876-5432',
    company: 'Retail Ventures',
    priority: 'low',
    status: 'contacted',
    source: 'website',
    value: 15000,
    createdAt: '2023-10-12T14:45:00Z',
    updatedAt: '2023-10-15T10:30:00Z',
    lastContactedAt: '2023-10-15T10:30:00Z',
    nextFollowUp: '2023-10-22T16:00:00Z',
    notes: 'Initial discussion completed. Seemed interested but no immediate need.'
  },
  {
    id: '8',
    firstName: 'Lisa',
    lastName: 'Taylor',
    email: 'lisa.taylor@example.com',
    company: 'Financial Services Inc',
    position: 'Operations Director',
    priority: 'medium',
    status: 'qualified',
    source: 'referral',
    value: 40000,
    createdAt: '2023-10-08T16:20:00Z',
    updatedAt: '2023-10-17T13:10:00Z',
    lastContactedAt: '2023-10-17T13:10:00Z',
    nextFollowUp: '2023-10-24T09:30:00Z',
    notes: 'Qualified lead. Needs custom solution for financial operations.'
  }
];

export const mockLeadStats: LeadStats = {
  total: 86,
  high: 28,
  medium: 35,
  low: 23,
  new: 45,
  contacted: 22,
  qualified: 12,
  proposal: 7,
  conversion: 0.18
};

export const recentActivities = [
  {
    id: '1',
    leadId: '6',
    leadName: 'Sarah Johnson',
    action: 'Email sent',
    date: '2023-10-18T11:30:00Z',
    description: 'Sent proposal documents and pricing details.'
  },
  {
    id: '2',
    leadId: '3',
    leadName: 'Robert Brown',
    action: 'Call completed',
    date: '2023-10-18T09:15:00Z',
    description: 'Discussed implementation timeline and next steps.'
  },
  {
    id: '3',
    leadId: '5',
    leadName: 'Michael Wilson',
    action: 'Note added',
    date: '2023-10-16T16:20:00Z',
    description: 'Client requested additional case studies for review.'
  },
  {
    id: '4',
    leadId: '1',
    leadName: 'John Doe',
    action: 'Meeting scheduled',
    date: '2023-10-17T14:45:00Z',
    description: 'Demo scheduled for next week to showcase enterprise features.'
  },
  {
    id: '5',
    leadId: '8',
    leadName: 'Lisa Taylor',
    action: 'Lead qualified',
    date: '2023-10-17T13:10:00Z',
    description: 'Identified specific needs and confirmed budget availability.'
  }
];

export const monthlyLeads = [
  { month: 'Jan', leads: 45 },
  { month: 'Feb', leads: 52 },
  { month: 'Mar', leads: 49 },
  { month: 'Apr', leads: 62 },
  { month: 'May', leads: 57 },
  { month: 'Jun', leads: 65 },
  { month: 'Jul', leads: 71 },
  { month: 'Aug', leads: 68 },
  { month: 'Sep', leads: 73 },
  { month: 'Oct', leads: 86 }
];

export const conversionRates = [
  { month: 'Jan', rate: 0.12 },
  { month: 'Feb', rate: 0.14 },
  { month: 'Mar', rate: 0.13 },
  { month: 'Apr', rate: 0.15 },
  { month: 'May', rate: 0.14 },
  { month: 'Jun', rate: 0.16 },
  { month: 'Jul', rate: 0.17 },
  { month: 'Aug', rate: 0.16 },
  { month: 'Sep', rate: 0.17 },
  { month: 'Oct', rate: 0.18 }
];

export const leadsBySource = [
  { name: 'Website', value: 42 },
  { name: 'Referral', value: 18 },
  { name: 'Email', value: 8 },
  { name: 'Social', value: 12 },
  { name: 'Event', value: 6 }
];
