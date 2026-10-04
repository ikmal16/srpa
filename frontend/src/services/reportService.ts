import { apiFetch } from "./api";

export interface ReportItem {
  country_name?: string;
  country_code?: string;
  flag_url?: string | null;
  region?: string;
  total: number;
}

export interface ReportResponse {
  by_country: ReportItem[];
  by_region: ReportItem[];
  passport_stats: {
    expiring_soon: number;
    expired: number;
  };
}

export async function getReports(): Promise<ReportResponse> {
  return apiFetch("/reports");
}

export async function getDashboardStats() {
  const report = await getReports();

  console.log("REPORT DATA:", report);

  const totalStudents = report.by_country.reduce(
    (total, item) => total + Number(item.total),
    0,
  );

  const countries = report.by_country.length;

  console.log("TOTAL STUDENTS:", totalStudents);
  console.log("TOTAL COUNTRIES:", countries);

  return {
    totalStudents,
    countries,
    expiringSoon: report.passport_stats.expiring_soon,
    expired: report.passport_stats.expired,
    report,
  };
}

export async function exportStudentDistributionReport() {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("Authentication required.");
  }

  const response = await fetch("http://127.0.0.1:8000/api/reports/export", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      Accept:
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    },
  });

  if (!response.ok) {
    throw new Error("Failed to export student distribution report.");
  }

  const blob = await response.blob();

  const url = window.URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = "student_distribution_report.xlsx";

  document.body.appendChild(link);
  link.click();

  link.remove();
  window.URL.revokeObjectURL(url);
}
