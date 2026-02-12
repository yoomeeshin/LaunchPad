/**
 * This utility script can be used to seed the Firestore database with initial company data.
 * You can run this once to populate your database with sample companies.
 */

import { db } from '@/firebase';
import { collection, doc, setDoc, getDocs, query, where } from 'firebase/firestore';
import topCompanies from './companiesData';

/**
 * Seeds the Firestore database with top companies for autocomplete suggestions
 * @returns {Promise<{success: boolean, count: number, message: string}>} Result of the seeding operation
 */
export async function seedCompanies() {
  console.log('Starting to seed companies collection...');
  
  const result = {
    success: false,
    count: 0,
    message: ''
  };

  try {
    // Check if companies already exist to avoid duplicates
    const companiesCollection = collection(db, 'companies');
    const existingCompaniesSnapshot = await getDocs(companiesCollection);
    
    // If we already have companies data, don't add more
    if (!existingCompaniesSnapshot.empty) {
      const existingCount = existingCompaniesSnapshot.size;
      console.log(`Companies collection already has ${existingCount} documents. Skipping seeding.`);
      result.success = true;
      result.count = existingCount;
      result.message = `Companies collection already populated with ${existingCount} companies.`;
      return result;
    }
    
    // Batch add all companies
    const addedCompanies = [];
    for (const company of topCompanies) {
      try {
        // Use normalized name as document ID for consistent reference
        await setDoc(doc(db, 'companies', company.normalizedName), {
          name: company.name,
          normalizedName: company.normalizedName,
          industry: company.industry || '',
          employeeSize: company.employeeSize || '',
          logoURL: company.logoURL || '',
          createdAt: new Date(),
          updatedAt: new Date()
        });
        
        addedCompanies.push(company.name);
      } catch (error) {
        console.error(`Error adding company ${company.name}:`, error);
      }
    }

    console.log(`Successfully added ${addedCompanies.length} companies to Firestore.`);
    result.success = true;
    result.count = addedCompanies.length;
    result.message = `Added ${addedCompanies.length} companies to database.`;
  } catch (error) {
    console.error('Error seeding companies collection:', error);
    result.success = false;
    result.message = `Error: ${error.message}`;
  }

  return result;
}

/**
 * Searches for companies matching a partial company name
 * @param {string} queryText - The partial company name to search for
 * @returns {Promise<Array>} - Array of matching companies
 */
export async function searchCompanies(queryText) {
  if (!queryText || queryText.length < 2) {
    return [];
  }
  
  const queryLower = queryText.toLowerCase();
  console.log(`Searching for companies matching: ${queryLower}`);
  
  try {
    // First try to find companies where the normalized name starts with the query
    const firestoreQuery = query(
      collection(db, 'companies'),
      where('normalizedName', '>=', queryLower),
      where('normalizedName', '<=', queryLower + '\uf8ff')
    );
    
    const snapshot = await getDocs(firestoreQuery);
    
    // Convert results to a simple array
    const results = [];
    snapshot.forEach(doc => {
      results.push(doc.data());
    });
    
    console.log(`Found ${results.length} matching companies in Firestore`);
    
    // If we found results in Firestore, use them
    if (results.length > 0) {
      sortResults(results, queryLower);
      return results;
    }
    
    // If Firestore search returned no results, try local search
    console.log('No results from Firestore, falling back to local dataset');
    return searchCompaniesLocally(queryLower);
    
  } catch (error) {
    console.error('Error searching companies in Firestore:', error);
    console.log('Falling back to local dataset due to error');
    // Fallback to local search if Firestore fails
    return searchCompaniesLocally(queryLower);
  }
}

/**
 * Helper function to sort search results by relevance
 */
function sortResults(results, queryLower) {
  // Sort results by closest match
  results.sort((a, b) => {
    // Exact matches first
    if (a.normalizedName === queryLower) return -1;
    if (b.normalizedName === queryLower) return 1;
    
    // Then starts with
    if (a.normalizedName.startsWith(queryLower) && !b.normalizedName.startsWith(queryLower)) return -1;
    if (!a.normalizedName.startsWith(queryLower) && b.normalizedName.startsWith(queryLower)) return 1;
    
    // Then alphabetical
    return a.name.localeCompare(b.name);
  });
}

/**
 * Searches for companies in the local dataset (fallback)
 * @param {string} queryLower - The lowercase query to search for
 * @returns {Array} - Array of matching companies
 */
function searchCompaniesLocally(queryLower) {
  console.log(`Searching local dataset for: ${queryLower}`);
  
  // Filter companies that match the query
  const results = topCompanies
    .filter(company => {
      return company.normalizedName.includes(queryLower) || 
             company.name.toLowerCase().includes(queryLower) || 
             (company.industry && company.industry.toLowerCase().includes(queryLower));
    })
    .map(company => ({
      ...company,
      // Add these fields to match Firestore document structure
      createdAt: new Date(),
      updatedAt: new Date()
    }));
  
  console.log(`Found ${results.length} matching companies in local dataset`, results);
  
  // Sort results by relevance
  sortResults(results, queryLower);
  return results;
}

export default {
  seedCompanies,
  searchCompanies
};

/**
 * Call this function from a component or browser console to seed the database
 * Example usage in browser console:
 * 
 * import { seedCompanies } from './utils/seedCompanies.js'
 * seedCompanies()
 */ 