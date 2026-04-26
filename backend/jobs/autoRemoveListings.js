const cron = require("node-cron");
const MarketplaceListing = require("../models/MarketplaceListing");
const ListingImage = require("../models/ListingImage");
const fs = require("fs");
const path = require("path");

// Schedule a job to run every day at midnight (0 0 * * *)
cron.schedule("0 0 * * *", async () => {
  try {
    console.log("Running auto-remove listings job...");

    // 1. Find all active listings older than 20 days
    const twentyDaysAgo = new Date();
    twentyDaysAgo.setDate(twentyDaysAgo.getDate() - 20);

    const oldListings = await MarketplaceListing.find({
      status: "active",
      createdAt: { $lt: twentyDaysAgo },
    });

    if (oldListings.length === 0) {
      console.log("No old listings to remove.");
      return;
    }

    let removedCount = 0;

    for (const listing of oldListings) {
      // 2. Find all images related to this listing
      const images = await ListingImage.find({ listingId: listing._id });

      // 3. Delete actual image files
      images.forEach((img) => {
        const fileName = img.url.split("/").pop();
        const filePath = path.join(
          __dirname,
          "../uploads/marketplace",
          fileName
        );
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      });

      // 4. Delete ListingImage documents and the Listing itself
      await ListingImage.deleteMany({ listingId: listing._id });
      await MarketplaceListing.findByIdAndDelete(listing._id);

      removedCount++;
    }

    console.log(`Auto-removed ${removedCount} listings older than 20 days.`);
  } catch (error) {
    console.error("Error in auto-remove listings job:", error);
  }
});
