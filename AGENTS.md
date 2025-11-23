# AGENTS.md

This document defines how **AI agents** (Codex, `/plan` assistants, Copilot Chat, etc.) MUST operate inside this repository.

Agents must safely modify and evolve this **React Native + Expo** finance application **without breaking**:

- SQLite architecture  
- Transaction engine  
- Recurring-transaction pipeline  
- Context system  
- React hook order  
- i18n + theming  
- Expo Router navigation  

**These rules are strict and non-negotiable.**

---

# 1. Project Overview

This is a **TypeScript**, **Expo Router**, **SQLite-based** **personal-finance application** featuring:

## Business logic
- Single transactions  
- Recurring transactions (RRULE-driven)  
- Credit-card flows (single, recurring, installment)  
- Monthly and category summaries  

## State management
- React Context (`NewTransactionContext`, `StyleContext`, etc.)  
- Zustand stores (summary, category distribution, etc.)

## UI system
- iOS-inspired grouped lists, tiles, blur modals  
- Custom icons (`AppIcon`, SF Symbols, Material Icons, Ionicons)  
- Theme system (light/dark) via custom hooks (`useStyle`)

## Localization
- `react-i18next`

## Database
- SQLite with typed wrappers  
  - `getFirstAsync`
  - `getAllAsync`  
  - recurring helpers  
  - installment engine

---

# 2. Global Rules for All Agents

## 2.1. NEVER Break React Hook Order
This is a top-level invariant.

You MUST NOT:
- Move hooks across conditions  
- Wrap hooks in `if`, `switch`, loops, or `try/catch`  
- Insert early `return` before the hook block  
- Modify dependency arrays unless fixing a confirmed bug

---

## 2.2. Respect Business Logic Boundaries

### RRULE-based recurrence
- DB stores: `date_start: string` , `rrule: string`  
- RRULE library expects combined objects  
- RRULE outputs strings → must be split again for DB storage  

This pipeline is **fragile**. Modify only if explicitly requested.

### Installments pipeline
- Installments generate a recurrence  
- Custom validation rules  
- Modify only if explicitly requested  

---

## 2.3. Deprecated Files
Agents MUST NOT reference or reuse any logic from these:
- `src/components/styles/CategorySelectionStyles.tsx`
- `src/components/styles/FontStyles.tsx`
- `src/components/styles/ScreenStyles.tsx`
- `src/components/styles/TextStyles.ts`
- `src/context/HeaderConfigContext.tsx`
- `src/hooks/usePlanningScreenCopy.ts`
- `src/hooks/useRecurringCreditLimitNotification.ts`
- `src/stores/useCreditNotificationStore.ts`

---

# 3. Architecture Model for Agents

## 3.1. UI/UX Agent
Focuses on screens, components, layouts, usability.

### Instructions
- Do not duplicate information in a single screen  
- When showing charts/graphics, also show numeric values  
- Avoid nested ScrollViews / FlatLists  
- Use grouped lists for:
  - forms (`modalAdd.tsx`)
  - menu-like screens (`settings.tsx`)
- Use lists for:
  - DB-driven data (transactions)
  - periodic data  
- Use custom components for unique visual blocks 
- Integrate theme via `useStyle`  
- Avoid borders unless necessary  

### Constraints
- MUST NOT break Expo Router navigation
- New screens MUST follow routing conventions

---

## 3.2. Database Agent (SQLite)

### Instructions
- Write SQL ONLY inside repository files
- NEVER put business logic inside a repository
- If a nullable variable is essential, require it explicitly as an argument
- Repositories MUST be independent; do not chain repository functions
- When writing new repo functions:
    - check existing documentation
    - if none exists, write documentation
- Dates:
    - ALWAYS stored in UTC
    - ALWAYS stored as `YYYY-MM-DDTHH:MM`

### Constraints
- NEVER bypass the DB abstraction layer
- NEVER write raw SQL outside repositories
- Schema changes:
    - Do NOT create migrations
    - Update TS types only
    - Assume database resets during development

---

## 3.3. Transactions & Logic Agent
Handles the entire multi-step transaction creation process.

### NewTransactionContext rules
- Must handle:
    - single transactions
    - recurring
    - credit card (single, recurring, installment)
- Performs lightweight validation for UI state
- Supplies data to modules that insert transactions into DB

### Modules
- Perform validation, generation, syncing
- Use repository functions only
- Refresh Zustand stores when required
- Accessed via `useDatabase.ts`

### Instructions
- Avoid adding internal helper clutter → move pure helpers to utils
- Dates from/to DB are UTC (`YYYY-MM-DDTHH:MM`)
- Some logic uses local dates:
    - e.g., syncing recurring transactions until local end-of-day
- RRULE works in UTC only
    - convert local deadlines → UTC when querying occurrences

### Constraints
- NEVER write SQL inside modules

---

## 3.5. Documentation Agent
Used for explanations, README, AGENTS.md, comments.

### Guidelines
- Short and scoped
- Avoid hallucinations
- When helpful, reference files / contexts

---

# 4. `/plan` Workflow

## 4.1. Step 1 — Produce a Structured Plan
Include:
- Target files
- List of modifications
- Risks (hook order, recurring logic, DB effects)
- Testing/verification steps

## 4.2. Step 2 — Apply Changes Incrementally
- Modify ONLY listed files  
- For screens: edit **below** the hook block whenever possible  

## 4.3. Never switch to “QA mode”
Always return:
- actionable diffs  
- proper code blocks  
- specific edits  

---

# 5. Agent Personas

## 5.1. ARCHITECT Agent
For reorganizing code and structure.

### Rules:
- Maintain architectural stability
- Warn user before cross-cutting refactors
- Never break UI/Theming/Transaction flows

## 5.2. DATA Agent
For database work.

### Rules:
- Uses exported DB APIs only  
- Does NOT modify DB helpers unless asked  
- Ensures TS types match DB shape  

## 5.3. UI Agent
For screens and components.

### Rules:
- Respects theme + layout patterns  
- Uses grouped lists where appropriate
- Preserve segmented-control patterns

## 5.4. REFACTOR Agent
For cleanup and modularization.

### Rules:
- No behavior changes unless requested
- One subsystem at a time
- Warn if hook order is at risk

## 5.5. DOCS Agent
For comments, explanations, README, architecture docs.  

---

# 6. Critical Fragile Areas (⚠️)
Agents MUST be extremely careful when touching:
1. React hook order (contexts, screens)
2. NewTransactionContext + recurrence logic
3. Installment transaction creation
4. RRULE recurrence engine
5. Summary store refresh triggers
6. Database abstraction layer (repositories only)

---

# 7. Safe Modifications Allowed
Agents _may_:
- Extract helper functions to utils
- Create reusable UI components
- Improve naming or TypeScript typings
- Add JSDoc or comments
- Simplify conditions without altering behavior
- Create new screens following Expo Router patterns

---

# 8. Prohibited Autonomous Actions
(Unless explicitly requested by the user)
- DB schema changes
- Editing core transaction logic
- Modifying recurring/ installment pipelines
- Creating new React Contexts
- Removing i18n keys
- Changing theme/layout structure
- Altering navigation structure
- Renaming foundational types/interfaces

---

# 9. Example Prompts Agents Should Handle Well

**Architecture**  
> Split my database hook into domain-based modules.

**UI**  
> Improve spacing in modalAdd.

**Logic**  
> Add a validation step before saving recurring transactions.

**Database**  
> Create a helper to fetch transactions between two dates.

---

# 10. Final Rule

When in doubt:  
**Ask for clarification — or choose the safest possible option.**  

Never assume architectural changes unless explicitly stated.
