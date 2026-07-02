const fs = require('fs');
const path = require('path');

const searchDir = path.join(__dirname, 'src', 'assets', 'data', 'search');
const profilesDir = path.join(__dirname, 'src', 'assets', 'data', 'profiles');

const searchFiles = fs.readdirSync(searchDir).filter(f => f.endsWith('.json'));
const profileFiles = fs.readdirSync(profilesDir).filter(f => f.endsWith('.json'));

const profileDataCache = {};
for (const pFile of profileFiles) {
  const pPath = path.join(profilesDir, pFile);
  const data = JSON.parse(fs.readFileSync(pPath, 'utf8'));
  profileDataCache[pFile.toLowerCase()] = data;
}

for (const searchFile of searchFiles) {
  const sPath = path.join(searchDir, searchFile);
  const data = JSON.parse(fs.readFileSync(sPath, 'utf8'));
  
  if (data.accounts) {
    for (const item of data.accounts) {
      if (item.account && item.account.user_profile) {
        const username = item.account.user_profile.username || item.account.user_profile.user_id || "";
        const profileFileKey = `${username.toLowerCase()}.json`;
        
        let latestPostImage = null;
        
        if (profileDataCache[profileFileKey]) {
           const pData = profileDataCache[profileFileKey];
           const posts = pData.data?.user_profile?.recent_posts || pData.data?.user_profile?.recent_reels || [];
           if (posts.length > 0) {
             const latest = posts[0];
             // Try to get thumbnail or fallback
             latestPostImage = latest.thumbnail || latest.video_cover || latest.user_picture;
           }
        }
        
        if (latestPostImage) {
          item.account.user_profile.latest_post_image = latestPostImage;
        } else {
          // If no specific post image, fallback to profile picture
          item.account.user_profile.latest_post_image = item.account.user_profile.picture;
        }
      }
    }
    fs.writeFileSync(sPath, JSON.stringify(data, null, 4));
    console.log(`Updated ${searchFile}`);
  }
}
