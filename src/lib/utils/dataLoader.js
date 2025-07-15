/**
 * Data loading utilities with error handling for portfolio JSON files
 */

/**
 * Generic function to load JSON data with error handling
 * @param {string} url - The URL/path to the JSON file
 * @param {string} dataType - Type of data being loaded (for error messages)
 * @returns {Promise<any>} - Parsed JSON data or default fallback
 */
async function loadJsonData(url, dataType) {
  try {
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    console.log(`✅ Successfully loaded ${dataType} data`);
    return data;
  } catch (error) {
    console.error(`❌ Error loading ${dataType} data:`, error);
    return getDefaultData(dataType);
  }
}

/**
 * Provides default fallback data when JSON loading fails
 * @param {string} dataType - Type of data to provide defaults for
 * @returns {object} - Default data structure
 */
function getDefaultData(dataType) {
  const defaults = {
    companies: {
      companies: [
        {
          name: "Loading...",
          logo: "/assets/placeholder.png",
          url: "#",
          alt: "Loading company data"
        }
      ]
    },
    projects: {
      projects: [
        {
          name: "Loading Projects...",
          description: "Project data is currently loading",
          technologies: ["Loading..."],
          githubUrl: "#",
          featured: false,
          image: "/assets/placeholder.png"
        }
      ]
    },
    skills: {
      categories: [
        {
          name: "Loading...",
          skills: ["Loading skills data..."]
        }
      ]
    },
    licenses: {
      certifications: [
        {
          title: "Loading Certifications...",
          institution: "Loading...",
          description: "Certification data is currently loading",
          url: "#",
          issueDate: "Loading...",
          logo: "/assets/placeholder.png"
        }
      ]
    }
  };
  
  return defaults[dataType] || {};
}

/**
 * Load companies data
 * @returns {Promise<object>} - Companies data with error handling
 */
export async function loadCompanies() {
  return await loadJsonData('/src/lib/data/companies.json', 'companies');
}

/**
 * Load projects data
 * @returns {Promise<object>} - Projects data with error handling
 */
export async function loadProjects() {
  return await loadJsonData('/src/lib/data/projects.json', 'projects');
}

/**
 * Load skills data
 * @returns {Promise<object>} - Skills data with error handling
 */
export async function loadSkills() {
  return await loadJsonData('/src/lib/data/skills.json', 'skills');
}

/**
 * Load licenses/certifications data
 * @returns {Promise<object>} - Licenses data with error handling
 */
export async function loadLicenses() {
  return await loadJsonData('/src/lib/data/licenses.json', 'licenses');
}

/**
 * Load all data concurrently with individual error handling
 * @returns {Promise<object>} - Object containing all loaded data
 */
export async function loadAllData() {
  console.log('🔄 Loading all portfolio data...');
  
  try {
    const [companies, projects, skills, licenses] = await Promise.allSettled([
      loadCompanies(),
      loadProjects(),
      loadSkills(),
      loadLicenses()
    ]);
    
    const result = {
      companies: companies.status === 'fulfilled' ? companies.value : getDefaultData('companies'),
      projects: projects.status === 'fulfilled' ? projects.value : getDefaultData('projects'),
      skills: skills.status === 'fulfilled' ? skills.value : getDefaultData('skills'),
      licenses: licenses.status === 'fulfilled' ? licenses.value : getDefaultData('licenses')
    };
    
    console.log('✅ All portfolio data loaded successfully');
    return result;
  } catch (error) {
    console.error('❌ Error loading portfolio data:', error);
    return {
      companies: getDefaultData('companies'),
      projects: getDefaultData('projects'),
      skills: getDefaultData('skills'),
      licenses: getDefaultData('licenses')
    };
  }
}

/**
 * Validate data structure to ensure required fields are present
 * @param {object} data - Data to validate
 * @param {string} type - Type of data being validated
 * @returns {boolean} - Whether data is valid
 */
export function validateData(data, type) {
  if (!data || typeof data !== 'object') {
    console.warn(`⚠️ Invalid ${type} data structure`);
    return false;
  }
  
  const validators = {
    companies: (data) => Array.isArray(data.companies) && data.companies.length > 0,
    projects: (data) => Array.isArray(data.projects) && data.projects.length > 0,
    skills: (data) => Array.isArray(data.categories) && data.categories.length > 0,
    licenses: (data) => Array.isArray(data.certifications) && data.certifications.length > 0
  };
  
  const isValid = validators[type] ? validators[type](data) : false;
  
  if (!isValid) {
    console.warn(`⚠️ ${type} data failed validation`);
  }
  
  return isValid;
}

/**
 * Filter skills based on search term
 * @param {object} skillsData - Skills data object
 * @param {string} searchTerm - Search term to filter by
 * @returns {object} - Filtered skills data
 */
export function filterSkills(skillsData, searchTerm) {
  if (!searchTerm || !skillsData?.categories) {
    return skillsData;
  }
  
  const filteredCategories = skillsData.categories
    .map(category => ({
      ...category,
      skills: category.skills.filter(skill => 
        skill.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }))
    .filter(category => category.skills.length > 0);
  
  return {
    ...skillsData,
    categories: filteredCategories
  };
}

/**
 * Get featured projects only
 * @param {object} projectsData - Projects data object
 * @returns {array} - Array of featured projects
 */
export function getFeaturedProjects(projectsData) {
  if (!projectsData?.projects) {
    return [];
  }
  
  return projectsData.projects.filter(project => project.featured === true);
}