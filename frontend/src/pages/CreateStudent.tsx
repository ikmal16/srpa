import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { getCountries } from "../services/countryService";
import type { Country } from "../services/countryService";
import { apiFetch } from "../services/api";

export default function CreateStudent() {
  const navigate = useNavigate();

  const [countries, setCountries] = useState<Country[]>([]);
  const [loadingCountries, setLoadingCountries] = useState(true);

  const [name, setName] = useState("");
  const [matricNo, setMatricNo] = useState("");
  const [program, setProgram] = useState("");
  const [countryCode, setCountryCode] = useState("");
  const [passportExpiry, setPassportExpiry] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadCountries() {
      try {
        const data = await getCountries();
        setCountries(data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load countries.",
        );
      } finally {
        setLoadingCountries(false);
      }
    }

    loadCountries();
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");
    setLoading(true);

    try {
      await apiFetch("/students", {
        method: "POST",
        body: JSON.stringify({
          name,
          matric_no: matricNo,
          program,
          country_code: countryCode,
          passport_expiry: passportExpiry,
        }),
      });

      navigate("/students");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to create student.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="mx-auto max-w-2xl">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Add Student</h1>

          <p className="mt-1 text-gray-500">
            Add a new international student record.
          </p>
        </div>

        <div className="rounded-xl bg-white p-6 shadow">
          {error && (
            <div className="mb-5 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Full Name
              </label>

              <input
                type="text"
                value={name}
                onChange={(event) => setName(event.target.value)}
                required
                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Matric No.
              </label>

              <input
                type="text"
                value={matricNo}
                onChange={(event) => setMatricNo(event.target.value)}
                required
                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Program
              </label>

              <input
                type="text"
                value={program}
                onChange={(event) => setProgram(event.target.value)}
                required
                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Country
              </label>

              <select
                value={countryCode}
                onChange={(event) => setCountryCode(event.target.value)}
                required
                disabled={loadingCountries}
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              >
                <option value="">
                  {loadingCountries
                    ? "Loading countries..."
                    : "Select a country"}
                </option>

                {countries.map((country) => (
                  <option
                    key={country.country_code}
                    value={country.country_code}
                  >
                    {country.country_name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Passport Expiry
              </label>

              <input
                type="date"
                value={passportExpiry}
                onChange={(event) => setPassportExpiry(event.target.value)}
                required
                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              />
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => navigate("/students")}
                className="rounded-lg border border-gray-300 px-5 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={loading || loadingCountries}
                className="flex-1 rounded-lg bg-indigo-600 px-5 py-3 text-sm font-medium text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Creating..." : "Create Student"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
