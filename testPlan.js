import { databases } from './lib/appwrite';

async function createPlan() {
  const response = await databases.createDocument(
    'main-db',       // database ID
    'study_plans',   // table/collection ID
    'unique()',      // document ID
    {
      planName: 'My Hackathon Plan',
      description: 'Monday: Math, Tuesday: Physics'
    }
  );

  console.log('Plan created:', response);
}

// Call the function directly to test
createPlan();
