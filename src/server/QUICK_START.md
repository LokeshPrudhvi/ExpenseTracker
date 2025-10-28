# ⚡ Quick Start Guide

## Get Your Backend Running in 5 Minutes!

### Step 1: Install Dependencies (30 seconds)

```bash
cd server
npm install
```

### Step 2: Configure Environment (2 minutes)

The `.env` file is already created. You just need to update it:

#### For Local Development (Easiest):

1. Make sure MongoDB is installed and running on your computer
2. The `.env` file is already configured for local MongoDB!
3. **Generate a secure JWT secret:**

```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

4. Copy the output and replace the `JWT_SECRET` in `/server/.env`

#### For MongoDB Atlas (Cloud - No Local Install Needed):

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free account and cluster (takes 2 minutes)
3. Get your connection string
4. Update these lines in `/server/.env`:

```env
MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
JWT_SECRET=<paste_the_generated_secret_here>
```

### Step 3: Start the Server (10 seconds)

```bash
npm run dev
```

You should see:

```
✅ MongoDB Connected
🚀 Server running on port 5000
```

### Step 4: Test It! (30 seconds)

Open a new terminal and test:

```bash
curl http://localhost:5000/health
```

You should see:
```json
{
  "success": true,
  "message": "Server is running"
}
```

---

## ✅ You're Done!

Your backend is now running! 🎉

### Next Steps:

1. **Start your frontend** (in a new terminal):
   ```bash
   # From project root
   npm run dev
   ```

2. **Test the full app:**
   - Open http://localhost:3000
   - Register a new account
   - Add your monthly income
   - Start tracking expenses!

---

## 🔧 Quick Troubleshooting

### "MongoDB Connection Error"

**Local MongoDB:**
```bash
# Start MongoDB
mongod
```

**MongoDB Atlas:**
- Check your connection string
- Make sure you whitelisted all IPs (0.0.0.0/0)
- Verify username/password

### "Port 5000 already in use"

```bash
# Change port in .env
PORT=5001
```

### "Cannot find module"

```bash
# Reinstall dependencies
rm -rf node_modules
npm install
```

---

## 📖 Full Documentation

For detailed setup, deployment, and API documentation, see:
- [SETUP_INSTRUCTIONS.md](./SETUP_INSTRUCTIONS.md)
- [ENV_SETUP_GUIDE.md](./ENV_SETUP_GUIDE.md)

---

**Happy Coding! 🚀**
