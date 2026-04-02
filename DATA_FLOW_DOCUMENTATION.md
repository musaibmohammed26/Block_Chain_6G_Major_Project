# 6G Blockchain System - Data Flow & Dynamic Updates Documentation

## 📊 Data Models & Upload Points

### 1. **NODE DATA**
**Model:** `Node`
**Fields:**
- `node_id` (String, Unique) - Node identifier
- `node_type` (Choice) - EDGE, CORE, IOT, USER
- `ip_address` (IP) - Node's IP address
- `location` (String, Optional) - Geographic location
- `hardware_capability` (Integer) - Capability score (1-10)
- `network_bandwidth` (Float) - BW in Mbps
- `reputation_score` (Float) - Reputation (0-10)
- `status` (Choice) - ACTIVE, INACTIVE, SUSPENDED
- `created_at` (DateTime) - Creation timestamp
- `last_seen` (DateTime) - Auto-updated on node activity

**Upload Endpoints:**
```
POST /api/nodes/join/  - Register new node
POST /api/nodes/join-via-get/  - Alternative registration
PUT /api/nodes/{node_id}/status/ - Update node status
```

**Dynamic Update Locations:**
- ✅ Admin Dashboard → Node statistics
- ✅ Admin Dashboard → Nodes table (Recently Active)
- ✅ User Dashboard → Network Overview section
- ✅ Nodes page → Main nodes table
- ✅ Real-time WebSocket → Live node status updates

---

### 2. **SHARD DATA**
**Model:** `Shard`
**Fields:**
- `shard_id` (String, Unique) - Shard identifier
- `name` (String) - Shard name
- `service_type` (Choice) - URLLC, EMBB, MIOT, MEC
- `description` (Text, Optional) - Shard description
- `minimum_reputation` (Float) - Min reputation required
- `minimum_capability` (Integer) - Min capability required
- `created_at` (DateTime) - Creation timestamp
- `is_active` (Boolean) - Active/Inactive status

**Upload Endpoints:**
```
POST /api/shards/create/ - Create new shard
GET /api/shards/auto-assign/ - Auto-assign nodes to shards
```

**Dynamic Update Locations:**
- ✅ Admin Dashboard → Shard statistics
- ✅ Admin Dashboard → Total/inactive shards metrics
- ✅ User Dashboard → Active shards count
- ✅ Shards page → Main shards table
- ✅ Node management → Shard memberships

---

### 3. **TRANSACTION DATA**
**Model:** `Transaction`
**Fields:**
- `transaction_hash` (String, Unique) - Transaction ID
- `sender` (ForeignKey→Node) - Source node
- `receiver` (ForeignKey→Node, Optional) - Destination node
- `shard` (ForeignKey→Shard) - Associated shard
- `transaction_type` (Choice) - DATA_SHARE, RESOURCE_ALLOC, SERVICE_REQ, CONSENSUS
- `data_size` (Integer) - Payload size in bytes
- `payload_hash` (String) - Data hash
- `offchain_storage_ref` (String, Optional) - Storage reference
- `status` (Choice) - PENDING, PROCESSING, CONFIRMED, FAILED
- `consensus_rounds` (Integer) - Consensus iterations
- `created_at` (DateTime) - Creation timestamp
- `confirmed_at` (DateTime, Optional) - Confirmation time

**Upload Endpoints:**
```
GET /api/transactions/ - Fetch transaction list (filtered)
POST /api/transactions/create/ - Submit new transaction
PUT /api/transactions/{tx_id}/status/ - Update transaction status
```

**Dynamic Update Locations:**
- ✅ Admin Dashboard → Transaction statistics (pending, confirmed, failed)
- ✅ Admin Dashboard → Recent transactions table
- ✅ Admin Dashboard → Transactions/hour metric
- ✅ User Dashboard → My transactions count
- ✅ User Dashboard → Pending transactions
- ✅ User Dashboard → Recent transactions table
- ✅ Transactions page → Full transactions table
- ✅ Real-time WebSocket → Live transaction status updates

---

### 4. **SHARD MEMBERSHIP DATA**
**Model:** `ShardMembership`
**Fields:**
- `node` (ForeignKey→Node) - Member node
- `shard` (ForeignKey→Shard) - Parent shard
- `role` (Choice) - LEADER, VALIDATOR, OBSERVER
- `joined_at` (DateTime) - Join timestamp
- `reputation_in_shard` (Float) - Shard-specific reputation

**Auto-Linked:**
- ✅ When node status changes
- ✅ When shard requirements change
- ✅ During consensus rounds

**Dynamic Update Locations:**
- ✅ Node management page → Node's shards
- ✅ Shard detail page → Member list
- ✅ Admin alerts → Membership conflicts

---

### 5. **CONSENSUS ROUND DATA**
**Model:** `ConsensusRound`
**Fields:**
- `shard` (ForeignKey→Shard) - Associated shard
- `round_number` (Integer) - Consensus sequence
- `leader` (ForeignKey→Node, Optional) - Round leader
- `start_time` (DateTime) - Round start
- `end_time` (DateTime, Optional) - Round end
- `status` (Choice) - PRE_PREPARE, PREPARE, COMMIT, DECIDED
- `load_factor` (Float) - Network load (0-1)
- `batch_size` (Integer) - Transactions per batch

**Upload Endpoints:**
```
POST /api/consensus/start-round/ - Initiate consensus
GET /api/consensus/active-rounds/ - Get ongoing rounds
GET /api/consensus/history/ - Get completed rounds
```

**Dynamic Update Locations:**
- ✅ Admin Dashboard → Active consensus count
- ✅ Consensus Monitor page → Live consensus rounds
- ✅ Network status → Consensus progress indicator
- ✅ Real-time WebSocket → Live consensus updates

---

### 6. **STORAGE RECORD DATA**
**Model:** `StorageRecord`
**Fields:**
- `transaction` (ForeignKey→Transaction) - Related transaction
- `storage_type` (Choice) - ON_CHAIN, OFF_CHAIN
- `data_hash` (String) - Stored data hash
- `storage_location` (String) - Storage URL/path
- `metadata` (JSON) - Custom metadata
- `timestamp` (DateTime) - Storage time
- `size_bytes` (Integer) - Data size

**Upload Endpoints:**
```
GET /api/storage/statistics/ - Storage metrics
POST /api/storage/record/ - Record storage event
```

**Dynamic Update Locations:**
- ✅ Storage page → Storage utilization metrics
- ✅ Storage page → On-chain vs off-chain breakdown
- ✅ Transaction detail → Storage link
- ✅ Admin Dashboard → Storage status indicator

---

### 7. **REPUTATION HISTORY DATA**
**Model:** `ReputationHistory`
**Fields:**
- `node` (ForeignKey→Node) - Affected node
- `shard` (ForeignKey→Shard, Optional) - Context shard
- `old_score` (Float) - Previous reputation
- `new_score` (Float) - Updated reputation
- `reason` (String) - Change reason
- `timestamp` (DateTime) - Change time

**Auto-triggered by:**
- ✅ Transaction confirmation/failure
- ✅ Consensus participation
- ✅ Node status changes
- ✅ Admin reputation recalculation

**Dynamic Update Locations:**
- ✅ Node detail page → Reputation history
- ✅ Admin Dashboard → Average reputation metric
- ✅ User Dashboard → Profile reputation info
- ✅ Node management → Reputation trends

---

## 🔄 Real-Time Update Mechanisms

### **AJAX Polling (Every 30 seconds)**
```javascript
// File: static/js/main.js
setInterval(updateDashboardStats, 30000);
```
**Updates:**
- Total nodes count
- Active nodes count
- Total shards
- Pending transactions
- Transactions per hour

### **WebSocket Real-Time Updates**
```javascript
// File: static/js/main.js
connectWebSocket(); // ws://localhost/ws/blockchain/
```
**Handles:**
- Live node status changes
- Real-time transaction status updates
- Consensus round progress
- Network metrics updates

### **Template Context Auto-Refresh**

**Admin Dashboard:**
```python
# core/views.py - dashboard() function
# All data is fresh on each page load:
- User management statistics
- Node distribution metrics
- Transaction status breakdown
- Consensus activity
- System alerts
```

**User Dashboard:**
```python
# core/views.py - dashboard() function
# User-specific data refreshed:
- Personal transaction count
- Network overview (read-only)
- Account information
- Network health status
```

---

## 📍 Data Upload Flow Diagram

```
External API / Manual Input
         ↓
    Django Views/API Endpoints
         ↓
    Database Models
         ↓
    ┌─────────────────────────────────────┐
    │   Automatic Processing:              │
    │   - Reputation calculation          │
    │   - Shard auto-assignment           │
    │   - Consensus round coordination    │
    └─────────────────────────────────────┘
         ↓
    ┌─────────────────────────────────────┐
    │   Dashboard/View Context            │
    │   - Dashboard stats API              │
    │   - Nodes API                        │
    │   - Transactions API                 │
    │   - Consensus API                    │
    └─────────────────────────────────────┘
         ↓
    ┌─────────────────────────────────────┐
    │   Frontend Display:                  │
    │   - AJAX polling (30s)              │
    │   - WebSocket real-time            │
    │   - Page template rendering         │
    └─────────────────────────────────────┘
         ↓
    User/Admin Dashboards
    Transaction Pages
    Node Management
    Consensus Monitor
    Storage Management
```

---

## 🎯 Key API Endpoints for Data Updates

### **Node Management**
- `GET /api/nodes/?page=1&per_page=25&type=EDGE&status=ACTIVE&min_reputation=5`
- `POST /api/nodes/join/` (JSON body with node data)
- `PUT /api/nodes/{node_id}/status/` (status update)

### **Transaction Processing**
- `GET /api/transactions/?page=1&per_page=25&status=PENDING&shard=shard-1`
- `POST /api/transactions/create/` (new transaction submission)
- `PUT /api/transactions/{tx_id}/status/` (status update)

### **Consensus Monitoring**
- `POST /api/consensus/start-round/`
- `GET /api/consensus/active-rounds/`
- `GET /api/consensus/history/?shard=shard-1`

### **System Statistics**
- `GET /api/dashboard-stats/` (main metrics)
- `GET /api/storage/statistics/` (storage info)
- `GET /api/reputation/recalculate/` (trigger recalculation)

---

## 📊 Dynamic Update Examples

### **Example 1: New Node Registration**
```
1. External API: POST /api/nodes/join/ with node data
2. Database: Node created with ACTIVE status
3. Auto-Trigger:
   - Shard auto-assignment checks
   - Initial reputation set
   - ShardMembership created
4. Dashboard Updates:
   - Total nodes count (+1)
   - Active nodes count (+1)
   - Recently active nodes table (added)
5. User Interface:
   - AJAX polling captures change in 30 seconds
   - WebSocket notifies instantly
   - Admin Dashboard refreshes
```

### **Example 2: Transaction Status Change**
```
1. External Update: PUT /api/transactions/{tx_id}/status/ → CONFIRMED
2. Database: Transaction status changed, confirmed_at set
3. Auto-Trigger:
   - ReputationHistory created
   - Related node reputation updated
   - Shard metrics recalculated
4. Dashboard Updates:
   - Pending transactions count (-1)
   - Confirmed transactions count (+1)
   - User Dashboard "my pending TX" (-1)
   - Recent transactions table (status updated)
5. User Interface:
   - Admin Dashboard reflects change instantly
   - User Dashboard shows updated status
   - WebSocket notifies all connected users
```

### **Example 3: Node Status Update**
```
1. External Update: PUT /api/nodes/{node_id}/status/ → SUSPENDED
2. Database: Node status changed, last_seen updated
3. Auto-Trigger:
   - ReputationHistory created
   - ShardMembership affected (may remove)
   - Consensus rounds affected
4. Dashboard Updates:
   - Active nodes count (-1)
   - Inactive/Suspended nodes count (+1)
   - Node status badge updated
   - System alerts triggered
5. User Interface:
   - Admin gets notification alert
   - Network overview updated
   - Dashboard metrics refreshed
```

---

## ✨ Synchronization Summary

| Data Type | Upload Frequency | Update Frequency | Sync Method |
|-----------|-----------------|-----------------|-------------|
| Nodes | Per connection | Real-time | AJAX (30s) + WebSocket |
| Transactions | Per submission | Per status change | AJAX (30s) + WebSocket |
| Shards | Per creation | On membership change | Page reload |
| Consensus | Per round | Per round phase | WebSocket (real-time) |
| Reputation | Continuous | Per event | AJAX (30s) |
| Storage | Per record | On availability change | AJAX (30s) |

---

## 🔐 Data Validation Flow

```
Input Data
   ↓
API Endpoint Validation
   ↓
Django Form/Serializer Validation
   ↓
Model Validation (clean method)
   ↓
Database Constraints
   ↓
✅ Saved to Database
   ↓
Backend Processing (auto-calculations)
   ↓
Cache Invalidation
   ↓
✅ Available for Display
```

---

## 📋 Implementation Checklist

- ✅ Node data upload & dynamic display
- ✅ Transaction tracking & status updates
- ✅ Shard management & auto-assignment
- ✅ Consensus round coordination
- ✅ Reputation calculations
- ✅ Real-time WebSocket updates
- ✅ AJAX polling for periodic updates
- ✅ Admin/User role-based data filtering
- ✅ Dynamic dashboard metrics
- ✅ Alert system for critical events
