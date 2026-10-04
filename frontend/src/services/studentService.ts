import { apiFetch } from "./api";

export interface Student {
  id: number;
  name: string;
  matric_no: string;
  program: string;
  country_code: string;
  country_name: string;
  official_country_name: string;
  region: string;
  flag_url: string | null;
  passport_expiry: string;
  created_at: string;
  updated_at: string;
  passport_status: "expired" | "expiring_soon" | "valid";
}

export interface StudentListResponse {
  current_page: number;
  data: Student[];
  last_page: number;
  per_page: number;
  total: number;
  from: number | null;
  to: number | null;
}

export async function getStudents(
  page: number = 1,
  search: string = "",
): Promise<StudentListResponse> {
  const params = new URLSearchParams();

  params.set("page", String(page));

  if (search.trim()) {
    params.set("search", search.trim());
  }

  return apiFetch(`/students?${params.toString()}`);
}
