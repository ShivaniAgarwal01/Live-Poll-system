import { useState } from "react";
import RoleSelect from "./pages/RoleSelect";
import Student from "./pages/Student";
import Teacher from "./pages/Teacher";

export default function App() {
  const [role, setRole] = useState<string | null>(null);

  if (!role) return <RoleSelect onSelect={setRole} />;

  return role === "teacher" ? <Teacher /> : <Student />;
}