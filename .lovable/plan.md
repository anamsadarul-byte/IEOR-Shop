

# Inventory Replenishment Optimizer — "IEOR" Shop Dashboard

## Global Branding & Background
- Shop-themed background throughout the entire website with the name **"IEOR"** prominently displayed
- Subtle shop/warehouse illustration or pattern as a background motif across all pages
- "IEOR" logo/text in the header/sidebar as the brand identity
- Professional, clean aesthetic suitable for a business demo

## Login Page
- "IEOR" shop branding front and center with a warehouse/shop visual backdrop
- Email and password fields (hardcoded: `anamsadarul@gmail.com` / `T7`)
- Error message on invalid credentials
- On success → redirect to the Data Upload Wizard

## Data Upload Wizard (Post-Login, Before Dashboard)
A step-by-step guided upload flow — 4 steps in strict order:

1. **Step 1: Upload Forecasted Demand** — Excel file with daily demand forecasts per item over 28 days
2. **Step 2: Upload Current Inventory** — Excel file with opening inventory levels per item
3. **Step 3: Upload Shelf Life of Products** — Excel file with shelf life (in days) per item
4. **Step 4: Upload Delivery Schedule** — Excel file with allowed delivery days per item

- Each step shows a clear title, description, and file upload area
- Progress indicator showing which step the user is on (1 of 4, 2 of 4, etc.)
- "Next" button enabled only after a file is selected
- After all 4 files are uploaded → parse the Excel data and redirect to the Analytics Dashboard

## Analytics Dashboard (5 Pages with Sidebar Navigation)
All analytics are generated dynamically from the uploaded Excel data:

### Page 1: Executive Summary
- KPI Cards: Total Orders, Total Waste, Total Unmet Demand, Service Level %, Leftover Inventory
- Key insights computed from the uploaded data

### Page 2: Order Schedule & Timeline
- Calendar/timeline view of delivery days and order quantities per item
- Color-coded items with filtering
- Summary order table

### Page 3: Inventory Flow Analysis
- Line/area charts showing daily inventory levels per item over the planning horizon
- Visualize: opening inventory → deliveries → demand → expiring stock → closing inventory
- Item selector to drill down

### Page 4: Waste & Shortage Analysis
- Bar charts for expired units and unmet demand per item
- Pie/donut chart for waste vs. fulfilled vs. shortage breakdown
- Per-item service level

### Page 5: Item Details Table
- Sortable data table: item name, shelf life, delivery schedule, total demand, total ordered, waste, shortage, service level
- Expandable rows for daily breakdown

## Design & UX
- "IEOR" shop branding visible on every page (sidebar header, background elements)
- Dark sidebar navigation with logout button
- Fully client-side — Excel files parsed in-browser using a library like SheetJS (xlsx)
- No backend required
- Responsive layout for presentation use

