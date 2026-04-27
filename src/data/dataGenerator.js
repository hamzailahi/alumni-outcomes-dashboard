// College Scorecard API Key
const API_KEY = '4kW9YoH8KzSi6Ta0U5svTu2LpzPwLEyTeyPV64m6';
const SCORECARD_API = 'https://api.data.gov/ed/collegescorecard/v1/schools';

// School IDs from College Scorecard
const SCHOOL_IDS = {
  harvard: '001987',
  yale: '001426',
  princeton: '002626',
  columbia: '002711',
  upenn: '003378',
  dartmouth: '002740',
  brown: '003096',
  cornell: '002738',
  northwestern: '001855',
  uchicago: '001622',
  stanford: '001305',
  nyu: '002848',
};

const SCHOOL_COORDS = {
  harvard: { lat: 42.3787, lng: -71.1161, city: 'Cambridge', state: 'MA' },
  yale: { lat: 41.3109, lng: -72.9254, city: 'New Haven', state: 'CT' },
  princeton: { lat: 40.3478, lng: -74.6552, city: 'Princeton', state: 'NJ' },
  columbia: { lat: 40.8075, lng: -73.9626, city: 'New York', state: 'NY' },
  upenn: { lat: 39.9526, lng: -75.1652, city: 'Philadelphia', state: 'PA' },
  dartmouth: { lat: 43.7034, lng: -72.2882, city: 'Hanover', state: 'NH' },
  brown: { lat: 41.8268, lng: -71.4029, city: 'Providence', state: 'RI' },
  cornell: { lat: 42.4534, lng: -76.4735, city: 'Ithaca', state: 'NY' },
  northwestern: { lat: 42.0534, lng: -87.6753, city: 'Evanston', state: 'IL' },
  uchicago: { lat: 41.7901, lng: -87.5997, city: 'Chicago', state: 'IL' },
  stanford: { lat: 37.4275, lng: -122.1697, city: 'Stanford', state: 'CA' },
  nyu: { lat: 40.7282, lng: -73.9942, city: 'New York', state: 'NY' },
};

const MAJORS = {
  cs: { name: 'Computer Science', color: '#378ADD' },
  economics: { name: 'Economics', color: '#D85A30' },
  engineering: { name: 'Engineering', color: '#1D9E75' },
  biology: { name: 'Biology', color: '#7F77DD' },
  finance: { name: 'Finance', color: '#F59E0B' },
};

const TOP_CITIES = [
  { name: 'New York', state: 'NY', lat: 40.7128, lng: -74.006 },
  { name: 'San Francisco', state: 'CA', lat: 37.7749, lng: -122.4194 },
  { name: 'Boston', state: 'MA', lat: 42.3601, lng: -71.0589 },
  { name: 'Chicago', state: 'IL', lat: 41.8781, lng: -87.6298 },
  { name: 'Los Angeles', state: 'CA', lat: 34.0522, lng: -118.2437 },
  { name: 'Seattle', state: 'WA', lat: 47.6062, lng: -122.3321 },
  { name: 'Austin', state: 'TX', lat: 30.2672, lng: -97.7431 },
  { name: 'Washington', state: 'DC', lat: 38.8951, lng: -77.0369 },
  { name: 'Philadelphia', state: 'PA', lat: 39.9526, lng: -75.1652 },
  { name: 'Miami', state: 'FL', lat: 25.7617, lng: -80.1918 },
];

const EMPLOYERS_BY_SECTOR = {
  tech: [
    { name: 'Google', salary: 185000 },
    { name: 'Microsoft', salary: 180000 },
    { name: 'Apple', salary: 182000 },
    { name: 'Amazon', salary: 175000 },
    { name: 'Meta', salary: 190000 },
    { name: 'Stripe', salary: 195000 },
    { name: 'Airbnb', salary: 172000 },
    { name: 'Salesforce', salary: 168000 },
  ],
  finance: [
    { name: 'Goldman Sachs', salary: 175000 },
    { name: 'JPMorgan Chase', salary: 172000 },
    { name: 'Morgan Stanley', salary: 170000 },
    { name: 'McKinsey', salary: 165000 },
    { name: 'Bain & Company', salary: 162000 },
    { name: 'Boston Consulting', salary: 160000 },
    { name: 'Two Sigma', salary: 200000 },
    { name: 'Citadel', salary: 185000 },
  ],
  consulting: [
    { name: 'McKinsey', salary: 165000 },
    { name: 'Boston Consulting', salary: 160000 },
    { name: 'Bain & Company', salary: 162000 },
    { name: 'Deloitte', salary: 145000 },
    { name: 'Accenture', salary: 140000 },
  ],
};

// Fetch real earnings data from College Scorecard
async function fetchEarningsData(schoolId) {
  try {
    const response = await fetch(
      `${SCORECARD_API}?id=${schoolId}&_fields=school.name,latest.earnings.10_yrs_after_entry.working_not_enrolled.median_earnings,latest.academics.program_percentage&api_key=${API_KEY}`
    );
    const data = await response.json();
    if (data.results && data.results.length > 0) {
      const school = data.results[0];
      return {
        name: school['school.name'],
        medianEarnings: school['latest.earnings.10_yrs_after_entry.working_not_enrolled.median_earnings'] || 75000,
      };
    }
  } catch (error) {
    console.error(`Error fetching data for school ${schoolId}:`, error);
  }
  return null;
}

// Generate realistic synthetic placement data
function generatePlacementData(schoolKey, schoolName, realEarnings) {
  const baseEarnings = realEarnings || 75000;
  const years = [2022, 2023, 2024];
  const placements = {};

  years.forEach((year) => {
    const majorAlloc = {
      cs: Math.floor(Math.random() * 150) + 80,
      economics: Math.floor(Math.random() * 120) + 60,
      engineering: Math.floor(Math.random() * 140) + 70,
      biology: Math.floor(Math.random() * 80) + 40,
      finance: Math.floor(Math.random() * 100) + 50,
    };

    const totalGraduates = Object.values(majorAlloc).reduce((a, b) => a + b, 0);

    const byCity = TOP_CITIES.map((city) => {
      const count = Math.floor(Math.random() * 60) + 20;
      return {
        ...city,
        count,
        pct: Math.round((count / totalGraduates) * 100),
      };
    });

    const byMajor = {};
    Object.entries(majorAlloc).forEach(([major, count]) => {
      const majorEarnings = baseEarnings * (0.9 + Math.random() * 0.4);
      const sectorMapping = {
        cs: 'tech',
        economics: 'finance',
        engineering: 'tech',
        biology: 'healthcare',
        finance: 'finance',
      };
      const sector = sectorMapping[major];
      const employers = EMPLOYERS_BY_SECTOR[sector] || EMPLOYERS_BY_SECTOR.tech;

      byMajor[major] = {
        count,
        medianSalary: Math.round(majorEarnings),
        topEmployers: employers.slice(0, 4).map((e) => e.name),
      };
    });

    const byEmployer = [];
    TOP_CITIES.slice(0, 5).forEach((city) => {
      const employers = EMPLOYERS_BY_SECTOR[Math.random() > 0.5 ? 'tech' : 'finance'].slice(0, 3);
      employers.forEach((emp, idx) => {
        if (!byEmployer.find((e) => e.name === emp.name)) {
          byEmployer.push({
            name: emp.name,
            sector: Math.random() > 0.5 ? 'tech' : 'finance',
            count: Math.floor(Math.random() * 40) + 10,
            medianSalary: emp.salary,
          });
        }
      });
    });

    placements[`${schoolKey}_${year}`] = {
      schoolId: schoolKey,
      schoolName,
      year,
      totalGraduates,
      byCity: byCity.slice(0, 8),
      byMajor,
      byEmployer: byEmployer.slice(0, 8),
      timeToHireMonths: 2.8 + Math.random() * 1.5,
    };
  });

  return placements;
}

// Main data loader
export async function loadDashboardData() {
  console.log('Loading dashboard data...');
  
  const schools = {};
  const allPlacements = {};

  // Fetch real earnings data and generate placements
  for (const [key, id] of Object.entries(SCHOOL_IDS)) {
    const schoolCoord = SCHOOL_COORDS[key];
    const realData = await fetchEarningsData(id);
    
    schools[key] = {
      id: key,
      name: realData?.name || key.replace(/([A-Z])/g, ' $1').trim(),
      collegeScorecardId: id,
      location: schoolCoord,
      medianEarnings: realData?.medianEarnings || 75000,
    };

    // Generate placements
    const placements = generatePlacementData(key, schools[key].name, schools[key].medianEarnings);
    Object.assign(allPlacements, placements);
  }

  return {
    schools,
    placements: allPlacements,
    majors: MAJORS,
    cities: TOP_CITIES,
  };
}

export { SCHOOL_IDS, SCHOOL_COORDS, MAJORS, TOP_CITIES, EMPLOYERS_BY_SECTOR };
