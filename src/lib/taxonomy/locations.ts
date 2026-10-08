export interface CityDefinition {
  name: string;
  isTechHub?: boolean;
}

export interface StateDefinition {
  name: string;
  code: string;
  cities: CityDefinition[];
}

export interface CountryDefinition {
  name: string;
  code: string;
  states: StateDefinition[];
}

export const REGIONAL_LOCATIONS: CountryDefinition[] = [
  {
    name: "India",
    code: "IN",
    states: [
      {
        name: "Telangana",
        code: "TS",
        cities: [
          { name: "Hyderabad", isTechHub: true },
          { name: "Warangal" },
          { name: "Karimnagar" },
          { name: "Nizamabad" },
        ],
      },
      {
        name: "Andhra Pradesh",
        code: "AP",
        cities: [
          { name: "Visakhapatnam", isTechHub: true },
          { name: "Vijayawada", isTechHub: true },
          { name: "Guntur" },
          { name: "Tirupati" },
          { name: "Kakinada" },
          { name: "Nellore" },
        ],
      },
      {
        name: "Karnataka",
        code: "KA",
        cities: [
          { name: "Bengaluru", isTechHub: true },
          { name: "Mysuru" },
          { name: "Mangaluru" },
          { name: "Hubballi" },
          { name: "Belagavi" },
        ],
      },
      {
        name: "Tamil Nadu",
        code: "TN",
        cities: [
          { name: "Chennai", isTechHub: true },
          { name: "Coimbatore", isTechHub: true },
          { name: "Madurai" },
          { name: "Tiruchirappalli" },
          { name: "Salem" },
        ],
      },
      {
        name: "Maharashtra",
        code: "MH",
        cities: [
          { name: "Pune", isTechHub: true },
          { name: "Mumbai", isTechHub: true },
          { name: "Nagpur" },
          { name: "Nashik" },
          { name: "Aurangabad" },
        ],
      },
      {
        name: "Delhi NCR",
        code: "DL",
        cities: [
          { name: "Delhi", isTechHub: true },
          { name: "Noida", isTechHub: true },
          { name: "Gurugram", isTechHub: true },
          { name: "Faridabad" },
        ],
      },
      {
        name: "Kerala",
        code: "KL",
        cities: [
          { name: "Kochi", isTechHub: true },
          { name: "Thiruvananthapuram", isTechHub: true },
          { name: "Kozhikode" },
          { name: "Thrissur" },
        ],
      },
      {
        name: "Gujarat",
        code: "GJ",
        cities: [
          { name: "Ahmedabad", isTechHub: true },
          { name: "Gandhinagar", isTechHub: true },
          { name: "Surat" },
          { name: "Vadodara" },
          { name: "Rajkot" },
        ],
      },
      {
        name: "Uttar Pradesh",
        code: "UP",
        cities: [
          { name: "Lucknow" },
          { name: "Kanpur" },
          { name: "Varanasi" },
          { name: "Agra" },
          { name: "Prayagraj" },
        ],
      },
    ],
  },
];

export const POPULAR_LOCATIONS = [
  "Remote",
  "Hyderabad",
  "Bengaluru",
  "Visakhapatnam",
  "Vijayawada",
  "Chennai",
  "Pune",
  "Mumbai",
  "Delhi NCR",
];
