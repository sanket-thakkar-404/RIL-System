# RIL System — Backend Senior Masterclass

If we were sitting down for a 1-on-1 code review, this is exactly what I would tell you. You have successfully built a working API—which is a huge achievement. However, building an API that *works* on your local machine is entirely different from building an API that scales to thousands of users, survives server crashes, and is easy to maintain.

Here is a pure backend critique detailing the common beginner mistakes you made, how to fix your code quality, and the "senior-level" concepts (like load balancing and queuing) that are currently missing.

---

## 1. Folder Structure & Separation of Concerns

You used the classic MVC/Service pattern (`routes` → `controllers` → `services`). This is the correct pattern to start with, but you violated some of its rules.

### The Mistake: The "God Function" (Fat Services)
Look at `updateStatusLogic` inside `issue.service.js`. When a request is marked as "RECEIVED", this single function:
1. Validates the status.
2. Queries MongoDB.
3. Updates MongoDB.
4. Makes a network call to Google Sheets to deduct stock.
5. Makes another network call to append a row to Google Sheets.
6. Makes a third network call to an SMTP server (Gmail) to send an email.

**Why this is a beginner mistake:** 
If the Gmail server takes 5 seconds to respond, the user is staring at a loading spinner for 5 seconds. If the Gmail server crashes, your function throws an error, the frontend gets a `500 Internal Server Error`, but **the database and Google Sheets were already updated!** Your data is now corrupted because the operation partially succeeded.

### The Senior Approach: Event-Driven Architecture & Dependency Injection
A service should only handle *core business logic*. 
1. **Event Emitters:** When the DB updates, the service should just emit an event: `eventEmitter.emit('ISSUE_RECEIVED', issueData)`. Another dedicated file listens for that event and handles the email asynchronously in the background. The user gets their HTTP `200 OK` response instantly.
2. **Dependency Injection:** Right now, `issue.service.js` directly imports `googleSheet.service.js`. If you want to write an automated test for `issue.service`, it will literally edit your real Google Sheet. You should pass the sheet service as a parameter so it can be mocked during testing.

---

## 2. Scalability & Load Balancing (The Missing Pieces)

When an app gets popular, you can't run it on one server. You put a Load Balancer (like AWS ALB or NGINX) in front of 3, 5, or 10 Node.js servers. Your current architecture will break in a multi-server environment.

### The Mistake: In-Memory Caching (`node-cache`)
In `inventory.service.js`, you use `node-cache` to store the Google Sheets data for 10 minutes.
**Why it fails at scale:** If you have 3 servers behind a load balancer, Server A caches the inventory. But the next user request is routed to Server B. Server B's local memory is empty, so it hits the Google Sheets API again. You are defeating the purpose of the cache and risking rate limits.

### The Senior Approach: Distributed Caching (Redis)
Instead of storing data in the Node.js process memory, you connect all 3 servers to a single Redis instance. When Server A fetches from Google Sheets, it saves to Redis. When Server B gets a request, it checks Redis and finds the data instantly.

---

## 3. Reliability & Fault Tolerance

### The Mistake: Synchronous Third-Party API Calls
You are waiting for Google Sheets and Nodemailer to finish before calling `res.send()`.
**Why it's bad:** External APIs are out of your control. They throttle, they timeout, and they go down.

### The Senior Approach: Background Job Queues (BullMQ / RabbitMQ)
When the admin clicks "Approve", the controller should update MongoDB, put a "Send Email" job into a queue (like Redis-backed BullMQ), and immediately respond `200 OK`. A separate background worker process picks up the job and tries to send the email. If Gmail is down, the worker will automatically retry 5 times with exponential backoff. The main API is never blocked.

### The Senior Approach: Graceful Shutdown
Look at `server.js`. When you stop the server (Ctrl+C) or when AWS restarts your server, the Node process dies instantly. If a Google Sheet update was halfway done, it is lost forever.
A senior developer adds a `SIGTERM` listener:
```javascript
process.on('SIGTERM', () => {
  console.log('Shutting down gently...');
  server.close(() => {
    mongoose.connection.close(); // Finish DB operations safely
    process.exit(0);
  });
});
```

---

## 4. Code Quality & Common Developer Mistakes

### 1. Magic Strings
You have the strings `"APPROVED"`, `"RECEIVED"`, and `"UNDER_REVIEW"` typed manually across different files. 
**The Fix:** Create a `constants/status.js` file:
```javascript
export const ISSUE_STATUS = {
  UNDER_REVIEW: 'UNDER_REVIEW',
  APPROVED: 'APPROVED',
  RECEIVED: 'RECEIVED',
};
```
If you ever want to change "UNDER_REVIEW" to "PENDING", you only change it in one place.

### 2. The "Find All" Trap
In `issue.controller.js`, `getIssueLogic()` runs `issueModel.find()`. 
Every single beginner does this. It works perfectly when you have 50 rows. When the company has 500,000 material requests, this single line of code will consume all the RAM on your server and crash it (Out of Memory). 
**The Fix:** **Always** paginate lists on the backend.
```javascript
const page = parseInt(req.query.page, 10) || 1;
const limit = parseInt(req.query.limit, 10) || 20;
const issues = await issueModel.find().skip((page - 1) * limit).limit(limit);
```

### 3. Lack of Database Transactions
When receiving an item, you modify the `Issue` document in MongoDB, and then modify Google Sheets.
If the Google Sheets API fails, your MongoDB document is still saved as "RECEIVED". Your system is now corrupted.
**The Fix:** In a pure MongoDB system, you would use Mongoose Transactions (`session.startTransaction()`). Since you are mixing MongoDB and Google Sheets, you need a "Saga Pattern" or a compensating transaction mechanism (e.g., if Sheets fails, revert the MongoDB status back to "APPROVED").

### 4. Hardcoded Secrets in Business Logic
In `issue.service.js`, you hardcoded `purchase@rotocastgroup.com`. 
**The Fix:** If the store manager quits tomorrow and a new one is hired, a developer has to edit the source code and redeploy the entire application just to change an email address. This should be an environment variable (`STORE_MANAGER_EMAIL`).

---

## 💡 Summary: The "Must Know" Checklist for a Senior Backend Dev

If you want to code like a senior backend engineer, you must constantly ask yourself these 4 questions when writing a function:

1. **What happens if this database gets 1 million rows?** *(Pagination, Indexing)*
2. **What happens if this third-party API takes 30 seconds to respond?** *(Queues, Timeouts, Async processing)*
3. **What happens if this server crashes exactly on line 45?** *(Transactions, Graceful Shutdown, Idempotency)*
4. **If we run 5 copies of this server behind a Load Balancer, does this code still work?** *(Statelessness, Distributed Caching)*

You have the syntax and the framework down perfectly. Your next step is mastering **architecture and reliability**.
