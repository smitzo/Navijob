import { Workspace } from "@/components/layout/Workspace";
import { RoleEditor } from "@/components/recruiter/RoleEditor";
export default async function EditRolePage({ params }: { params: Promise<{ id: string }> }) { const { id } = await params; return <Workspace role="recruiter"><RoleEditor id={id} /></Workspace>; }
