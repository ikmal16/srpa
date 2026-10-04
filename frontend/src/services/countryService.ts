import { apiFetch } from "./api";

export interface Country {
  country_code: string;
  country_name: string;
  official_country_name: string;
  region: string;
  flag_url: string | null;
}

interface CountryResponse {
  data: Country[];
}

export async function getCountries(): Promise<Country[]> {
  const response: CountryResponse = await apiFetch("/countries");

  return response.data;
}
