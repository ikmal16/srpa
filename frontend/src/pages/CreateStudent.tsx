import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { getCountries } from "../services/countryService";
import type { Country } from "../services/countryService";
import { apiFetch } from "../services/api";
import {
  AcademicIcon,
  CountrySelect,
  Field,
  FormActions,
  FormPageHeader,
  FormPageShell,
  FormSection,
  GlobeIcon,
  StudentFormCard,
  UserIcon,
  useStudentFormValidation,
} from "../components/StudentFormParts";

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

  const { isInvalid, controlProps, handleInvalid } = useStudentFormValidation({
    name,
    matric_no: matricNo,
    program,
    country_code: countryCode,
    passport_expiry: passportExpiry,
  });

  const selectedCountry = countries.find((c) => c.country_code === countryCode);

  return (
    <FormPageShell>
      <FormPageHeader
        title="Add Student"
        description="Add a new international student record."
      />

      <StudentFormCard
        error={error}
        loading={loading}
        onSubmit={handleSubmit}
        onInvalid={handleInvalid}
        actions={
          <FormActions
            loading={loading}
            disabled={loadingCountries}
            submitLabel="Create Student"
            loadingLabel="Creating..."
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
