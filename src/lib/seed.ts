// This script is designed to be run from the command line.
// Usage: `npm run seed-data`

import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { getFirestore, doc, writeBatch } from 'firebase/firestore';
import { v4 as uuidv4 } from 'uuid';
import { firebaseConfig } from '../firebase/config';
import { SEED_DATA } from './seed-data';

// --- Configuration ---
const ADMIN_EMAIL = 'admin@example.com';
const ADMIN_PASSWORD = 'password';

async function seedDatabase() {
    console.log("--- Starting Firebase Seed Script ---");

    // 1. Initialize Firebase App
    const firebaseApp = initializeApp(firebaseConfig);
    const auth = getAuth(firebaseApp);
    const firestore = getFirestore(firebaseApp);
    
    console.log("Firebase App initialized.");

    try {
        // 2. Authenticate as the admin user
        console.log(`Attempting to sign in as ${ADMIN_EMAIL}...`);
        const userCredential = await signInWithEmailAndPassword(auth, ADMIN_EMAIL, ADMIN_PASSWORD);
        const user = userCredential.user;
        console.log(`Successfully signed in as user: ${user.uid}`);

        // 3. Prepare the batch write
        const batch = writeBatch(firestore);
        console.log("Preparing data batch...");

        // Seed User Profile
        const userProfileRef = doc(firestore, `users/${user.uid}`);
        batch.set(userProfileRef, { ...SEED_DATA.userProfile, id: user.uid, email: user.email });

        // Seed Tags and get their IDs
        const tagMap = new Map<string, string>();
        SEED_DATA.tags.forEach(tagName => {
            const tagId = uuidv4();
            tagMap.set(tagName, tagId);
            const tagRef = doc(firestore, `tags/${tagId}`);
            batch.set(tagRef, { id: tagId, name: tagName });
        });

        // Seed Projects
        SEED_DATA.projects.forEach(project => {
            const projectId = uuidv4();
            const projectRef = doc(firestore, `users/${user.uid}/projects/${projectId}`);
            const tagIds = project.tags.map(tagName => tagMap.get(tagName)).filter(Boolean) as string[];
            batch.set(projectRef, { ...project, id: projectId, userProfileId: user.uid, tagIds });
        });

        // Seed Experiences
        SEED_DATA.experiences.forEach(exp => {
            const expId = uuidv4();
            const expRef = doc(firestore, `users/${user.uid}/experiences/${expId}`);
            batch.set(expRef, { ...exp, id: expId, userProfileId: user.uid });
        });

        // Seed Education
        SEED_DATA.educations.forEach(edu => {
            const eduId = uuidv4();
            const eduRef = doc(firestore, `users/${user.uid}/educations/${eduId}`);
            batch.set(eduRef, { ...edu, id: eduId, userProfileId: user.uid });
        });
        
        // Seed Skills
        SEED_DATA.skills.forEach(skill => {
            const skillId = uuidv4();
            const skillRef = doc(firestore, `users/${user.uid}/skills/${skillId}`);
            batch.set(skillRef, { ...skill, id: skillId, userProfileId: user.uid });
        });

        console.log("Data batch is ready. Committing to Firestore...");

        // 4. Commit the batch
        await batch.commit();
        console.log("✅ Success! Database has been seeded.");

    } catch (error) {
        console.error("❌ Error seeding database:", error);
        if (error instanceof Error) {
            console.error("Error message:", error.message);
        }
        process.exit(1); // Exit with an error code
    } finally {
        // 5. Sign out and clean up
        await signOut(auth);
        console.log("Signed out admin user.");
        console.log("--- Firebase Seed Script Finished ---");
        // In Node.js, the script will automatically exit, but you can be explicit if needed.
        process.exit(0);
    }
}

// Run the seed function
seedDatabase();
