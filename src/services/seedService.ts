
import { supabase } from "@/integrations/supabase/client";
import { LeadPriority, LeadSource, LeadStatus } from "@/types/lead";
import { format, addDays, subDays, subMonths, addMonths } from "date-fns";

const randomInt = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const pickRandom = <T>(arr: T[]): T => {
  return arr[Math.floor(Math.random() * arr.length)];
};

// Generate a random date between two dates
const randomDate = (start: Date, end: Date) => {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
};

// Format a date for Supabase (ISO format)
const formatDate = (date: Date) => {
  return date.toISOString();
};

// Define sample data
const firstNames = ["James", "Mary", "John", "Patricia", "Robert", "Jennifer", "Michael", "Linda", "William", "Elizabeth", "David", "Susan", "Richard", "Jessica", "Joseph", "Sarah", "Thomas", "Karen", "Charles", "Nancy", "Daniel", "Lisa", "Matthew", "Margaret", "Anthony", "Betty", "Mark", "Sandra", "Donald", "Ashley", "Steven", "Dorothy", "Paul", "Kimberly", "Andrew", "Emily", "Joshua", "Donna", "Kenneth", "Michelle", "Kevin", "Carol", "Brian", "Amanda", "George", "Melissa", "Edward", "Deborah", "Ronald", "Stephanie"];

const lastNames = ["Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis", "Rodriguez", "Martinez", "Hernandez", "Lopez", "Gonzales", "Wilson", "Anderson", "Thomas", "Taylor", "Moore", "Jackson", "Martin", "Lee", "Perez", "Thompson", "White", "Harris", "Sanchez", "Clark", "Ramirez", "Lewis", "Robinson", "Walker", "Young", "Allen", "King", "Wright", "Scott", "Torres", "Nguyen", "Hill", "Flores", "Green", "Adams", "Nelson", "Baker", "Hall", "Rivera", "Campbell", "Mitchell", "Carter", "Roberts"];

const companies = ["Acme Corp", "Globex", "Initech", "Umbrella Corp", "Massive Dynamic", "Stark Industries", "Wayne Enterprises", "Cyberdyne Systems", "Soylent Corp", "Tyrell Corp", "Weyland-Yutani", "Xanatos Enterprises", "Oscorp", "LexCorp", "Dharma Initiative", "Rekall", "Gekko & Co", "Wonka Industries", "Dunder Mifflin", "Sterling Cooper", "Prestige Worldwide", "Madrigal Electromotive", "Hooli", "Pied Piper", "Raviga Capital", "Endframe", "Delos Inc", "Vehement Capital", "Gringotts Bank", "Bubba Gump", "Los Pollos Hermanos", "Bluth Company", "Krusty Krab", "Globotech", "Oceanic Airlines", "Massive Dynamics", "InGen", "Virtucon", "Beneke Fabricators", "Pendant Publishing", "Vandelay Industries", "Monsters Inc", "Planet Express", "Wernham Hogg", "Paper Street Soap Company", "Willy Wonka's", "Nakatomi Trading Corp", "Slate Rock and Gravel"];

const domains = ["gmail.com", "yahoo.com", "hotmail.com", "outlook.com", "icloud.com", "aol.com", "protonmail.com", "mail.com", "zoho.com", "yandex.com"];

const industries = ["Technology", "Finance", "Healthcare", "Education", "Manufacturing", "Retail", "Hospitality", "Real Estate", "Entertainment", "Construction", "Transportation", "Energy", "Agriculture", "Mining", "Telecommunications", "Media", "Legal Services", "Marketing", "Consulting", "Insurance"];

const companySizes = ["1-10 employees", "11-50 employees", "51-200 employees", "201-500 employees", "501-1000 employees", "1001-5000 employees", "5000+ employees"];

const positions = ["CEO", "CTO", "CFO", "COO", "CMO", "VP Sales", "VP Marketing", "Director", "Manager", "Team Lead", "Associate", "Specialist", "Analyst", "Consultant", "Owner", "Founder", "President", "Developer", "Engineer", "Designer"];

const sourcesWithWeights: [LeadSource, number][] = [
  ["website", 35],
  ["referral", 25],
  ["email", 15],
  ["social", 10],
  ["event", 10],
  ["other", 5]
];

const statusesWithWeights: [LeadStatus, number][] = [
  ["new", 35],
  ["contacted", 25],
  ["qualified", 15],
  ["proposal", 10],
  ["negotiation", 10],
  ["closed", 3],
  ["lost", 2]
];

const prioritiesWithWeights: [LeadPriority, number][] = [
  ["high", 30],
  ["medium", 50],
  ["low", 20]
];

const weightedRandom = <T>(items: [T, number][]) => {
  const totalWeight = items.reduce((sum, [_, weight]) => sum + weight, 0);
  let random = Math.random() * totalWeight;
  
  for (const [item, weight] of items) {
    random -= weight;
    if (random <= 0) {
      return item;
    }
  }
  
  return items[0][0]; // Fallback
};

const phoneFormats = [
  "###-###-####",
  "(###) ###-####",
  "###.###.####",
  "+1 ###-###-####",
  "+1 (###) ###-####"
];

const generatePhone = () => {
  const format = pickRandom(phoneFormats);
  return format.replace(/#+/g, match => {
    return Array.from({ length: match.length }, () => randomInt(0, 9)).join('');
  });
};

const generateLead = (index: number) => {
  const firstName = pickRandom(firstNames);
  const lastName = pickRandom(lastNames);
  const company = pickRandom(companies);
  const domain = pickRandom(domains);
  const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}@${domain}`;
  const position = pickRandom(positions);
  const priority = weightedRandom(prioritiesWithWeights);
  const status = weightedRandom(statusesWithWeights);
  const source = weightedRandom(sourcesWithWeights);
  const value = randomInt(0, 10) > 3 ? randomInt(5000, 200000) : null;
  const createdAt = formatDate(randomDate(subMonths(new Date(), 12), new Date()));
  
  const hasBeenContacted = ["contacted", "qualified", "proposal", "negotiation", "closed", "lost"].includes(status);
  const lastContactedAt = hasBeenContacted ? formatDate(randomDate(new Date(createdAt), new Date())) : null;
  
  const needsFollowUp = randomInt(1, 10) > 7;
  const nextFollowUp = needsFollowUp ? formatDate(randomDate(new Date(), addDays(new Date(), 30))) : null;
  
  const industry = Math.random() > 0.3 ? pickRandom(industries) : null;
  const companySize = Math.random() > 0.4 ? pickRandom(companySizes) : null;
  const revenue = Math.random() > 0.6 ? randomInt(100000, 10000000) : null;
  
  let notes = null;
  if (Math.random() > 0.7) {
    notes = `Initial contact made with ${firstName} ${lastName} from ${company}. ${firstName} is interested in our product and requested a follow-up call.`;
  }
  
  return {
    first_name: firstName,
    last_name: lastName,
    email,
    phone: Math.random() > 0.2 ? generatePhone() : null,
    company,
    position,
    priority,
    status,
    source,
    value,
    created_at: createdAt,
    last_contacted_at: lastContactedAt,
    next_follow_up: nextFollowUp,
    notes,
    industry,
    company_size: companySize,
    revenue
  };
};

const generateSales = (leads: any[]) => {
  const sales: any[] = [];
  
  const products = [
    "Premium Plan", "Basic Plan", "Enterprise Solution",
    "Professional Services", "Consultation Package", "Standard License",
    "Custom Implementation", "Monthly Subscription", "Annual Subscription",
    "Support Package", "Training Sessions", "Hardware Bundle"
  ];
  
  const paymentMethods = ["credit_card", "bank_transfer", "paypal", "check", "cash", "crypto"];
  const paymentStatuses = ["paid", "pending", "failed", "refunded"];
  
  // Filter leads that could have made a purchase (qualified, proposal, negotiation, closed)
  const qualifiedLeads = leads.filter(lead => 
    ["qualified", "proposal", "negotiation", "closed"].includes(lead.status)
  );
  
  // Generate sales for about 60% of qualified leads
  const leadsWithSales = qualifiedLeads.filter(() => Math.random() > 0.4);
  
  for (const lead of leadsWithSales) {
    const salesCount = randomInt(1, 3); // Some leads might have multiple sales
    
    for (let i = 0; i < salesCount; i++) {
      const product = pickRandom(products);
      const amount = randomInt(1000, 50000);
      const saleDate = formatDate(randomDate(new Date(lead.last_contacted_at || lead.created_at), new Date()));
      const paymentMethod = pickRandom(paymentMethods);
      const paymentStatus = pickRandom(paymentStatuses);
      
      sales.push({
        lead_id: lead.id,
        product_name: product,
        amount,
        sale_date: saleDate,
        payment_method: paymentMethod,
        payment_status: paymentStatus,
      });
    }
  }
  
  return sales;
};

const generateActivities = (leads: any[]) => {
  const activities: any[] = [];
  
  const actionTypes = [
    "Email sent", "Call made", "Meeting scheduled", "Proposal sent",
    "Demo completed", "Contract sent", "Follow-up", "Note added"
  ];
  
  for (const lead of leads) {
    const activityCount = randomInt(0, 5); // Some leads might have no activities, others might have several
    
    if (activityCount > 0) {
      // Generate activities
      for (let i = 0; i < activityCount; i++) {
        const action = pickRandom(actionTypes);
        let description;
        
        switch (action) {
          case "Email sent":
            description = `Sent email to ${lead.first_name} regarding our product offerings`;
            break;
          case "Call made":
            description = `Called ${lead.first_name} to discuss their requirements`;
            break;
          case "Meeting scheduled":
            description = `Scheduled meeting with ${lead.first_name} for next week`;
            break;
          case "Proposal sent":
            description = `Sent proposal to ${lead.first_name} with pricing details`;
            break;
          case "Demo completed":
            description = `Completed product demonstration for ${lead.first_name} and team`;
            break;
          case "Contract sent":
            description = `Sent contract to ${lead.first_name} for review`;
            break;
          case "Follow-up":
            description = `Follow-up with ${lead.first_name} after initial contact`;
            break;
          case "Note added":
            description = `Added note: ${lead.first_name} is interested in our premium plan`;
            break;
          default:
            description = `Interaction with ${lead.first_name} from ${lead.company}`;
        }
        
        activities.push({
          lead_id: lead.id,
          action,
          description,
          created_at: formatDate(randomDate(new Date(lead.created_at), new Date()))
        });
      }
    }
  }
  
  return activities;
};

const generateNotifications = (leads: any[]) => {
  const notifications: any[] = [];
  
  const notificationTypes = ["follow-up", "email", "call", "meeting"];
  
  // We'll create notifications for leads needing follow-ups
  const leadsNeedingFollowUp = leads.filter(lead => lead.next_follow_up);
  
  for (const lead of leadsNeedingFollowUp) {
    const notificationType = pickRandom(notificationTypes);
    let title, message;
    
    const scheduledAt = lead.next_follow_up;
    const isRead = Math.random() > 0.7; // 30% chance of being unread
    
    switch (notificationType) {
      case "follow-up":
        title = `Follow up with ${lead.first_name} ${lead.last_name}`;
        message = `It's time to follow up with ${lead.first_name} from ${lead.company} regarding their interest in our products.`;
        break;
      case "email":
        title = `Send email to ${lead.first_name} ${lead.last_name}`;
        message = `Send a follow-up email to ${lead.first_name} at ${lead.email} with additional information.`;
        break;
      case "call":
        title = `Call ${lead.first_name} ${lead.last_name}`;
        message = `Schedule a call with ${lead.first_name} to discuss their requirements and next steps.`;
        break;
      case "meeting":
        title = `Meeting with ${lead.first_name} ${lead.last_name}`;
        message = `You have a meeting scheduled with ${lead.first_name} from ${lead.company}. Prepare presentation materials.`;
        break;
      default:
        title = `Reminder for ${lead.first_name} ${lead.last_name}`;
        message = `Don't forget to follow up with ${lead.first_name} from ${lead.company}.`;
    }
    
    notifications.push({
      lead_id: lead.id,
      user_id: "00000000-0000-0000-0000-000000000000", // This will be replaced with the actual user ID
      title,
      message,
      type: notificationType,
      scheduled_at: scheduledAt,
      is_read: isRead,
    });
  }
  
  return notifications;
};

export const seedService = {
  async seedLeads(count: number = 500) {
    console.log(`Generating ${count} leads...`);
    
    try {
      // Generate leads data
      const leadsData = Array.from({ length: count }, (_, i) => generateLead(i));
      
      // Insert in batches of 50 to avoid timeouts
      const batchSize = 50;
      let inserted = 0;
      
      // Store created lead IDs
      const createdLeads = [];
      
      for (let i = 0; i < leadsData.length; i += batchSize) {
        const batch = leadsData.slice(i, i + batchSize);
        
        console.log(`Inserting batch ${Math.ceil((i+1) / batchSize)} of ${Math.ceil(leadsData.length / batchSize)}...`);
        
        const { data, error } = await supabase
          .from('leads')
          .insert(batch)
          .select();
          
        if (error) {
          console.error('Error inserting leads:', error);
          return { success: false, error };
        }
        
        inserted += batch.length;
        if (data) {
          createdLeads.push(...data);
        }
        
        console.log(`${inserted} of ${count} leads inserted`);
      }
      
      console.log('All leads inserted successfully!');
      
      // Generate sales data
      console.log('Generating sales data...');
      const salesData = generateSales(createdLeads);
      
      // Insert sales data
      if (salesData.length > 0) {
        console.log(`Inserting ${salesData.length} sales records...`);
        
        for (let i = 0; i < salesData.length; i += batchSize) {
          const batch = salesData.slice(i, i + batchSize);
          
          const { error } = await supabase
            .from('sales' as any)
            .insert(batch);
            
          if (error) {
            console.error('Error inserting sales:', error);
          }
        }
        
        console.log('Sales data inserted successfully!');
      }
      
      // Generate activities data
      console.log('Generating activities data...');
      const activitiesData = generateActivities(createdLeads);
      
      // Insert activities data
      if (activitiesData.length > 0) {
        console.log(`Inserting ${activitiesData.length} activity records...`);
        
        for (let i = 0; i < activitiesData.length; i += batchSize) {
          const batch = activitiesData.slice(i, i + batchSize);
          
          const { error } = await supabase
            .from('activities')
            .insert(batch);
            
          if (error) {
            console.error('Error inserting activities:', error);
          }
        }
        
        console.log('Activities data inserted successfully!');
      }
      
      // Get current user ID
      const { data: authData } = await supabase.auth.getSession();
      const userId = authData?.session?.user?.id;
      
      // Generate notifications data if we have a user ID
      if (userId) {
        console.log('Generating notifications data...');
        const notificationsData = generateNotifications(createdLeads);
        
        // Update all notifications with the current user ID
        const notificationsWithUserId = notificationsData.map(notification => ({
          ...notification,
          user_id: userId
        }));
        
        // Insert notifications data
        if (notificationsWithUserId.length > 0) {
          console.log(`Inserting ${notificationsWithUserId.length} notification records...`);
          
          for (let i = 0; i < notificationsWithUserId.length; i += batchSize) {
            const batch = notificationsWithUserId.slice(i, i + batchSize);
            
            const { error } = await supabase
              .from('notifications' as any)
              .insert(batch);
              
            if (error) {
              console.error('Error inserting notifications:', error);
            }
          }
          
          console.log('Notifications data inserted successfully!');
        }
      }
      
      return { 
        success: true, 
        message: `Successfully seeded database with ${count} leads, ${salesData.length} sales records, ${activitiesData.length} activities, and ${userId ? 'notifications' : 'no notifications (user not logged in)'}` 
      };
    } catch (error) {
      console.error('Error in seed service:', error);
      return { success: false, error };
    }
  },
  
  async truncateLeads() {
    try {
      // Delete all records from dependent tables first
      
      // Delete sales records
      const { error: salesError } = await supabase
        .from('sales' as any)
        .delete()
        .neq('lead_id', 'dummy'); // This will delete all records
        
      if (salesError) {
        console.error('Error deleting sales records:', salesError);
        return { success: false, error: salesError };
      }
      
      // Delete activities
      const { error: activitiesError } = await supabase
        .from('activities')
        .delete()
        .neq('lead_id', 'dummy'); // This will delete all records
        
      if (activitiesError) {
        console.error('Error deleting activity records:', activitiesError);
        return { success: false, error: activitiesError };
      }
      
      // Delete notifications
      const { error: notificationsError } = await supabase
        .from('notifications' as any)
        .delete()
        .neq('lead_id', 'dummy'); // This will delete all records
        
      if (notificationsError) {
        console.error('Error deleting notification records:', notificationsError);
        return { success: false, error: notificationsError };
      }
      
      // Finally delete leads
      const { error } = await supabase
        .from('leads')
        .delete()
        .neq('id', 'dummy'); // This will delete all records
        
      if (error) {
        console.error('Error deleting lead records:', error);
        return { success: false, error };
      }
      
      return { success: true, message: 'All leads and related data deleted successfully' };
    } catch (error) {
      console.error('Error in truncate service:', error);
      return { success: false, error };
    }
  }
};
