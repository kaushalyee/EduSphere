/**
 * ADMIN SCRIPT: Update Reward Points (RP)
 * 
 * This script atomically increments the rewardPoints in the User model
 * and the balance in the Wallet model for specified users.
 * 
 * Usage: node scripts/admin_add_rp.js
 */

const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const User = require('../models/User');
const Wallet = require('../models/Wallet');
const connectDB = require('../config/db');

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../.env') });

const TARGET_EMAILS = ['test1@mail.com', 'test2@mail.com']; // User emails
const RP_INCREMENT = 30000; // Amount to add

const runUpdate = async () => {
    try {
        await connectDB();
        console.log('--- Starting Atomic RP Update ---');

        const summary = [];

        for (const email of TARGET_EMAILS) {
            const normalizedEmail = email.toLowerCase();
            console.log(`\nProcessing: ${normalizedEmail}`);

            // 1. Find the User
            const user = await User.findOne({ email: normalizedEmail });
            if (!user) {
                console.error(`  ❌ Error: User not found`);
                summary.push({ email, status: 'FAILED', reason: 'User not found' });
                continue;
            }

            // 2. Atomic increment in User model
            await User.updateOne(
                { _id: user._id },
                { $inc: { rewardPoints: RP_INCREMENT } }
            );
            console.log(`  ✅ User.rewardPoints incremented by ${RP_INCREMENT}`);

            // 3. Atomic increment in Wallet model (Primary source for dashboard)
            const walletResult = await Wallet.updateOne(
                { userId: user._id },
                { $inc: { balance: RP_INCREMENT } }
            );

            if (walletResult.matchedCount === 0) {
                // If no wallet exists, create one
                await Wallet.create({
                    userId: user._id,
                    balance: RP_INCREMENT,
                    currency: 'coins'
                });
                console.log(`  ✅ Wallet created with ${RP_INCREMENT} points`);
            } else {
                console.log(`  ✅ Wallet.balance incremented by ${RP_INCREMENT}`);
            }

            summary.push({ email, status: 'SUCCESS' });
        }

        console.log('\n--- Final Summary ---');
        console.table(summary);
        console.log('\nOperation finished. Closing connection...');
        process.exit(0);

    } catch (error) {
        console.error('\n❌ Critical Failure:', error.message);
        process.exit(1);
    }
};

runUpdate();
