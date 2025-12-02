import { BlogPostData } from '@/components/features/types/blogPost';

export const eventStormsTmsData: BlogPostData = {
  id: '8',
  slug: 'event-storms-tms',
  title: 'Event Storms Over Journey Maps and Why It Worked',
  excerpt:'Journey maps are useful, but they break down quickly inside complex enterprise systems. Event storms helped us uncover system behavior, team misalignment, and hidden dependencies that traditional UX tools could not surface.',
  category: 'UX Insight',
  tags: ['UX Research', 'Event Storming', 'Enterprise UX', 'TMS', 'Workflow Design'],
  image: 'event-storms-tms.jpg',
  date: '2025-12-10',
  readTime: '9 min read',
  featured: true,
  content: `# Event Storms Over Journey Maps: Why It Worked for the TMS Redesign

There is a point in enterprise UX where traditional tools—journey maps, personas, service maps—stop revealing what you need. This happened early in the Transportation Management System (TMS) redesign. The workflows were too fragmented, too dependent on internal rules, and too distributed across teams for a linear journey map to give us the clarity we needed.

Event storming solved that problem.

Unlike journey maps, which describe what a user *experiences*, event storms expose what the *system* is doing and why. When your goal is to modernize a legacy platform touching operations, billing, dispatch, compliance, and customer service, understanding system behavior becomes more important than user emotions alone.

## Why Journey Maps Fell Short

Traditional journey mapping broke down for a few reasons:

- **Workflows weren't linear.** A load could move forward, backward, or stall indefinitely. A journey map forced us to flatten this complexity.
- **Multiple personas touched the same object.** The load was touched by four teams, all with different goals.
- **System rules mattered more than user intention.** In a TMS, a user’s “step 3” often depended on how the system interpreted data from step 1.

A journey map oversimplified the story. The result was a great storyboard but not a tool that explained the system's logic.

## Why Event Storming Worked

Event storming unlocked alignment by allowing us to focus on **events instead of steps**.  
This meant we mapped:

- System events  
- User actions  
- Commands  
- Policies  
- Data objects  
- Downstream effects  

A journey map shows what happens to a person.  
An event storm shows what happens to the *business*.

The shift changed everything.

### 1. It exposed hidden dependencies
During the first storm session, two separate teams realized they were both modifying the same “Load Status” object with conflicting rules. That conflict had been causing years of operational pain.

### 2. It surfaced domain concepts the business never defined
We identified 14 domain objects that were being used inconsistently across teams.  
(Example: "Exception" had three different definitions depending on which department you asked.)

### 3. It revealed where automation should exist
Mapping events showed us:

- which steps were mandatory  
- which steps were repetitive  
- which steps were system-correctable  

We found 18 steps across the workflow that could be automated or simplified.

### 4. It aligned business, engineering, and UX in the same room
Event storming forced everyone to see the same truth instead of debating interpretations.

> **“This is the first time I’ve seen how our work actually flows across teams.”**  
> — Operations Supervisor (TMS Stakeholder)

That alignment alone justified replacing journey maps for this project.

---

## Before vs After: Impact Summary

| Area | Before Event Storms | After Event Storms |
|------|---------------------|--------------------|
| Cross-team alignment | 4 teams, 3 competing definitions of core workflow | Shared domain language + unified process |
| Workflow length | 27 steps across 4 tools | Reduced to 14 steps, consolidated into one tool |
| Exception handling | 9 manual checks | 4 automated checks, 2 removed entirely |
| User efficiency | High cognitive load, scattered navigation | 50 percent+ workload reduction through streamlined flow and decision logic |
| Engineering effort | Unclear requirements | Clear event, command, and policy model to build against |

---

## Anonymized Artifact Examples

Below are redacted artifacts recreated for the blog but true to the original structure.

### Example: Event Storm Fragment

**Events Identified:**
- Load Created  
- Rate Assigned  
- Tender Offer Sent  
- Carrier Acceptance Received  
- Exception Triggered  
- Load Rejected  
- Load Reassigned  
- Documentation Confirmed  

**Commands Mapped:**
- Assign Carrier  
- Override Exception  
- Request Documentation  
- Resend Tender  

**Policies Identified:**
- Auto-reject if carrier does not respond after X hours  
- Auto-trigger compliance review when rate is adjusted  
- Require documentation before “Delivered” status  

These artifacts helped structure the entire redesigned workflow.

---

## Why This Approach Was Perfect for TMS

Enterprise logistics systems are rule-driven, time-sensitive, and heavily dependent on business policies. Journey maps simply can’t express the richness of those relationships.

Event storming gave us:

- A **holistic** view of the load lifecycle  
- A **shared mental model** across teams  
- A **clear technical blueprint** for engineering  
- A **data-driven foundation** for UI decisions  

This is what allowed the team to confidently redesign the TMS and reduce workload by more than half.  
Not because the UI was simpler, but because the underlying workflow finally made sense.

---

## Final Thoughts

Journey maps are still valuable, but they’re not enough for complex enterprise products. When workflows rely on rules, data, events, and cross-team coordination, you need a method that exposes system behavior.

Event storming did exactly that.  
It made the organization see its own processes clearly for the first time, and that clarity powered every major decision in the redesign.

If you’re working in enterprise UX and your journey maps feel incomplete, try an event storm.  
You might uncover the real problem faster than you expect.
`
};
