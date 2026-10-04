import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getCountries } from "../services/countryService";
import type { Country } from "../services/countryService";
import { apiFetch } from "../services/api";
import type { Student } from "../services/studentService";
import {
  AcademicIcon,
  CountrySelect,
  Field,
  FormActions,
  FormPageHeader,
  FormPageShell,
  FormSection,
  FormSkeleton,
  GlobeIcon,
  StudentFormCard,
  UserIcon,
  useStudentFormValidation,
} from "../components/StudentFormParts";

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  const first = parts[0][0] ?? "";
  const last = parts.length > 1 ? parts[parts.length - 1][0] : "";
  return (first + last).toUpperCase();
}

export default function EditStudent() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const [countries, setCountries] = useState<Country[]>([]);
  const [loadingCountries, setLoadingCountries] = useState(true);
  const [loadingStudent, setLoadingStudent] = useState(true);

  const [name, setName] = useState("");
  const [matricNo, setMatricNo] = useState("");
  const [program, setProgram] = useState("");
  const [countryCode, setCountryCode] = useState("");
  const [passportExpiry, setPassportExpiry] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Display only: the record as it was loaded, so the "editing" strip does not
  // change while the user types.
  const [record, setRecord] = useState<{
    name: string;
    matricNo: string;
  } | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        setError("");

        const [countriesData, studentResponse] = await Promise.all([
          getCountries(),
          apiFetch(`/students/${id}`),
        ]);

        const student: Student = studentResponse.data;

        setCountries(countriesData);
        setName(student.name);
        setMatricNo(student.matric_no);
        setProgram(student.program);
        setCountryCode(student.country_code);
        setPassportExpiry(student.passport_expiry.slice(0, 10));
        setRecord({ name: student.name, matricNo: student.matric_no });
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load student.",
        );
      } finally {
        setLoadingCountries(false);
        setLoadingStudent(false);
      }
    }

    if (id) {
      loadData();
    }
  }, [id]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!id) {
      setError("Student ID is missing.");
      return;
    }

    setError("");
    setLoading(true);

    try {
      await apiFetch(`/students/${id}`, {
        method: "PUT",
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
        err instanceof Error ? err.message : "Failed to update student.",
      );
    } finally {
      setLoading(false);
    }
  }

  const { isInvalid, controlProps, handleInvalid } = useStudentFormValidation({
    name,
    matric_no: matricNo,
    program,
    country_code: countryCode,
    passport_expiry: passportExpiry,
  });

  const selectedCountry = countries.find((c) => c.country_code === countryCode);

  if (loadingStudent) {
    return (
      <FormPageShell>
        <FormSkeleton />
      </FormPageShell>
    );
  }

  return (
    <FormPageShell>
      <FormPageHeader
        title="Edit Student"
        description="Update the international student record."
      />

      <StudentFormCard
        error={error}
        loading={loading}
        onSubmit={handleSubmit}
        onInvalid={handleInvalid}
        context={
          record && (
            <div className="flex items-center gap-3 border-b border-slate-200 bg-blue-50/60 px-5 py-3.5 sm:px-6">
              <span
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-blue-900 text-xs font-semibold text-white"
                aria-hidden="true"
              >
                {getInitials(record.name)}
              </span>
              <div className="min-w-0">
                <p className="text-xs font-medium text-slate-500">
                  Editing existing record
                </p>
                <p className="truncate text-sm font-semibold text-slate-900">
                  {record.name}
                </p>
                <p className="truncate text-xs text-slate-500">
                  {record.matricNo}
                </p>
              </div>
            </div>
          )
        }
        actions={
          <FormActions
            loading={loading}
            disabled={loadingCountries}
            submitLabel="Update Student"
            loadingLabel="Updating..."
          />
        }
      >
        <FormSection
          title="Personal Information"
          description="Name as it appears on official documents."
          icon={<UserIcon />}
        >
          <Field
            field="name"
            label="Full Name"
            showError={isInvalid("name")}
            wide
          >
            <input
              type="text"
              autoComplete="off"
              value={name}
              onChange={(event) => setName(event.target.value)}
              {...controlProps("name")}
            />
          </Field>
        </FormSection>

        <FormSection title="Academic Information" icon={<AcademicIcon />}>
          <Field
            field="matric_no"
            label="Matric No."
            showError={isInvalid("matric_no")}
          >
            <input
              type="text"
              autoComplete="off"
              value={matricNo}
              onChange={(event) => setMatricNo(event.target.value)}
              {...controlProps("matric_no")}
            />
          </Field>

          <Field
            field="program"
            label="Program"
            showError={isInvalid("program")}
          >
            <input
              type="text"
              autoComplete="off"
              value={program}
              onChange={(event) => setProgram(event.target.value)}
              {...controlProps("program")}
            />
          </Field>
        </FormSection>

        <FormSection
          title="Country and Passport"
          description="Nationality and passport validity."
          icon={<GlobeIcon />}
        >
          <Field
            field="country_code"
            label="Country"
            hint={
              selectedCountry
                ? `Country code: ${selectedCountry.country_code}`
                : undefined
            }
            showError={isInvalid("country_code")}
          >
            <CountrySelect
              countries={countries}
              value={countryCode}
              onChange={setCountryCode}
              loading={loadingCountries}
              controlProps={controlProps("country_code")}
            />
          </Field>

          <Field
            field="passport_expiry"
            label="Passport Expiry"
            hint="Expiry date as shown on the passport."
            showError={isInvalid("passport_expiry")}
          >
            <input
              type="date"
              value={passportExpiry}
              onChange={(event) => setPassportExpiry(event.target.value)}
              {...controlProps("passport_expiry")}
            />
          </Field>
        </FormSection>
      </StudentFormCard>
    </FormPageShell>
  );
}
